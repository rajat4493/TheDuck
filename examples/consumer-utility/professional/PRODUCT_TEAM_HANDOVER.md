<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c18ef76142175bb618e17b826e291cc1dcc51533ae1c012a57db31b9565ceddb pack=professional file=PRODUCT_TEAM_HANDOVER.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:c18ef76142175bb618e17b826e291cc1dcc51533ae1c012a57db31b9565ceddb`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Product team handover — FreshNudge

Lock v1 · `sha256:c18ef76142175bb618e17b826e291cc1dcc51533ae1c012a57db31b9565ceddb`

## 1. Product overview and problem statement

**FreshNudge** — They throw away less food because they get a nudge the day before something expires

Problem: Keep track of what is in the fridge and use food before it expires, without writing lists

Stage: demo (a demo to show people (not for real use yet)).

## 2. Target user and job to be done

- Target user: Busy home cooks who do one big weekly shop
- Job to be done: Keep track of what is in the fridge and use food before it expires, without writing lists
- Promised outcome: They throw away less food because they get a nudge the day before something expires

## 3. Functional requirements, scope, non-scope and journeys

Main journey (functional requirements FR-n map to journey steps):

1. FR-1: Add an item and its expiry date in under 10 seconds
2. FR-2: See everything sorted by what expires first
3. FR-3: Get a reminder the day before an item expires
4. FR-4: Mark an item as used or thrown away

Out of scope:

- Recipe suggestions
- Barcode or receipt scanning
- Sharing a fridge with other people

Must never:

- Send more than one reminder per day

## 4. Acceptance criteria and initial NFRs

- **AC-01** — Main journey step 1 works for Busy home cooks who do one big weekly shop: "Add an item and its expiry date in under 10 seconds". _(check: Acting as Busy home cooks who do one big weekly shop, perform "Add an item and its expiry date in under 10 seconds" end to end. It completes without help from the builder.)_
- **AC-02** — Main journey step 2 works for Busy home cooks who do one big weekly shop: "See everything sorted by what expires first". _(check: Acting as Busy home cooks who do one big weekly shop, perform "See everything sorted by what expires first" end to end. It completes without help from the builder.)_
- **AC-03** — Main journey step 3 works for Busy home cooks who do one big weekly shop: "Get a reminder the day before an item expires". _(check: Acting as Busy home cooks who do one big weekly shop, perform "Get a reminder the day before an item expires" end to end. It completes without help from the builder.)_
- **AC-04** — Main journey step 4 works for Busy home cooks who do one big weekly shop: "Mark an item as used or thrown away". _(check: Acting as Busy home cooks who do one big weekly shop, perform "Mark an item as used or thrown away" end to end. It completes without help from the builder.)_
- **AC-05** — Protection holds — the product never does this: "Send more than one reminder per day". _(check: Deliberately try to break this rule. The product prevents it, and the attempt is recorded as evidence.)_
- **AC-06** — Done means: I use it for two weeks and throw away less food than before _(check: Show observed evidence (not a claim) that this is true.)_

Initial non-functional requirements (derived; see DELIVERY_READINESS.md):

- Data protection appropriate to: no personal information.
- Reliability appropriate to: a demo to show people (not for real use yet).

## 5. Architecture / context

No architecture has been chosen. Context for the architect:

- Stage: demo.
- Uses AI: no.
- Integrations: none.
- Record the stack decision as an ADR before building.

## 6. Data and integration considerations

- Data sensitivity: none (no personal information).

## 7. Risks, dependencies, assumptions and open questions

Assumptions:

- Data and integrations: Founder said no personal information and no connected services; assumed simple data only.
- Security and privacy: Founder said no personal information; assumed basic security hygiene only.
- FinOps / cost model: No AI and not production: expected low running cost (hosting and storage only) — not measured.

Open questions:

_None._

Dependencies: none identified.

## 8. Decision history and provenance

- v1 locked by Test Founder (product owner) after 13 refinement questions (deterministic-rules; AI used: no).

## 9. Verification and UAT / release-readiness status

- Evidence states in use: VERIFIED, IMPLEMENTED NOT VERIFIED, ASSUMPTION, OPEN QUESTION, FAILED.
- Recorded evidence:
  - VERIFIED: The product owner explicitly locked product intent v1.
- Acceptance criteria evidence: none yet (nothing built).
- Release readiness: **not ready** — nothing is built. See DELIVERY_READINESS.md.
- Founder UAT checklist: Founder Pack, VAT_UAT.md.

## 10. Current product state and handover

- Locked intent v1; nothing built; no coding tool invoked by TheDuck.
- Pending Change Proposals: none.
- Next action: an engineering lead proposes the smallest technical design for the main journey (B1) to the product owner before writing code.
