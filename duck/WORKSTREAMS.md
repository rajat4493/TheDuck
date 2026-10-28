# TheDuck — delivery workstream matrix (TheDuck's own repo)

This is the matrix for **building TheDuck itself** (Clarification 001, level 1).
The per-user Delivery Profile that TheDuck *generates* lives in
`src/core/assurance/readiness.ts`.

States: REQUIRED · NOT APPLICABLE · ASSUMPTION · OPEN QUESTION · IMPLEMENTED NOT VERIFIED · VERIFIED

Last updated: 2026-10-28, end of M1.1.2 (correction).

| # | Workstream | State | What exists / evidence | Next action | Unknowns |
|---|---|---|---|---|---|
| 1 | Product and UX | REQUIRED | Locked intent, CP-002 amendment, Clarification 001. Founder-pack wording checked by curated assertions and, since M1.1.1, by regression tests for misleading output (VERIFIED, `tests/founder-language.test.ts`, `tests/m1-1-1-corrections.test.ts`). No UI exists. | M1.2 (after approval): build the six screens; manual founder-readability review. | Does a 5-question first pass feel right to real founders? (OPEN QUESTION) |
| 2 | Solution architecture | IMPLEMENTED NOT VERIFIED | ADR-001; core modules in `src/core/`. Boundaries exercised by tests, but not yet behind a UI. | M1.2: wire Next.js to the core without moving logic into routes. | — |
| 3 | Data and integrations | VERIFIED (core) | Schema-validated model; immutable locks; append-only log; tamper detection — all exercised in `tests/storage.test.ts`. No external integrations. | Keep it that way in M1. | — |
| 4 | Security and privacy | ASSUMPTION | Local-only, no network, no auth, no real personal data (fixtures are made up). Unsafe project ids rejected (VERIFIED). | M1.2: decide whether the local UI binds to localhost only (recommended). Before any hosted version: auth, encryption, data retention. | Founder ideas may contain sensitive text — storage is plain JSON on disk. |
| 5 | Quality and release engineering | VERIFIED (M1.1.1 scope) | `npm run check` = typecheck + lint + build + 118 tests, exit 0 from a clean `npm ci` (see `duck/EVIDENCE.md`). M1.1 tests checked agreement with the lock but not misleading output; M1.1.1 added regression tests for that. | M1.2: add Playwright browser runs. No CI pipeline yet (OPEN QUESTION: add GitHub Actions?). | — |
| 6 | Operations / reliability | NOT APPLICABLE | Nothing is hosted or deployed. | Revisit only if hosting is approved. | — |
| 7 | FinOps / cost model | ASSUMPTION | `duck/FINOPS.md`: zero external runtime spend in M1.1; symbolic model for a future LLM. | Re-model if an LLM provider is approved. | All future prices unverified. |
| 8 | AI system design / AIOps | NOT APPLICABLE (M1.1) | No AI is used (D-001). `RefinementProvider` interface + contract test exist (VERIFIED) so an LLM can be added behind the same boundary. | If an LLM is approved after M1.2: write the AI delivery note (below) before code. | Whether fixed questions are good enough (decided after M1.2). |

## Local storage limitation (recorded per D-006)

Local prototype storage only: plain JSON on one machine, no locking between
processes, no auth, no backups, no encryption at rest. It is not production or
multi-user persistence and must not be described as such.

## AI delivery note — required before any LLM is introduced

Not applicable in M1.1. If an LLM provider is approved, this note must cover,
before implementation: the user-visible AI jobs; provider abstraction (already the
`RefinementProvider` seam); what founder text is sent to which provider and the
privacy implications; structured output validated by the existing `Question`
schema with fallback to the rules provider; failure modes; an evaluation set
(the three fixtures plus at least two more); quality signals (question
usefulness, lock accuracy, pack consistency, founder correction rate);
observability (run id, model/version, latency, tokens, cost estimate, errors,
redaction). Fluent output is not evidence of correctness.
