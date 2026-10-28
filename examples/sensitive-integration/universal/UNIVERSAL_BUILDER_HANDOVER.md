<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c pack=universal file=UNIVERSAL_BUILDER_HANDOVER.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Builder handover — PhysioPath

**This is a rendered instruction set, not a live integration. TheDuck has not sent it to any coding tool and has not run any code.** Paste it into your coding agent as the first message.

You are the coding agent for **PhysioPath**. The human product owner, Test Founder, has locked this product intent (v1, `sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c`). Build this product — not a different one.

## Product

- Target user: Patients of one partner physiotherapy clinic who have a home exercise plan
- Job to be done: Know exactly which exercises to do at home and how often, and see changes their physio makes without waiting for the next appointment
- Promised outcome: Patients follow their plan correctly between appointments and stop relying on paper handouts
- Stage: production — a real product that people will rely on
- Data: sensitive_or_regulated — sensitive or regulated information
- Uses AI: ASSUMPTION — no AI (not confirmed); do not add AI without a Change Proposal
- Integrations: The clinic's practice management system — the source of each patient's exercise plan — when unavailable: Keep working with what is already saved and catch up when the service is back.

## Main journey

1. Patient signs in with an invite from the clinic
2. Patient sees today's exercises with instructions
3. Patient marks exercises as done
4. Physio changes the plan in the clinic's system and the patient sees the update

## Out of scope

- Diagnosis, medical advice or symptom checking
- Booking appointments or taking payments
- Messaging between patients and physios
- Any clinic other than the one partner clinic

## Must never

- Must not show one patient's information to another patient.
- Must not change anything in the clinic's practice management system.
- Must not use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then).

## LOCKED ACCEPTANCE CRITERIA

- **AC-01** — When any user or process attempts to show one patient's information to another patient, the system shall prevent it.
- **AC-02** — When any user or process attempts to change anything in the clinic's practice management system, the system shall prevent it.
- **AC-03** — When any user or process attempts to use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then), the system shall prevent it.
- **AC-04** — When the first version is evaluated, the product owner shall be able to observe that: Ten pilot patients use it for four weeks.
- **AC-05** — When the first version is evaluated, the product owner shall be able to observe that: The partner clinic confirms the plans shown match their system.

## DRAFT VERIFICATION CANDIDATES — not acceptance criteria

- **VC-01** (draft) — Patient signs in with an invite from the clinic
- **VC-02** (draft) — Patient sees today's exercises with instructions
- **VC-03** (draft) — Patient marks exercises as done
- **VC-04** (draft) — Physio changes the plan in the clinic's system and the patient sees the update

**Before claiming any feature is complete:** Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.

## Open decisions and questions (do not invent answers)

_None._

## Explicit assumptions

- TheDuck assumes the product does not use AI, because AI was not mentioned.

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
