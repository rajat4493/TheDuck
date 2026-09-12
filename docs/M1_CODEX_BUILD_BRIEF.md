# M1 Codex Build Brief — Intent Gate Vertical Slice

## Authority

Read these first, in order:

1. `docs/PRODUCT_INTENT_LOCKED_V1.md`
2. `docs/JTBD.md`
3. `docs/ARTIFACT_MODEL.md`
4. `AGENTS.md`
5. `duck/MILESTONES.md`
6. `duck/HANDOFF.md`

The locked Product Intent v1 is authoritative. Do not reinterpret or broaden it.

## Milestone goal

Build only **M1 — Intent Gate Vertical Slice**.

A user with a rough software idea must be able to:

1. submit the idea in plain language;
2. answer a small number of focused clarification/challenge questions;
3. see a plain-English Product Preview that explains what TheDuck believes they want;
4. explicitly approve and LOCK the product intent;
5. generate three consistent outputs from that exact lock:
   - Founder / Vibe Coder Pack
   - AI Builder Pack
   - Professional Product Team Pack

The purpose of M1 is to prove TheDuck's core value before building the wider SaaS.

## Product behavior requirements

### 1. Rough idea capture

The first interaction should feel low-friction. Do not force the user to complete a long form or think like a PM.

Accept a short, messy software idea in ordinary language.

### 2. Understand + challenge

TheDuck should infer the likely product shape, then ask only the smallest useful set of questions needed to resolve material ambiguity.

Questions should focus on things that materially affect:

- who the user is;
- what job they are trying to accomplish;
- core workflow;
- success criteria;
- significant product trade-offs;
- hidden assumptions;
- obvious scope explosion.

Do not turn this into a generic startup questionnaire.

When TheDuck proposes an improvement, simplification, or alternative, make clear that it is a suggestion rather than something the user originally asked for.

### 3. Provenance

Every material product decision must carry one of these origins:

- `HUMAN`
- `THEDUCK-SUGGESTED + HUMAN-APPROVED`
- `IMPLEMENTATION-NECESSARY`
- `EVIDENCE-DISCOVERED`

For the pre-build M1 flow, the first two will be the dominant states.

### 4. Product Preview

Before lock, show the user a plain-English preview containing at minimum:

- one-sentence product definition;
- target user;
- primary JTBD;
- core user journey;
- scope for this build;
- explicit non-goals where important;
- important assumptions/unknowns;
- material TheDuck suggestions the user accepted;
- what “done” means.

The preview should be understandable by a non-technical founder.

### 5. Explicit lock

The lock must be a deliberate user action.

Once locked:

- the canonical product contract becomes immutable for ordinary downstream generation;
- output packs must be generated from that lock, not from independently reconstructed prompts;
- downstream generation must not silently add or change product intent;
- changing locked product behavior requires a future Change Proposal flow, which may be represented minimally in M1 if needed, but full change-management UI is not required.

### 6. Three packs

Generate all three packs from the same canonical lock.

#### Founder / Vibe Coder Pack

Explain in simple language:

- what the product is;
- who it is for;
- why it matters;
- what is in scope;
- what the user should test themselves;
- important technical/product nuance the owner should know;
- concise product pitch.

#### AI Builder Pack

Provide a coding agent with:

- locked intent;
- JTBD;
- scope/non-scope;
- user journey;
- acceptance criteria;
- relevant constraints;
- known assumptions;
- provenance where material;
- anti-drift instruction;
- verification expectations.

Do not make this specific to Codex or Claude Code yet. M1 should produce a universal builder pack.

#### Professional Product Team Pack

Provide a professional handover-style product specification derived from the same lock, including as appropriate:

- problem statement;
- target user/persona;
- JTBD;
- user flows;
- functional requirements;
- non-functional requirements where known/relevant;
- scope/non-scope;
- acceptance criteria;
- dependencies/risks/assumptions;
- UAT/VAT guidance;
- decision/provenance summary.

Do not invent technical architecture that has not yet been decided.

## Consistency requirement

The three packs are views of one canonical contract, not three separately authored specifications.

Add automated checks where practical to prove that critical fields (product identity, target user, JTBD, scope and acceptance criteria) are sourced consistently from the same locked object.

## M1 drift test

Include at least one automated or deterministic test showing that a downstream pack generator cannot silently mutate a locked field.

Example: attempt to produce a Builder Pack with a different target user or primary JTBD than the locked object and ensure the system rejects or normalizes it back to the canonical lock.

## VAT/UAT

Generate founder-facing VAT/UAT instructions in ordinary language.

The founder should be able to test the product without understanding code or architecture.

## M1 evidence required

Before claiming M1 complete, exercise at least three materially different rough ideas end-to-end.

At minimum include:

1. a simple consumer app;
2. a B2B/workflow product;
3. a technically constrained or ambiguous product where TheDuck has to challenge/refine something material.

Also prove:

- at least one accepted TheDuck suggestion materially changes the resulting lock;
- the three packs stay consistent with the same lock;
- the drift test works;
- founder VAT/UAT is generated;
- claims about tests/builds are based on actually observed evidence.

## Non-goals

Do not build in M1:

- billing/subscriptions;
- authentication unless absolutely required to prove the vertical slice;
- teams/RBAC;
- enterprise admin;
- broad analytics;
- GitHub OAuth/integration;
- Codex/Claude/Cursor/Lovable-specific adapters;
- autonomous code generation;
- cross-project learning engine;
- elaborate dashboard;
- marketing site;
- full change-management workflow.

## Technical freedom

Choose the smallest sane implementation that proves M1.

Implementation details are yours to decide unless they alter locked product behavior. Prefer a simple architecture that can later become a SaaS without making M1 a throwaway prototype.

Do not over-engineer for imagined scale.

## GitHub checkpoint discipline

Work on `codex/m1-intent-gate`.

At the end of the milestone:

1. commit and push implementation;
2. update `duck/MILESTONES.md` with truthful status;
3. add/update verification evidence;
4. update `duck/HANDOFF.md` so another agent can continue with no chat history;
5. record assumptions/blockers/open questions where relevant;
6. state the exact next action;
7. stop for human review before M2.

## Definition of M1 success

M1 is successful when a non-technical user can enter a fuzzy software idea, make a small number of meaningful decisions, explicitly lock the resulting product, and receive three internally consistent representations of that same product that are useful to themselves, an AI coding agent, and a professional product team.

The amount of documentation generated is not a success metric.
