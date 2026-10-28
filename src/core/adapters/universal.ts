/** Universal Builder Handover: one copy/paste starting point for any coding agent. */
import { prohibition } from "../model/text.ts";
import {
  ANTI_DRIFT_RULES,
  DRAFT_VC_HEADING,
  LOCKED_AC_HEADING,
  REFINE_INSTRUCTION,
  candidateLines,
  lockedAcLines,
  profileLines,
} from "../renderer/builder.ts";
import { bullets, header, numbered } from "../renderer/common.ts";
import type { RenderInput } from "../renderer/common.ts";
import type { BuilderAdapter } from "./adapter.ts";

export const UNIVERSAL_FILE = "UNIVERSAL_BUILDER_HANDOVER.md";
export const NOT_LIVE_NOTICE =
  "This is a rendered instruction set, not a live integration. TheDuck has not sent it to any coding tool and has not run any code.";

export function renderUniversal(input: RenderInput): string {
  const l = input.lock;
  const i = l.intent;
  const prof = profileLines(i);
  return `${header(input, "universal", UNIVERSAL_FILE, "professional")}
# Builder handover — ${i.productName}

**${NOT_LIVE_NOTICE}** Paste it into your coding agent as the first message.

You are the coding agent for **${i.productName}**. The human product owner, ${l.lockedBy.name}, has locked this product intent (v${l.version}, \`${l.fingerprint}\`). Build this product — not a different one.

## Product

- Target user: ${i.targetUser}
- Job to be done: ${i.jobToBeDone}
- Promised outcome: ${i.desiredOutcome}
- Stage: ${prof.stage}
- Data: ${prof.data}
- Uses AI: ${prof.ai}
${i.integrations.length ? `- Integrations: ${i.integrations.map((x) => x.text).join("; ")} — when unavailable: ${i.integrationFailureBehaviour ?? "OPEN QUESTION (show a clear error)"}` : "- Integrations: none named"}

## Main journey

${numbered(i.coreWorkflow.map((s) => s.text))}

## Out of scope

${bullets(i.outOfScope.map((s) => s.text))}

## Must never

${bullets(i.mustNot.map((s) => prohibition(s.text)), "_None set._")}

## ${LOCKED_AC_HEADING}

${lockedAcLines(input)}

## ${DRAFT_VC_HEADING}

${candidateLines(input)}

**Before claiming any feature is complete:** ${REFINE_INSTRUCTION}

## Open decisions and questions (do not invent answers)

${bullets(
  [
    ...input.open.decisions.map((d) => `Product owner decision: ${d.decisionNeeded}`),
    ...input.open.professional.map((p) => `Professional question: ${p.question}`),
  ],
  "_None._",
)}

## Explicit assumptions

${bullets(input.open.assumptions.map((a) => a.text), "_None._")}

## Rules

${numbered(ANTI_DRIFT_RULES)}

## Your first action

In plain language, raise the open decisions with the product owner, refine the draft verification candidates for the main journey with them, and propose the smallest technical design for the main journey. Wait for approval before writing code.
`;
}

export const universalAdapter: BuilderAdapter = {
  id: "universal",
  target: "Any coding agent (copy/paste)",
  isLiveIntegration: false,
  render: (input) => [{ name: UNIVERSAL_FILE, content: renderUniversal(input) }],
};
