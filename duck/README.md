# /duck — TheDuck building TheDuck

This directory is the project-control layer for building TheDuck itself.

TheDuck must dogfood its own rules.

## Mandatory milestone checkpoint

A milestone is complete only when all are true:

1. implementation is committed and pushed;
2. this `/duck` state is updated;
3. evidence is recorded honestly;
4. blockers/assumptions/open questions are visible;
5. `HANDOFF.md` gives the exact next action for another coding agent.

## Evidence vocabulary

- **VERIFIED** — actually executed/observed and result recorded.
- **IMPLEMENTED NOT VERIFIED** — code/config exists but was not exercised.
- **ASSUMPTION** — believed true but not confirmed.
- **OPEN QUESTION** — unresolved decision or unknown.
- **FAILED** — attempted and did not work.

Never use `tested`, `validated`, `production ready`, `works`, or `passes` as evidence unless the relevant thing actually ran and the result was observed.

## Product-change provenance

Material changes must be labelled:

- `HUMAN`
- `THEDUCK-SUGGESTED + HUMAN-APPROVED`
- `IMPLEMENTATION-NECESSARY`
- `EVIDENCE-DISCOVERED`

The locked product intent lives at `docs/PRODUCT_INTENT_LOCKED_V1.md` and is authoritative.
