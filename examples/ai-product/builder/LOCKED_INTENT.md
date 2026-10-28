<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:0db8680577a98167d1676dc2be0e8e48c7e0ba0ae1f911a7d565c3f13ea99743 pack=builder file=LOCKED_INTENT.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:0db8680577a98167d1676dc2be0e8e48c7e0ba0ae1f911a7d565c3f13ea99743`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Locked intent — ShowNotes AI

- **Lock version:** v1
- **Fingerprint:** `sha256:0db8680577a98167d1676dc2be0e8e48c7e0ba0ae1f911a7d565c3f13ea99743`
- **Locked by:** Test Founder (product owner), 2026-10-28T09:00:15.000Z
- **Refinement:** deterministic-rules provider `theduck-rules-v2`; AI used: no

| Field | Locked value | Provenance |
|---|---|---|
| Product name | ShowNotes AI | HUMAN |
| Target user | Independent podcasters who publish weekly and edit their own shows | HUMAN |
| Job to be done | Turn each finished episode into show notes, chapters and promo posts without spending two hours writing them | HUMAN |
| Promised outcome | Publishing an episode's written material takes under 15 minutes instead of about two hours | HUMAN |
| Stage | pilot — a pilot with a small number of real users | HUMAN |
| Data sensitivity | personal — basic personal details (such as names, emails or accounts) | HUMAN |
| Uses AI | yes — when AI is wrong: A person reviews and can edit every AI result before it is used or shared. | HUMAN |

## Anti-drift rules

1. The locked intent is authoritative. If any instruction, file or your own idea conflicts with it, the lock wins.
2. You may choose implementation details (stack, libraries, internal structure) that do not change product meaning.
3. You may not silently change any locked field: productName, targetUser, jobToBeDone, desiredOutcome, stage, dataSensitivity, usesAI, integrationFailureBehaviour, aiFailureBehaviour, aiUsageEstimate, coreWorkflow, outOfScope, mustNot, successCriteria, integrations, openQuestions, acceptanceCriteria.
4. If a locked field must change, stop and write a Change Proposal for the product owner: field, current value, proposed value, reason, and provenance (HUMAN, THEDUCK-SUGGESTED + HUMAN-APPROVED, IMPLEMENTATION-NECESSARY or EVIDENCE-DISCOVERED). Do not implement it until the owner approves.
5. Do not invent answers to open questions or undecided values (limits, providers, policies). Leave them open and ask.
6. Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.
7. Never call anything verified unless it actually ran and you observed the result.
8. Where GitHub is available: commit and push at every milestone, update the handoff, record evidence honestly, and declare the exact next action.
