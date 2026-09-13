# M1 implementation decisions

- **HUMAN** — Start M1 in `rajat4493/TheDuck`, branch `codex/m1-intent-gate`, against the locked product intent and M1 build brief.
- **IMPLEMENTATION-NECESSARY** — Dependency-free Node.js static server, browser ES modules, and a separately testable domain module. Only loopback access; no auth, billing, platform adapters, or external AI calls.
- **IMPLEMENTATION-NECESSARY** — Rule-based question selection and explicit opt-in suggestions as an initial vertical-slice implementation. This does not establish that M1's understanding/challenge quality requirement is satisfied. Review remains open; do not reinterpret the locked brief to make static questions sufficient by definition.
- **IMPLEMENTATION-NECESSARY** — Immutable deep-frozen contract, detached from draft references, with a SHA-256 integrity fingerprint. All output renderers accept the same verified lock; override arguments are rejected. Fingerprint is not authentication or an approval signature.
- **IMPLEMENTATION-NECESSARY** — Local browser draft/latest-lock persistence, portable JSON and named Markdown outputs. Selectable JSON fallback for browsers where downloads cannot be confirmed.
- **EVIDENCE-DISCOVERED** — A generated default assumption was incorrectly attributed to HUMAN during browser review. Removed the default and added regression coverage. Assumptions now start empty.
- **EVIDENCE-DISCOVERED** — Port 3000 was occupied. Verification server uses port 4317.
- **EVIDENCE-DISCOVERED** — In-app browser download-event waits timed out, including after attaching the download anchor and extending object URL lifetime. No browser console error was observed. Download completion remains unverified; no cause is asserted.

No locked authority file was changed. No suggestion made by this implementation has been accepted on behalf of the actual product owner. Example approvals are synthetic test inputs only.

## M1.2 decisions

- **HUMAN** — Implement general understanding and the supplied TheDuck Design System v1, preserve the locked engine/provenance and stop before M2.
- **IMPLEMENTATION-NECESSARY** — Replaceable server-side provider, strict schema/source validation, bounded cache, one optional refresh and deterministic human-decision reapplication. No default model or automatic fallback.
- **IMPLEMENTATION-NECESSARY** — Legacy rules serve compatibility only; new ideas use version-2 semantic interpretation. Explicit samples cannot replace persisted personal projects.
- **IMPLEMENTATION-NECESSARY** — Original canonical SVG and OFL Inter with approved centralized colours; this supersedes the previous temporary-design open question.
- **EVIDENCE-DISCOVERED** — Live credentials/model unavailable. Zero live calls; generalization and human WOW acceptance remain unverified.

## M1.1 decisions

- **HUMAN** — Replace the fixed PM-style questionnaire as the primary front door with conversational reflection, material questions, shaped preview, fidelity review, and correction paths, as specified in `docs/M1_1_VIBER_EXPERIENCE.md`.
- **IMPLEMENTATION-NECESSARY** — Keep M1's canonical contract fields and lock engine unchanged. The new `src/experience.js` is a pre-lock shaping layer; `src/intent.js` still owns explicit approval, deep immutability, fingerprint verification, and pack generation.
- **IMPLEMENTATION-NECESSARY** — Use transparent, deterministic language rules for this local slice. Unrecognized ideas remain unresolved and cannot lock until the user supplies or accounts for missing material decisions.
- **IMPLEMENTATION-NECESSARY** — Store the conversational draft separately from the locked contract so correction and reload preserve the pre-lock decision history without changing the lock model.
- **EVIDENCE-DISCOVERED** — Browser review exposed that a correction must replace the selected field rather than also leak into scope. Corrections now carry a selected field and are recorded in fidelity/provenance.
- **OPEN QUESTION** — No permanent Ducklings visual reference was supplied. Styling tokens are centralized and explicitly temporary.
