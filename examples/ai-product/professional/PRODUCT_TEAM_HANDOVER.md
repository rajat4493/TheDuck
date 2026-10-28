<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:908b4794a3ae817c09a603936fe645ecaecabd7781cbb4f97c17614dd17c990d pack=professional file=PRODUCT_TEAM_HANDOVER.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:908b4794a3ae817c09a603936fe645ecaecabd7781cbb4f97c17614dd17c990d`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Product team handover — ShowNotes AI

Lock v1 · `sha256:908b4794a3ae817c09a603936fe645ecaecabd7781cbb4f97c17614dd17c990d`

## 1. Product overview and problem statement

**ShowNotes AI** — Publishing an episode's written material takes under 15 minutes instead of about two hours

Problem: Turn each finished episode into show notes, chapters and promo posts without spending two hours writing them

Stage: pilot — a pilot with a small number of real users.

## 2. Target user and job to be done

- Target user: Independent podcasters who publish weekly and edit their own shows
- Job to be done: Turn each finished episode into show notes, chapters and promo posts without spending two hours writing them
- Promised outcome: Publishing an episode's written material takes under 15 minutes instead of about two hours

## 3. Functional requirements, scope, non-scope and journeys

Main journey (locked commitments; FR-n map to journey steps):

1. FR-1: Upload an episode audio file
2. FR-2: Get a draft of show notes, chapter markers and three social posts
3. FR-3: Review and edit the AI's result before it is used or shared
4. FR-4: Copy the final text into their podcast host and social accounts

Out of scope:

- Posting directly to social media accounts
- Audio editing
- Hosting or publishing the podcast

Must never:

- Must not use uploaded audio to train AI models.
- Must not publish, send or act on AI output without the user's approval.

## 4. Acceptance criteria and initial NFRs

### LOCKED ACCEPTANCE CRITERIA

- **AC-01** — When any user or process attempts to use uploaded audio to train AI models, the system shall prevent it.
- **AC-02** — When any user or process attempts to publish, send or act on AI output without the user's approval, the system shall prevent it.
- **AC-03** — When the first version is evaluated, the product owner shall be able to observe that: Five podcasters use it on a real episode and say they would use it again.

### DRAFT VERIFICATION CANDIDATES — not acceptance criteria

Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.

- **VC-01** (draft) — Upload an episode audio file
- **VC-02** (draft) — Get a draft of show notes, chapter markers and three social posts
- **VC-03** (draft) — Review and edit the AI's result before it is used or shared
- **VC-04** (draft) — Copy the final text into their podcast host and social accounts
- **VC-05** (draft) — The AI cost of one episode stays under the agreed cost limit

Initial non-functional requirements (derived; see DELIVERY_READINESS.md):

- Data protection appropriate to: personal — basic personal details (such as names, emails or accounts).
- Reliability appropriate to: pilot — a pilot with a small number of real users.
- AI outputs evaluated against a fixed evaluation set; cost per request logged.
- Integration failure: Show a clear message and let people try again later.

## 5. Architecture / context

No architecture has been chosen. Context for the architect:

- Stage: pilot — a pilot with a small number of real users.
- Uses AI: yes — when AI is wrong: A person reviews and can edit every AI result before it is used or shared..
- Integrations: A speech-to-text and AI writing service — to transcribe the episode and draft the text.
- Record the stack decision as an ADR before building.

## 6. Data and integration considerations

- Data sensitivity: personal — basic personal details (such as names, emails or accounts).
- Integration: A speech-to-text and AI writing service — to transcribe the episode and draft the text.

## 7. Risks, dependencies, assumptions and open questions

Open decisions for the product owner:

- Set the maximum acceptable AI cost per episode. (about: "The AI cost of one episode stays under the agreed cost limit")

Open professional questions:

- Which specific service or provider will be used for: "A speech-to-text and AI writing service — to transcribe the episode and draft the text"?
- Estimate how often one active person will use the AI feature each month.

Explicit assumptions:

- Operations and reliability: Pilot: assumed basic error logging and a way for pilot users to report problems is enough.

Dependencies: A speech-to-text and AI writing service — to transcribe the episode and draft the text.

## 8. Decision history and provenance

- v1 locked by Test Founder (product owner) after 6 refinement questions (deterministic-rules; AI used: no).
- Q-AI: "Review and edit the AI's result before it is used or shared" — THEDUCK-SUGGESTED + HUMAN-APPROVED
- Q-AI: "Must not publish, send or act on AI output without the user's approval." — THEDUCK-SUGGESTED + HUMAN-APPROVED

## 9. Verification and UAT / release-readiness status

- Evidence states in use: VERIFIED, IMPLEMENTED NOT VERIFIED, ASSUMPTION, OPEN QUESTION, FAILED.
- Recorded evidence:
  - VERIFIED: The product owner explicitly locked product intent v1.
- Locked acceptance criteria evidence: none yet (nothing built).
- Draft verification candidates awaiting refinement: VC-01, VC-02, VC-03, VC-04, VC-05.
- Not measurable until decided: VC-05 "The AI cost of one episode stays under the agreed cost limit".
- Release readiness: **not ready** — nothing is built. See DELIVERY_READINESS.md.
- Founder UAT checklist: Founder Pack, VAT_UAT.md.

## 10. Current product state and handover

- Locked intent v1; nothing built; no coding tool invoked by TheDuck.
- Pending Change Proposals: none.
- Next action: with the product owner, resolve the open decisions and refine the draft verification candidates for the main journey; then propose the smallest technical design for B1 before writing code.
