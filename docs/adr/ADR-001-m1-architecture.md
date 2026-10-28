# ADR-001 — M1 architecture: modular monolith, canonical model first

- Status: **Accepted** (stack approved by the product owner 2026-10-28; see `duck/DECISIONS.md` D-005, D-006)
- Scope: M1 (M1.1 implemented; M1.2/M1.3 planned)

## Context

M1 must prove one thing: a rough idea can become an explicitly locked product
intent, and three consistent packs can be generated from that lock without any
downstream step silently changing it. The founder UI comes in M1.2. Nothing in M1
may call a coding platform, use paid services, or require accounts.

## Decision

1. **One TypeScript codebase, modular monolith.** Next.js (App Router) for the
   M1.2 UI and API routes; a framework-free core in `src/core/` that the UI calls.
   M1.1 builds only the core.
2. **Zod schemas are the canonical product model** (`src/core/model/schema.ts`).
   Every write is schema-validated. Types are inferred from the schemas.
3. **Module boundaries** (plain folders, no packages):
   - `model/` — Canonical Product Model, labels, fingerprinting, errors.
   - `intent-gate/` — provider contract, rules provider, refinement, preview edits,
     explicit lock, Change Proposals.
   - `assurance/` — decision cards, Delivery Profile + Readiness Matrix, cost hypothesis, AI note.
   - `renderer/` — pure, deterministic Founder / Builder / Professional renderers;
     pack inspection; consistency check.
   - `adapters/` — `BuilderAdapter` boundary; Universal only.
   - `storage/` — local prototype file store.
4. **Locks are immutable, fingerprinted snapshots.** `sha256` over canonical
   (key-sorted) JSON of every lock field except the fingerprint. A change after
   lock is only possible through a Change Proposal approved by the human product
   owner, which creates lock v(n+1); earlier versions are never edited.
5. **Renderers and adapters receive frozen deep copies.** Mutation throws.
   `runAdapter` re-checks lock fingerprints afterwards and requires every adapter
   file to carry the lock header and the canonical labelled lines verbatim.
6. **Refinement is behind `RefinementProvider`.** The provider proposes questions
   as data; the gate validates and applies them and records provenance. M1.1 ships
   only the deterministic rules provider (no AI), per D-001.
7. **Local prototype storage only** (D-006): `project.json` atomic replace
   (temp + fsync + rename), `events.jsonl` append-only with prefix check,
   `locks/vN.json` create-once via hard link (refuses overwrite), fingerprint
   re-verified on load.

## Alternatives considered

| Option | Why not (for M1) |
|---|---|
| SQLite | Adds a native dependency; JSON files are more portable and diff-able in git (useful for M2 GitHub continuity). |
| Python (FastAPI) + separate frontend | Two languages and two runtimes for a one-person vertical slice. |
| SPA + separate API service | More moving parts than M1 needs. |
| CLI only | Fails the founder-first UX requirement. |
| Event-sourced model (state rebuilt from events) | Stronger audit, but more code than M1 needs. We keep an append-only log *and* a current-state file. |
| Microservices | No benefit at this scale. |

## Consequences and limitations

- **Storage is not production or multi-user.** No cross-process locking, no auth,
  no backups, no encryption at rest. Concurrent writers can corrupt state. The
  event-log append is fsynced but not transactional with `project.json`. Recorded
  in `duck/WORKSTREAMS.md`.
- **Consistency checking is anchor-based**, not semantic. It proves locked values
  appear verbatim (line-level for adapters) and fingerprints match; it cannot
  prove a human reading the pack understands the same thing.
- **The rules provider does not understand ideas.** Keyword hints only pre-select
  suggestions; the founder always chooses.
- **Toolchain notes (IMPLEMENTATION-NECESSARY):** Vitest 5.0.4 (earlier lines had
  open advisories); `vite` is an explicit dev dependency; `.npmrc` sets
  `legacy-peer-deps=true` because npm 10.9 crashes resolving Vitest 5's optional
  browser peers.
- Next.js and Playwright are approved but not installed until M1.2.
