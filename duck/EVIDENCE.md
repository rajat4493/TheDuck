# Evidence log

Only these states are used: VERIFIED · IMPLEMENTED NOT VERIFIED · ASSUMPTION · OPEN QUESTION · FAILED.

## M1.1 — Lock Core (2026-10-28)

### Commands run and observed results

Environment: Node v22.22.0, npm 10.9.4, Linux container. Run from a clean
`rm -rf node_modules dist && npm ci`.

| Command | Observed result | State |
|---|---|---|
| `npm ci` | installed from `package-lock.json`; `found 0 vulnerabilities` | VERIFIED |
| `npm audit` | `found 0 vulnerabilities` | VERIFIED |
| `npm run typecheck` (`tsc --noEmit`) | no output, exit 0 | VERIFIED |
| `npm run lint` (`eslint .`) | no output, exit 0 | VERIFIED |
| `npm run build` (`tsc -p tsconfig.build.json`) | exit 0; `dist/core/index.js` imports in plain Node and exposes 106 exports | VERIFIED |
| `npm run test` (`vitest run`) | `Test Files 8 passed (8)`, `Tests 85 passed (85)` | VERIFIED |
| `npm run check` (all four) | exit 0 | VERIFIED |
| `npm run render:examples` | 3 fixtures rendered to `examples/`; 12–14 questions each; consistency problems: 0 | VERIFIED |
| Manual browser verification | not applicable — there is no UI in M1.1 | — |

### M1 exit criteria — status after M1.1

M1.1 proves these at the **core/API level only**. No founder has used a UI.

| # | Exit criterion | State | Evidence |
|---|---|---|---|
| 1 | Three materially different ideas complete the flow | VERIFIED (core) · OPEN QUESTION (UI, M1.2) | `tests/end-to-end.test.ts`: consumer utility (demo / no data / no AI), AI product (pilot / personal / AI), sensitive integration (production / sensitive / integration). Three different fingerprints. |
| 2 | A challenge question materially changes the lock | VERIFIED | `tests/challenge.test.ts`: "AI wrong → review" vs "→ auto" changes journey, must-never rules, success criteria, acceptance criteria and fingerprint. "Everyone" challenge replaces a broad target user. |
| 3 | Explicit lock only | VERIFIED (core) | `tests/explicit-lock.test.ts`: no packs before lock; lock refused without exact confirmation, by an agent, when incomplete, or twice. |
| 4 | Packs derive from the same lock and agree | VERIFIED (anchor-based) | `tests/end-to-end.test.ts`: every pack carries the same fingerprint; locked values present verbatim in each designated file; readiness statuses match between founder and professional packs; deterministic rendering; tampering detected. Limitation: not a semantic check (ADR-001). |
| 5 | Drift test | VERIFIED | `tests/drift.test.ts` — the four approved tests (D-007): rendering does not mutate the model; adapters cannot alter locked fields (mutating, drifting, dropping, unanchored and "live" adapters all refused); locked-field changes without an approved Change Proposal refused; mismatched or edited packs visibly invalid. |
| 6 | Founder VAT/UAT next step in plain English | VERIFIED (curated assertions) · OPEN QUESTION (manual readability review, M1.2) | `tests/founder-language.test.ts`. |
| 7 | All checks recorded with commands and results | VERIFIED for M1.1 | This file. Browser checks start in M1.2. |
| 8 | Workstream matrix with honest states | VERIFIED (exists) | `duck/WORKSTREAMS.md` (TheDuck) and generated per-project matrix (`tests/readiness.test.ts`: all 8 rows always present; NOT APPLICABLE shown, not omitted). |
| 9 | FinOps hypothesis and AI note separate facts from assumptions | VERIFIED (exists) | `duck/FINOPS.md`; generated cost hypothesis has no prices (`verifiedPrices: []`); AI note generated only for AI projects; TheDuck's own AI note NOT APPLICABLE (no AI used). |
| 10 | A fresh agent can state the next action from the repo | IMPLEMENTED NOT VERIFIED | `duck/HANDOFF.md` updated. No fresh agent has been tried yet (planned for M1.3). |

### Evidence discovered during M1.1

| Finding | State | What changed |
|---|---|---|
| The first adapter drift check matched the target user *anywhere* in the output. A drifted "Target user" line still passed because the same text appeared inside an acceptance criterion. | FAILED → fixed | Adapter coverage now requires exact labelled lines (`- Target user: …`, numbered journey steps, `- **AC-nn** — …`). Test now catches it. |
| The jargon guard caught "FinOps" in the founder disclaimer. | FAILED → fixed | Founder pack uses its own plain disclaimer. |
| Reading the rendered packs: founder "must never" answers name the forbidden action, but TheDuck's own rules started with "Must not…", so under "Rules it must never break" founder items read as instructions. | FAILED → fixed | All must-never items now name the forbidden action; heading is "Things it must never do". |
| npm 10.9 crashes (`edgesOut`) resolving Vitest 5's optional peers; Vitest 3.2.x and 4.1.12 carry open advisories. | IMPLEMENTATION-NECESSARY | Vitest 5.0.4 + explicit `vite` 8.3.4 + `.npmrc legacy-peer-deps=true`. |

