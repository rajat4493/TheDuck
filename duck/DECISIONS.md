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
