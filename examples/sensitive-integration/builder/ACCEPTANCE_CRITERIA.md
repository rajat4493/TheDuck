<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c pack=builder file=ACCEPTANCE_CRITERIA.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Acceptance criteria and verification candidates

## LOCKED ACCEPTANCE CRITERIA

Explicit, testable commitments approved by the product owner at lock. Each needs observed evidence before it may be called VERIFIED. Current evidence: none — nothing is built.

### AC-01

- **Statement:** When any user or process attempts to show one patient's information to another patient, the system shall prevent it.
- **How to check:** Deliberately attempt it — as a user and through any background process or connected service. Expected: it is blocked, nothing is changed or shared, and the attempt is recorded as evidence.
- **Source:** must_not · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

### AC-02

- **Statement:** When any user or process attempts to change anything in the clinic's practice management system, the system shall prevent it.
- **How to check:** Deliberately attempt it — as a user and through any background process or connected service. Expected: it is blocked, nothing is changed or shared, and the attempt is recorded as evidence.
- **Source:** must_not · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

### AC-03

- **Statement:** When any user or process attempts to use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then), the system shall prevent it.
- **How to check:** Deliberately attempt it — as a user and through any background process or connected service. Expected: it is blocked, nothing is changed or shared, and the attempt is recorded as evidence.
- **Source:** must_not · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

### AC-04

- **Statement:** When the first version is evaluated, the product owner shall be able to observe that: Ten pilot patients use it for four weeks.
- **How to check:** Record the observed result against this statement: what was measured, by whom, and when.
- **Source:** success · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

### AC-05

- **Statement:** When the first version is evaluated, the product owner shall be able to observe that: The partner clinic confirms the plans shown match their system.
- **How to check:** Record the observed result against this statement: what was measured, by whom, and when.
- **Source:** success · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

## DRAFT VERIFICATION CANDIDATES — not acceptance criteria

Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.

### VC-01 (draft)

- **Locked commitment:** Patient signs in with an invite from the clinic
- **Draft check:** When the user carries out "Patient signs in with an invite from the clinic", the system shall [expected observable result — not yet defined].
- **Missing before it is testable:** the expected result; what happens on error; limits (sizes, formats, timing)
- **Status:** OPEN QUESTION

### VC-02 (draft)

- **Locked commitment:** Patient sees today's exercises with instructions
- **Draft check:** When the user carries out "Patient sees today's exercises with instructions", the system shall [expected observable result — not yet defined].
- **Missing before it is testable:** the expected result; what happens on error; limits (sizes, formats, timing)
- **Status:** OPEN QUESTION

### VC-03 (draft)

- **Locked commitment:** Patient marks exercises as done
- **Draft check:** When the user carries out "Patient marks exercises as done", the system shall [expected observable result — not yet defined].
- **Missing before it is testable:** the expected result; what happens on error; limits (sizes, formats, timing)
- **Status:** OPEN QUESTION

### VC-04 (draft)

- **Locked commitment:** Physio changes the plan in the clinic's system and the patient sees the update
- **Draft check:** When the user carries out "Physio changes the plan in the clinic's system and the patient sees the update", the system shall [expected observable result — not yet defined].
- **Missing before it is testable:** the expected result; what happens on error; limits (sizes, formats, timing)
- **Status:** OPEN QUESTION
