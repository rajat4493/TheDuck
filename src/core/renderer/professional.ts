/** Professional Product Team Pack — inheritable without old AI chats. */
import { EVIDENCE_LABEL, PROVENANCE_LABEL, READINESS_LABEL } from "../model/labels.ts";
import { prohibition } from "../model/text.ts";
import { DRAFT_VC_HEADING, LOCKED_AC_HEADING, REFINE_INSTRUCTION, candidateLines, lockedAcLines, profileLines } from "./builder.ts";
import { bullets, extraAssumedRows, header, makePack, numbered } from "./common.ts";
import type { Pack, RenderInput, RenderedFile } from "./common.ts";

export const PROFESSIONAL_FILES = ["PRODUCT_TEAM_HANDOVER.md", "DELIVERY_READINESS.md"] as const;

function handover(input: RenderInput): string {
  const l = input.lock;
  const i = l.intent;
  const prof = profileLines(i);
  const mustNotTexts = new Set(i.mustNot.map((m) => m.text));
  const decisionHistory = [
    `v1 locked by ${l.lockedBy.name} (product owner) after ${l.refinement.questionsAsked} refinement questions (${l.refinement.providerKind}; AI used: ${l.refinement.usedAI ? "yes" : "no"}).`,
    ...input.asked.flatMap((a) =>
      a.theduckAdditions.map(
        (t) => `${a.questionId}: "${mustNotTexts.has(t) ? prohibition(t) : t}" — ${PROVENANCE_LABEL.THEDUCK_SUGGESTED_HUMAN_APPROVED}`,
      ),
    ),
    ...input.approvedChanges.map(
      (c) =>
        `${c.id}: ${c.field} changed → v${c.resultingLockVersion}. Reason: ${c.reason}. Provenance: ${PROVENANCE_LABEL[l.fieldProvenance[c.field] ?? "HUMAN"]}. Approved by ${c.decidedBy?.name ?? "?"}.`,
    ),
  ];
  const unmeasurable = input.candidates.filter((c) => c.source === "success");
  return `${header(input, "professional", "PRODUCT_TEAM_HANDOVER.md", "professional")}
# Product team handover — ${i.productName}

Lock v${l.version} · \`${l.fingerprint}\`

## 1. Product overview and problem statement

**${i.productName}** — ${i.desiredOutcome}

Problem: ${i.jobToBeDone}

Stage: ${prof.stage}.

## 2. Target user and job to be done

- Target user: ${i.targetUser}
- Job to be done: ${i.jobToBeDone}
- Promised outcome: ${i.desiredOutcome}

## 3. Functional requirements, scope, non-scope and journeys

Main journey (locked commitments; FR-n map to journey steps):

${numbered(i.coreWorkflow.map((s, n) => `FR-${n + 1}: ${s.text}`))}

Out of scope:

${bullets(i.outOfScope.map((s) => s.text))}

Must never:

${bullets(i.mustNot.map((s) => prohibition(s.text)), "_None set._")}

## 4. Acceptance criteria and initial NFRs

### ${LOCKED_AC_HEADING}

${lockedAcLines(input)}

### ${DRAFT_VC_HEADING}

${REFINE_INSTRUCTION}

${candidateLines(input)}

Initial non-functional requirements (derived; see DELIVERY_READINESS.md):

${bullets([
  `Data protection appropriate to: ${prof.data}.`,
  `Reliability appropriate to: ${prof.stage}.`,
  ...(i.usesAI === true ? ["AI outputs evaluated against a fixed evaluation set; cost per request logged."] : []),
  ...(i.integrations.length ? [`Integration failure: ${i.integrationFailureBehaviour ?? "OPEN QUESTION"}`] : []),
])}

## 5. Architecture / context

No architecture has been chosen. Context for the architect:

${bullets([
  `Stage: ${prof.stage}.`,
  `Uses AI: ${prof.ai}.`,
  `Integrations: ${i.integrations.length ? i.integrations.map((x) => x.text).join("; ") : "none named"}.`,
  "Record the stack decision as an ADR before building.",
])}

## 6. Data and integration considerations

${bullets([`Data sensitivity: ${prof.data}.`, ...i.integrations.map((x) => `Integration: ${x.text}.`)])}

## 7. Risks, dependencies, assumptions and open questions

Open decisions for the product owner:

${bullets(input.open.decisions.map((d) => `${d.decisionNeeded}${d.about ? ` (about: "${d.about}")` : ""}`), "_None._")}

Open professional questions:

${bullets(input.open.professional.map((p) => p.question), "_None._")}

Explicit assumptions:

${bullets(
  [...input.open.assumptions.map((a) => a.text), ...extraAssumedRows(input).map((r) => `${r.name}: ${r.basis}`)],
  "_None._",
)}

Dependencies: ${i.integrations.length ? i.integrations.map((x) => x.text).join("; ") : "none identified"}.

## 8. Decision history and provenance

${bullets(decisionHistory)}

## 9. Verification and UAT / release-readiness status

- Evidence states in use: ${Object.values(EVIDENCE_LABEL).join(", ")}.
- Recorded evidence:
${input.evidence.map((e) => `  - ${EVIDENCE_LABEL[e.state]}: ${e.claim}`).join("\n")}
- Locked acceptance criteria evidence: none yet (nothing built).
- Draft verification candidates awaiting refinement: ${input.candidates.map((c) => c.id).join(", ") || "none"}.
${unmeasurable.length ? `- Not measurable until decided: ${unmeasurable.map((c) => `${c.id} "${c.commitment}"`).join("; ")}.\n` : ""}- Release readiness: **not ready** — nothing is built. See DELIVERY_READINESS.md.
- Founder UAT checklist: Founder Pack, VAT_UAT.md.

## 10. Current product state and handover

- Locked intent v${l.version}; nothing built; no coding tool invoked by TheDuck.
- Pending Change Proposals: ${input.pendingChanges.length ? input.pendingChanges.map((c) => c.id).join(", ") : "none"}.
- Next action: with the product owner, resolve the open decisions and refine the draft verification candidates for the main journey; then propose the smallest technical design for B1 before writing code.
`;
}

