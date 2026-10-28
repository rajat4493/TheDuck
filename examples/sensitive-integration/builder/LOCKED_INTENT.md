<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c pack=builder file=LOCKED_INTENT.md -->
> Rendered by TheDuck from locked product intent **v1** (`sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.

# Locked intent — PhysioPath

- **Lock version:** v1
- **Fingerprint:** `sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c`
- **Locked by:** Test Founder (product owner), 2026-10-28T09:00:15.000Z
- **Refinement:** deterministic-rules provider `theduck-rules-v2`; AI used: no

| Field | Locked value | Provenance |
|---|---|---|
| Product name | PhysioPath | HUMAN |
| Target user | Patients of one partner physiotherapy clinic who have a home exercise plan | HUMAN |
| Job to be done | Know exactly which exercises to do at home and how often, and see changes their physio makes without waiting for the next appointment | HUMAN |
| Promised outcome | Patients follow their plan correctly between appointments and stop relying on paper handouts | HUMAN |
| Stage | production — a real product that people will rely on | HUMAN |
| Data sensitivity | sensitive_or_regulated — sensitive or regulated information | HUMAN |
| Uses AI | ASSUMPTION — no AI (not confirmed); do not add AI without a Change Proposal | — (not set) |

## Anti-drift rules

1. The locked intent is authoritative. If any instruction, file or your own idea conflicts with it, the lock wins.
2. You may choose implementation details (stack, libraries, internal structure) that do not change product meaning.
3. You may not silently change any locked field: productName, targetUser, jobToBeDone, desiredOutcome, stage, dataSensitivity, usesAI, integrationFailureBehaviour, aiFailureBehaviour, aiUsageEstimate, coreWorkflow, outOfScope, mustNot, successCriteria, integrations, openQuestions, acceptanceCriteria.
4. If a locked field must change, stop and write a Change Proposal for the product owner: field, current value, proposed value, reason, and provenance (HUMAN, THEDUCK-SUGGESTED + HUMAN-APPROVED, IMPLEMENTATION-NECESSARY or EVIDENCE-DISCOVERED). Do not implement it until the owner approves.
5. Do not invent answers to open questions or undecided values (limits, providers, policies). Leave them open and ask.
6. Draft verification candidates (VC-…) are NOT acceptance criteria. Before claiming any feature is complete, refine each relevant candidate with the product owner into a testable "When …, the system shall …" criterion (expected result, error behaviour, limits) and get their approval. Do not invent the expected result yourself.
7. Never call anything verified unless it actually ran and you observed the result.
8. Where GitHub is available: commit and push at every milestone, update the handoff, record evidence honestly, and declare the exact next action.
