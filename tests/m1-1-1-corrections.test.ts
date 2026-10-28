/**
 * M1.1.1 Truth and Founder-Experience Correction — regression tests.
 * Each block targets an output that M1.1 rendered in a materially misleading way.
 */
import { describe, expect, it } from "vitest";
import {
  DRAFT_VC_HEADING,
  LOCKED_AC_HEADING,
  LOCK_CONFIRMATION_TEXT,
  MAX_CORE_QUESTIONS,
  MAX_FOLLOW_UPS,
  MAX_QUESTIONS,
  NOTHING_WAITING,
  ProviderContractError,
  REFINE_INSTRUCTION,
  answerQuestion,
  createProject,
  currentLock,
  deriveOpenItems,
  deriveVerificationCandidates,
  editDraft,
  findUnresolvedReferences,
  fixedCtx,
  lockIntent,
  lockReadiness,
  nextQuestion,
  renderAllPacks,
  rulesProvider,
} from "../src/core/index.ts";
import type { Answer, Draft, Pack, Question, RefinementProvider } from "../src/core/index.ts";
import { ALL_FIXTURES, freshNudge, physioPath, showNotes } from "../fixtures/ideas.ts";
import { OWNER, refine, refineAndLock } from "../fixtures/run-session.ts";

const get = (p: Pack, name: string) => p.files.find((f) => f.name === name)!.content;
const COST_DECISION = "Set the maximum acceptable AI cost per episode.";

function answerAll(q: Question): Answer {
  if (q.kind === "parts") return { kind: "parts", values: Object.fromEntries(q.parts.map((p) => [p.key, p.kind === "text" ? "Everyone" : ["One thing"]])) };
  if (q.kind === "list") return { kind: "list", values: ["One thing"] };
  if (q.kind === "text") return { kind: "text", value: "Everyone" };
  return { kind: "choice", value: q.options[0]!.value };
}

// ── 1. Question burden ──────────────────────────────────────────────────────

