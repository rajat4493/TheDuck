/** Founder / Vibe Coder Pack — plain English, conclusion first. */
import { DATA_PLAIN, PROVENANCE_PLAIN, READINESS_LABEL, READINESS_PLAIN, STAGE_PLAIN } from "../model/labels.ts";
import { bullets, header, makePack, numbered } from "./common.ts";
import type { Pack, RenderInput, RenderedFile } from "./common.ts";

export const FOUNDER_DISCLAIMER =
  "TheDuck wrote these notes from your locked product definition using fixed rules. No qualified technical, security, cost or legal expert has reviewed them, and they are not an approval of any kind.";

export const FOUNDER_FILES = [
  "WHAT_YOU_ARE_BUILDING.md",
  "WHAT_CHANGED.md",
  "CURRENT_OUTCOME.md",
  "VAT_UAT.md",
  "PRODUCT_PITCH.md",
  "FOUNDER_TECH_NOTES.md",
] as const;

function plainValue(v: unknown): string {
  if (Array.isArray(v)) return v.map((x) => (typeof x === "string" ? x : (x as { text?: string }).text ?? "")).join("; ");
  if (v === null || v === undefined) return "(not set)";
  return String(v);
}

function waitingForYou(input: RenderInput): string {
  const lines: string[] = [];
  for (const d of input.decisions) {
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
      `- **What would change:** ${c.field}`,
      `- **From:** ${plainValue(c.before)}`,
      `- **To:** ${plainValue(c.after)}`,
      `- **Why:** ${c.reason}`,
      "- Nothing changes unless you approve it.",
      "",
    );
  }
  return lines.length ? lines.join("\n") : "Nothing is waiting for your decision right now.";
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

${bullets(i.outOfScope.map((s) => s.text))}

## Things it must never do

${bullets(i.mustNot.map((s) => s.text), "You did not list anything.")}

## How you will know it is done

${bullets(i.successCriteria.map((s) => s.text))}

## What kind of product this is

- This is ${STAGE_PLAIN[i.stage]}.
- It holds ${DATA_PLAIN[i.dataSensitivity]}.
- ${i.usesAI ? "It uses AI to do part of the job." : "It does not use AI."}
${i.integrations.length ? `- It connects to: ${i.integrations.map((x) => x.text).join("; ")}.` : "- It does not connect to other services."}

## Still waiting for you

${waitingForYou(input)}
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
              `- **${c.field}** changed in version ${c.resultingLockVersion} (${c.id}). From: ${plainValue(c.before)} → To: ${plainValue(c.after)}. Why: ${c.reason}. Who: ${PROVENANCE_PLAIN[input.lock.fieldProvenance[c.field] ?? "HUMAN"]}.`,
          )
          .join("\n");
  const suggestions = input.asked.flatMap((a) => a.theduckAdditions);
  const narrowed = input.asked.filter((a) => a.questionId === "Q-TARGET-USER-NARROW");
  const shaping: string[] = [];
  if (narrowed.length) shaping.push(`TheDuck asked you to narrow who it is for. It is now for: ${i.targetUser}.`);
  for (const s of suggestions) shaping.push(`TheDuck suggested, and you accepted: "${s}"`);
  return `${header(input, "founder", "WHAT_CHANGED.md", "founder")}
# What changed

${since}

## How your answers shaped it before you locked it

${input.provider.description}

${bullets(shaping, "Your answers were used as you gave them. TheDuck did not add anything of its own.")}

You locked version 1 after answering ${input.lock.refinement.questionsAsked} questions.
`;
}

function currentOutcome(input: RenderInput): string {
  const l = input.lock;
  const proven = input.evidence.filter((e) => e.state === "VERIFIED").map((e) => e.claim);
  const open = input.decisions.map((d) => d.decisionNeeded);
  return `${header(input, "founder", "CURRENT_OUTCOME.md", "founder")}
# Current outcome

**Nothing has been built yet. Your product definition is locked (version ${l.version}).**

TheDuck has not sent anything to a coding tool and has not run any code for this product.

## Proven

${bullets(proven, "Nothing yet.")}

## Assumed, not yet checked

${bullets(
  input.profile.rows.filter((r) => r.status === "ASSUMPTION").map((r) => `${r.founderName}: ${r.founderConsequence}`),
  "Nothing.",
)}

## Still undecided

${bullets(open, "Nothing.")}

## Your next step

Read "What you are building" and check it says what you mean. Then give the builder handover to whichever coding tool you use, and ask it to propose a plan before it writes code.
`;
}

function vatUat(input: RenderInput): string {
  const acs = input.lock.intent.acceptanceCriteria;
  return `${header(input, "founder", "VAT_UAT.md", "founder")}
# Your own checks before you call it done

**Your next step:** nothing is built yet, so there is nothing to try today. When your builder says the main journey is ready, start with the first check below.

Do these yourself. Tick each one only when you have seen it with your own eyes — not because someone told you it works.

${acs.map((ac) => `- [ ] **${ac.id}** — ${ac.founderCheck}`).join("\n")}

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

${bullets(i.outOfScope.map((s) => s.text))}

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
  return makePack("founder", input, files);
}
