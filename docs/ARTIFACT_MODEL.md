# TheDuck Artifact Model

TheDuck maintains one canonical product truth and renders it for three audiences. These are not three independent specifications.

## 1. Founder / Vibe Coder Pack

Purpose: keep the human product owner informed and in control without requiring engineering fluency.

Minimum outputs:

- `WHAT_YOU_ARE_BUILDING.md`
- `WHAT_CHANGED.md` — material changes only
- `CURRENT_OUTCOME.md`
- `VAT_UAT.md`
- `PRODUCT_PITCH.md`
- `FOUNDER_TECH_NOTES.md`

Rules:

- use plain language;
- do not dump implementation detail unless it changes product meaning, cost, risk, privacy, security, portability or future choices;
- distinguish proven behaviour from claims;
- make the next human decision/test obvious.

## 2. AI Builder Pack

Purpose: give a coding agent precise, durable instructions while preserving the locked JTBD.

Minimum outputs:

- `LOCKED_INTENT.md`
- `JTBD.md`
- `SCOPE.md`
- `USER_FLOWS.md`
- `ACCEPTANCE_CRITERIA.md`
- `CONSTRAINTS.md`
- `MILESTONES.md`
- `VERIFICATION_EXPECTATIONS.md`
- `HANDOFF.md`

Platform adapters may additionally emit native files such as `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/*`, or a Lovable starter prompt.

Standing builder rules:

- protect the locked intent;
- never silently alter material product behaviour;
- classify material changes by provenance;
- checkpoint to GitHub at every milestone where GitHub is available;
- never call something verified unless it actually ran and the result was observed;
- keep `HANDOFF.md` usable by a different agent at all times.

## 3. Professional Product Team Pack

Purpose: allow a formal product/engineering team to inherit the product without reconstructing AI conversations.

Expected coverage:

- product overview and problem statement
- JTBD / personas where useful
- functional requirements
- scope / non-scope
- journeys and UX flows
- acceptance criteria
- non-functional requirements
- architecture/context
- data and integration considerations
- dependencies
- risks and open questions
- decision history and provenance
- verification evidence
- UAT / release-readiness status
- current product state

## One source of truth

All packs must derive from the same locked product model. If two outputs disagree, that is a TheDuck defect.
