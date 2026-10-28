# TheDuck

TheDuck is the human-intent gate for AI software creation.

It helps a non-technical or semi-technical builder turn a rough idea into an agreed, buildable product definition, locks that intent, translates it for whichever AI coding tool they choose, preserves continuity across agents and sessions, and tells the human whether what came back still matches what they approved.

## Current status

TheDuck Product Intent v1 is locked (target user amended via CP-002).

This repository is now dogfooding TheDuck while TheDuck itself is built.

**M1.1 Lock Core is built** (TypeScript core, no UI yet): `npm ci && npm run check`.
Example packs rendered from made-up fixtures are in `examples/`. Current state and
next action: `duck/HANDOFF.md`.

Start here:

- `docs/PRODUCT_INTENT_LOCKED_V1.md` — canonical product authority
- `docs/JTBD.md` — jobs to be done
- `docs/ARTIFACT_MODEL.md` — Founder / AI Builder / Product Team outputs
- `AGENTS.md` — standing coding-agent contract
- `duck/MILESTONES.md` — current build milestones
- `duck/HANDOFF.md` — exact continuation point for the next coding agent
- `docs/CLARIFICATION_001_DELIVERY_WORKBENCH.md` — professional delivery workbench (owner clarification)
- `duck/CHANGE_PROPOSALS.md`, `duck/DECISIONS.md` — what changed, and who decided
- `docs/adr/ADR-001-m1-architecture.md` — M1 architecture

## v0 focus

The first usable vertical slice is deliberately narrow:

**rough idea → focused refinement → Product Preview → explicit LOCK → generate three consistent packs**

GitHub continuity and builder-specific adapters follow after that core is proven.

## Product principle

**Challenge before lock. Protect after lock.**

The user remains the product owner. AI may suggest, but material changes to locked intent require explicit human approval.
