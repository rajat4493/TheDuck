<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:908b4794a3ae817c09a603936fe645ecaecabd7781cbb4f97c17614dd17c990d pack=builder file=ACCEPTANCE_CRITERIA.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:908b4794a3ae817c09a603936fe645ecaecabd7781cbb4f97c17614dd17c990d`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Acceptance criteria and verification candidates

## LOCKED ACCEPTANCE CRITERIA

Explicit, testable commitments approved by the product owner at lock. Each needs observed evidence before it may be called VERIFIED. Current evidence: none — nothing is built.

### AC-01

- **Statement:** When any user or process attempts to use uploaded audio to train AI models, the system shall prevent it.
- **How to check:** Deliberately attempt it — as a user and through any background process or connected service. Expected: it is blocked, nothing is changed or shared, and the attempt is recorded as evidence.
- **Source:** must_not · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

### AC-02

- **Statement:** When any user or process attempts to publish, send or act on AI output without the user's approval, the system shall prevent it.
- **How to check:** Deliberately attempt it — as a user and through any background process or connected service. Expected: it is blocked, nothing is changed or shared, and the attempt is recorded as evidence.
- **Source:** must_not · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

### AC-03

- **Statement:** When the first version is evaluated, the product owner shall be able to observe that: Five podcasters use it on a real episode and say they would use it again.
- **How to check:** Record the observed result against this statement: what was measured, by whom, and when.
- **Source:** success · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

## DRAFT VERIFICATION CANDIDATES — not acceptance criteria

Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.

### VC-01 (draft)

- **Locked commitment:** Upload an episode audio file
- **Draft check:** When the user carries out "Upload an episode audio file", the system shall [expected observable result — not yet defined].
- **Missing before it is testable:** the expected result; what happens on error; limits (sizes, formats, timing)
- **Status:** OPEN QUESTION

### VC-02 (draft)

- **Locked commitment:** Get a draft of show notes, chapter markers and three social posts
- **Draft check:** When the user carries out "Get a draft of show notes, chapter markers and three social posts", the system shall [expected observable result — not yet defined].
- **Missing before it is testable:** the expected result; what happens on error; limits (sizes, formats, timing)
- **Status:** OPEN QUESTION

### VC-03 (draft)

- **Locked commitment:** Review and edit the AI's result before it is used or shared
- **Draft check:** When the user carries out "Review and edit the AI's result before it is used or shared", the system shall [expected observable result — not yet defined].
- **Missing before it is testable:** the expected result; what happens on error; limits (sizes, formats, timing)
- **Status:** OPEN QUESTION

### VC-04 (draft)

- **Locked commitment:** Copy the final text into their podcast host and social accounts
- **Draft check:** When the user carries out "Copy the final text into their podcast host and social accounts", the system shall [expected observable result — not yet defined].
- **Missing before it is testable:** the expected result; what happens on error; limits (sizes, formats, timing)
- **Status:** OPEN QUESTION

### VC-05 (draft)

- **Locked commitment:** The AI cost of one episode stays under the agreed cost limit
- **Draft check:** When the first version is evaluated, the product owner shall be able to observe that: The AI cost of one episode stays under the agreed cost limit. [measure not yet defined]
- **Missing before it is testable:** It depends on "agreed cost limit", which has not been decided.
- **Status:** OPEN QUESTION — waits on product-owner decision DC-UR-01
