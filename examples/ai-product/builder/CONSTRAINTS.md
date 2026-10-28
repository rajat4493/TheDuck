<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:8eefb103c25e6dc1ecb8e7c2cd3aa5df390a5a13f6007e036b9b1bd5d6f6f7a7 pack=builder file=CONSTRAINTS.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:8eefb103c25e6dc1ecb8e7c2cd3aa5df390a5a13f6007e036b9b1bd5d6f6f7a7`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Constraints

- Stage: pilot — a pilot with a small number of real users.
- Data: basic personal details (such as names, emails or accounts).
- Uses AI: keep the AI provider behind one interface; log run ID, model/version, latency, tokens and errors without personal information.
- Integration: A speech-to-text and AI writing service — to transcribe the episode and draft the text
- Must never: Use uploaded audio to train AI models
- Must never: Publish, send or act on AI output without the user's approval

## Open questions — do not invent answers

_None._

## Assumptions

- Operations and reliability: Pilot: assumed basic error logging and a way for pilot users to report problems is enough.
