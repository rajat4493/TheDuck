# TheDuck Product Intent v1 — LOCKED

Status: **LOCKED by product owner on 2026-09-13**

## Canonical definition

TheDuck is the human-intent gate for AI software creation.

It helps ordinary people turn a rough software idea into an explicitly approved and locked product intent, generates the right artifacts for the founder, AI builders, and professional product teams, preserves continuity across coding agents and milestones, and verifies that the resulting product still matches what the human approved.

## Primary JTBD

When I have an idea for a software product but cannot express it like a professional product/engineering team, help me figure out exactly what I mean, challenge the important gaps in language I understand, let me approve and lock it, and then make sure whichever AI coding agent I use builds that product rather than gradually inventing a different one.

## Emotional job

I should remain the owner of the product even though I am not the strongest technical person in the room.

## Continuity job

If my AI coding agent runs out of tokens, fails, or I want to move to another builder, I should not have to explain the whole project again.

## End-to-end flow

IDEA → UNDERSTAND → CHALLENGE → REFINE → PREVIEW → HUMAN APPROVES → LOCK → TRANSLATE FOR BUILDER → BUILD → CHECKPOINT → VERIFY → HUMAN VAT/UAT → HANDOFF/CONTINUE → COMPLETE → LEARN

## Lock rule

Before lock: **challenge intelligently**.

After lock: **protect aggressively**.

A coding agent may choose implementation details, internal abstractions, libraries and other technical mechanics where those choices do not alter the locked product intent.

A coding agent may not silently change:

- target user
- primary JTBD
- core user workflow
- promised behaviour
- product scope or explicit non-scope
- major UX behaviour
- critical data behaviour
- acceptance criteria
- security/safety expectations
- the meaning of done

If one of those must change, create a Change Proposal and obtain explicit human approval before updating the lock.

## Material decision provenance

Every material product change must be attributable to one of:

1. **HUMAN** — requested directly by the product owner.
2. **THEDUCK-SUGGESTED + HUMAN-APPROVED** — proposed by TheDuck and explicitly accepted.
3. **IMPLEMENTATION-NECESSARY** — a technical consequence required to implement the locked product without changing product intent.
4. **EVIDENCE-DISCOVERED** — a fact uncovered during implementation/testing that affects feasibility or understanding and must be surfaced to the human.

The agent must never blur these categories.

## Canonical outputs

### 1. Founder / Vibe Coder Pack

Must answer in plain language:

- What am I building?
- Who is it for and what job does it do?
- What was actually built?
- What materially changed from what I approved?
- What works, what is uncertain, and what is blocked?
- What should I personally test (VAT/UAT)?
- How do I explain/pitch this product?
- What technical nuance should I know as the owner?

### 2. AI Builder Pack

Must include:

- locked product intent
- JTBD
- scope and non-scope
- user flows
- acceptance criteria
- constraints and assumptions
- architecture requirements only where relevant
- milestone plan
- verification expectations
- anti-drift rules
- GitHub checkpoint discipline
- current handoff state / exact next action

### 3. Professional Product Team Pack

Must provide enough structured product/engineering context that a PM, designer, architect and engineering team can inherit the project without reconstructing AI chat history.

It should include the professional equivalents of PRD, requirements, flows, acceptance criteria, NFRs, architecture/context, integrations, data considerations, risks, dependencies, decisions, evidence, UAT and release/readiness status.

## GitHub role

If the user has GitHub, the repository is the persistent continuity backbone.

A milestone is not complete until:

1. implementation is committed and pushed;
2. TheDuck state/artifacts are updated;
3. verification evidence is recorded honestly;
4. unresolved blockers/assumptions are visible;
5. the next action is declared.

A new coding agent should be able to continue from the repository without the user re-explaining the project.

If GitHub/direct integration is unavailable, TheDuck must generate a portable platform-specific pack. The product is **portable first, connected where possible**.

## Product boundaries

TheDuck is not:

- a coding model
- an IDE
- a GitHub replacement
- a Jira replacement
- a generic AI project manager
- merely a prompt improver
- merely a documentation generator
- an autonomous CTO that takes product ownership away from the human
- primarily an audit/governance product

Verification, provenance, handoff and governance exist to protect human intent. They are supporting capabilities, not the product identity.

## Success definition

A successful TheDuck project means:

> The user can explain what they are building. The coding agent knows exactly what to build. A different coding agent can continue it. A professional product team can inherit it. And all four are describing the same product.

## Change control

This file is authoritative. It may only be changed after an explicit product-owner decision to amend the lock. Implementation discoveries should be recorded elsewhere until approved.
