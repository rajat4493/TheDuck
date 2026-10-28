/**
 * Deterministic rules provider.
 *
 * Honest label: these are FIXED questions chosen by simple rules and keyword
 * hints. There is no AI and no understanding of the idea's meaning.
 *
 * M1.1.1 shape: five core questions, then at most three follow-ups — each only
 * when an answer or the idea materially changes the product. Everything else
 * (name, stage, connected services…) is left to the editable Product Preview and
 * shown as an explicit assumption or an open decision, never a guess.
 */
import type { Question, RefinementProvider, RefinementState } from "./provider.ts";

const BROAD_USER = /\b(everyone|everybody|anyone|anybody|all users|all people|people in general)\b/i;
const AI_HINT = /\b(ai|a\.i\.|gpt|llm|chatbot|machine learning|ai-written|ai-generated)\b/i;
const SENSITIVE_HINT =
  /\b(health|patient|patients|clinic|medical|therapy|physio\w*|bank|banking|financ\w*|payroll|child|children|kids|pupil|employee records?|insurance|legal)\b/i;

/** Must-not items name the forbidden action; renderers add "Must not". */
export const SENSITIVE_DATA_RULE =
  "Use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then)";
export const AI_REVIEW_STEP = "Review and edit the AI's result before it is used or shared";
export const AI_REVIEW_RULE = "Publish, send or act on AI output without the user's approval";
export const AI_AUTO_SUCCESS = "People can quickly see, undo or correct anything the AI produced.";

type Rule = (s: RefinementState) => Question | null;

const asked = (s: RefinementState, id: string) => s.asked.some((a) => a.questionId === id);

/** Everything the founder has said so far, for keyword hints. */
function allText(s: RefinementState): string {
  const d = s.draft;
  return [
    s.roughIdea,
    d.targetUser,
    d.jobToBeDone,
    d.desiredOutcome,
    ...d.coreWorkflow.map((i) => i.text),
    ...d.successCriteria.map((i) => i.text),
  ]
    .filter(Boolean)
    .join(" \n ");
}

