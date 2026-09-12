# M1.1 verification — 2026-09-13 (Europe/Warsaw)

## Automated evidence

**VERIFIED** — `npm test`: 19 tests, 0 failures. `npm run check`: server, experience, lock engine, and browser modules parse successfully. `git diff --check`: no whitespace errors.

The new M1.1 tests cover:

- simple reading-journal idea with zero follow-up questions and plain-language shaping;
- ambiguous antique-value idea where estimate versus actual comparable listings produces materially different locks;
- suggestion accept/reject and reversal, with rejected text absent from lock and packs;
- misunderstanding correction and “Almost” correction while retaining prior choices and accepted suggestions;
- Idea Fidelity with raw statements, unresolved coverage, and lock blocking until reviewed;
- WOW case preserving photo/value/why, challenging evidence quality, accepting a separate fallback, and keeping all three packs consistent;
- M1 approval, immutability, fingerprint, tampering, and override protections;
- unknown ideas remaining unresolved instead of receiving fabricated product decisions;
- maximum three material questions;
- generation from old M1 example locks.

## Browser evidence

**VERIFIED** — Served at `http://127.0.0.1:4318` after the existing port 3000 process was occupied.

1. Reading journal: initial screen is one large conversational idea input. “Here’s what I heard” showed product, audience, outcome, and journey with zero follow-up questions. The shaped screen showed plain-language sections, an optional suggestion, and Idea Fidelity. I rejected the suggestion, marked the original statement captured, and observed the explicit lock button become enabled. After locking, the screen said “Your product intent is locked” and displayed all three pack sections.
2. Antique guide: “Here’s what I heard” surfaced the material value question. The choice screen offered “A rough estimate” and “Actual comparable listings”, and the estimate path materially changed the shaped outcome. The suggestion “Ask for another photo when the first one is unclear” was separately accepted.
3. Correction: “You misunderstood me” opened a correction form. Changing the target user to “Museum volunteers cataloguing donated antiques” retained the prior listings choice and accepted suggestion. “Almost — change something” opened the same correction surface and produced a final locked product with the corrected target user and canonical fingerprint.
4. Portable export: the rendered JSON showed the locked fingerprint, accepted suggestion provenance `THEDUCK-SUGGESTED + HUMAN-APPROVED`, and three packs. The in-app Playwright locator timed out on the very large textarea, so the structured export was inspected through the browser accessibility snapshot instead.

**VERIFIED** — The browser screenshot showed the temporary neutral design system, large conversational input, four-step progress, responsive workspace, clear focus treatment, and no permanent Ducklings colors claimed.

**IMPLEMENTED NOT VERIFIED** — Normal-browser download delivery. The previous in-app download event did not complete; the copyable JSON fallback is rendered and the domain-level portable export is covered by tests.

## Open questions and limits

- **OPEN QUESTION** — Does the rule-based interpretation feel sufficiently “wow” to a real vibe coder across ideas outside the covered examples? The flow keeps unfamiliar statements unresolved, but it is not general semantic understanding.
- **OPEN QUESTION** — Does the user prefer the current correction wording and fidelity review density? Human UAT is required.
- **OPEN QUESTION** — Exact Ducklings visual reference is not supplied. Tokens are centralized in `public/style.css` and intentionally temporary.
- **ASSUMPTION** — Browser local storage is acceptable for a local M1.1 review; it is not an archive and keeps the latest conversation/lock only.
- No M2 work was started. No downstream coding platform was invoked.
