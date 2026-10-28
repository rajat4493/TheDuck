<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9 pack=professional file=PRODUCT_TEAM_HANDOVER.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Product team handover — PhysioPath

Lock v1 · `sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9`

## 1. Product overview and problem statement

**PhysioPath** — Patients follow their plan correctly between appointments and stop relying on paper handouts

Problem: Know exactly which exercises to do at home and how often, and see changes their physio makes without waiting for the next appointment

Stage: production (a real product that people will rely on).

## 2. Target user and job to be done

- Target user: Patients of one partner physiotherapy clinic who have a home exercise plan
- Job to be done: Know exactly which exercises to do at home and how often, and see changes their physio makes without waiting for the next appointment
- Promised outcome: Patients follow their plan correctly between appointments and stop relying on paper handouts

## 3. Functional requirements, scope, non-scope and journeys

Main journey (functional requirements FR-n map to journey steps):

1. FR-1: Patient signs in with an invite from the clinic
2. FR-2: Patient sees today's exercises with instructions
3. FR-3: Patient marks exercises as done
4. FR-4: Physio changes the plan in the clinic's system and the patient sees the update

Out of scope:

- Diagnosis, medical advice or symptom checking
- Booking appointments or taking payments
- Messaging between patients and physios
- Any clinic other than the one partner clinic

Must never:

- Show one patient's information to another patient
- Change anything in the clinic's practice management system
- Use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then)

## 4. Acceptance criteria and initial NFRs

- **AC-01** — Main journey step 1 works for Patients of one partner physiotherapy clinic who have a home exercise plan: "Patient signs in with an invite from the clinic". _(check: Acting as Patients of one partner physiotherapy clinic who have a home exercise plan, perform "Patient signs in with an invite from the clinic" end to end. It completes without help from the builder.)_
- **AC-02** — Main journey step 2 works for Patients of one partner physiotherapy clinic who have a home exercise plan: "Patient sees today's exercises with instructions". _(check: Acting as Patients of one partner physiotherapy clinic who have a home exercise plan, perform "Patient sees today's exercises with instructions" end to end. It completes without help from the builder.)_
- **AC-03** — Main journey step 3 works for Patients of one partner physiotherapy clinic who have a home exercise plan: "Patient marks exercises as done". _(check: Acting as Patients of one partner physiotherapy clinic who have a home exercise plan, perform "Patient marks exercises as done" end to end. It completes without help from the builder.)_
- **AC-04** — Main journey step 4 works for Patients of one partner physiotherapy clinic who have a home exercise plan: "Physio changes the plan in the clinic's system and the patient sees the update". _(check: Acting as Patients of one partner physiotherapy clinic who have a home exercise plan, perform "Physio changes the plan in the clinic's system and the patient sees the update" end to end. It completes without help from the builder.)_
- **AC-05** — Protection holds — the product never does this: "Show one patient's information to another patient". _(check: Deliberately try to break this rule. The product prevents it, and the attempt is recorded as evidence.)_
- **AC-06** — Protection holds — the product never does this: "Change anything in the clinic's practice management system". _(check: Deliberately try to break this rule. The product prevents it, and the attempt is recorded as evidence.)_
- **AC-07** — Protection holds — the product never does this: "Use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then)". _(check: Deliberately try to break this rule. The product prevents it, and the attempt is recorded as evidence.)_
- **AC-08** — Done means: Ten pilot patients use it for four weeks _(check: Show observed evidence (not a claim) that this is true.)_
- **AC-09** — Done means: The partner clinic confirms the plans shown match their system _(check: Show observed evidence (not a claim) that this is true.)_

Initial non-functional requirements (derived; see DELIVERY_READINESS.md):

- Data protection appropriate to: sensitive or regulated information.
- Reliability appropriate to: a real product that people will rely on.
- Integration failure: Keep working with what is already saved and catch up when the service is back.

## 5. Architecture / context

No architecture has been chosen. Context for the architect:

- Stage: production.
- Uses AI: no.
- Integrations: The clinic's practice management system — the source of each patient's exercise plan.
- Record the stack decision as an ADR before building.

## 6. Data and integration considerations

- Data sensitivity: sensitive_or_regulated (sensitive or regulated information).
- Integration: The clinic's practice management system — the source of each patient's exercise plan.

## 7. Risks, dependencies, assumptions and open questions

Assumptions:

_None._

Open questions:

_None._

Dependencies: The clinic's practice management system — the source of each patient's exercise plan.

## 8. Decision history and provenance

- v1 locked by Test Founder (product owner) after 12 refinement questions (deterministic-rules; AI used: no).
- Q-DATA: "Use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then)" — THEDUCK-SUGGESTED + HUMAN-APPROVED

## 9. Verification and UAT / release-readiness status

- Evidence states in use: VERIFIED, IMPLEMENTED NOT VERIFIED, ASSUMPTION, OPEN QUESTION, FAILED.
- Recorded evidence:
  - VERIFIED: The product owner explicitly locked product intent v1.
- Acceptance criteria evidence: none yet (nothing built).
- Release readiness: **not ready** — nothing is built. See DELIVERY_READINESS.md.
- Founder UAT checklist: Founder Pack, VAT_UAT.md.

## 10. Current product state and handover

- Locked intent v1; nothing built; no coding tool invoked by TheDuck.
- Pending Change Proposals: none.
- Next action: an engineering lead proposes the smallest technical design for the main journey (B1) to the product owner before writing code.
