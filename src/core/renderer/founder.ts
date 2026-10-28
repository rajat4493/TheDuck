/** Founder / Vibe Coder Pack — plain English, conclusion first. */
import { DATA_PLAIN, PROVENANCE_PLAIN, READINESS_LABEL, READINESS_PLAIN, stagePlain } from "../model/labels.ts";
import { prohibition } from "../model/text.ts";
import { aiState, dataState } from "../assurance/open-items.ts";
import { bullets, extraAssumedRows, header, makePack, numbered } from "./common.ts";
import type { Pack, RenderInput, RenderedFile } from "./common.ts";

export const FOUNDER_DISCLAIMER =
  "TheDuck wrote these notes from your locked product definition using fixed rules. No qualified technical, security, cost or legal expert has reviewed them, and they are not an approval of any kind.";

export const NOTHING_WAITING = "Nothing is waiting for your decision right now.";

export const FOUNDER_FILES = [
  "WHAT_YOU_ARE_BUILDING.md",
  "WHAT_CHANGED.md",
  "CURRENT_OUTCOME.md",
  "VAT_UAT.md",
  "PRODUCT_PITCH.md",
  "FOUNDER_TECH_NOTES.md",
] as const;

const FIELD_PLAIN: Record<string, string> = {
  productName: "name",
  targetUser: "who it is for",
  jobToBeDone: "the job it does",
  desiredOutcome: "what will be better",
  stage: "what the first version is for",
  dataSensitivity: "what information it holds",
  usesAI: "whether it uses AI",
  coreWorkflow: "the main journey",
  outOfScope: "what it will not do",
  mustNot: "what it must never do",
  successCriteria: "how you will know it is done",
  integrations: "connected services",
  acceptanceCriteria: "the agreed checks",
};

function plainValue(v: unknown): string {
  if (Array.isArray(v)) return v.map((x) => (typeof x === "string" ? x : ((x as { text?: string }).text ?? ""))).join("; ");
  if (v === null || v === undefined) return "(not set)";
  return String(v);
}

/** True when anything at all is still open. Used to guard the "nothing waiting" sentence. */
export function anythingOpen(input: RenderInput): boolean {
  return (
    input.open.decisions.length > 0 ||
    input.open.unresolved.length > 0 ||
    input.open.professional.length > 0 ||
    input.candidates.length > 0 ||
    input.pendingChanges.length > 0
  );
}

/** "Still waiting for you" — the single source used by every founder file. */
export function waitingForYou(input: RenderInput): string {
  const lines: string[] = [];
  for (const d of input.open.decisions) {
    lines.push(
      `### Decision needed: ${d.decisionNeeded}`,
      "",
      `- **Why it matters:** ${d.whyItMatters}`,
      ...(d.options.length ? [`- **Options:** ${d.options.map((o) => `${o.label} (${o.tradeOff})`).join(" · ")}`] : []),
      `- **TheDuck recommends:** ${d.recommendation}`,
      `- **If you leave it for now:** ${d.ifDeferred}`,
      "",
    );
  }
  for (const c of input.pendingChanges) {
    lines.push(
      `### A change is waiting for your approval (${c.id})`,
      "",
      `- **What would change:** ${FIELD_PLAIN[c.field] ?? c.field}`,
      `- **From:** ${plainValue(c.before)}`,
      `- **To:** ${plainValue(c.after)}`,
      `- **Why:** ${c.reason}`,
      "- Nothing changes unless you approve it.",
      "",
    );
  }
  if (lines.length) return lines.join("\n");
  if (anythingOpen(input)) {
    return "No decisions are waiting for you right now, but some questions are still open for your builder or a professional — see below.";
  }
  return NOTHING_WAITING;
}

function openForOthers(input: RenderInput): string {
  const items = [
    ...input.open.professional.map((p) => `${p.question} — ${p.whyItMatters.replace(/the product owner/g, "you")}`),
    ...(input.candidates.length
      ? [
          `${input.candidates.length} of your checks are not precise enough to test yet (${input.candidates.map((c) => c.id).join(", ")}). Your builder must agree the exact expected result with you before calling any of them done.`,
        ]
      : []),
  ];
  return bullets(items, "None.");
}

function assumed(input: RenderInput): string {
  return bullets(
    input.open.assumptions.map((a) => a.text),
    "TheDuck did not assume anything that you did not tell it.",
  );
}

