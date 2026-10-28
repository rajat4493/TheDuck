/**
 * Deterministic rules provider.
 *
 * Honest label: these are FIXED questions chosen by simple rules and keyword
 * hints. There is no AI and no understanding of the idea's meaning.
 */
import type { Question, RefinementProvider, RefinementState } from "./provider.ts";

const BROAD_USER = /\b(everyone|everybody|anyone|anybody|all users|all people|people in general)\b/i;
const AI_HINT = /\b(ai|a\.i\.|gpt|llm|chatbot|machine learning|ai-written|ai-generated)\b/i;
const SENSITIVE_HINT =
  /\b(health|patient|patients|clinic|medical|therapy|physio\w*|bank|banking|financ\w*|payroll|child|children|kids|pupil|employee records?|insurance|legal)\b/i;

/** Must-never items name the forbidden action, matching how founders answer Q-MUST-NOT. */
export const SENSITIVE_DATA_RULE =
  "Use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then)";
export const AI_REVIEW_STEP = "Review and edit the AI's result before it is used or shared";
export const AI_REVIEW_RULE = "Publish, send or act on AI output without the user's approval";
export const AI_AUTO_SUCCESS = "People can quickly see, undo or correct anything the AI produced.";

type Bank = (s: RefinementState) => Question | null;

const asked = (s: RefinementState, id: string) => s.asked.some((a) => a.questionId === id);

