<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9 pack=universal file=UNIVERSAL_BUILDER_HANDOVER.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Builder handover — PhysioPath

**This is a rendered instruction set, not a live integration. TheDuck has not sent it to any coding tool and has not run any code.** Paste it into your coding agent as the first message.

You are the coding agent for **PhysioPath**. The human product owner, Test Founder, has locked this product intent (v1, `sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9`). Build this product — not a different one.

## Product

- Target user: Patients of one partner physiotherapy clinic who have a home exercise plan
- Job to be done: Know exactly which exercises to do at home and how often, and see changes their physio makes without waiting for the next appointment
- Promised outcome: Patients follow their plan correctly between appointments and stop relying on paper handouts
- Stage: a real product that people will rely on
- Data: sensitive or regulated information
- Uses AI: no
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

- Show one patient's information to another patient
- Change anything in the clinic's practice management system
- Use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then)

## Acceptance criteria

- **AC-01** — Main journey step 1 works for Patients of one partner physiotherapy clinic who have a home exercise plan: "Patient signs in with an invite from the clinic".
- **AC-02** — Main journey step 2 works for Patients of one partner physiotherapy clinic who have a home exercise plan: "Patient sees today's exercises with instructions".
- **AC-03** — Main journey step 3 works for Patients of one partner physiotherapy clinic who have a home exercise plan: "Patient marks exercises as done".
- **AC-04** — Main journey step 4 works for Patients of one partner physiotherapy clinic who have a home exercise plan: "Physio changes the plan in the clinic's system and the patient sees the update".
- **AC-05** — Protection holds — the product never does this: "Show one patient's information to another patient".
- **AC-06** — Protection holds — the product never does this: "Change anything in the clinic's practice management system".
- **AC-07** — Protection holds — the product never does this: "Use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then)".
- **AC-08** — Done means: Ten pilot patients use it for four weeks
- **AC-09** — Done means: The partner clinic confirms the plans shown match their system

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