function kindOfProduct(input: RenderInput): string {
  const i = input.lock.intent;
  const ai = aiState(i);
  const ds = dataState(i);
  return [
    i.stage ? `- This is ${stagePlain(i.stage)}.` : "- You have not decided yet whether this is a demo, a pilot or a real product.",
    ds === "open"
      ? "- You are not sure yet what information about people it will hold."
      : ds === "assumed_not_sensitive"
        ? "- TheDuck assumes it holds no sensitive or regulated information (not confirmed)."
        : `- It holds ${DATA_PLAIN[ds]}.`,
    ai === "yes"
      ? "- It uses AI to do part of the job."
      : ai === "no"
        ? "- It does not use AI."
        : ai === "open"
          ? "- You are not sure yet whether it uses AI."
          : "- TheDuck assumes it does not use AI (not confirmed).",
    i.integrations.length ? `- It connects to: ${i.integrations.map((x) => x.text).join("; ")}.` : "- No connected services have been named.",
  ].join("\n");
}

function whatYouAreBuilding(input: RenderInput): string {
  const i = input.lock.intent;
  return `${header(input, "founder", "WHAT_YOU_ARE_BUILDING.md", "founder")}
# What you are building

You are building **${i.productName}** for ${i.targetUser}.

## The job it does for them

${i.jobToBeDone}

## What will be better when it works

${i.desiredOutcome}

## The main journey

${numbered(i.coreWorkflow.map((s) => s.text))}

## What the first version will not do

${bullets(i.outOfScope.map((s) => s.text), "You did not list anything.")}

## Things it must never do

${bullets(i.mustNot.map((s) => prohibition(s.text)), "You did not list anything.")}

## How you will know it is done

${bullets(i.successCriteria.map((s) => s.text))}

## What kind of product this is

${kindOfProduct(input)}

## Still waiting for you

${waitingForYou(input)}

## Still open for your builder or a professional

You do not need to answer these yourself, but they must be settled before anyone calls the product done.

${openForOthers(input)}

## What TheDuck assumed (tell us if any of this is wrong)

${assumed(input)}
`;
}

function whatChanged(input: RenderInput): string {
  const i = input.lock.intent;
  const changes = input.approvedChanges;
  const since =
    changes.length === 0
      ? "Nothing has changed since you locked it."
      : changes
          .map(
            (c) =>
              `- **${FIELD_PLAIN[c.field] ?? c.field}** changed in version ${c.resultingLockVersion} (${c.id}). From: ${plainValue(c.before)} → To: ${plainValue(c.after)}. Why: ${c.reason}. Who: ${PROVENANCE_PLAIN[input.lock.fieldProvenance[c.field] ?? "HUMAN"]}.`,
          )
          .join("\n");
  const mustNotTexts = new Set(i.mustNot.map((m) => m.text));
  const shaping: string[] = [];
  if (input.asked.some((a) => a.questionId === "Q-TARGET-USER-NARROW"))
    shaping.push(`TheDuck asked you to narrow who it is for. It is now for: ${i.targetUser}.`);
  for (const s of input.asked.flatMap((a) => a.theduckAdditions))
    shaping.push(`TheDuck suggested, and you accepted: "${mustNotTexts.has(s) ? prohibition(s) : s}"`);
  const notSure = input.asked.filter((a) => a.answer.kind === "not_sure").length;
  return `${header(input, "founder", "WHAT_CHANGED.md", "founder")}
# What changed

${since}

## How your answers shaped it before you locked it

${input.provider.description}

${bullets(shaping, "Your answers were used as you gave them. TheDuck did not add anything of its own.")}

You answered ${input.lock.refinement.questionsAsked} questions${notSure ? ` (you said "not sure yet" to ${notSure})` : ""}, filled in the rest in the preview, and locked version 1.
`;
}

function currentOutcome(input: RenderInput): string {
  const l = input.lock;
  const proven = input.evidence.filter((e) => e.state === "VERIFIED").map((e) => e.claim);
  const assumedRows = extraAssumedRows(input).map((r) => `${r.founderName}: ${r.founderConsequence}`);
  return `${header(input, "founder", "CURRENT_OUTCOME.md", "founder")}
# Current outcome

**Nothing has been built yet. Your product definition is locked (version ${l.version}).**

TheDuck has not sent anything to a coding tool and has not run any code for this product.

## Proven

${bullets(proven, "Nothing yet.")}

## Waiting for your decision

${input.open.decisions.length || input.pendingChanges.length ? bullets([...input.open.decisions.map((d) => d.decisionNeeded), ...input.pendingChanges.map((c) => `Approve or reject change ${c.id}.`)]) : waitingForYou(input)}

## Still open for your builder or a professional

${openForOthers(input)}

## Assumed, not yet checked

${bullets([...input.open.assumptions.map((a) => a.text), ...assumedRows], "Nothing.")}

## Your next step

${input.open.decisions.length ? `Make the decision${input.open.decisions.length > 1 ? "s" : ""} above first — start with: ${input.open.decisions[0]?.decisionNeeded}` : 'Read "What you are building" and check it says what you mean.'} Then give the builder handover to whichever coding tool you use, and ask it to propose a plan before it writes code.
`;
}

