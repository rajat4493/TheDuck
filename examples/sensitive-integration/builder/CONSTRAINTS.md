<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9 pack=builder file=CONSTRAINTS.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Constraints

- Stage: production — a real product that people will rely on.
- Data: sensitive or regulated information. Use made-up test data only until a qualified review is done.
- No AI: do not add AI features without an approved Change Proposal.
- Integration: The clinic's practice management system — the source of each patient's exercise plan
- Must never: Show one patient's information to another patient
- Must never: Change anything in the clinic's practice management system
- Must never: Use real people's sensitive information before a qualified security and privacy review is done (use made-up test data until then)

## Open questions — do not invent answers

_None._

## Assumptions

_None recorded._
