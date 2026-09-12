# Handoff

## Current state

TheDuck Product Intent v1 is locked and committed. The repo now contains the primary JTBD, three-pack artifact model, milestone plan, self-dogfood protocol and standing coding-agent contract.

## What is NOT built yet

No SaaS application exists yet.

No intent-gate UI exists yet.

No builder adapter has been implemented yet.

No GitHub connection flow has been implemented yet.

No downstream coding platform has been invoked by TheDuck.

## Exact next milestone

Build **M1 — Intent Gate Vertical Slice** only.

The product must let a user:

1. submit a rough software idea;
2. answer a small number of focused clarification/challenge questions;
3. review a plain-English Product Preview;
4. explicitly lock the product intent;
5. generate three consistent outputs from that lock: Founder/Vibe Coder Pack, AI Builder Pack, Professional Product Team Pack.

## Constraints

- do not build billing;
- do not build teams/RBAC;
- do not build a generic project-management dashboard;
- do not add Cursor/Lovable integration yet;
- do not let generated packs become separate sources of truth;
- preserve a clear boundary between pre-lock suggestions and post-lock protection;
- every material suggestion accepted by the user must retain provenance.

## Evidence expected

See `duck/MILESTONES.md` M1 exit criteria.

## Next action

A coding agent should propose the smallest technical design for M1 and implementation plan, then build it against the locked intent without expanding scope.
