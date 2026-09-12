# TheDuck

TheDuck is the human-intent gate for AI software creation.

It helps a non-technical or semi-technical builder turn a rough idea into an agreed, buildable product definition, locks that intent, translates it for whichever AI coding tool they choose, preserves continuity across agents and sessions, and tells the human whether what came back still matches what they approved.

## Current status

TheDuck Product Intent v1 is locked.

This repository is now dogfooding TheDuck while TheDuck itself is built.

Start here:

- `docs/PRODUCT_INTENT_LOCKED_V1.md` — canonical product authority
- `docs/JTBD.md` — jobs to be done
- `docs/ARTIFACT_MODEL.md` — Founder / AI Builder / Product Team outputs
- `AGENTS.md` — standing coding-agent contract
- `duck/MILESTONES.md` — current build milestones
- `duck/HANDOFF.md` — exact continuation point for the next coding agent

## v0 focus

The first usable vertical slice is deliberately narrow:

**rough idea → focused refinement → Product Preview → explicit LOCK → generate three consistent packs**

GitHub continuity and builder-specific adapters follow after that core is proven.

## Product principle

**Challenge before lock. Protect after lock.**

The user remains the product owner. AI may suggest, but material changes to locked intent require explicit human approval.

## Run the M1 local slice

Requires Node.js 22 or newer. No packages, API keys, or accounts are needed.

```sh
npm start
```

Open http://127.0.0.1:3000. If that port is occupied:

```sh
PORT=4317 npm start
```

Enter an idea, answer four short question groups, edit the preview, choose any suggestions, then explicitly approve the final preview. The three packs and canonical JSON are available on the lock screen. Each Markdown file can be viewed or downloaded; the complete JSON export also has a selectable-text fallback.

This is a **rule-based local slice**, not model-backed understanding. Questions have limited keyword adaptation; the owner supplies the substantive product definition. No product text is sent to a service. Browser storage keeps the most recent lock and a draft; it is not a project archive or backup. Save exports before starting another project. A new lock replaces the latest saved lock. There is no import or full Change Proposal UI yet.

```sh
npm test
npm run check
node scripts/exercise.mjs
```

The exercise command regenerates synthetic examples in `duck/examples/`, including their canonical locks and all named pack files. It does not represent actual owner approvals or downstream builds. Fingerprints detect accidental drift, not malicious rewriting of a file and its fingerprint together.

See `duck/VERIFICATION.md` for observed evidence and `duck/HANDOFF.md` for remaining M1 work. M2 requires human review first.
