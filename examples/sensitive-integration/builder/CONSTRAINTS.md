<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c pack=builder file=CONSTRAINTS.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Constraints

- Stage: production — a real product that people will rely on.
- Data: sensitive_or_regulated — sensitive or regulated information. Use made-up test data only until a qualified review is done.
- Uses AI: ASSUMPTION — no AI (not confirmed); do not add AI without a Change Proposal.
- Integration: The clinic's practice management system — the source of each patient's exercise plan
- Must not show one patient's information to another patient.
- Must not change anything in the clinic's practice management system.
- Must not use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then).

## Open questions and undecided values — do not invent answers

_None._

## Explicit assumptions

- TheDuck assumes the product does not use AI, because AI was not mentioned.