function vatUat(input: RenderInput): string {
  const acs = input.lock.intent.acceptanceCriteria;
  const journey = input.candidates.filter((c) => c.source === "workflow");
  const blocked = input.candidates.filter((c) => c.source === "success");
  return `${header(input, "founder", "VAT_UAT.md", "founder")}
# Your own checks before you call it done

**Your next step:** nothing is built yet, so there is nothing to try today. When your builder says the main journey is ready, start with the journey checks below.

Do these yourself. Tick each one only when you have seen it with your own eyes — not because someone told you it works.

## Journey checks (still being made precise with your builder)

${journey.map((c) => `- [ ] **${c.id}** — ${c.founderCheck}`).join("\n") || "None."}

## Agreed checks

${acs.map((ac) => `- [ ] **${ac.id}** — ${ac.founderCheck}`).join("\n") || "None yet."}
${
  blocked.length
    ? `
## Checks you cannot do yet

${blocked.map((c) => `- [ ] **${c.id}** — ${c.founderCheck}`).join("\n")}
`
    : ""
}
If something does not behave as described, write down what you did and what you saw, and give that to your builder. If you want it to behave differently, that is a change to your product: ask for a Change Proposal.
`;
}

function pitch(input: RenderInput): string {
  const i = input.lock.intent;
  return `${header(input, "founder", "PRODUCT_PITCH.md", "founder")}
# How to explain ${i.productName}

## In one line

${i.productName} is for ${i.targetUser}.

## The problem

${i.jobToBeDone}

## What is better with it

${i.desiredOutcome}

## How it works

${numbered(i.coreWorkflow.map((s) => s.text))}

## What it deliberately does not do (yet)

${bullets([...i.outOfScope.map((s) => s.text), ...i.mustNot.map((s) => prohibition(s.text))])}

## Honest status

Nothing has been built yet. This describes what you approved, not a finished product.
`;
}

function techNotes(input: RenderInput): string {
  const p = input.profile;
  const order = ["OPEN_QUESTION", "REQUIRED", "ASSUMPTION", "IMPLEMENTED_NOT_VERIFIED", "VERIFIED", "NOT_APPLICABLE"];
  const rows = [...p.rows].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
  const body = rows
    .map(
      (r) => `### ${r.founderName} — ${READINESS_PLAIN[r.status]} (${READINESS_LABEL[r.status]})

${r.founderConsequence}

<details><summary>Technical detail</summary>

- Workstream: ${r.name}
- Why this status: ${r.basis}
- Next professional action: ${r.nextProfessionalAction}
${r.unknowns.length ? `- Unknowns: ${r.unknowns.join(" ")}` : "- Unknowns: none recorded."}

</details>
`,
    )
    .join("\n");
  return `${header(input, "founder", "FOUNDER_TECH_NOTES.md", "founder")}
# What you should know as the owner

These notes turn the professional checklist into what it means for you. Most important first.

${body}
## Running costs

${p.cost.founderSummary}

<details><summary>Technical detail</summary>

- Measured ${p.cost.unit}. Status: ${p.cost.state}.
- Suggested limit: ${p.cost.guardrail}
- Alert: ${p.cost.alertThreshold}

</details>

## Important

${FOUNDER_DISCLAIMER}
`;
}

export function renderFounderPack(input: RenderInput): Pack {
  const files: RenderedFile[] = [
    { name: "WHAT_YOU_ARE_BUILDING.md", content: whatYouAreBuilding(input) },
    { name: "WHAT_CHANGED.md", content: whatChanged(input) },
    { name: "CURRENT_OUTCOME.md", content: currentOutcome(input) },
    { name: "VAT_UAT.md", content: vatUat(input) },
    { name: "PRODUCT_PITCH.md", content: pitch(input) },
    { name: "FOUNDER_TECH_NOTES.md", content: techNotes(input) },
  ];
  for (const f of files) {
    if (f.content.includes(NOTHING_WAITING) && anythingOpen(input)) {
      throw new Error(`Invariant broken: ${f.name} says nothing is waiting while items are open.`);
    }
  }
  return makePack("founder", input, files);
}
