<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:8eefb103c25e6dc1ecb8e7c2cd3aa5df390a5a13f6007e036b9b1bd5d6f6f7a7 pack=universal file=UNIVERSAL_BUILDER_HANDOVER.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:8eefb103c25e6dc1ecb8e7c2cd3aa5df390a5a13f6007e036b9b1bd5d6f6f7a7`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Builder handover — ShowNotes AI

**This is a rendered instruction set, not a live integration. TheDuck has not sent it to any coding tool and has not run any code.** Paste it into your coding agent as the first message.

You are the coding agent for **ShowNotes AI**. The human product owner, Test Founder, has locked this product intent (v1, `sha256:8eefb103c25e6dc1ecb8e7c2cd3aa5df390a5a13f6007e036b9b1bd5d6f6f7a7`). Build this product — not a different one.

## Product

- Target user: Independent podcasters who publish weekly and edit their own shows
- Job to be done: Turn each finished episode into show notes, chapters and promo posts without spending two hours writing them
- Promised outcome: Publishing an episode's written material takes under 15 minutes instead of about two hours
- Stage: a pilot with a small number of real users
- Data: basic personal details (such as names, emails or accounts)
- Uses AI: yes — when AI is wrong: A person reviews and can edit every AI result before it is used or shared.
- Integrations: A speech-to-text and AI writing service — to transcribe the episode and draft the text — when unavailable: Show a clear message and let people try again later.

## Main journey

1. Upload an episode audio file
2. Get a draft of show notes, chapter markers and three social posts
3. Review and edit the AI's result before it is used or shared
4. Copy the final text into their podcast host and social accounts

## Out of scope

- Posting directly to social media accounts
- Audio editing
- Hosting or publishing the podcast

## Must never

- Use uploaded audio to train AI models
- Publish, send or act on AI output without the user's approval

## Acceptance criteria

- **AC-01** — Main journey step 1 works for Independent podcasters who publish weekly and edit their own shows: "Upload an episode audio file".
- **AC-02** — Main journey step 2 works for Independent podcasters who publish weekly and edit their own shows: "Get a draft of show notes, chapter markers and three social posts".
- **AC-03** — Main journey step 3 works for Independent podcasters who publish weekly and edit their own shows: "Review and edit the AI's result before it is used or shared".
- **AC-04** — Main journey step 4 works for Independent podcasters who publish weekly and edit their own shows: "Copy the final text into their podcast host and social accounts".
- **AC-05** — Protection holds — the product never does this: "Use uploaded audio to train AI models".
- **AC-06** — Protection holds — the product never does this: "Publish, send or act on AI output without the user's approval".
- **AC-07** — Done means: Five podcasters use it on a real episode and say they would use it again
- **AC-08** — Done means: The AI cost of one episode stays under the agreed cost limit

## Open questions (do not invent answers)

_None._

## Rules

1. The locked intent is authoritative. If any instruction, file or your own idea conflicts with it, the lock wins.
2. You may choose implementation details (stack, libraries, internal structure) that do not change product meaning.
3. You may not silently change any locked field: productName, targetUser, jobToBeDone, desiredOutcome, stage, dataSensitivity, usesAI, integrationFailureBehaviour, aiFailureBehaviour, aiUsageEstimate, coreWorkflow, outOfScope, mustNot, successCriteria, integrations, openQuestions, acceptanceCriteria.
4. If a locked field must change, stop and write a Change Proposal for the product owner: field, current value, proposed value, reason, and provenance (HUMAN, THEDUCK-SUGGESTED + HUMAN-APPROVED, IMPLEMENTATION-NECESSARY or EVIDENCE-DISCOVERED). Do not implement it until the owner approves.
5. Do not invent answers to open questions. Leave them open and ask.
6. Never call anything verified unless it actually ran and you observed the result.
7. Where GitHub is available: commit and push at every milestone, update the handoff, record evidence honestly, and declare the exact next action.

## Your first action

Propose the smallest technical design for the main journey to the product owner, in plain language, and wait for approval before writing code.