describe("Correction 1 — short first pass", () => {
  it.each(ALL_FIXTURES.map((f) => [f.key, f] as const))("%s: ≤5 core questions and ≤3 follow-ups", (_k, f) => {
    const asked = refine(f).refinement.asked;
    expect(asked.filter((a) => a.tier === "core").length).toBeLessThanOrEqual(MAX_CORE_QUESTIONS);
    expect(asked.filter((a) => a.tier === "follow_up").length).toBeLessThanOrEqual(MAX_FOLLOW_UPS);
    expect(asked.length).toBeLessThanOrEqual(MAX_QUESTIONS);
  });

  it("the worst case — an idea that triggers every follow-up — stops at exactly 8 questions", () => {
    const ctx = fixedCtx();
    let p = createProject(ctx, {
      roughIdea: "An AI chatbot for everyone that answers questions about patients' health records",
      workingName: "X",
      provider: rulesProvider.info,
      by: OWNER,
    });
    for (let q = nextQuestion(p, rulesProvider); q; q = nextQuestion(p, rulesProvider)) p = answerQuestion(p, q, answerAll(q), OWNER, ctx);
    const asked = p.refinement.asked;
    expect(asked.length).toBe(8);
    expect(asked.filter((a) => a.tier === "core").map((a) => a.questionId)).toEqual([
      "Q-USER-JOB",
      "Q-OUTCOME",
      "Q-WORKFLOW",
      "Q-BOUNDARIES",
      "Q-SUCCESS",
    ]);
    expect(asked.filter((a) => a.tier === "follow_up").map((a) => a.questionId)).toEqual(["Q-TARGET-USER-NARROW", "Q-AI", "Q-DATA"]);
  });

  it("the core pass alone covers user/job, outcome, journey, boundaries and success", () => {
    const d = refine(freshNudge).draft;
    expect(d.targetUser && d.jobToBeDone && d.desiredOutcome).toBeTruthy();
    expect(d.coreWorkflow.length && d.outOfScope.length + d.mustNot.length && d.successCriteria.length).toBeTruthy();
  });

  it("every question offers 'I am not sure yet'", () => {
    const ctx = fixedCtx();
    let p = createProject(ctx, { roughIdea: "An AI tool for everyone at a clinic", workingName: "X", provider: rulesProvider.info, by: OWNER });
    for (let q = nextQuestion(p, rulesProvider); q; q = nextQuestion(p, rulesProvider)) {
      expect(q.notSureText.length).toBeGreaterThan(0);
      p = answerQuestion(p, q, answerAll(q), OWNER, ctx);
    }
  });

  it("the gate refuses a provider that asks a sixth core question or a fourth follow-up", () => {
    const flood = (tier: "core" | "follow_up"): RefinementProvider => ({
      info: { id: `flood-${tier}`, kind: "test-fake", usesAI: false, description: "Floods questions." },
      nextQuestion: (s) => ({
        id: `Q-F${s.asked.length + 1}`,
        tier,
        gap: "x",
        kind: "text",
        target: "desiredOutcome",
        prompt: "?",
        reason: "?",
        notSureText: "?",
      }),
    });
    for (const [tier, limit] of [["core", MAX_CORE_QUESTIONS], ["follow_up", MAX_FOLLOW_UPS]] as const) {
      const ctx = fixedCtx();
      const provider = flood(tier);
      let p = createProject(ctx, { roughIdea: "Idea", workingName: "X", provider: provider.info, by: OWNER });
      for (let n = 0; n < limit; n++) p = answerQuestion(p, nextQuestion(p, provider)!, { kind: "text", value: "x" }, OWNER, ctx);
      expect(() => nextQuestion(p, provider)).toThrow(ProviderContractError);
    }
  });

  it("'not sure' on a core question creates a visible open question, which the preview can close", () => {
    const f = { ...freshNudge, answers: { ...freshNudge.answers, "Q-SUCCESS": { kind: "not_sure" } as Answer }, previewEdits: undefined };
    const ctx = fixedCtx();
    let p = refine(f, ctx);
    const r = lockReadiness(p);
    expect(r.deferred).toContain("How will we know the first version is good enough?");
    expect(r.decisionsWaiting).toContain("How will we know the first version is good enough?");
    expect(r.ready).toBe(false);
    p = editDraft(p, { productName: "FreshNudge", successCriteria: ["I use it for two weeks"] }, OWNER, ctx);
    expect(p.draft.openQuestions).toEqual([]);
    expect(lockReadiness(p).ready).toBe(true);
  });

  it("'not sure' on a follow-up stays open through lock and is visible in every audience's pack", () => {
    const f = { ...physioPath, answers: { ...physioPath.answers, "Q-DATA": { kind: "not_sure" } as Answer } };
    const packs = renderAllPacks(refineAndLock(f));
    const q = "What kind of information about people will it hold?";
    expect(get(packs.founder, "WHAT_YOU_ARE_BUILDING.md")).toContain(`### Decision needed: ${q}`);
    expect(get(packs.founder, "CURRENT_OUTCOME.md")).toContain(`- ${q}`);
    expect(get(packs.professional, "PRODUCT_TEAM_HANDOVER.md")).toContain(`- ${q}`);
    expect(get(packs.builder, "CONSTRAINTS.md")).toContain(`Product owner decision: ${q}`);
    expect(get(packs.professional, "DELIVERY_READINESS.md")).toContain("| Security and privacy | OPEN QUESTION |");
  });
});

// ── 2. Never hide an unresolved material decision ──────────────────────────