const BANK: Bank[] = [
  (s) =>
    s.draft.productName
      ? null
      : {
          id: "Q-PRODUCT-NAME",
          gap: "name",
          kind: "text",
          target: "productName",
          prompt: "What should we call it for now? A working name is fine.",
          reason: "Every document and every builder will then talk about the same thing.",
          notSureText: null,
        },
  () => ({
    id: "Q-TARGET-USER",
    gap: "target_user",
    kind: "text",
    target: "targetUser",
    prompt: "Who is the main person this first version is for?",
    reason: "AI builders need one clear person to design for. Products built for everyone usually suit no one.",
    notSureText: "Who is the main person the first version is for?",
  }),
  (s) => {
    const user = s.draft.targetUser;
    if (!user || !BROAD_USER.test(user) || asked(s, "Q-TARGET-USER-NARROW")) return null;
    return {
      id: "Q-TARGET-USER-NARROW",
      gap: "target_user",
      kind: "text",
      target: "targetUser",
      prompt: `"${user}" is very broad. Who will use it first and most often?`,
      reason: "The first version needs one main user. You can widen it later through a change you approve.",
      notSureText: "Who will use the first version first and most often?",
    };
  },
  () => ({
    id: "Q-JOB",
    gap: "job",
    kind: "text",
    target: "jobToBeDone",
    prompt: "What are they trying to get done, and what gets in their way today?",
    reason: "This is the job the product exists to do. Builders will judge every choice against it.",
    notSureText: "What job is the product doing for its main user?",
  }),
  () => ({
    id: "Q-OUTCOME",
    gap: "outcome",
    kind: "text",
    target: "desiredOutcome",
    prompt: "When this works, what is better for them?",
    reason: "This becomes the promise the builder has to keep.",
    notSureText: "What should be better for the user when it works?",
  }),
  () => ({
    id: "Q-WORKFLOW",
    gap: "core_workflow",
    kind: "list",
    target: "coreWorkflow",
    minItems: 1,
    prompt: "Describe the main journey in a few short steps — one step per line.",
    reason: "This is the path the builder must make work first. Everything else comes after.",
    notSureText: "What are the steps of the main journey?",
  }),
  () => ({
    id: "Q-OUT-OF-SCOPE",
    gap: "non_scope",
    kind: "list",
    target: "outOfScope",
    minItems: 1,
    prompt: "What should the first version deliberately NOT do?",
    reason: "Saying no protects your time and money, and stops AI builders adding things you did not ask for.",
    notSureText: "What will the first version deliberately not do?",
  }),
  () => ({
    id: "Q-MUST-NOT",
    gap: "must_not",
    kind: "list",
    target: "mustNot",
    minItems: 0,
    prompt:
      "Is there anything it must never do, even by accident? Describe the thing it must never do, e.g. \"Show one person's data to someone else\". Leave empty if nothing comes to mind.",
    reason: "These become protection rules that every builder must respect and test.",
    notSureText: null,
  }),
  () => ({
    id: "Q-SUCCESS",
    gap: "success",
    kind: "list",
    target: "successCriteria",
    minItems: 1,
    prompt: "How will you know the first version is good enough?",
    reason: "This defines \"done\". Without it, a builder decides for you.",
    notSureText: "How will we know the first version is good enough?",
  }),
  () => ({
    id: "Q-STAGE",
    gap: "stage",
    kind: "choice",
    prompt: "What is this first version for?",
    reason: "A demo, a pilot and a real product need very different levels of care, cost and protection.",
    notSureText: "Is the first version a demo, a pilot or a real product?",
    suggested: null,
    options: [
      {
        value: "demo",
        label: "A demo to show people — not for real use",
        consequence: "Builders can keep things simple. It must not be used with real customers.",
        effects: [{ op: "set", field: "stage", value: "demo" }],
      },
      {
        value: "pilot",
        label: "A pilot with a few real users",
        consequence: "Real people will use it, so basic reliability and support matter.",
        effects: [{ op: "set", field: "stage", value: "pilot" }],
      },
      {
        value: "production",
        label: "A real product people will rely on",
        consequence: "It needs proper hosting, monitoring, backups and someone to respond to problems.",
        effects: [{ op: "set", field: "stage", value: "production" }],
      },
    ],
  }),
  (s) => ({
    id: "Q-DATA",
    gap: "data",
    kind: "choice",
    prompt: "What kind of information about people will it hold?",
    reason: "The more sensitive the information, the more protection and review it needs before real use.",
    notSureText: "What kind of information about people will it hold?",
    suggested: SENSITIVE_HINT.test(s.roughIdea)
      ? {
          value: "sensitive_or_regulated",
          why: "Your idea mentions something that is often sensitive or regulated (keyword match only — please check).",
        }
      : null,
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
  }),
  () => ({
    id: "Q-INTEGRATIONS",
    gap: "integrations",
    kind: "list",
    target: "integrations",
    minItems: 0,
    prompt:
      "Does it need to connect to any other system or service to work? One per line, e.g. \"Google Calendar — to add reminders\". Leave empty if not.",
    reason: "Outside services can limit what is possible, cost money, or go down. Builders need to know early.",
    notSureText: null,
  }),
  (s) => {
    const first = s.draft.integrations[0];
    if (!first) return null;
    return {
      id: "Q-INTEGRATION-DOWN",
      gap: "integration_failure",
      kind: "choice",
      prompt: `If "${first.text}" is unavailable, what should people experience?`,
      reason: "Every outside service fails sometimes. Deciding now stops a builder guessing.",
      notSureText: "What should happen when a connected service is unavailable?",
      suggested: null,
      options: [
        {
          value: "message",
          label: "Show a clear message and let them try again later",
          consequence: "Simpler to build. People wait until the service is back.",
          effects: [
            {
              op: "set",
              field: "integrationFailureBehaviour",
              value: "Show a clear message and let people try again later.",
            },
          ],
        },
        {
          value: "queue",
          label: "Keep working with what is already saved and catch up later",
          consequence: "Better for people, but more work and more to test.",
          effects: [
            {
              op: "set",
              field: "integrationFailureBehaviour",
              value: "Keep working with what is already saved and catch up when the service is back.",
            },
          ],
        },
      ],
    };
  },
  (s) => ({
    id: "Q-AI",
    gap: "ai",
    kind: "choice",
    prompt: "Does the product itself use AI to do part of the job for its users?",
    reason: "AI features cost money each time they run and can be wrong, so they need extra decisions.",
    notSureText: "Does the product itself use AI?",
    suggested: AI_HINT.test(s.roughIdea)
      ? { value: "yes", why: "Your idea mentions AI (keyword match only — please check)." }
      : null,
    options: [
      {
        value: "yes",
        label: "Yes",
        consequence: "TheDuck will ask what should happen when the AI is wrong, and how often it will be used.",
        effects: [{ op: "set", field: "usesAI", value: true }],
      },
      {
        value: "no",
        label: "No",
        consequence: "No AI-specific risks or running costs.",
        effects: [{ op: "set", field: "usesAI", value: false }],
      },
    ],
  }),
  (s) =>
    s.draft.usesAI !== true
      ? null
      : {
          id: "Q-AI-WRONG",
          gap: "ai_failure",
          kind: "choice",
          prompt: "AI will sometimes get things wrong. What should happen then?",
          reason: "This decides whether a mistake can reach your users or the public without anyone checking.",
          notSureText: "What should happen when the AI gets something wrong?",
          suggested: {
            value: "review",
            why: "Safer for a first version: mistakes are caught before anyone else sees them.",
          },
          options: [
            {
              value: "review",
              label:
                "A person always checks the AI's work before it is used or shared — TheDuck will add a review step and a protection rule",
              consequence: "Safer. Slightly slower for users.",
              effects: [
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
              label:
                "Use the AI's work straight away; people fix mistakes afterwards — TheDuck will add a success check for easy correction",
              consequence: "Faster. Mistakes can reach other people before anyone notices.",
              effects: [
                {
                  op: "set",
                  field: "aiFailureBehaviour",
                  value: "AI results are used immediately; people correct mistakes afterwards.",
                },
                { op: "append", field: "successCriteria", text: AI_AUTO_SUCCESS, authoredBy: "theduck" },
              ],
            },
          ],
        },
  (s) =>
    s.draft.usesAI !== true
      ? null
      : {
          id: "Q-AI-USAGE",
          gap: "ai_usage",
          kind: "choice",
          prompt: "Roughly how often would one active person use the AI feature in a month?",
          reason:
            "AI costs money every time it runs. This sets the first cost estimate. It can be wrong — it will be marked as an assumption.",
          notSureText: "How often will one person use the AI feature each month?",
          suggested: null,
          options: [
            {
              value: "low",
              label: "A few times (under 10)",
              consequence: "Low AI running cost per person.",
              effects: [{ op: "set", field: "aiUsageEstimate", value: "low" }],
            },
            {
              value: "base",
              label: "Regularly (about 50 times)",
              consequence: "Moderate AI running cost per person.",
              effects: [{ op: "set", field: "aiUsageEstimate", value: "base" }],
            },
            {
              value: "high",
              label: "Heavily (200 times or more)",
              consequence: "AI may become your biggest running cost. Usage limits matter.",
              effects: [{ op: "set", field: "aiUsageEstimate", value: "high" }],
            },
          ],
        },
];

export const rulesProvider: RefinementProvider = {
  info: {
    id: "theduck-rules-v1",
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
