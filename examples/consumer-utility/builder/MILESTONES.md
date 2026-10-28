<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7 pack=builder file=MILESTONES.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Suggested milestones

ASSUMPTION: this sequencing is TheDuck's suggestion. A builder may re-sequence work but may not change scope; any scope change needs a Change Proposal.

## B0 — Agree what "done" means

- Refine draft verification candidates with the product owner: VC-01, VC-02, VC-03, VC-04.
- Resolve open product-owner decisions that block the work (see CONSTRAINTS.md).
- Exit: each candidate needed for B1 is an owner-approved, testable criterion.

## B1 — Main journey works end to end

- Journey candidates (after refinement): VC-01, VC-02, VC-03, VC-04
- Exit: evidence recorded for each refined criterion; handoff updated.

## B2 — Protections hold

- Locked acceptance criteria: AC-01
- Exit: each protection deliberately attacked and the result recorded.

## B3 — Done means done

- Locked acceptance criteria: AC-02
- Exit: the product owner completes the VAT/UAT checklist.

At every milestone: commit and push, update HANDOFF.md, record evidence, declare the exact next action, and stop if the product owner must decide something.
