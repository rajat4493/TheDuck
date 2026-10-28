<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c pack=professional file=PRODUCT_TEAM_HANDOVER.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Product team handover — PhysioPath

Lock v1 · `sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c`

## 1. Product overview and problem statement

**PhysioPath** — Patients follow their plan correctly between appointments and stop relying on paper handouts

Problem: Know exactly which exercises to do at home and how often, and see changes their physio makes without waiting for the next appointment

Stage: production — a real product that people will rely on.

## 2. Target user and job to be done

- Target user: Patients of one partner physiotherapy clinic who have a home exercise plan
- Job to be done: Know exactly which exercises to do at home and how often, and see changes their physio makes without waiting for the next appointment
- Promised outcome: Patients follow their plan correctly between appointments and stop relying on paper handouts

## 3. Functional requirements, scope, non-scope and journeys

Main journey (locked commitments; FR-n map to journey steps):

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

- Must not show one patient's information to another patient.
- Must not change anything in the clinic's practice management system.
- Must not use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then).

## 4. Acceptance criteria and initial NFRs

### LOCKED ACCEPTANCE CRITERIA

- **AC-01** — When any user or process attempts to show one patient's information to another patient, the system shall prevent it.
- **AC-02** — When any user or process attempts to change anything in the clinic's practice management system, the system shall prevent it.
- **AC-03** — When any user or process attempts to use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then), the system shall prevent it.
- **AC-04** — When the first version is evaluated, the product owner shall be able to observe that: Ten pilot patients use it for four weeks.
- **AC-05** — When the first version is evaluated, the product owner shall be able to observe that: The partner clinic confirms the plans shown match their system.

### DRAFT VERIFICATION CANDIDATES — not acceptance criteria

Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.

- **VC-01** (draft) — Patient signs in with an invite from the clinic
- **VC-02** (draft) — Patient sees today's exercises with instructions
- **VC-03** (draft) — Patient marks exercises as done
- **VC-04** (draft) — Physio changes the plan in the clinic's system and the patient sees the update

Initial non-functional requirements (derived; see DELIVERY_READINESS.md):

- Data protection appropriate to: sensitive_or_regulated — sensitive or regulated information.
- Reliability appropriate to: production — a real product that people will rely on.
- Integration failure: Keep working with what is already saved and catch up when the service is back.

## 5. Architecture / context

No architecture has been chosen. Context for the architect:

- Stage: production — a real product that people will rely on.
- Uses AI: ASSUMPTION — no AI (not confirmed); do not add AI without a Change Proposal.
- Integrations: The clinic's practice management system — the source of each patient's exercise plan.
- Record the stack decision as an ADR before building.

## 6. Data and integration considerations

- Data sensitivity: sensitive_or_regulated — sensitive or regulated information.
- Integration: The clinic's practice management system — the source of each patient's exercise plan.

## 7. Risks, dependencies, assumptions and open questions

Open decisions for the product owner:

_None._

Open professional questions:

_None._

Explicit assumptions:

- TheDuck assumes the product does not use AI, because AI was not mentioned.

Dependencies: The clinic's practice management system — the source of each patient's exercise plan.

## 8. Decision history and provenance

- v1 locked by Test Founder (product owner) after 6 refinement questions (deterministic-rules; AI used: no).
- Q-DATA: "Must not use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then)." — THEDUCK-SUGGESTED + HUMAN-APPROVED

## 9. Verification and UAT / release-readiness status

- Evidence states in use: VERIFIED, IMPLEMENTED NOT VERIFIED, ASSUMPTION, OPEN QUESTION, FAILED.
- Recorded evidence:
  - VERIFIED: The product owner explicitly locked product intent v1.
- Locked acceptance criteria evidence: none yet (nothing built).
- Draft verification candidates awaiting refinement: VC-01, VC-02, VC-03, VC-04.
- Release readiness: **not ready** — nothing is built. See DELIVERY_READINESS.md.
- Founder UAT checklist: Founder Pack, VAT_UAT.md.

## 10. Current product state and handover

- Locked intent v1; nothing built; no coding tool invoked by TheDuck.
- Pending Change Proposals: none.
- Next action: with the product owner, resolve the open decisions and refine the draft verification candidates for the main journey; then propose the smallest technical design for B1 before writing code.
