# Change Proposals

A Change Proposal is the only way a locked product-intent field can change.
Each one names the field, the current wording, the proposed wording, why, its
provenance, and the product owner's decision. Nothing here edits the lock until
the status is `APPROVED` and the decision is recorded below.

| ID | Field | Provenance | Status | Lock file changed? |
|---|---|---|---|---|
| CP-001 | Canonical definition wording | THEDUCK-SUGGESTED | REJECTED (keep lock wording) | No |
| CP-002 | Target user | THEDUCK-SUGGESTED + HUMAN-APPROVED | APPROVED 2026-10-28 | Yes — after this record |

---

## CP-001 — Canonical definition wording ("trust layer")

- **Raised by:** lead coding agent, 2026-10-28, while reading the M1 build brief.
- **Field:** canonical definition (`docs/PRODUCT_INTENT_LOCKED_V1.md`).
- **Current (locked):** "TheDuck is the human-intent gate for AI software creation."
- **Proposed by the brief:** "TheDuck is the human-intent and trust layer for vibe-coded software."
- **Why raised:** "trust layer" could pull TheDuck toward an audit/governance
  product, which the lock lists as a non-goal.
- **Decision (product owner, 2026-10-28):** **REJECTED — do not amend.** Keep the
  locked wording. "Trust layer" may appear carefully in non-authoritative,
  explanatory copy only. Trust is an outcome of founder control, continuity,
  provenance and honest verification — not the product's primary identity.
- **Lock file changed:** No.

## CP-002 — Target user

- **Raised by:** lead coding agent, 2026-10-28 (the brief said "non-deep-tech
  founder"; the lock said "ordinary people"; the README said "non-technical or
  semi-technical builder").
- **Field:** target user (a protected field under the lock rule).
- **Current (locked):** "It helps ordinary people turn a rough software idea into
  an explicitly approved and locked product intent…" (no separate target-user
  statement).
- **Approved wording (supplied by the product owner):**
  > Ordinary people—especially non-technical or semi-technical founders and
  > builders—creating a real software product with AI coding tools.
- **Why:** keeps the original broad ambition while making the first customer
  explicit. It must not narrow the product to founders in a way that excludes
  capable non-founder builders.
- **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED (the agent raised the
  ambiguity; the product owner wrote and approved the final wording).
- **Decision (product owner, 2026-10-28):** **APPROVED.** Recorded here before
  the lock file is edited, as instructed.
- **Lock file change:** add a "Target user" section and an amendment log entry
  to `docs/PRODUCT_INTENT_LOCKED_V1.md`. No other locked wording changes.
