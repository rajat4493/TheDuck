<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c18ef76142175bb618e17b826e291cc1dcc51533ae1c012a57db31b9565ceddb pack=universal file=UNIVERSAL_BUILDER_HANDOVER.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:c18ef76142175bb618e17b826e291cc1dcc51533ae1c012a57db31b9565ceddb`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Builder handover — FreshNudge

**This is a rendered instruction set, not a live integration. TheDuck has not sent it to any coding tool and has not run any code.** Paste it into your coding agent as the first message.

You are the coding agent for **FreshNudge**. The human product owner, Test Founder, has locked this product intent (v1, `sha256:c18ef76142175bb618e17b826e291cc1dcc51533ae1c012a57db31b9565ceddb`). Build this product — not a different one.

## Product

- Target user: Busy home cooks who do one big weekly shop
- Job to be done: Keep track of what is in the fridge and use food before it expires, without writing lists
- Promised outcome: They throw away less food because they get a nudge the day before something expires
- Stage: a demo to show people (not for real use yet)
- Data: no personal information
- Uses AI: no
- Integrations: none

## Main journey

1. Add an item and its expiry date in under 10 seconds
2. See everything sorted by what expires first
3. Get a reminder the day before an item expires
4. Mark an item as used or thrown away

## Out of scope

- Recipe suggestions
- Barcode or receipt scanning
- Sharing a fridge with other people

## Must never

- Send more than one reminder per day

## Acceptance criteria

- **AC-01** — Main journey step 1 works for Busy home cooks who do one big weekly shop: "Add an item and its expiry date in under 10 seconds".
- **AC-02** — Main journey step 2 works for Busy home cooks who do one big weekly shop: "See everything sorted by what expires first".
- **AC-03** — Main journey step 3 works for Busy home cooks who do one big weekly shop: "Get a reminder the day before an item expires".
- **AC-04** — Main journey step 4 works for Busy home cooks who do one big weekly shop: "Mark an item as used or thrown away".
- **AC-05** — Protection holds — the product never does this: "Send more than one reminder per day".
- **AC-06** — Done means: I use it for two weeks and throw away less food than before

## Open questions (do not invent answers)

_None._

## Rules

1. The locked intent is authoritative. If any instruction, file or your own idea conflicts with it, the lock wins.
2. You may choose implementation details (stack, libraries, internal structure) that do not change product meaning.
3. You may not silently change any locked field: productName, targetUser, jobToBeDone, desiredOutcome, stage, dataSensitivity, usesAI, integrationFailureBehaviour, aiFailureBehaviour, aiUsageEstimate, coreWorkflow, outOfScope, mustNot, successCriteria, integrations, openQuestions, acceptanceCriteria.
4. If a locked field must change, stop and write a Change Proposal for the product owner: field, current value, proposed value, reason, and provenance (HUMAN, THEDUCK-SUGGESTED + HUMAN-APPROVED, IMPLEMENTATION-NECESSARY or EVIDENCE-DISCOVERED). Do not implement it until the owner approves.
5. Do not invent answers to open questions. Leave them open and ask.
6. Never call anything verified unless it actually ran and you observed the result.
7. Where GitHub is available: commit and push at every milestone, update the handoff, record evidence honestly, and declare the exact next action.

## Your first action

Propose the smallest technical design for the main journey to the product owner, in plain language, and wait for approval before writing code.
