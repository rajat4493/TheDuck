<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7 pack=professional file=PRODUCT_TEAM_HANDOVER.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Product team handover — FreshNudge

Lock v1 · `sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7`

## 1. Product overview and problem statement

**FreshNudge** — They throw away less food because they get a nudge the day before something expires

Problem: Keep track of what is in the fridge and use food before it expires, without writing lists

Stage: demo — a demo to show people (not for real use yet).

## 2. Target user and job to be done

- Target user: Busy home cooks who do one big weekly shop
- Job to be done: Keep track of what is in the fridge and use food before it expires, without writing lists
- Promised outcome: They throw away less food because they get a nudge the day before something expires

## 3. Functional requirements, scope, non-scope and journeys

Main journey (locked commitments; FR-n map to journey steps):

1. FR-1: Add an item and its expiry date in under 10 seconds
2. FR-2: See everything sorted by what expires first
3. FR-3: Get a reminder the day before an item expires
4. FR-4: Mark an item as used or thrown away

Out of scope:

- Recipe suggestions
- Barcode or receipt scanning
- Sharing a fridge with other people

Must never:

- Must not send more than one reminder per day.

## 4. Acceptance criteria and initial NFRs

### LOCKED ACCEPTANCE CRITERIA

- **AC-01** — When any user or process attempts to send more than one reminder per day, the system shall prevent it.
- **AC-02** — When the first version is evaluated, the product owner shall be able to observe that: I use it for two weeks and throw away less food than before.

### DRAFT VERIFICATION CANDIDATES — not acceptance criteria

Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.

- **VC-01** (draft) — Add an item and its expiry date in under 10 seconds
- **VC-02** (draft) — See everything sorted by what expires first
- **VC-03** (draft) — Get a reminder the day before an item expires
- **VC-04** (draft) — Mark an item as used or thrown away

Initial non-functional requirements (derived; see DELIVERY_READINESS.md):

- Data protection appropriate to: ASSUMPTION — no sensitive or regulated information (not confirmed); may hold basic personal details.
- Reliability appropriate to: demo — a demo to show people (not for real use yet).

## 5. Architecture / context

No architecture has been chosen. Context for the architect:

- Stage: demo — a demo to show people (not for real use yet).
- Uses AI: ASSUMPTION — no AI (not confirmed); do not add AI without a Change Proposal.
- Integrations: none named.
- Record the stack decision as an ADR before building.

## 6. Data and integration considerations

- Data sensitivity: ASSUMPTION — no sensitive or regulated information (not confirmed); may hold basic personal details.

## 7. Risks, dependencies, assumptions and open questions

Open decisions for the product owner:

_None._

Open professional questions:

_None._

Explicit assumptions:

- TheDuck assumes the product does not use AI, because AI was not mentioned.
- TheDuck assumes it holds no sensitive or regulated information (such as health, money or children's data), because nothing said so. It may still hold basic personal details such as names or emails.
- Data and integrations: No connected services named and no personal information confirmed; assumed simple data only.
- FinOps / cost model: No AI confirmed and not production: expected low running cost (hosting and storage only) — not measured.

Dependencies: none identified.

## 8. Decision history and provenance

- v1 locked by Test Founder (product owner) after 6 refinement questions (deterministic-rules; AI used: no).

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
