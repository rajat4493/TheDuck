# Handoff

Last updated: 2026-10-28, end of **M1.1.1 — Truth and Founder-Experience Correction**.

## Current state

- M0 complete. M1.1 complete. Owner review of M1.1 found four misleading-output defects; **M1.1.1 corrects them and is awaiting product-owner review.** M1.2 has not started and needs approval.
- Locked intent: `docs/PRODUCT_INTENT_LOCKED_V1.md` (target user amended via approved CP-002; CP-001 rejected).
- Owner clarification: `docs/CLARIFICATION_001_DELIVERY_WORKBENCH.md` — delivery discipline applies to this repo **and** to every generated Professional Pack (Delivery Profile + Readiness Matrix).
- Decisions: `duck/DECISIONS.md` (D-001…D-012). Architecture: `docs/adr/ADR-001-m1-architecture.md`.
- Evidence: `duck/EVIDENCE.md` (M1.1 and M1.1.1 sections). Receipts: `duck/receipts/2026-10-28-M1.1-lock-core.md`, `duck/receipts/2026-10-28-M1.1.1-truth-correction.md` (correction record).

## What exists

- `src/core/` — framework-free TypeScript core (no UI):
  - `model/` canonical Zod schemas, labels, fingerprint (`sha256` over canonical JSON), errors.
  - `intent-gate/` `RefinementProvider` contract (tiers; ≤5 core + ≤3 follow-ups enforced by the gate; every question has "not sure yet"), deterministic `rulesProvider` v2 (no AI), `createProject` → `nextQuestion` / `answerQuestion` → `editDraft` (preview; closes "not sure" items once filled) → `lockReadiness` → `lockIntent` (exact confirmation text required) → `proposeChange` / `decideChangeProposal` (only the human owner can approve; creates lock v(n+1)).
  - `assurance/` `open-items.ts` (unresolved references → founder decision cards / professional questions; explicit assumptions), `verification.ts` (LOCKED ACCEPTANCE CRITERIA vs DRAFT VERIFICATION CANDIDATES), Delivery Profile + Readiness Matrix (8 workstreams, open actions); symbolic cost hypothesis; AI note for AI projects.
  - `renderer/` Founder (6 files), Builder (9 files + `LOCK.json`), Professional (2 files); `inspectPack`; `checkPackConsistency`.
  - `adapters/` `BuilderAdapter` + `runAdapter` guard; Universal only.
  - `storage/` `FileProjectStore` — local prototype storage only.
- `fixtures/` three made-up founder sessions (6 questions each, rest via preview); `tests/` 108 tests; `examples/` rendered packs (`npm run render:examples`).

## What is NOT built

- No UI (Next.js and Playwright not installed yet). No ZIP download.
- No LLM, API key or paid dependency. No external adapters, GitHub connection, auth or deployment.
- No downstream coding platform has been invoked by TheDuck.

## How to verify

```
npm ci
npm run check            # typecheck + lint + build + tests
npm run render:examples  # regenerate examples/
```

## Constraints (unchanged)

- Do not build billing, teams/RBAC, dashboards, Cursor/Lovable/Codex/Claude Code integrations, GitHub sync, or pack re-import.
- Generated packs are renderings of a lock snapshot, never sources of truth.
- Keep the core framework-free; the UI calls it, it does not reimplement it.
- Never describe the rules provider as AI.

## Blockers

None.

## Open questions (for the product owner)

1. Does a first pass of 5 core questions (6 in each sample, 8 worst case) feel right to real founders? (needs the M1.2 UI)
2. After M1.2: add an optional LLM provider, or keep fixed questions? (D-001)
3. Add a CI workflow (GitHub Actions) running `npm run check`? Not requested yet.
4. Should the M1.2 local UI bind to localhost only? (recommended)

## Assumptions

- The unresolved-reference patterns (e.g. "agreed cost limit", "TBD", "appropriate retention", "a … service") catch common phrasings. They are rules, not understanding.
- TheDuck's generic must-not acceptance wording ("When any user or process attempts to …, the system shall prevent it") is a usable starting point for professionals.
- Free-text founder answers are kept verbatim in every pack (needed for consistency checks); must-not items are re-worded only by adding "Must not".

## Exact next action

**Stop: product-owner review of M1.1.1 is required before M1.2.** Start the review with `examples/ai-product/founder/WHAT_YOU_ARE_BUILDING.md` and `examples/ai-product/builder/ACCEPTANCE_CRITERIA.md`.

Do not begin Next.js, UI work, Playwright, live AI or any new capability until the owner approves. After approval, the next agent should: install Next.js + Playwright (pinned, ≥2 weeks old), build the six M1.2 screens (Start, Refine, Product Preview, Lock confirmation, Project Room, Packs) on top of `src/core/index.ts` without moving logic into routes, add Playwright runs for the three fixtures, run a documented manual founder-readability review, then update this file, `duck/EVIDENCE.md` and a new receipt.
