# M1.1 — Viber Experience Correction

## Why this milestone exists

M1 proved the core contract mechanics: explicit lock, canonical intent, provenance, immutable/fingerprinted lock, consistent generation of Founder / AI Builder / Product Team packs, and protection against silent downstream overrides.

However, the current onboarding experience places too much product-management burden on the user. A vibe coder should not have to think in terms such as JTBD, non-goals, assumptions, constraints, acceptance criteria, or NFRs just to explain an idea.

M1.1 corrects the front-door experience without weakening the M1 contract model.

## Product principle

**TheDuck should do the structuring work. The human should do the deciding.**

A user should be able to explain an idea in ordinary language, as if speaking to a friend. TheDuck should infer as much as it safely can, ask only questions whose answers would materially change the product, make suggestions visibly and separately, and then show the user a shaped version of their idea that they can accept, correct, or reject before LOCK.

## Keep from M1

Do not remove or weaken:

- the canonical lock/fingerprint model;
- explicit human approval before LOCK;
- the single canonical contract as source of truth;
- provenance of human input versus TheDuck suggestions;
- the three-pack generation model;
- prevention of downstream pack overrides;
- verification honesty states;
- founder VAT/UAT generation;
- GitHub checkpoint / handoff discipline.

## Replace from M1

Replace the fixed PM-style questionnaire as the primary user experience.

The user must not be presented with a form that requires them to explicitly fill fields named:

- JTBD
- non-goals
- assumptions
- constraints
- acceptance criteria
- NFRs

Those concepts may remain internal to the canonical model, but TheDuck is responsible for deriving them from conversation and only asking the user about unresolved decisions that materially affect the product.

## Required user flow

### 1. Tell me your idea

First screen should be dominated by one large free-text input.

Prompt direction:

> **What do you want to build? Tell me like you'd tell a friend.**

Optional helper examples may be conversational, not specification-like.

The user should be able to paste a rough, incomplete, messy idea.

### 2. Here's what I heard

TheDuck reflects the idea back in plain language before interrogating the user.

Show:

- a crisp 1–3 sentence interpretation of the product;
- the likely main user;
- the likely core outcome;
- a simple core journey / flow where it can be inferred;
- any important uncertainty that cannot safely be inferred.

The tone must make it easy for the user to say, "yes, that is what I meant" or "no, you misunderstood me."

### 3. Ask only questions that materially change the product

TheDuck should generate **0–3 focused clarification/challenge questions**.

Default expectation:

- simple idea: 0–2 questions;
- 3 questions should be unusual and justified;
- never ask questions merely to populate every internal field.

A question is justified when the answer would materially change one or more of:

- target user;
- core job/outcome;
- primary journey;
- meaningful scope boundary;
- critical feasibility/safety/privacy requirement;
- what "done" means.

Good example:

> "When you say value, do you mean a rough estimate or actual comparable listings?"

Bad example:

> "What are your non-goals?"

If TheDuck can reasonably infer something without creating product risk, infer it and show the inference in the shaped preview instead of asking.

## Suggestions are not questions

TheDuck may suggest a stronger or simpler version of the user's idea, but suggestions must be clearly separated from the user's original intent.

Each suggestion must show:

- what TheDuck proposes;
- why it may help;
- Accept / Reject.

Accepted suggestions retain provenance:

`THEDUCK-SUGGESTED + HUMAN-APPROVED`

Rejected suggestions must not leak into the lock or generated packs.

## 4. Your idea, shaped

This is the primary "wow" moment.

Show a polished but plain-language view of the product that makes the user feel:

> "That is exactly what I meant, but much clearer."

Recommended visual content:

- **What you're building** — concise product explanation;
- **Who it's for** — normal language;
- **The core experience** — simple step flow, e.g. `Take photo → identify object → find evidence → estimate value → explain confidence`;
- **What matters in the first version**;
- **What TheDuck suggested** — clearly marked;
- **Still unresolved** — only genuine unresolved product decisions.

Do not expose internal PM vocabulary unless the user explicitly asks for it.

## 5. Idea Fidelity

Before LOCK, show an auditable mapping between the raw idea and the shaped product.

Do **not** invent a numeric fidelity percentage.

The goal is traceability, not a fake score.

Show rows or cards similar to:

| You said | TheDuck interpreted / placed it as | Status |
| --- | --- | --- |
| "take a photo of an antique" | Core journey begins with photo capture | PRESERVED |
| "tell me if it is valuable" | Primary outcome is value estimation | PRESERVED |
| "roughly" | Estimate, not certified appraisal | PRESERVED |
| "why" | Product must explain evidence/reasoning | PRESERVED |
| — | Ask for another photo when confidence is low | THEDUCK SUGGESTION |

Anything TheDuck cannot confidently account for should appear as `UNRESOLVED` rather than being silently omitted.

The user must be able to see:

**MY IDEA → INTERPRETATION → SUGGESTIONS → LOCK**

## 6. Lock decision

At the final pre-lock step provide three obvious actions:

