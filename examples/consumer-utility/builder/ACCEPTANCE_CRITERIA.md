<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7 pack=builder file=ACCEPTANCE_CRITERIA.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Acceptance criteria and verification candidates

## LOCKED ACCEPTANCE CRITERIA

Explicit, testable commitments approved by the product owner at lock. Each needs observed evidence before it may be called VERIFIED. Current evidence: none — nothing is built.

### AC-01

- **Statement:** When any user or process attempts to send more than one reminder per day, the system shall prevent it.
- **How to check:** Deliberately attempt it — as a user and through any background process or connected service. Expected: it is blocked, nothing is changed or shared, and the attempt is recorded as evidence.
- **Source:** must_not · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

### AC-02

- **Statement:** When the first version is evaluated, the product owner shall be able to observe that: I use it for two weeks and throw away less food than before.
- **How to check:** Record the observed result against this statement: what was measured, by whom, and when.
- **Source:** success · **Provenance:** THEDUCK-SUGGESTED + HUMAN-APPROVED
- **Evidence:** none yet

## DRAFT VERIFICATION CANDIDATES — not acceptance criteria

Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.

### VC-01 (draft)

- **Locked commitment:** Add an item and its expiry date in under 10 seconds
- **Draft check:** When the user carries out "Add an item and its expiry date in under 10 seconds", the system shall [expected observable result — not yet defined].
- **Missing before it is testable:** the expected result; what happens on error; limits (sizes, formats, timing)
- **Status:** OPEN QUESTION

### VC-02 (draft)

- **Locked commitment:** See everything sorted by what expires first
- **Draft check:** When the user carries out "See everything sorted by what expires first", the system shall [expected observable result — not yet defined].
- **Missing before it is testable:** the expected result; what happens on error; limits (sizes, formats, timing)
- **Status:** OPEN QUESTION

### VC-03 (draft)

- **Locked commitment:** Get a reminder the day before an item expires
- **Draft check:** When the user carries out "Get a reminder the day before an item expires", the system shall [expected observable result — not yet defined].
- **Missing before it is testable:** the expected result; what happens on error; limits (sizes, formats, timing)
- **Status:** OPEN QUESTION

### VC-04 (draft)

- **Locked commitment:** Mark an item as used or thrown away
- **Draft check:** When the user carries out "Mark an item as used or thrown away", the system shall [expected observable result — not yet defined].
- **Missing before it is testable:** the expected result; what happens on error; limits (sizes, formats, timing)
- **Status:** OPEN QUESTION
