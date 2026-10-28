/** AI Builder Pack — precise, durable instructions that protect the lock. */
import { canonicalJson } from "../model/integrity.ts";
import { DATA_PLAIN, EVIDENCE_LABEL, PROVENANCE_LABEL, STAGE_PLAIN } from "../model/labels.ts";
import { EVIDENCE_STATES, INTENT_FIELDS } from "../model/schema.ts";
import { bullets, header, makePack, numbered } from "./common.ts";
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

export const ANTI_DRIFT_RULES = [
  "The locked intent is authoritative. If any instruction, file or your own idea conflicts with it, the lock wins.",
  "You may choose implementation details (stack, libraries, internal structure) that do not change product meaning.",
  `You may not silently change any locked field: ${INTENT_FIELDS.join(", ")}.`,
  "If a locked field must change, stop and write a Change Proposal for the product owner: field, current value, proposed value, reason, and provenance (HUMAN, THEDUCK-SUGGESTED + HUMAN-APPROVED, IMPLEMENTATION-NECESSARY or EVIDENCE-DISCOVERED). Do not implement it until the owner approves.",
  "Do not invent answers to open questions. Leave them open and ask.",
  "Never call anything verified unless it actually ran and you observed the result.",
  "Where GitHub is available: commit and push at every milestone, update the handoff, record evidence honestly, and declare the exact next action.",
];

function lockedIntent(input: RenderInput): string {
  const l = input.lock;
  const i = l.intent;
  const prov = (f: string) => PROVENANCE_LABEL[l.fieldProvenance[f] ?? "HUMAN"];
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
| Stage | ${i.stage} — ${STAGE_PLAIN[i.stage]} | ${prov("stage")} |
| Data sensitivity | ${i.dataSensitivity} — ${DATA_PLAIN[i.dataSensitivity]} | ${prov("dataSensitivity")} |
| Uses AI | ${i.usesAI ? "yes" : "no"} | ${prov("usesAI")} |

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

The main journey (see USER_FLOWS.md) and everything needed to meet ACCEPTANCE_CRITERIA.md:

${numbered(i.coreWorkflow.map((s) => s.text))}

## Out of scope (explicit non-scope)

${bullets(i.outOfScope.map((s) => s.text))}

## Must never

${bullets(i.mustNot.map((s) => s.text), "_No extra rules set._")}

Anything not listed as in scope needs a Change Proposal before you build it.
`;
}

function flows(input: RenderInput): string {
  const i = input.lock.intent;
  return `${header(input, "builder", "USER_FLOWS.md", "professional")}
# User flows

## Main journey — ${i.targetUser}

${numbered(i.coreWorkflow.map((s) => s.text))}

## Failure behaviour

${bullets(
  [
    ...(i.integrations.length
      ? [`Connected service unavailable: ${i.integrationFailureBehaviour ?? "OPEN QUESTION — show a clear error; do not invent a workaround."}`]
      : []),
    ...(i.usesAI
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
# Acceptance criteria

Each criterion needs observed evidence before it may be called VERIFIED. Current evidence: none — nothing is built.

${acs
  .map(
    (ac) => `## ${ac.id}

- **Statement:** ${ac.statement}
- **How to check:** ${ac.howToCheck}
- **Source:** ${ac.source} · **Provenance:** ${PROVENANCE_LABEL[ac.provenance]}
- **Evidence:** none yet`,
  )
  .join("\n\n")}
`;
}

function constraints(input: RenderInput): string {
  const i = input.lock.intent;
  const lines = [
    `Stage: ${i.stage} — ${STAGE_PLAIN[i.stage]}.`,
    `Data: ${DATA_PLAIN[i.dataSensitivity]}.${i.dataSensitivity === "sensitive_or_regulated" ? " Use made-up test data only until a qualified review is done." : ""}`,
    i.usesAI
      ? "Uses AI: keep the AI provider behind one interface; log run ID, model/version, latency, tokens and errors without personal information."
      : "No AI: do not add AI features without an approved Change Proposal.",
    ...i.integrations.map((x) => `Integration: ${x.text}`),
    ...i.mustNot.map((m) => `Must never: ${m.text}`),
  ];
  return `${header(input, "builder", "CONSTRAINTS.md", "professional")}
# Constraints

${bullets(lines)}

## Open questions — do not invent answers

${bullets(i.openQuestions.map((q) => q.text), "_None._")}

## Assumptions

${bullets(
  input.profile.rows.filter((r) => r.status === "ASSUMPTION").map((r) => `${r.name}: ${r.basis}`),
  "_None recorded._",
)}
`;
}

function milestones(input: RenderInput): string {
  const acs = input.lock.intent.acceptanceCriteria;
  const ids = (src: string) => acs.filter((a) => a.source === src).map((a) => a.id);
  return `${header(input, "builder", "MILESTONES.md", "professional")}
# Suggested milestones

ASSUMPTION: this sequencing is TheDuck's suggestion. A builder may re-sequence work but may not change scope; any scope change needs a Change Proposal.

## B1 — Main journey works end to end

- Acceptance criteria: ${ids("workflow").join(", ") || "—"}
- Exit: evidence recorded for each criterion; handoff updated.

## B2 — Protections hold

- Acceptance criteria: ${ids("must_not").join(", ") || "— (no protection rules locked)"}
- Exit: each protection deliberately attacked and the result recorded.

## B3 — Done means done

- Acceptance criteria: ${[...ids("success"), ...ids("human")].join(", ") || "—"}
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
- Record evidence per acceptance criterion ID (${input.lock.intent.acceptanceCriteria.map((a) => a.id).join(", ")}).
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
- Open decisions: ${input.decisions.length ? input.decisions.map((d) => d.decisionNeeded).join(" | ") : "none"}.
- Pending Change Proposals: ${input.pendingChanges.length ? input.pendingChanges.map((c) => c.id).join(", ") : "none"}.

## Exact next action

Read LOCKED_INTENT.md, SCOPE.md and ACCEPTANCE_CRITERIA.md. Then propose the smallest technical design for milestone B1 to the product owner, in plain language, before writing code.
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