- **Yes, lock it**
- **Almost — change something**
- **You misunderstood me**

Only `Yes, lock it` may create a new canonical locked contract.

If the user selects either correction path, return to the relevant shaped interpretation without losing already-approved decisions.

## 7. After lock

After successful lock, clearly communicate:

> **Your product intent is locked.**

Then generate the existing three consistent packs:

- Founder / Vibe Coder Pack
- AI Builder Pack
- Professional Product Team Pack

A future screen may ask where the user wants to build:

- Codex
- Claude Code
- Cursor
- Lovable
- Download / Universal

For M1.1, do not falsely imply live integration if an adapter is not implemented. A disabled or "coming next" presentation is acceptable.

## Internal model requirement

The internal canonical contract may continue to contain structured fields such as:

- definition
- target user
- JTBD
- journey
- scope
- non-goals
- assumptions
- constraints
- acceptance

But these are implementation details of TheDuck's product intelligence, not a form the vibe coder must fill.

Every required internal field should be sourced from one of:

1. explicit human wording;
2. a safe TheDuck interpretation surfaced to the human before lock;
3. a TheDuck suggestion explicitly accepted by the human;
4. an unresolved state that prevents lock if truly material.

Do not fabricate missing product decisions merely to make the schema complete.

## Question-quality rules

Before displaying a follow-up question, apply this test:

> **Would different reasonable answers materially change what gets built?**

If no, do not ask.

Also:

- prefer one concrete question over multiple abstract questions;
- avoid technical jargon;
- avoid asking the user to choose architecture unless architecture materially affects their intended product behavior;
- ask about risk/constraints only when relevant to the actual idea;
- combine closely related uncertainty into one understandable question;
- never ask questions just because a schema field is empty.

## Vibe-coder acceptance criterion

A normal user must be able to go from rough idea to lock without needing to understand the terms:

- JTBD
- non-goals
- assumptions
- acceptance criteria
- NFR
- architecture

The generated professional artifacts may use those concepts after the lock.

## UX tone

TheDuck should feel:

- friendly;
- clever;
- lightweight;
- reassuring without being sycophantic;
- product-aware without sounding like enterprise requirements software;
- willing to challenge when something important is unclear.

It should feel like a thoughtful product partner, not a form wizard.

## Ducklings design language

TheDuck should visually belong to the wider Ducklings family.

However, exact permanent colors/tokens are not yet committed in this repo. Therefore for M1.1:

- do not create a hard-to-replace permanent visual identity unrelated to Ducklings;
- keep design tokens centralized and easy to retheme;
- use temporary neutral styling where exact Ducklings tokens are unavailable;
- do not invent "official" Ducklings colors;
- record this as an open design dependency until a real Ducklings visual reference is supplied.

Once the reference is provided, update the design system explicitly rather than scattering one-off color changes through components.

## WOW requirement

M1.1 is not complete merely because the new flow functions.

At least one tested sample idea must produce a shaped preview where a reviewer can clearly see that TheDuck:

1. preserved the original idea;
2. made it substantially clearer;
3. surfaced an important decision the user had not explicitly stated;
4. kept TheDuck's own suggestion separate;
5. allowed the user to approve/reject that suggestion;
6. produced a lock whose three packs remain consistent with the shaped product.

The "wow" is clarity + ownership, not visual animation.

## M1.1 evidence required

Before M1.1 can be called complete, demonstrate at least:

1. **Simple idea case** — no more than 2 follow-up questions before shaped preview.
2. **Ambiguous idea case** — a material answer changes the resulting shaped product/lock.
3. **Suggestion case** — TheDuck suggestion can be accepted and rejected, with correct provenance and no leakage when rejected.
4. **Misunderstanding case** — user can say "You misunderstood me" and correct interpretation before lock.
5. **Idea Fidelity case** — original statements map visibly to preserved/interpreted/suggested/unresolved outcomes.
6. **Drift protection case** — post-lock pack generation still cannot mutate the canonical intent.
7. **Three-pack consistency case** — Founder, Builder and Product Team outputs reflect the same canonical lock.
8. **Plain-language VAT/UAT case** — user-facing test instructions remain understandable without product/engineering vocabulary.

Record exactly what was actually executed. Do not call browser behavior verified if only unit logic was tested.

## Scope control

Do not build during M1.1:

- billing;
- teams/RBAC;
- analytics platform;
- full GitHub connection UX;
- cross-project learning engine;
- production Codex/Claude/Cursor/Lovable integrations;
- autonomous coding;
- enterprise governance dashboard.

M1.1 is specifically about making the locked M1 engine feel natural and valuable to a real vibe coder.

## Milestone checkpoint

At completion:

1. push implementation to `codex/m1-intent-gate`;
2. update `/duck` milestone status and evidence;
3. update assumptions / blockers / open questions;
4. update `duck/HANDOFF.md` for a fresh agent;
5. explicitly state what is VERIFIED versus IMPLEMENTED NOT VERIFIED;
6. stop for human review before starting M2.
