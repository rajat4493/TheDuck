/** AI Builder Pack — precise, durable instructions that protect the lock. */
import { canonicalJson } from "../model/integrity.ts";
import { DATA_PLAIN, EVIDENCE_LABEL, PROVENANCE_LABEL, stagePlain } from "../model/labels.ts";
import { prohibition } from "../model/text.ts";
import { EVIDENCE_STATES, INTENT_FIELDS } from "../model/schema.ts";
import type { IntentContent } from "../model/schema.ts";
import { aiState, dataState } from "../assurance/open-items.ts";
import { bullets, extraAssumedRows, header, makePack, numbered } from "./common.ts";
import type { Pack, RenderInput, RenderedFile } from "./common.ts";

export const BUILDER_FILES = [
  "LOCKED_INTENT.md",
  "JTBD.md",
  "SCOPE.md",
  "USER_FLOWS.md",
  "ACCEPTANCE_CRITERIA.md",
  "CONSTRAINTS.md",
  "MILESTONES.md",
  "VERIFICATION_EXPECTATIONS.md",
  "HANDOFF.md",
  "LOCK.json",
] as const;

export const LOCKED_AC_HEADING = "LOCKED ACCEPTANCE CRITERIA";
export const DRAFT_VC_HEADING = "DRAFT VERIFICATION CANDIDATES — not acceptance criteria";
export const REFINE_INSTRUCTION =
  "Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable \"When …, the system shall …\" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.";

export const ANTI_DRIFT_RULES = [
  "The locked intent is authoritative. If any instruction, file or your own idea conflicts with it, the lock wins.",
  "You may choose implementation details (stack, libraries, internal structure) that do not change product meaning.",
  `You may not silently change any locked field: ${INTENT_FIELDS.join(", ")}.`,
  "If a locked field must change, stop and write a Change Proposal for the product owner: field, current value, proposed value, reason, and provenance (HUMAN, THEDUCK-SUGGESTED + HUMAN-APPROVED, IMPLEMENTATION-NECESSARY or EVIDENCE-DISCOVERED). Do not implement it until the owner approves.",
  "Do not invent answers to open questions or undecided values (limits, providers, policies). Leave them open and ask.",
  REFINE_INSTRUCTION,
  "Never call anything verified unless it actually ran and you observed the result.",
  "Where GitHub is available: commit and push at every milestone, update the handoff, record evidence honestly, and declare the exact next action.",
];

/** Profile values as a builder should read them: value, ASSUMPTION or OPEN QUESTION. */
export function profileLines(i: IntentContent): { stage: string; data: string; ai: string } {
  const ai = aiState(i);
  const ds = dataState(i);
  return {
    stage: i.stage ? `${i.stage} — ${stagePlain(i.stage)}` : "OPEN QUESTION — not decided; treat as a demo (no real users, no real data) until decided",
    data:
      ds === "open"
        ? "OPEN QUESTION — founder not sure yet"
        : ds === "assumed_not_sensitive"
          ? "ASSUMPTION — no sensitive or regulated information (not confirmed); may hold basic personal details"
          : `${ds} — ${DATA_PLAIN[ds]}`,
    ai:
      ai === "yes"
        ? `yes — when AI is wrong: ${i.aiFailureBehaviour ?? "OPEN QUESTION (do not use AI output automatically)"}`
        : ai === "no"
          ? "no"
          : ai === "open"
            ? "OPEN QUESTION — founder not sure yet; do not build AI features until decided"
            : "ASSUMPTION — no AI (not confirmed); do not add AI without a Change Proposal",
  };
}

export function lockedAcLines(input: RenderInput): string {
  const acs = input.lock.intent.acceptanceCriteria;
  return acs.length ? acs.map((ac) => `- **${ac.id}** — ${ac.statement}`).join("\n") : "_None locked yet._";
}

export function candidateLines(input: RenderInput): string {
  return input.candidates.length
    ? input.candidates.map((c) => `- **${c.id}** (draft) — ${c.commitment}`).join("\n")
    : "_None._";
}

function lockedIntent(input: RenderInput): string {
  const l = input.lock;
  const i = l.intent;
  const prof = profileLines(i);
  const prov = (f: string) => (l.fieldProvenance[f] ? PROVENANCE_LABEL[l.fieldProvenance[f]] : "— (not set)");
  return `${header(input, "builder", "LOCKED_INTENT.md", "professional")}
# Locked intent — ${i.productName}

- **Lock version:** v${l.version}
- **Fingerprint:** \`${l.fingerprint}\`
- **Locked by:** ${l.lockedBy.name} (product owner), ${l.lockedAt}
- **Refinement:** ${l.refinement.providerKind} provider \`${l.refinement.providerId}\`; AI used: ${l.refinement.usedAI ? "yes" : "no"}

| Field | Locked value | Provenance |
|---|---|---|
| Product name | ${i.productName} | ${prov("productName")} |
| Target user | ${i.targetUser} | ${prov("targetUser")} |
| Job to be done | ${i.jobToBeDone} | ${prov("jobToBeDone")} |
| Promised outcome | ${i.desiredOutcome} | ${prov("desiredOutcome")} |
| Stage | ${prof.stage} | ${prov("stage")} |
| Data sensitivity | ${prof.data} | ${prov("dataSensitivity")} |
| Uses AI | ${prof.ai} | ${prov("usesAI")} |

## Anti-drift rules

${numbered(ANTI_DRIFT_RULES)}
`;
}

