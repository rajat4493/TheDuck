<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:908b4794a3ae817c09a603936fe645ecaecabd7781cbb4f97c17614dd17c990d pack=builder file=VERIFICATION_EXPECTATIONS.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:908b4794a3ae817c09a603936fe645ecaecabd7781cbb4f97c17614dd17c990d`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Verification expectations

Use only these evidence states:

- VERIFIED
- IMPLEMENTED NOT VERIFIED
- ASSUMPTION
- OPEN QUESTION
- FAILED

- VERIFIED means it actually ran and the result was observed and recorded (command or steps, and the result).
- IMPLEMENTED NOT VERIFIED means code exists but was not exercised.
- Never write "works", "tested", "passes", "validated" or "production ready" without observed evidence for that exact claim.
- Record evidence per locked acceptance criterion (AC-01, AC-02, AC-03).
- Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.
- Fluent AI output is not evidence of correctness.
