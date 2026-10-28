/** Universal Builder Handover: one copy/paste starting point for any coding agent. */
import { DATA_PLAIN, STAGE_PLAIN } from "../model/labels.ts";
import { ANTI_DRIFT_RULES } from "../renderer/builder.ts";
import { bullets, header, numbered } from "../renderer/common.ts";
import type { RenderInput } from "../renderer/common.ts";
import type { BuilderAdapter } from "./adapter.ts";

export const UNIVERSAL_FILE = "UNIVERSAL_BUILDER_HANDOVER.md";
export const NOT_LIVE_NOTICE =
  "This is a rendered instruction set, not a live integration. TheDuck has not sent it to any coding tool and has not run any code.";

export function renderUniversal(input: RenderInput): string {
  const l = input.lock;
  const i = l.intent;
  return `${header(input, "universal", UNIVERSAL_FILE, "professional")}
# Builder handover — ${i.productName}

**${NOT_LIVE_NOTICE}** Paste it into your coding agent as the first message.

You are the coding agent for **${i.productName}**. The human product owner, ${l.lockedBy.name}, has locked this product intent (v${l.version}, \`${l.fingerprint}\`). Build this product — not a different one.

## Product

- Target user: ${i.targetUser}
- Job to be done: ${i.jobToBeDone}
- Promised outcome: ${i.desiredOutcome}
- Stage: ${STAGE_PLAIN[i.stage]}
- Data: ${DATA_PLAIN[i.dataSensitivity]}
- Uses AI: ${i.usesAI ? `yes — when AI is wrong: ${i.aiFailureBehaviour ?? "OPEN QUESTION (do not use AI output automatically)"}` : "no"}
${i.integrations.length ? `- Integrations: ${i.integrations.map((x) => x.text).join("; ")} — when unavailable: ${i.integrationFailureBehaviour ?? "OPEN QUESTION (show a clear error)"}` : "- Integrations: none"}

## Main journey

${numbered(i.coreWorkflow.map((s) => s.text))}

## Out of scope

${bullets(i.outOfScope.map((s) => s.text))}

## Must never

${bullets(i.mustNot.map((s) => s.text), "_None set._")}

## Acceptance criteria

${i.acceptanceCriteria.map((ac) => `- **${ac.id}** — ${ac.statement}`).join("\n")}

## Open questions (do not invent answers)

${bullets(i.openQuestions.map((q) => q.text), "_None._")}

## Rules

${numbered(ANTI_DRIFT_RULES)}

## Your first action

Propose the smallest technical design for the main journey to the product owner, in plain language, and wait for approval before writing code.
`;
}

export const universalAdapter: BuilderAdapter = {
  id: "universal",
  target: "Any coding agent (copy/paste)",
  isLiveIntegration: false,
  render: (input) => [{ name: UNIVERSAL_FILE, content: renderUniversal(input) }],
};