describe("Correction 2 — unresolved references become visible decisions", () => {
  it("REGRESSION (exact M1.1 sample): 'the agreed cost limit' with no limit set is a founder decision everywhere", () => {
    const project = refineAndLock(showNotes("review"));
    const lock = currentLock(project)!;
    expect(lock.intent.successCriteria.map((s) => s.text)).toContain("The AI cost of one episode stays under the agreed cost limit");
    const packs = renderAllPacks(project);

    const building = get(packs.founder, "WHAT_YOU_ARE_BUILDING.md");
    expect(building).not.toContain(NOTHING_WAITING);
    expect(building).toContain(`### Decision needed: ${COST_DECISION}`);
    expect(building).toMatch(/no limit has been set\. Until you set one, this check cannot be measured/);

    expect(get(packs.founder, "CURRENT_OUTCOME.md")).toContain(`- ${COST_DECISION}`);
    expect(get(packs.founder, "CURRENT_OUTCOME.md")).not.toContain(NOTHING_WAITING);
    expect(get(packs.professional, "PRODUCT_TEAM_HANDOVER.md")).toContain(COST_DECISION);
    expect(get(packs.professional, "DELIVERY_READINESS.md")).toContain("Founder cost limit not set");
    expect(get(packs.universal, "UNIVERSAL_BUILDER_HANDOVER.md")).toContain(`Product owner decision: ${COST_DECISION}`);

    // It is not treated as measurable: not a locked acceptance criterion, but a blocked draft candidate.
    expect(lock.intent.acceptanceCriteria.some((a) => a.statement.includes("agreed cost limit"))).toBe(false);
    const vc = deriveVerificationCandidates(lock.intent).find((c) => c.commitment.includes("agreed cost limit"));
    expect(vc?.blockedBy).toMatch(/^DC-UR-/);
    expect(get(packs.founder, "VAT_UAT.md")).toContain("Cannot be checked yet: The AI cost of one episode stays under the agreed cost limit.");
  });

  it("setting the limit resolves the decision and makes the check a locked acceptance criterion", () => {
    const f = showNotes("review");
    f.previewEdits = {
      ...f.previewEdits,
      successCriteria: [
        "Five podcasters use it on a real episode and say they would use it again",
        "The AI cost of one episode stays under $0.50",
      ],
    };
    const lock = currentLock(refineAndLock(f))!;
    expect(deriveOpenItems(lock.intent).decisions.map((d) => d.decisionNeeded)).not.toContain(COST_DECISION);
    expect(lock.intent.acceptanceCriteria.some((a) => a.statement.includes("under $0.50"))).toBe(true);
  });

  it("detects placeholders and undefined values, and leaves defined ones alone", () => {
    const draft = (texts: string[]): Draft => ({ ...refine(freshNudge).draft, successCriteria: texts.map((t, n) => ({ id: `s${n}`, text: t, provenance: "HUMAN" })) });
    const refs = (texts: string[]) => findUnresolvedReferences(draft(texts)).filter((r) => r.field === "successCriteria").map((r) => r.text);
    expect(refs(["Response time TBD"])).toEqual(["Response time TBD"]);
    expect(refs(["Data kept for an appropriate retention period"])).toHaveLength(1);
    expect(refs(["Pricing to be decided"])).toHaveLength(1);
    expect(refs(["Stays within the agreed cost limit"])).toHaveLength(1);
    expect(refs(["Monthly spend stays under the budget limit"])).toHaveLength(1);
    expect(refs(["Monthly spend stays under a £200 budget limit"])).toHaveLength(0);
    expect(refs(["Ten pilot patients use it for four weeks"])).toHaveLength(0);
  });

  it("a generic provider is a professional open question, distinct from founder decisions", () => {
    const open = deriveOpenItems(currentLock(refineAndLock(showNotes("review")))!.intent);
    expect(open.professional.map((p) => p.question)).toContain(
      'Which specific service or provider will be used for: "A speech-to-text and AI writing service — to transcribe the episode and draft the text"?',
    );
    expect(open.decisions.some((d) => d.decisionNeeded.includes("speech-to-text"))).toBe(false);
  });

  it("assumptions are listed as assumptions, never as decisions", () => {
    const packs = renderAllPacks(refineAndLock(freshNudge));
    const building = get(packs.founder, "WHAT_YOU_ARE_BUILDING.md");
    const waiting = building.slice(building.indexOf("## Still waiting for you"), building.indexOf("## Still open for your builder"));
    const assumed = building.slice(building.indexOf("## What TheDuck assumed"));
    expect(assumed).toContain("TheDuck assumes the product does not use AI, because AI was not mentioned.");
    expect(waiting).not.toContain("TheDuck assumes");
    // Open items exist (draft checks), so the "nothing waiting" sentence must not appear.
    expect(building).not.toContain(NOTHING_WAITING);
  });
});

// ── 3. Locked acceptance criteria vs draft verification candidates ─────────

