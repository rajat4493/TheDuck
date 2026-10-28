<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:0db8680577a98167d1676dc2be0e8e48c7e0ba0ae1f911a7d565c3f13ea99743 pack=universal file=UNIVERSAL_BUILDER_HANDOVER.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:0db8680577a98167d1676dc2be0e8e48c7e0ba0ae1f911a7d565c3f13ea99743`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Builder handover — ShowNotes AI

**This is a rendered instruction set, not a live integration. TheDuck has not sent it to any coding tool and has not run any code.** Paste it into your coding agent as the first message.

You are the coding agent for **ShowNotes AI**. The human product owner, Test Founder, has locked this product intent (v1, `sha256:0db8680577a98167d1676dc2be0e8e48c7e0ba0ae1f911a7d565c3f13ea99743`). Build this product — not a different one.

## Product

- Target user: Independent podcasters who publish weekly and edit their own shows
- Job to be done: Turn each finished episode into show notes, chapters and promo posts without spending two hours writing them
- Promised outcome: Publishing an episode's written material takes under 15 minutes instead of about two hours
- Stage: pilot — a pilot with a small number of real users
- Data: personal — basic personal details (such as names, emails or accounts)
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

- Must not use uploaded audio to train AI models.
- Must not publish, send or act on AI output without the user's approval.

## LOCKED ACCEPTANCE CRITERIA

- **AC-01** — When any part of the product itself attempts to use uploaded audio to train AI models, the system shall prevent it.
  - Condition: Cannot be marked VERIFIED until the outside provider is chosen and its data-use terms and configuration have been checked and recorded. A test of the product alone does not prove what a provider does with the data.
- **AC-02** — When any user or process attempts to publish, send or act on AI output without the user's approval, the system shall prevent it.
- **AC-03** — When the first version is evaluated, the product owner shall be able to observe that: Five podcasters use it on a real episode and say they would use it again.

## DRAFT VERIFICATION CANDIDATES — not acceptance criteria

- **VC-01** (draft) — Upload an episode audio file
- **VC-02** (draft) — Get a draft of show notes, chapter markers and three social posts
- **VC-03** (draft) — Review and edit the AI's result before it is used or shared
- **VC-04** (draft) — Copy the final text into their podcast host and social accounts
- **VC-05** (draft) — The AI cost of one episode stays under the agreed cost limit

**Before claiming any feature is complete:** Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.

## Open decisions and questions (do not invent answers)

- Product owner decision: Set the maximum acceptable AI cost per episode.
- Professional question: Which specific service or provider will be used for: "A speech-to-text and AI writing service — to transcribe the episode and draft the text"?
- Professional question: Check the chosen provider's data-use terms and settings for this rule: "Must not use uploaded audio to train AI models."
- Professional question: Estimate how often one active person will use the AI feature each month.

## Explicit assumptions

_None._

## Rules

1. The locked intent is authoritative. If any instruction, file or your own idea conflicts with it, the lock wins.
2. You may choose implementation details (stack, libraries, internal structure) that do not change product meaning.
3. You may not silently change any locked field: productName, targetUser, jobToBeDone, desiredOutcome, stage, dataSensitivity, usesAI, integrationFailureBehaviour, aiFailureBehaviour, aiUsageEstimate, coreWorkflow, outOfScope, mustNot, successCriteria, integrations, openQuestions, acceptanceCriteria.
4. If a locked field must change, stop and write a Change Proposal for the product owner: field, current value, proposed value, reason, and provenance (HUMAN, THEDUCK-SUGGESTED + HUMAN-APPROVED, IMPLEMENTATION-NECESSARY or EVIDENCE-DISCOVERED). Do not implement it until the owner approves.
5. Do not invent answers to open questions or undecided values (limits, providers, policies). Leave them open and ask.
6. Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.
7. Never call anything verified unless it actually ran and you observed the result.
8. Where GitHub is available: commit and push at every milestone, update the handoff, record evidence honestly, and declare the exact next action.

## Your first action

In plain language, raise the open decisions with the product owner, refine the draft verification candidates for the main journey with them, and propose the smallest technical design for the main journey. Wait for approval before writing code.