function readiness(input: RenderInput): string {
  const p = input.profile;
  return `${header(input, "professional", "DELIVERY_READINESS.md", "professional")}
# Delivery profile and readiness matrix

> ${p.disclaimer}

| Workstream | Status | Why it matters | Next professional action |
|---|---|---|---|
${p.rows.map((r) => `| ${r.name} | ${READINESS_LABEL[r.status]} | ${r.whyItMatters} | ${r.nextProfessionalAction} |`).join("\n")}

## Open professional actions

${bullets(p.openActions, "_None._")}

## Detail

${p.rows
  .map(
    (r) => `### ${r.name} — ${READINESS_LABEL[r.status]}

- Basis: ${r.basis}
- Unknowns: ${r.unknowns.length ? r.unknowns.join(" ") : "none recorded."}
- Founder consequence: ${r.founderConsequence}`,
  )
  .join("\n\n")}

## FinOps — cost hypothesis (${p.cost.state})

- Unit: ${p.cost.unit}
- Cost drivers:
${p.cost.drivers.map((d) => `  - ${d}`).join("\n")}
- Scenarios:
${p.cost.scenarios.map((s) => `  - ${s.name}: ${s.assumption} — ${s.formula}`).join("\n")}
- Verified prices: ${p.cost.verifiedPrices.length ? p.cost.verifiedPrices.map((v) => `${v.item} ${v.price} (${v.source}, ${v.checkedOn})`).join("; ") : "none — no price has been checked against official provider documentation."}
- Unknowns:
${p.cost.unknowns.map((u) => `  - ${u}`).join("\n")}
- Guardrail: ${p.cost.guardrail}
- Future alert threshold: ${p.cost.alertThreshold}
${
  p.ai
    ? `
## AI system / AIOps note

- AI jobs: ${p.ai.aiJobs.join("; ")}
- Failure behaviour: ${p.ai.failureBehaviour}
- Data boundary: ${p.ai.dataBoundary}
- Provider portability: ${p.ai.providerPortability}
- Evaluation: ${p.ai.evaluation}
- Quality signals: ${p.ai.qualitySignals.join("; ")}
- Observability: ${p.ai.observability.join("; ")}
`
    : `
## AI system / AIOps note

${p.rows.find((r) => r.id === "ai_aiops")?.basis ?? ""} No AI note generated. Revisit only through an approved Change Proposal.
`
}`;
}

export function renderProfessionalPack(input: RenderInput): Pack {
  const files: RenderedFile[] = [
    { name: "PRODUCT_TEAM_HANDOVER.md", content: handover(input) },
    { name: "DELIVERY_READINESS.md", content: readiness(input) },
  ];
  return makePack("professional", input, files);
}
