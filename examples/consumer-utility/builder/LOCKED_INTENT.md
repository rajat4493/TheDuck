<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c18ef76142175bb618e17b826e291cc1dcc51533ae1c012a57db31b9565ceddb pack=builder file=LOCKED_INTENT.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:c18ef76142175bb618e17b826e291cc1dcc51533ae1c012a57db31b9565ceddb`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Locked intent — FreshNudge

- **Lock version:** v1
- **Fingerprint:** `sha256:c18ef76142175bb618e17b826e291cc1dcc51533ae1c012a57db31b9565ceddb`
- **Locked by:** Test Founder (product owner), 2026-10-28T09:00:28.000Z
- **Refinement:** deterministic-rules provider `theduck-rules-v1`; AI used: no

| Field | Locked value | Provenance |
|---|---|---|
| Product name | FreshNudge | HUMAN |
| Target user | Busy home cooks who do one big weekly shop | HUMAN |
| Job to be done | Keep track of what is in the fridge and use food before it expires, without writing lists | HUMAN |
| Promised outcome | They throw away less food because they get a nudge the day before something expires | HUMAN |
| Stage | demo — a demo to show people (not for real use yet) | HUMAN |
| Data sensitivity | none — no personal information | HUMAN |
| Uses AI | no | HUMAN |

## Anti-drift rules

1. The locked intent is authoritative. If any instruction, file or your own idea conflicts with it, the lock wins.
2. You may choose implementation details (stack, libraries, internal structure) that do not change product meaning.
3. You may not silently change any locked field: productName, targetUser, jobToBeDone, desiredOutcome, stage, dataSensitivity, usesAI, integrationFailureBehaviour, aiFailureBehaviour, aiUsageEstimate, coreWorkflow, outOfScope, mustNot, successCriteria, integrations, openQuestions, acceptanceCriteria.
4. If a locked field must change, stop and write a Change Proposal for the product owner: field, current value, proposed value, reason, and provenance (HUMAN, THEDUCK-SUGGESTED + HUMAN-APPROVED, IMPLEMENTATION-NECESSARY or EVIDENCE-DISCOVERED). Do not implement it until the owner approves.
5. Do not invent answers to open questions. Leave them open and ask.
6. Never call anything verified unless it actually ran and you observed the result.
7. Where GitHub is available: commit and push at every milestone, update the handoff, record evidence honestly, and declare the exact next action.
