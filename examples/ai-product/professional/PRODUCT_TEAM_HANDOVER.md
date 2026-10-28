<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:8eefb103c25e6dc1ecb8e7c2cd3aa5df390a5a13f6007e036b9b1bd5d6f6f7a7 pack=professional file=PRODUCT_TEAM_HANDOVER.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:8eefb103c25e6dc1ecb8e7c2cd3aa5df390a5a13f6007e036b9b1bd5d6f6f7a7`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Product team handover — ShowNotes AI

Lock v1 · `sha256:8eefb103c25e6dc1ecb8e7c2cd3aa5df390a5a13f6007e036b9b1bd5d6f6f7a7`

## 1. Product overview and problem statement

**ShowNotes AI** — Publishing an episode's written material takes under 15 minutes instead of about two hours

Problem: Turn each finished episode into show notes, chapters and promo posts without spending two hours writing them

Stage: pilot (a pilot with a small number of real users).

## 2. Target user and job to be done

- Target user: Independent podcasters who publish weekly and edit their own shows
- Job to be done: Turn each finished episode into show notes, chapters and promo posts without spending two hours writing them
- Promised outcome: Publishing an episode's written material takes under 15 minutes instead of about two hours

## 3. Functional requirements, scope, non-scope and journeys

Main journey (functional requirements FR-n map to journey steps):

1. FR-1: Upload an episode audio file
2. FR-2: Get a draft of show notes, chapter markers and three social posts
3. FR-3: Review and edit the AI's result before it is used or shared
4. FR-4: Copy the final text into their podcast host and social accounts

Out of scope:

- Posting directly to social media accounts
- Audio editing
- Hosting or publishing the podcast

Must never:

- Use uploaded audio to train AI models
- Publish, send or act on AI output without the user's approval

## 4. Acceptance criteria and initial NFRs

- **AC-01** — Main journey step 1 works for Independent podcasters who publish weekly and edit their own shows: "Upload an episode audio file". _(check: Acting as Independent podcasters who publish weekly and edit their own shows, perform "Upload an episode audio file" end to end. It completes without help from the builder.)_
- **AC-02** — Main journey step 2 works for Independent podcasters who publish weekly and edit their own shows: "Get a draft of show notes, chapter markers and three social posts". _(check: Acting as Independent podcasters who publish weekly and edit their own shows, perform "Get a draft of show notes, chapter markers and three social posts" end to end. It completes without help from the builder.)_
- **AC-03** — Main journey step 3 works for Independent podcasters who publish weekly and edit their own shows: "Review and edit the AI's result before it is used or shared". _(check: Acting as Independent podcasters who publish weekly and edit their own shows, perform "Review and edit the AI's result before it is used or shared" end to end. It completes without help from the builder.)_
- **AC-04** — Main journey step 4 works for Independent podcasters who publish weekly and edit their own shows: "Copy the final text into their podcast host and social accounts". _(check: Acting as Independent podcasters who publish weekly and edit their own shows, perform "Copy the final text into their podcast host and social accounts" end to end. It completes without help from the builder.)_
- **AC-05** — Protection holds — the product never does this: "Use uploaded audio to train AI models". _(check: Deliberately try to break this rule. The product prevents it, and the attempt is recorded as evidence.)_
- **AC-06** — Protection holds — the product never does this: "Publish, send or act on AI output without the user's approval". _(check: Deliberately try to break this rule. The product prevents it, and the attempt is recorded as evidence.)_
- **AC-07** — Done means: Five podcasters use it on a real episode and say they would use it again _(check: Show observed evidence (not a claim) that this is true.)_
- **AC-08** — Done means: The AI cost of one episode stays under the agreed cost limit _(check: Show observed evidence (not a claim) that this is true.)_

Initial non-functional requirements (derived; see DELIVERY_READINESS.md):

- Data protection appropriate to: basic personal details (such as names, emails or accounts).
- Reliability appropriate to: a pilot with a small number of real users.
- AI outputs evaluated against a fixed evaluation set; cost per request logged.
- Integration failure: Show a clear message and let people try again later.

## 5. Architecture / context

No architecture has been chosen. Context for the architect:

- Stage: pilot.
- Uses AI: yes.
- Integrations: A speech-to-text and AI writing service — to transcribe the episode and draft the text.
- Record the stack decision as an ADR before building.

## 6. Data and integration considerations

- Data sensitivity: personal (basic personal details (such as names, emails or accounts)).
- Integration: A speech-to-text and AI writing service — to transcribe the episode and draft the text.

## 7. Risks, dependencies, assumptions and open questions

Assumptions:

- Operations and reliability: Pilot: assumed basic error logging and a way for pilot users to report problems is enough.

Open questions:

_None._

Dependencies: A speech-to-text and AI writing service — to transcribe the episode and draft the text.

## 8. Decision history and provenance

- v1 locked by Test Founder (product owner) after 14 refinement questions (deterministic-rules; AI used: no).
- Q-AI-WRONG: "Review and edit the AI's result before it is used or shared" — THEDUCK-SUGGESTED + HUMAN-APPROVED
- Q-AI-WRONG: "Publish, send or act on AI output without the user's approval" — THEDUCK-SUGGESTED + HUMAN-APPROVED

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
