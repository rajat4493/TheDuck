<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9 pack=builder file=LOCKED_INTENT.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Locked intent — PhysioPath

- **Lock version:** v1
- **Fingerprint:** `sha256:01541571b98bcb10be251c36a45992b29e9dac61172b09a0730a01300978ffa9`
- **Locked by:** Test Founder (product owner), 2026-10-28T09:00:26.000Z
- **Refinement:** deterministic-rules provider `theduck-rules-v1`; AI used: no

| Field | Locked value | Provenance |
|---|---|---|
| Product name | PhysioPath | HUMAN |
| Target user | Patients of one partner physiotherapy clinic who have a home exercise plan | HUMAN |
| Job to be done | Know exactly which exercises to do at home and how often, and see changes their physio makes without waiting for the next appointment | HUMAN |
| Promised outcome | Patients follow their plan correctly between appointments and stop relying on paper handouts | HUMAN |
| Stage | production — a real product that people will rely on | HUMAN |
| Data sensitivity | sensitive_or_regulated — sensitive or regulated information | HUMAN |
| Uses AI | no | HUMAN |

## Anti-drift rules

1. The locked intent is authoritative. If any instruction, file or your own idea conflicts with it, the lock wins.
2. You may choose implementation details (stack, libraries, internal structure) that do not change product meaning.
3. You may not silently change any locked field: productName, targetUser, jobToBeDone, desiredOutcome, stage, dataSensitivity, usesAI, integrationFailureBehaviour, aiFailureBehaviour, aiUsageEstimate, coreWorkflow, outOfScope, mustNot, successCriteria, integrations, openQuestions, acceptanceCriteria.
4. If a locked field must change, stop and write a Change Proposal for the product owner: field, current value, proposed value, reason, and provenance (HUMAN, THEDUCK-SUGGESTED + HUMAN-APPROVED, IMPLEMENTATION-NECESSARY or EVIDENCE-DISCOVERED). Do not implement it until the owner approves.
5. Do not invent answers to open questions. Leave them open and ask.
6. Never call anything verified unless it actually ran and you observed the result.
7. Where GitHub is available: commit and push at every milestone, update the handoff, record evidence honestly, and declare the exact next action.
