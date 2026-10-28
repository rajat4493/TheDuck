<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7 pack=universal file=UNIVERSAL_BUILDER_HANDOVER.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Builder handover — FreshNudge

**This is a rendered instruction set, not a live integration. TheDuck has not sent it to any coding tool and has not run any code.** Paste it into your coding agent as the first message.

You are the coding agent for **FreshNudge**. The human product owner, Test Founder, has locked this product intent (v1, `sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7`). Build this product — not a different one.

## Product

- Target user: Busy home cooks who do one big weekly shop
- Job to be done: Keep track of what is in the fridge and use food before it expires, without writing lists
- Promised outcome: They throw away less food because they get a nudge the day before something expires
- Stage: demo — a demo to show people (not for real use yet)
- Data: ASSUMPTION — no sensitive or regulated information (not confirmed); may hold basic personal details
- Uses AI: ASSUMPTION — no AI (not confirmed); do not add AI without a Change Proposal
- Integrations: none named

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

- Must not send more than one reminder per day.

## LOCKED ACCEPTANCE CRITERIA

- **AC-01** — When any user or process attempts to send more than one reminder per day, the system shall prevent it.
- **AC-02** — When the first version is evaluated, the product owner shall be able to observe that: I use it for two weeks and throw away less food than before.

## DRAFT VERIFICATION CANDIDATES — not acceptance criteria

- **VC-01** (draft) — Add an item and its expiry date in under 10 seconds
- **VC-02** (draft) — See everything sorted by what expires first
- **VC-03** (draft) — Get a reminder the day before an item expires
- **VC-04** (draft) — Mark an item as used or thrown away

**Before claiming any feature is complete:** Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.

## Open decisions and questions (do not invent answers)

_None._

## Explicit assumptions

- TheDuck assumes the product does not use AI, because AI was not mentioned.
- TheDuck assumes it holds no sensitive or regulated information (such as health, money or children's data), because nothing said so. It may still hold basic personal details such as names or emails.

## Rules

1. The locked intent is authoritative. If any instruction, file or your own idea conflicts with it, the lock wins.
2. You may choose implementation details (stack, libraries, internal structure) that do not change product meaning.
3. You may not silently change any locked field: productName, targetUser, jobToBeDone, desiredOutcome, stage, dataSensitivity, usesAI, integrationFailureBehaviour, aiFailureBehaviour, aiUsageEstimate, coreWorkflow, outOfScope, mustNot, successCriteria, integrations, openQuestions, acceptanceCriteria.
4. If a locked field must change, stop and write a Change Proposal for the product owner: field, current value, proposed value, reason, and provenance (HUMAN, THEDUCK-SUGGESTED + HUMAN-APPROVED, IMPLEMENTATION-NECESSARY or EVIDENCE-DISCOVERED). Do not implement it until the owner approves.
5. Do not invent answers to open questions or undecided values (limits, providers, policies). Leave them open and ask.
6. Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.
7. Never call anything verified unless it actually ran and you observed the result.
8. Where GitHub is available: commit and push at every milestone, update the handoff, record evidence honestly, and declare the exact next action.

## Your first action

In plain language, raise the open decisions with the product owner, refine the draft verification candidates for the main journey with them, and propose the smallest technical design for the main journey. Wait for approval before writing code.
