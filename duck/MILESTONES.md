# TheDuck v0 Milestones

## M0 — Foundation

Goal: establish the locked product authority and self-dogfood protocol.

Exit criteria:

- locked Product Intent v1 committed;
- JTBD committed;
- three-pack artifact model committed;
- `/duck` protocol committed;
- standing coding-agent rules committed;
- first implementation milestone specified.

Status: IN PROGRESS

## M1 — Intent Gate Vertical Slice

Status: IN PROGRESS — local slice implemented; automated and browser flow evidence recorded. Download delivery and owner acceptance of clarification quality remain open. See `VERIFICATION.md`, `DECISIONS.md`, and `UAT.md`.

Goal: prove the core value before building a full SaaS.

A user can:

1. enter a rough software idea;
2. be guided through a small number of useful clarification/challenge steps;
3. see a plain-English Product Preview;
4. explicitly LOCK that product intent;
5. generate three consistent outputs from the lock:
   - Founder/Vibe Coder Pack
   - AI Builder Pack
   - Professional Product Team Pack

Non-goals for M1:

- billing/subscriptions;
- teams/RBAC;
- enterprise admin;
- broad analytics;
- full Lovable/Cursor integrations;
- autonomous code generation;
- elaborate dashboard;
- cross-project learning engine.

Evidence required before M1 complete:

- at least three materially different rough ideas exercised end-to-end;
- generated packs shown to be consistent with the same locked intent;
- at least one challenge/refinement case where the user's choice changes the resulting lock;
- at least one deliberate drift test proving downstream generation cannot silently mutate locked intent;
- founder VAT/UAT instructions generated in plain language;
- no unsupported claim that a downstream coding platform was actually invoked unless it was.

## M1.1 — Viber Experience Correction

Status: IMPLEMENTED NOT VERIFIED — conversational front door, shaped preview, fidelity review, correction paths, provenance, and M1 compatibility are implemented. Browser evidence is recorded; human review of clarity and download behavior remains required.

Evidence: `duck/VERIFICATION_M1_1.md`. Exact next action: human review of the M1.1 UAT flow; do not begin M2.

## M2 — GitHub Continuity

Goal: make the repository the continuity backbone when the user chooses GitHub.

User can connect/select a repo and TheDuck can persist the canonical project artifacts/checkpoint state.

Evidence required:

- milestone state committed to a test repo;
- a second fresh agent/session can understand current state and exact next action from repo artifacts without chat history;
- change proposal flow works without silently editing the lock.

## M3 — Builder Adapters

Goal: generate useful target-specific packs from the same canonical lock.

Initial adapters:

- Universal
- Codex
- Claude Code

Later candidates:

- Cursor
- Lovable

Adapter output is a rendering of canonical intent, never a separate product specification.

## M4 — External Validation

Goal: determine whether people choose to start real projects through TheDuck.

Initial success signal:

Real vibe coders voluntarily prefer to start their next software project in TheDuck before opening their coding tool.