function jtbd(input: RenderInput): string {
  const i = input.lock.intent;
  return `${header(input, "builder", "JTBD.md", "professional")}
# Job to be done

- **Who:** ${i.targetUser}
- **Job:** ${i.jobToBeDone}
- **Promised outcome:** ${i.desiredOutcome}

Every implementation decision should make this job easier for this user. Do not optimise for a different user.
`;
}

function scope(input: RenderInput): string {
  const i = input.lock.intent;
  return `${header(input, "builder", "SCOPE.md", "professional")}
# Scope

## In scope

The main journey (see USER_FLOWS.md) and what is needed to meet ACCEPTANCE_CRITERIA.md:

${numbered(i.coreWorkflow.map((s) => s.text))}

## Out of scope (explicit non-scope)

${bullets(i.outOfScope.map((s) => s.text))}

## Must never

${bullets(i.mustNot.map((s) => prohibition(s.text)), "_No must-not rules set._")}

Anything not listed as in scope needs a Change Proposal before you build it.
`;
}

function flows(input: RenderInput): string {
  const i = input.lock.intent;
  return `${header(input, "builder", "USER_FLOWS.md", "professional")}
# User flows

## Main journey — ${i.targetUser}

${numbered(i.coreWorkflow.map((s) => s.text))}

Each step is a locked commitment, not an acceptance criterion. Its expected result, error behaviour and limits are draft verification candidates (ACCEPTANCE_CRITERIA.md) to refine with the product owner.

## Failure behaviour

${bullets(
  [
    ...(i.integrations.length
      ? [`Connected service unavailable: ${i.integrationFailureBehaviour ?? "OPEN QUESTION — show a clear error; do not invent a workaround."}`]
      : []),
    ...(i.usesAI === true
      ? [`AI output wrong: ${i.aiFailureBehaviour ?? "OPEN QUESTION — do not use AI output automatically until decided."}`]
      : []),
  ],
  "_No special failure behaviour locked._",
)}
`;
}

function acceptance(input: RenderInput): string {
  const acs = input.lock.intent.acceptanceCriteria;
  return `${header(input, "builder", "ACCEPTANCE_CRITERIA.md", "professional")}
# Acceptance criteria and verification candidates

## ${LOCKED_AC_HEADING}

Explicit, testable commitments approved by the product owner at lock. Each needs observed evidence before it may be called VERIFIED. Current evidence: none — nothing is built.

${
  acs.length
    ? acs
        .map(
          (ac) => `### ${ac.id}

- **Statement:** ${ac.statement}
- **How to check:** ${ac.howToCheck}
- **Source:** ${ac.source} · **Provenance:** ${PROVENANCE_LABEL[ac.provenance]}
- **Evidence:** none yet`,
        )
        .join("\n\n")
    : "_None locked yet._"
}

## ${DRAFT_VC_HEADING}

${REFINE_INSTRUCTION}

${
  input.candidates.length
    ? input.candidates
        .map(
          (c) => `### ${c.id} (draft)

- **Locked commitment:** ${c.commitment}
- **Draft check:** ${c.draftCheck}
- **Missing before it is testable:** ${c.missing.join("; ")}
- **Status:** OPEN QUESTION${c.blockedBy ? ` — waits on product-owner decision ${c.blockedBy}` : ""}`,
        )
        .join("\n\n")
    : "_None._"
}
`;
}

function openList(input: RenderInput): string[] {
  return [
    ...input.open.decisions.map((d) => `Product owner decision: ${d.decisionNeeded}`),
    ...input.open.professional.map((p) => `Professional question: ${p.question}`),
  ];
}

function constraints(input: RenderInput): string {
  const i = input.lock.intent;
  const prof = profileLines(i);
  const lines = [
    `Stage: ${prof.stage}.`,
    `Data: ${prof.data}.${i.dataSensitivity === "sensitive_or_regulated" ? " Use made-up test data only until a qualified review is done." : ""}`,
    `Uses AI: ${prof.ai}.`,
    ...(i.usesAI === true
      ? ["Keep the AI provider behind one interface; log run ID, model/version, latency, tokens and errors without personal information."]
      : []),
    ...i.integrations.map((x) => `Integration: ${x.text}`),
    ...i.mustNot.map((m) => prohibition(m.text)),
  ];
  return `${header(input, "builder", "CONSTRAINTS.md", "professional")}
# Constraints

${bullets(lines)}

## Open questions and undecided values — do not invent answers

${bullets(openList(input), "_None._")}

## Explicit assumptions

${bullets(
  [
    ...input.open.assumptions.map((a) => a.text),
    ...extraAssumedRows(input).map((r) => `${r.name}: ${r.basis}`),
  ],
  "_None recorded._",
)}
`;
}

