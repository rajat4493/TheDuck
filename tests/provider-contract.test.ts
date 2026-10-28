import { describe, expect, it } from "vitest";
import {
  MAX_QUESTIONS,
  ProviderContractError,
  Question,
  answerQuestion,
  createProject,
  currentLock,
  emptyDraft,
  fixedCtx,
  nextQuestion,
  readonlyCopy,
  rulesProvider,
} from "../src/core/index.ts";
import type { Answer, RefinementProvider, RefinementState } from "../src/core/index.ts";
import { ALL_FIXTURES } from "../fixtures/ideas.ts";
import { OWNER, refineAndLock } from "../fixtures/run-session.ts";

/** A scripted fake: proves the gate works with any provider honouring the contract. */
function fakeProvider(questions: Question[]): RefinementProvider {
  return {
    info: { id: "test-fake", kind: "test-fake", usesAI: false, description: "Scripted test questions." },
    nextQuestion: (s) => questions.find((q) => !s.asked.some((a) => a.questionId === q.id)) ?? null,
  };
}

const FAKE_QS: Question[] = [
  { id: "Q-F1", tier: "core", gap: "target_user", kind: "text", target: "targetUser", prompt: "Who?", reason: "Why.", notSureText: "Who?" },
  { id: "Q-F2", tier: "core", gap: "core_workflow", kind: "list", target: "coreWorkflow", minItems: 1, prompt: "Steps?", reason: "Why.", notSureText: "Steps?" },
];

function contract(name: string, make: () => RefinementProvider, answerFor: (q: Question) => Answer) {
  describe(`RefinementProvider contract — ${name}`, () => {
    const startState = (): RefinementState => readonlyCopy({ roughIdea: "A rough idea about AI for patients", draft: emptyDraft(), asked: [] });

    it("declares honest metadata", () => {
      const info = make().info;
      expect(typeof info.usesAI).toBe("boolean");
      expect(info.description.length).toBeGreaterThan(10);
      if (info.kind === "deterministic-rules") {
        expect(info.usesAI).toBe(false);
        expect(info.description).toMatch(/No AI/);
      }
    });

    it("returns schema-valid questions and never mutates its (frozen) input", () => {
      const s = startState();
      const q = make().nextQuestion(s);
      expect(q).not.toBeNull();
      expect(Question.safeParse(q).success).toBe(true);
      expect(Object.isFrozen(s.draft)).toBe(true);
    });

    it("is deterministic for the same state", () => {
      expect(make().nextQuestion(startState())).toEqual(make().nextQuestion(startState()));
    });

    it("never repeats a question and finishes within the limit", () => {
      const provider = make();
      const ctx = fixedCtx();
      let p = createProject(ctx, { roughIdea: "A rough idea", workingName: "X", provider: provider.info, by: OWNER });
      const seen = new Set<string>();
      for (let q = nextQuestion(p, provider); q; q = nextQuestion(p, provider)) {
        expect(seen.has(q.id)).toBe(false);
        seen.add(q.id);
        p = answerQuestion(p, q, answerFor(q), OWNER, ctx);
      }
      expect(seen.size).toBeLessThanOrEqual(MAX_QUESTIONS);
    });
  });
}

const genericAnswer = (q: Question): Answer =>
  q.kind === "text"
    ? { kind: "text", value: "Someone specific" }
    : q.kind === "list"
      ? { kind: "list", values: q.minItems ? ["One thing"] : [] }
      : q.kind === "parts"
        ? { kind: "parts", values: Object.fromEntries(q.parts.map((p) => [p.key, p.kind === "text" ? "Something specific" : ["One thing"]])) }
        : { kind: "choice", value: q.options[0]!.value };

contract("rules provider", () => rulesProvider, genericAnswer);
contract("scripted fake provider", () => fakeProvider(FAKE_QS), genericAnswer);

describe("The gate owns application; a misbehaving provider cannot write intent", () => {
  const ctx = fixedCtx();
  const mk = (provider: RefinementProvider) =>
    createProject(ctx, { roughIdea: "Idea", workingName: "X", provider: provider.info, by: OWNER });

  it("rejects a question whose effect targets a non-draft field", () => {
    const bad = {
      info: { id: "bad", kind: "test-fake", usesAI: false, description: "Bad provider." },
      nextQuestion: () =>
        ({
          id: "Q-BAD",
          tier: "core",
          gap: "x",
          kind: "choice",
          prompt: "?",
          reason: "?",
          notSureText: "?",
          suggested: null,
          options: [
            { value: "a", label: "a", consequence: "a", effects: [{ op: "set", field: "fingerprint", value: "x" }] },
            { value: "b", label: "b", consequence: "b", effects: [{ op: "set", field: "stage", value: "demo" }] },
          ],
        }) as unknown as Question,
    } satisfies RefinementProvider;
    expect(() => nextQuestion(mk(bad), bad)).toThrow(ProviderContractError);
  });

  it("rejects a provider that mutates its input", () => {
    const mutating: RefinementProvider = {
      info: { id: "mut", kind: "test-fake", usesAI: false, description: "Mutating provider." },
      nextQuestion: (s) => {
        (s.draft as { targetUser: string | null }).targetUser = "Injected";
        return null;
      },
    };
    expect(() => nextQuestion(mk(mutating), mutating)).toThrow(TypeError);
  });

  it("rejects a provider that repeats a question", () => {
    const q = FAKE_QS[0]!;
    const repeating: RefinementProvider = {
      info: { id: "rep", kind: "test-fake", usesAI: false, description: "Repeating provider." },
      nextQuestion: () => q,
    };
    let p = mk(repeating);
    p = answerQuestion(p, q, { kind: "text", value: "A" }, OWNER, ctx);
    expect(() => nextQuestion(p, repeating)).toThrow(/repeated/);
  });

  it("rejects a provider that is not the one recorded on the project", () => {
    expect(() => nextQuestion(mk(rulesProvider), fakeProvider(FAKE_QS))).toThrow(ProviderContractError);
  });
});

describe("Honesty: M1.1 locks record that no AI was used", () => {
  it.each(ALL_FIXTURES.map((f) => [f.key, f] as const))("%s", (_k, f) => {
    const lock = currentLock(refineAndLock(f))!;
    expect(lock.refinement).toMatchObject({ providerKind: "deterministic-rules", usedAI: false });
  });
});
