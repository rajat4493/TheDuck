<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:0db8680577a98167d1676dc2be0e8e48c7e0ba0ae1f911a7d565c3f13ea99743 pack=builder file=CONSTRAINTS.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:0db8680577a98167d1676dc2be0e8e48c7e0ba0ae1f911a7d565c3f13ea99743`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Constraints

- Stage: pilot — a pilot with a small number of real users.
- Data: personal — basic personal details (such as names, emails or accounts).
- Uses AI: yes — when AI is wrong: A person reviews and can edit every AI result before it is used or shared..
- Keep the AI provider behind one interface; log run ID, model/version, latency, tokens and errors without personal information.
- Integration: A speech-to-text and AI writing service — to transcribe the episode and draft the text
- Must not use uploaded audio to train AI models.
- Must not publish, send or act on AI output without the user's approval.

## Open questions and undecided values — do not invent answers

- Product owner decision: Set the maximum acceptable AI cost per episode.
- Professional question: Which specific service or provider will be used for: "A speech-to-text and AI writing service — to transcribe the episode and draft the text"?
- Professional question: Check the chosen provider's data-use terms and settings for this rule: "Must not use uploaded audio to train AI models."
- Professional question: Estimate how often one active person will use the AI feature each month.

## Explicit assumptions

- Operations and reliability: Pilot: assumed basic error logging and a way for pilot users to report problems is enough.
