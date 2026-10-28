/**
 * Locked acceptance criteria vs draft verification candidates.
 *
 * LOCKED ACCEPTANCE CRITERIA: explicit, testable commitments the owner approved
 * at lock — must-not rules, and success checks that are measurable and depend
 * on no undecided value — written as "When …, the system shall …".
 *
 * DRAFT VERIFICATION CANDIDATES: TheDuck's restatement of journey steps and of
 * success checks that are not yet measurable. They preserve the commitment but
 * are NOT acceptance criteria: the expected result, error behaviour and limits
 * must be refined with the product owner before anyone claims "done".
 */
import type { AcceptanceCriterion, Draft, IntentContent } from "../model/schema.ts";
import { forbiddenAction, withPeriod } from "../model/text.ts";
import { dependsOnOutsideProvider, findUnresolvedReferences } from "./open-items.ts";
import type { IntentLike } from "./open-items.ts";

const VAGUE_QUALITY =
  /\b(good enough|easy|easily|simple|simply|fast|faster|quick|quickly|intuitive|user-friendly|nice|seamless|smooth|robust|scalable|well)\b/i;
const MEASURABLE =
  /\d|\b(one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty|hundred|thousand|half|once|twice|daily|weekly|monthly|every|each|all|none|nobody|no one|never|always|confirms?|matches|match)\b/i;

export interface Testability {
  testable: boolean;
  /** Plain reason when not testable. */
  reason: string | null;
  /** Decision-card id this depends on, if any. */
  blockedBy: string | null;
}

export function successTestability(text: string, intent: IntentLike): Testability {
  const ref = findUnresolvedReferences(intent).find((r) => r.text === text);
  if (ref) return { testable: false, reason: `It depends on "${ref.phrase}", which has not been decided.`, blockedBy: `DC-${ref.id}` };
  if (VAGUE_QUALITY.test(text) && !/\d/.test(text))
    return { testable: false, reason: "It uses a word like \"quickly\" or \"easy\" without a measure.", blockedBy: null };
  if (!MEASURABLE.test(text)) return { testable: false, reason: "It has no observable or measurable result yet.", blockedBy: null };
  return { testable: true, reason: null, blockedBy: null };
}

const acId = (n: number) => `AC-${String(n + 1).padStart(2, "0")}`;

/** Locked acceptance criteria TheDuck can derive without inventing detail. */
export function deriveAcceptanceCriteria(draft: Draft | IntentContent): AcceptanceCriterion[] {
  const out: Omit<AcceptanceCriterion, "id">[] = [];
  for (const rule of draft.mustNot) {
    const action = forbiddenAction(rule.text);
    if (dependsOnOutsideProvider(rule.text, draft)) {
      out.push({
        statement: `When any part of the product itself attempts to ${action}, the system shall prevent it.`,
        howToCheck:
          "Two parts. (1) Product: deliberately attempt it through the product's own code and its calls to outside services; expected: blocked and recorded. (2) Provider: record which provider was chosen, the contract or data-use terms, and the account settings that rule it out, with the date checked.",
        founderCheck: `You cannot fully check this one yourself, because it depends on the outside provider you choose. Ask your builder to show you that provider's terms and settings proving it will not ${action}, and when they were checked.`,
        source: "must_not",
        provenance: "THEDUCK_SUGGESTED_HUMAN_APPROVED",
        verificationCondition:
          "Cannot be marked VERIFIED until the outside provider is chosen and its data-use terms and configuration have been checked and recorded. A test of the product alone does not prove what a provider does with the data.",
      });
      continue;
    }
    out.push({
      statement: `When any user or process attempts to ${action}, the system shall prevent it.`,
      howToCheck:
        "Deliberately attempt it — as a user and through any background process or connected service. Expected: it is blocked, nothing is changed or shared, and the attempt is recorded as evidence.",
      founderCheck: `Try to make this happen on purpose: ${action}. It should not be possible.`,
      source: "must_not",
      provenance: "THEDUCK_SUGGESTED_HUMAN_APPROVED",
    });
  }
  for (const s of draft.successCriteria) {
    if (!successTestability(s.text, draft).testable) continue;
    out.push({
      statement: `When the first version is evaluated, the product owner shall be able to observe that: ${withPeriod(s.text)}`,
      howToCheck: "Record the observed result against this statement: what was measured, by whom, and when.",
      founderCheck: `Check for yourself: ${withPeriod(s.text)}`,
      source: "success",
      provenance: "THEDUCK_SUGGESTED_HUMAN_APPROVED",
    });
  }
  return out.map((ac, n) => ({ id: acId(n), ...ac }));
}

export interface VerificationCandidate {
  id: string;
  /** The locked commitment it restates, verbatim. */
  commitment: string;
  source: "workflow" | "success";
  /** Draft "When …, the system shall …" with the unknown part marked. */
  draftCheck: string;
  /** What must be defined before it can become an acceptance criterion. */
  missing: string[];
  /** Founder decision it waits on, if any. */
  blockedBy: string | null;
  founderCheck: string;
}

/** Draft candidates: every journey step, and every success check that is not yet measurable. */
export function deriveVerificationCandidates(i: IntentContent): VerificationCandidate[] {
  const out: Omit<VerificationCandidate, "id">[] = [];
  for (const step of i.coreWorkflow) {
    out.push({
      commitment: step.text,
      source: "workflow",
      draftCheck: `When the user carries out "${step.text}", the system shall [expected observable result — not yet defined].`,
      missing: ["the expected result", "what happens on error", "limits (sizes, formats, timing)"],
      blockedBy: null,
      founderCheck: `Try it yourself: ${withPeriod(step.text)} You should manage it on your own, without help.`,
    });
  }
  for (const s of i.successCriteria) {
    const t = successTestability(s.text, i);
    if (t.testable) continue;
    out.push({
      commitment: s.text,
      source: "success",
      draftCheck: `When the first version is evaluated, the product owner shall be able to observe that: ${withPeriod(s.text)} [measure not yet defined]`,
      missing: [t.reason ?? "a measurable result"],
      blockedBy: t.blockedBy,
      founderCheck: t.blockedBy
        ? `Cannot be checked yet: ${withPeriod(s.text)} Make the decision about it first (see "Still waiting for you").`
        : `Not measurable yet: ${withPeriod(s.text)} Decide how you would measure it.`,
    });
  }
  return out.map((c, n) => ({ id: `VC-${String(n + 1).padStart(2, "0")}`, ...c }));
}