function milestones(input: RenderInput): string {
  const acs = input.lock.intent.acceptanceCriteria;
  const ids = (src: string) => acs.filter((a) => a.source === src).map((a) => a.id);
  const vc = (src: string) => input.candidates.filter((c) => c.source === src).map((c) => c.id);
  return `${header(input, "builder", "MILESTONES.md", "professional")}
# Suggested milestones

ASSUMPTION: this sequencing is TheDuck's suggestion. A builder may re-sequence work but may not change scope; any scope change needs a Change Proposal.

## B0 — Agree what "done" means

- Refine draft verification candidates with the product owner: ${[...vc("workflow"), ...vc("success")].join(", ") || "—"}.
- Resolve open product-owner decisions that block the work (see CONSTRAINTS.md).
- Exit: each candidate needed for B1 is an owner-approved, testable criterion.

## B1 — Main journey works end to end

- Journey candidates (after refinement): ${vc("workflow").join(", ") || "—"}
- Exit: evidence recorded for each refined criterion; handoff updated.

## B2 — Protections hold

- Locked acceptance criteria: ${ids("must_not").join(", ") || "— (no must-not rules locked)"}
- Exit: each protection deliberately attacked and the result recorded.

## B3 — Done means done

- Locked acceptance criteria: ${[...ids("success"), ...ids("human")].join(", ") || "—"}${vc("success").length ? `; plus ${vc("success").join(", ")} once measurable` : ""}
- Exit: the product owner completes the VAT/UAT checklist.

At every milestone: commit and push, update HANDOFF.md, record evidence, declare the exact next action, and stop if the product owner must decide something.
`;
}

function verification(input: RenderInput): string {
  return `${header(input, "builder", "VERIFICATION_EXPECTATIONS.md", "professional")}
# Verification expectations

Use only these evidence states:

${bullets(EVIDENCE_STATES.map((s) => EVIDENCE_LABEL[s]))}

- VERIFIED means it actually ran and the result was observed and recorded (command or steps, and the result).
- IMPLEMENTED NOT VERIFIED means code exists but was not exercised.
- Never write "works", "tested", "passes", "validated" or "production ready" without observed evidence for that exact claim.
- Record evidence per locked acceptance criterion (${input.lock.intent.acceptanceCriteria.map((a) => a.id).join(", ") || "none yet"}).
- ${REFINE_INSTRUCTION}
- Fluent AI output is not evidence of correctness.
`;
}

function handoff(input: RenderInput): string {
  const l = input.lock;
  return `${header(input, "builder", "HANDOFF.md", "professional")}
# Handoff

## Current state

- Product intent locked at v${l.version} (\`${l.fingerprint}\`).
- Nothing has been built. No coding tool has been invoked by TheDuck.
- Open product-owner decisions: ${input.open.decisions.length ? input.open.decisions.map((d) => d.decisionNeeded).join(" | ") : "none"}.
- Open professional questions: ${input.open.professional.length ? input.open.professional.map((p) => p.question).join(" | ") : "none"}.
- Draft verification candidates to refine: ${input.candidates.map((c) => c.id).join(", ") || "none"}.
- Pending Change Proposals: ${input.pendingChanges.length ? input.pendingChanges.map((c) => c.id).join(", ") : "none"}.

## Exact next action

Read LOCKED_INTENT.md, SCOPE.md and ACCEPTANCE_CRITERIA.md. Then, with the product owner and in plain language: (1) raise the open decisions, (2) refine the draft verification candidates for the main journey, and (3) propose the smallest technical design for milestone B1 — before writing code.
`;
}

export function renderBuilderPack(input: RenderInput): Pack {
  const files: RenderedFile[] = [
    { name: "LOCKED_INTENT.md", content: lockedIntent(input) },
    { name: "JTBD.md", content: jtbd(input) },
    { name: "SCOPE.md", content: scope(input) },
    { name: "USER_FLOWS.md", content: flows(input) },
    { name: "ACCEPTANCE_CRITERIA.md", content: acceptance(input) },
    { name: "CONSTRAINTS.md", content: constraints(input) },
    { name: "MILESTONES.md", content: milestones(input) },
    { name: "VERIFICATION_EXPECTATIONS.md", content: verification(input) },
    { name: "HANDOFF.md", content: handoff(input) },
    // Machine-readable copy of the lock. Its fingerprint can be recomputed.
    { name: "LOCK.json", content: JSON.stringify(JSON.parse(canonicalJson(input.lock)), null, 2) + "\n" },
  ];
  return makePack("builder", input, files);
}
