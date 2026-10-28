<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c pack=builder file=USER_FLOWS.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# User flows

## Main journey — Patients of one partner physiotherapy clinic who have a home exercise plan

1. Patient signs in with an invite from the clinic
2. Patient sees today's exercises with instructions
3. Patient marks exercises as done
4. Physio changes the plan in the clinic's system and the patient sees the update

Each step is a locked commitment, not an acceptance criterion. Its expected result, error behaviour and limits are draft verification candidates (ACCEPTANCE_CRITERIA.md) to refine with the product owner.

## Failure behaviour

- Connected service unavailable: Keep working with what is already saved and catch up when the service is back.
