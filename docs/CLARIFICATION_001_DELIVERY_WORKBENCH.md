# Clarification 001 — Professional delivery workbench

Status: **HUMAN — issued by the product owner, 2026-10-28.**
Type: clarification of the locked intent, not an amendment. It explains how the
locked outputs (in particular the Professional Product Team Pack, which the lock
already says must cover NFRs, architecture/context, risks and
release/readiness status) must be produced. It does not broaden M1's end-user
scope.

## The clarification (owner's words)

> TheDuck must let the founder stay in plain language while coding agents create
> and maintain professional delivery artefacts appropriate to the project:
> product, architecture, security/privacy, quality, operations, FinOps, and—when
> the product uses AI—AI system design and AIOps/LLMOps. These professional
> artefacts support the founder; they must not turn TheDuck into an enterprise
> governance product or make the founder read technical jargon.

## It applies at two levels

1. **TheDuck's own repository.** Coding agents building TheDuck use the full,
   appropriate delivery discipline: architecture, security/privacy, quality,
   operations, FinOps, and AI/AIOps if and when AI is introduced. This lives in
   `/duck` (see `duck/WORKSTREAMS.md`, `duck/FINOPS.md`, `docs/adr/`).
2. **Every user's generated Professional Product Team Pack.** TheDuck generates a
   project-specific **Delivery Profile and Readiness Matrix** that marks each
   professional workstream as `REQUIRED`, `NOT APPLICABLE`, `ASSUMPTION`,
   `OPEN QUESTION`, `IMPLEMENTED NOT VERIFIED` or `VERIFIED`.

## Workstreams in the generated readiness view (M1)

- product / UX
- architecture / context
- data and integrations
- security / privacy
- quality / release
- operations / reliability
- FinOps / cost hypothesis
- AI system / AIOps — only when the project profile is AI-heavy; otherwise shown
  as `NOT APPLICABLE` with the reason (inapplicable does not mean omitted)

For each: current status, why it matters, the next professional action, and what
remains unknown. The Founder Pack translates the material consequence into plain
English.

## Limits for M1

- No fake 50-page enterprise architecture, security or FinOps documents.
- No claim that a real architect, security reviewer or FinOps professional has
  reviewed anything.
- The readiness view is an honest starting point for professionals, not a
  certification.
