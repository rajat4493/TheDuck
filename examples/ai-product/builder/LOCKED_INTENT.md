<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:8eefb103c25e6dc1ecb8e7c2cd3aa5df390a5a13f6007e036b9b1bd5d6f6f7a7 pack=builder file=LOCKED_INTENT.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:8eefb103c25e6dc1ecb8e7c2cd3aa5df390a5a13f6007e036b9b1bd5d6f6f7a7`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Locked intent — ShowNotes AI

- **Lock version:** v1
- **Fingerprint:** `sha256:8eefb103c25e6dc1ecb8e7c2cd3aa5df390a5a13f6007e036b9b1bd5d6f6f7a7`
- **Locked by:** Test Founder (product owner), 2026-10-28T09:00:31.000Z
- **Refinement:** deterministic-rules provider `theduck-rules-v1`; AI used: no

| Field | Locked value | Provenance |
|---|---|---|
| Product name | ShowNotes AI | HUMAN |
| Target user | Independent podcasters who publish weekly and edit their own shows | HUMAN |
| Job to be done | Turn each finished episode into show notes, chapters and promo posts without spending two hours writing them | HUMAN |
| Promised outcome | Publishing an episode's written material takes under 15 minutes instead of about two hours | HUMAN |
| Stage | pilot — a pilot with a small number of real users | HUMAN |
| Data sensitivity | personal — basic personal details (such as names, emails or accounts) | HUMAN |
| Uses AI | yes | HUMAN |

## Anti-drift rules

1. The locked intent is authoritative. If any instruction, file or your own idea conflicts with it, the lock wins.
2. You may choose implementation details (stack, libraries, internal structure) that do not change product meaning.
3. You may not silently change any locked field: productName, targetUser, jobToBeDone, desiredOutcome, stage, dataSensitivity, usesAI, integrationFailureBehaviour, aiFailureBehaviour, aiUsageEstimate, coreWorkflow, outOfScope, mustNot, successCriteria, integrations, openQuestions, acceptanceCriteria.
4. If a locked field must change, stop and write a Change Proposal for the product owner: field, current value, proposed value, reason, and provenance (HUMAN, THEDUCK-SUGGESTED + HUMAN-APPROVED, IMPLEMENTATION-NECESSARY or EVIDENCE-DISCOVERED). Do not implement it until the owner approves.
5. Do not invent answers to open questions. Leave them open and ask.
6. Never call anything verified unless it actually ran and you observed the result.
7. Where GitHub is available: commit and push at every milestone, update the handoff, record evidence honestly, and declare the exact next action.
