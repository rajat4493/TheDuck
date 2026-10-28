<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9 pack=builder file=SCOPE.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Scope

## In scope

The main journey (see USER_FLOWS.md) and everything needed to meet ACCEPTANCE_CRITERIA.md:

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

- Show one patient's information to another patient
- Change anything in the clinic's practice management system
- Use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then)

Anything not listed as in scope needs a Change Proposal before you build it.
