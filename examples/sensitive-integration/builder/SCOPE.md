<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c pack=builder file=SCOPE.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Scope

## In scope

The main journey (see USER_FLOWS.md) and what is needed to meet ACCEPTANCE_CRITERIA.md:

1. Patient signs in with an invite from the clinic
2. Patient sees today's exercises with instructions
3. Patient marks exercises as done
4. Physio changes the plan in the clinic's system and the patient sees the update

## Out of scope (explicit non-scope)

- Diagnosis, medical advice or symptom checking
- Booking appointments or taking payments
- Messaging between patients and physios
- Any clinic other than the one partner clinic

## Must never

- Must not show one patient's information to another patient.
- Must not change anything in the clinic's practice management system.
- Must not use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then).

Anything not listed as in scope needs a Change Proposal before you build it.