### Not verified / assumptions

- ASSUMPTION: 12–14 fixed questions is acceptable as "a small number". To be judged by the founder in M1.2.
- ASSUMPTION: deterministic acceptance-criteria wording (one per journey step, rule and success check) is useful to builders.
- OPEN QUESTION: whether founders will accept that free-text answers are kept verbatim (e.g. "for Independent podcasters…" keeps the capital letter).

## M1.1.1 — Truth and Founder-Experience Correction (2026-10-28)

Additive correction record. The M1.1 section above is unchanged and remains
valid for the mechanisms it tested (lock, fingerprint, provenance, Change
Proposals, drift guards, cross-pack agreement). It did **not** test whether an
output was materially misleading. Full narrative:
`duck/receipts/2026-10-28-M1.1.1-truth-correction.md`.

### Status changes to M1.1 statements

| M1.1 statement | M1.1.1 state | Why |
|---|---|---|
| ASSUMPTION: 12–14 fixed questions is acceptable as "a small number" | FAILED (owner review) | Replaced by 5 core + ≤3 follow-ups. |
| Exit criterion 6 "VERIFIED (curated assertions)" | VERIFIED (curated assertions), with a caveat | The assertions passed, but the AI sample's founder pack still hid an undecided cost limit. Now covered by a regression test. |
| ASSUMPTION: deterministic acceptance criteria are useful to builders | FAILED for journey-step criteria (owner review) | Journey steps are now draft verification candidates, not acceptance criteria. |

### Defects observed in committed M1.1 output (`eaa5bb6`)

| Check | Observed |
|---|---|
| `git show eaa5bb6:examples/README.md` | 13 / 14 / 12 questions |
| `git show eaa5bb6:examples/ai-product/founder/WHAT_YOU_ARE_BUILDING.md` | line 37 "…under the agreed cost limit"; line 48 "Nothing is waiting for your decision right now." |
| `git show eaa5bb6:examples/ai-product/builder/ACCEPTANCE_CRITERIA.md` | 4 × "Main journey step N works…" as locked acceptance criteria |
| same founder file, must-never section | "- Use uploaded audio to train AI models" (bare action) |

### Commands run and observed results

Environment: Node v22.22.0, npm 10.9.4. From a clean `rm -rf node_modules dist && npm ci`.

| Command | Observed result | State |
|---|---|---|
| `npm ci` / `npm audit` | `found 0 vulnerabilities` | VERIFIED |
| `npm run check` | exit 0 — typecheck, lint, build clean; `Test Files 9 passed (9)`, `Tests 108 passed (108)` | VERIFIED |
| built output | `dist/core/index.js` imports; `MAX_QUESTIONS` = 8; provider `theduck-rules-v2` | VERIFIED |
| `npm run render:examples` | 6 questions per sample; consistency problems: 0 | VERIFIED |
| `grep "Nothing is waiting" examples/*/founder/*.md` | no matches | VERIFIED |
| `grep -r "Main journey step" examples` | no matches | VERIFIED |
| Manual browser verification | not applicable — no UI | — |

### New tests (`tests/m1-1-1-corrections.test.ts`, 23)

- **Correction 1:**
  - ≤5 core and ≤3 follow-ups per sample;
  - the worst case stops at exactly 8 questions;
  - the core pass covers the five commitments;
  - every question offers "not sure";
  - the gate refuses a sixth core question or a fourth follow-up;
  - "not sure" on a core question becomes a visible open question that the preview can close;
  - "not sure" on a follow-up stays open through lock and appears in founder, builder and professional packs.
- **Correction 2:**
  - REGRESSION on the exact ShowNotes sample: the "agreed cost limit" becomes the decision "Set the maximum acceptable AI cost per episode.", is shown in every pack, and is never accompanied by "Nothing is waiting";
  - the check is not a locked acceptance criterion but a blocked candidate;
  - setting "$0.50" resolves it;
  - placeholder and undefined-value detection;
  - a generic provider is a professional question;
  - assumptions are kept separate from decisions.
- **Correction 3:**
  - for every sample: locked ACs are only must-not or measurable success checks in When/shall form, and journey steps appear only as draft candidates (in the Builder, Professional and Universal packs, with the refine instruction);
  - "Upload an episode audio file" is not implementation-ready;
  - owner-written criteria lock as HUMAN.
- **Correction 4:**
  - REGRESSION: "Must not use uploaded audio to train AI models." appears in every pack;
  - no bare action appears under any must-never heading, in any pack.

### Open after M1.1.1

- OPEN QUESTION: does the first-pass question count (5 core; 6 in each sample; 8 at most) feel right to real founders? Needs real founders using the M1.2 UI.
- ASSUMPTION: the unresolved-reference patterns cover common phrasings; they are rules, not understanding.
- IMPLEMENTED NOT VERIFIED: fresh-agent handover (M1.3).