describe("Correction 3 — journey restatements are draft candidates, not locked acceptance criteria", () => {
  it.each(ALL_FIXTURES.map((f) => [f.key, f] as const))("%s", (_k, f) => {
    const project = refineAndLock(f);
    const i = currentLock(project)!.intent;
    const packs = renderAllPacks(project);

    // Locked ACs are only must-not rules or measurable success checks, in When/shall form.
    for (const ac of i.acceptanceCriteria) {
      expect(["must_not", "success", "human"]).toContain(ac.source);
      expect(ac.statement).toMatch(/^When .+, the (system|product owner) shall /);
    }
    // Every journey step is a draft candidate and never a locked AC.
    const vcs = deriveVerificationCandidates(i);
    for (const step of i.coreWorkflow) {
      expect(vcs.some((c) => c.source === "workflow" && c.commitment === step.text)).toBe(true);
      expect(i.acceptanceCriteria.some((a) => a.statement.includes(`"${step.text}"`))).toBe(false);
    }

    // Builder: the locked section contains no journey step; the draft section says it is not AC.
    const acFile = get(packs.builder, "ACCEPTANCE_CRITERIA.md");
    const locked = acFile.slice(acFile.indexOf(`## ${LOCKED_AC_HEADING}`), acFile.indexOf(`## ${DRAFT_VC_HEADING}`));
    for (const step of i.coreWorkflow) expect(locked).not.toContain(step.text);
    expect(acFile).toContain(`## ${DRAFT_VC_HEADING}`);
    expect(acFile).toContain("[expected observable result — not yet defined]");

    // Professional pack and Universal handover carry the same distinction and instruction.
    const pro = get(packs.professional, "PRODUCT_TEAM_HANDOVER.md");
    expect(pro).toContain(`### ${LOCKED_AC_HEADING}`);
    expect(pro).toContain(`### ${DRAFT_VC_HEADING}`);
    const uni = get(packs.universal, "UNIVERSAL_BUILDER_HANDOVER.md");
    expect(uni).toContain(`**Before claiming any feature is complete:** ${REFINE_INSTRUCTION}`);
    expect(get(packs.professional, "DELIVERY_READINESS.md")).toContain("| Quality and release engineering | OPEN QUESTION |");
  });

  it("'Upload an episode audio file' is not presented as an implementation-ready acceptance criterion", () => {
    const packs = renderAllPacks(refineAndLock(showNotes("review")));
    const acFile = get(packs.builder, "ACCEPTANCE_CRITERIA.md");
    expect(acFile).not.toMatch(/Main journey step \d+ works/);
    const draft = acFile.slice(acFile.indexOf(`## ${DRAFT_VC_HEADING}`));
    expect(draft).toContain("- **Locked commitment:** Upload an episode audio file");
    expect(draft).toContain("the expected result; what happens on error; limits (sizes, formats, timing)");
  });

  it("an owner-written criterion locks as given (HUMAN)", () => {
    const ctx = fixedCtx();
    let p = refine(showNotes("review"), ctx);
    p = editDraft(
      p,
      {
        acceptanceCriteria: [
          {
            statement: "When a podcaster uploads an MP3 under 200 MB, the system shall show a draft within 5 minutes.",
            howToCheck: "Upload a 60-minute MP3 and time it.",
            founderCheck: "Upload an episode and check a draft appears within 5 minutes.",
          },
        ],
      },
      OWNER,
      ctx,
    );
    const lock = currentLock(lockIntent(p, { confirmed: true, statement: LOCK_CONFIRMATION_TEXT, by: OWNER }, ctx))!;
    expect(lock.intent.acceptanceCriteria).toHaveLength(1);
    expect(lock.intent.acceptanceCriteria[0]).toMatchObject({ source: "human", provenance: "HUMAN" });
  });
});

// ── 4. Must-not rendering ──────────────────────────────────────────────────

describe("Correction 4 — must-not items always render as explicit prohibitions", () => {
  const EXACT = "Must not use uploaded audio to train AI models.";

  it("REGRESSION: the exact ShowNotes rule renders as a prohibition in every pack", () => {
    const packs = renderAllPacks(refineAndLock(showNotes("review")));
    expect(get(packs.founder, "WHAT_YOU_ARE_BUILDING.md")).toContain(`- ${EXACT}`);
    expect(get(packs.builder, "SCOPE.md")).toContain(`- ${EXACT}`);
    expect(get(packs.professional, "PRODUCT_TEAM_HANDOVER.md")).toContain(`- ${EXACT}`);
    expect(get(packs.universal, "UNIVERSAL_BUILDER_HANDOVER.md")).toContain(`- ${EXACT}`);
  });

  it.each(ALL_FIXTURES.map((f) => [f.key, f] as const))("%s: no bare forbidden action under a must-never heading", (_k, f) => {
    const packs = renderAllPacks(refineAndLock(f));
    for (const pack of Object.values(packs)) {
      for (const file of pack.files) {
        const lines = file.content.split("\n");
        lines.forEach((line: string, n: number) => {
          if (!/^#+ .*must never/i.test(line) && !/^Must never:$/.test(line)) return;
          for (let k = n + 1; k < lines.length && !/^#/.test(lines[k]!); k++) {
            const l = lines[k]!;
            if (l.startsWith("- ")) expect(l, `${pack.kind}/${file.name}`).toMatch(/^- Must not .+\.$/);
          }
        });
      }
    }
  });
});
