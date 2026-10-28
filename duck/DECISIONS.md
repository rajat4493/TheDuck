# Decision log

Material decisions about building TheDuck. Each carries exactly one provenance
label. Product-intent changes live in `duck/CHANGE_PROPOSALS.md`.

| ID | Date | Decision | Provenance |
|---|---|---|---|
| D-001 | 2026-10-28 | M1.1 uses a deterministic **rules** refinement provider. A `RefinementProvider` interface and a contract test exist, but no live LLM, API key or paid runtime dependency. Whether to add an optional LLM is decided after the M1.2 founder UI exists. The product must say plainly that the questions are fixed rules, not AI. | HUMAN |
| D-002 | 2026-10-28 | Keep the locked definition wording (CP-001 rejected). | HUMAN |
| D-003 | 2026-10-28 | Target user amended per CP-002. | THEDUCK-SUGGESTED + HUMAN-APPROVED |
| D-004 | 2026-10-28 | The delivery workbench applies to TheDuck's own repo **and** to each generated Professional Pack as a Delivery Profile + Readiness Matrix (`docs/CLARIFICATION_001_DELIVERY_WORKBENCH.md`). | HUMAN |
| D-005 | 2026-10-28 | Stack: Next.js + TypeScript + Zod + Vitest + Playwright, as a modular monolith. M1.1 builds only the framework-free TypeScript core; Next.js and Playwright arrive with the UI in M1.2. See `docs/adr/ADR-001-m1-architecture.md`. | HUMAN (stack approved) / IMPLEMENTATION-NECESSARY (core-first sequencing) |
| D-006 | 2026-10-28 | Local-only prototype storage: schema-validated atomic JSON writes, an append-only event log, immutable lock snapshots per version (`locks/v1.json`, …). Packs are always renderings of a lock snapshot and never authoritative. Not production or multi-user storage. | HUMAN |
| D-007 | 2026-10-28 | No pack re-import feature. Drift is tested via: rendering does not mutate the lock; adapters cannot alter locked fields; a locked-field change without an approved Change Proposal is rejected; a pack whose fingerprint does not match its lock is visibly invalid when inspected. | HUMAN |
| D-008 | 2026-10-28 | Founder-language quality: curated assertions for required plain-English content (plus a small jargon guard) in M1.1; a documented manual founder-readability review in M1.2. | HUMAN |