const BANK: Rule[] = [
  // ── core 1: user + job ────────────────────────────────────────────────────
  () => ({
    id: "Q-USER-JOB",
    tier: "core",
    gap: "target_user_and_job",
    kind: "parts",
    prompt: "Who is the main person this first version is for, and what are they trying to get done?",
    reason: "AI builders need one clear person and one clear job to design for. Products built for everyone usually suit no one.",
    notSureText: "Who is the first version for, and what job does it do for them?",
    requireAny: false,
    parts: [
      { key: "user", label: "The main person it is for", kind: "text", target: "targetUser", optional: false },
      { key: "job", label: "What they are trying to get done", kind: "text", target: "jobToBeDone", optional: false },
    ],
  }),
  // follow-up: only if the user is too broad (changes the locked target user)
  (s) => {
    const user = s.draft.targetUser;
    if (!user || !BROAD_USER.test(user)) return null;
    return {
      id: "Q-TARGET-USER-NARROW",
      tier: "follow_up",
      gap: "target_user",
      kind: "text",
      target: "targetUser",
      prompt: `"${user}" is very broad. Who will use it first and most often?`,
      reason: "The first version needs one main user. You can widen it later through a change you approve.",
      notSureText: "Who will use the first version first and most often?",
    };
  },
  // ── core 2: outcome ───────────────────────────────────────────────────────
  () => ({
    id: "Q-OUTCOME",
    tier: "core",
    gap: "outcome",
    kind: "text",
    target: "desiredOutcome",
    prompt: "When this works, what is better for them?",
    reason: "This becomes the promise the builder has to keep.",
    notSureText: "What should be better for the user when it works?",
  }),
  // ── core 3: journey ───────────────────────────────────────────────────────
  () => ({
    id: "Q-WORKFLOW",
    tier: "core",
    gap: "core_workflow",
    kind: "list",
    target: "coreWorkflow",
    minItems: 1,
    prompt: "Describe the main journey in a few short steps — one step per line.",
    reason: "This is the path the builder must make work first. Everything else comes after.",
    notSureText: "What are the steps of the main journey?",
  }),
  // ── core 4: boundaries ────────────────────────────────────────────────────
  () => ({
    id: "Q-BOUNDARIES",
    tier: "core",
    gap: "non_scope_and_must_not",
    kind: "parts",
    prompt: "What should the first version deliberately not do — and is there anything it must never do?",
    reason: "Saying no protects your time and money, and stops AI builders adding things you did not ask for. Fill in at least one box.",
    notSureText: "What will the first version not do, and what must it never do?",
    requireAny: true,
    parts: [
      { key: "exclusions", label: "Things the first version will not do", kind: "list", target: "outOfScope", optional: true },
      {
        key: "never",
        label: "Things it must never do, even by accident (for example: show one person's data to someone else)",
        kind: "list",
        target: "mustNot",
        optional: true,
      },
    ],
  }),
  // ── core 5: success ───────────────────────────────────────────────────────
  () => ({
    id: "Q-SUCCESS",
    tier: "core",
    gap: "success",
    kind: "list",
    target: "successCriteria",
    minItems: 1,
    prompt: "How will you know the first version is good enough? Numbers help, but are not required.",
    reason: 'This defines "done". Without it, a builder decides for you.',
    notSureText: "How will we know the first version is good enough?",
  }),
  // follow-up: only if AI is mentioned (adds or removes a journey step and a rule)
  (s) =>
    !AI_HINT.test(allText(s))
      ? null
      : {
          id: "Q-AI",
          tier: "follow_up",
          gap: "ai",
          kind: "choice",
          prompt: "Your idea mentions AI. Will the product use AI to do part of the job — and if so, what should happen when the AI gets something wrong?",
          reason: "This decides whether an AI mistake can reach your users or the public without anyone checking.",
          notSureText: "Will the product use AI, and what should happen when the AI gets something wrong?",
          suggested: { value: "review", why: "Safer for a first version: mistakes are caught before anyone else sees them." },
          options: [
            {
              value: "review",
              label:
                "Yes — a person always checks the AI's work before it is used or shared (TheDuck will add a review step and a protection rule)",
              consequence: "Safer. Slightly slower for users.",
              effects: [
                { op: "set", field: "usesAI", value: true },
                {
                  op: "set",
                  field: "aiFailureBehaviour",
                  value: "A person reviews and can edit every AI result before it is used or shared.",
                },
                { op: "append", field: "coreWorkflow", text: AI_REVIEW_STEP, authoredBy: "theduck" },
                { op: "append", field: "mustNot", text: AI_REVIEW_RULE, authoredBy: "theduck" },
              ],
            },
            {
              value: "auto",
              label: "Yes — use the AI's work straight away; people fix mistakes afterwards (TheDuck will add a success check)",
              consequence: "Faster. Mistakes can reach other people before anyone notices.",
              effects: [
                { op: "set", field: "usesAI", value: true },
                {
                  op: "set",
                  field: "aiFailureBehaviour",
                  value: "AI results are used immediately; people correct mistakes afterwards.",
                },
                { op: "append", field: "successCriteria", text: AI_AUTO_SUCCESS, authoredBy: "theduck" },
              ],
            },
            {
              value: "no",
              label: "No — the product itself does not use AI",
              consequence: "No AI-specific risks or running costs.",
              effects: [{ op: "set", field: "usesAI", value: false }],
            },
          ],
        },
  // follow-up: only if sensitive information is hinted (adds a protection rule)
  (s) =>
    !SENSITIVE_HINT.test(allText(s))
      ? null
      : {
          id: "Q-DATA",
          tier: "follow_up",
          gap: "data",
          kind: "choice",
          prompt:
            "Your idea mentions something that is often sensitive (such as health, money or children). What kind of information about people will it hold?",
          reason: "The more sensitive the information, the more protection and review it needs before real use.",
          notSureText: "What kind of information about people will it hold?",
          suggested: {
            value: "sensitive_or_regulated",
            why: "Your idea mentions something that is often sensitive or regulated (keyword match only — please check).",
          },
          options: [
            {
              value: "none",
              label: "No personal information",
              consequence: "Lower risk, as long as it really never collects personal information.",
              effects: [{ op: "set", field: "dataSensitivity", value: "none" }],
            },
            {
              value: "personal",
              label: "Basic personal details (names, emails, accounts)",
              consequence: "It needs basic protection, a privacy notice and a way to delete someone's data.",
              effects: [{ op: "set", field: "dataSensitivity", value: "personal" }],
            },
            {
              value: "sensitive_or_regulated",
              label:
                "Sensitive or regulated information (health, money, children, employee or legal records) — TheDuck will add a protection rule: no real sensitive data until a qualified review",
              consequence: "It needs a qualified security and privacy review before any real data goes in.",
              effects: [
                { op: "set", field: "dataSensitivity", value: "sensitive_or_regulated" },
                { op: "append", field: "mustNot", text: SENSITIVE_DATA_RULE, authoredBy: "theduck" },
              ],
            },
          ],
        },
];

export const rulesProvider: RefinementProvider = {
  info: {
    id: "theduck-rules-v2",
    kind: "deterministic-rules",
    usesAI: false,
    description:
      "TheDuck asked fixed questions chosen by simple rules and keyword hints. No AI was used to understand or refine your idea.",
  },
  nextQuestion(state) {
    for (const rule of BANK) {
      const q = rule(state);
      if (q && !asked(state, q.id)) return q;
    }
    return null;
  },
};
