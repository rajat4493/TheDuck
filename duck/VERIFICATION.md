# M1 verification — 2026-09-13 (Europe/Warsaw)

## Automated domain evidence

**VERIFIED** — Node.js v22.23.2; `npm test`: 9 named tests, 0 failures.

- Consumer reading journal, B2B leave-request workflow, and constrained offline plant guide each exercise idea → questions → preview → explicit lock → all three packs.
- Product identity, target user, JTBD, scope and acceptance criteria match the canonical contract in each pack's structured identity and rendered content.
- Accepting the feasibility suggestion adds an acceptance criterion with `THEDUCK-SUGGESTED + HUMAN-APPROVED` provenance; declining it does not. Original owner input is retained separately.
- Direct and nested mutation throw. Serialized tampering and downstream override arguments are rejected. Original lock remains usable.
- Missing explicit approval and incomplete previews are rejected.
- A portable JSON round-trip preserves generated output and is independent of draft mutation.
- Caller-injected suggestions are not accepted as trusted suggestion provenance.
- Incidental letters in “plain”/“rainy” do not trigger the AI rule; no generated assumption is misattributed to the owner.

**VERIFIED** — `npm run check`: server and browser modules parse successfully. `git diff --check`: no whitespace errors.

**VERIFIED** — `node scripts/exercise.mjs` produced the three synthetic examples under `duck/examples/`, each with a lock and 3 packs containing 16 named Markdown files in total. Run again to regenerate with new timestamps/fingerprints.

## Browser evidence

**VERIFIED** — Local in-app browser at `http://127.0.0.1:4317` exercised all three scenarios through the UI:

| Scenario | Observed lock fingerprint | Observations |
| --- | --- | --- |
| Reading journal | `d1490aadefd868a103cbe477e1469948387049835410316cad2b5d28de30aa23` | All three packs displayed; founder VAT/UAT includes the entered journey and acceptance check; reload restores the same fingerprint. |
| Leave requests | `9555620b336abff17d8a5088fd6fec6e4071f690b6e5ae8bf55b6c1e59b63bdb` | Accepted narrow-scope suggestion appears with provenance; all three pack sections appear after lock. |
| Offline plant guide | `b9f34a52bd32ab787132d149b8f4c04e3a1b99181ed146658384beff050387d0` | Constraint-specific question displayed; accepting feasibility challenge adds a completion criterion with provenance; three packs generated. |

The lock button was observed disabled until the approval checkbox was selected. Synthetic test decisions do not establish product-owner acceptance. Browser scenario fingerprints differ from command-generated fixtures because lock time and entered wording differ.

**VERIFIED** — Narrow in-app viewport screenshot inspected on the pack screen. Final reload focuses the new page heading. This is not a full accessibility or cross-browser audit.

**FAILED** — Initial `npm start` could not bind port 3000 (`EADDRINUSE`). `PORT=4317 npm start` served the application successfully.

**FAILED** — In-app browser waits for canonical/bundle download events timed out (10s and 5s); button invocation alone is not download evidence. No console error was observed.

**IMPLEMENTED NOT VERIFIED** — Actual file delivery through the browser's download manager. Owner should exercise downloads in their normal browser. JSON/Markdown rendering and domain-level JSON round-trip are verified separately.

## Remaining acceptance questions

- **OPEN QUESTION** — Does this rule-based implementation meet the owner's expected inference/challenge quality? It retains the idea verbatim as the starting definition, asks four question groups, and uses limited keyword-based challenge selection. It does not perform general semantic inference, adaptive follow-ups, or conflict detection.
- **OPEN QUESTION** — Does a non-technical owner find the review and the resulting packs useful? No actual owner UAT has occurred.
- **ASSUMPTION** — Latest-lock browser storage is adequate for this local M1 review. It is not a project archive; another locked project replaces the latest saved lock. Download/copy before doing so.
- **OPEN QUESTION** — Browser download completion needs direct verification. Selectable project JSON is provided as a fallback.

No downstream software described by the synthetic ideas was built or verified. No downstream coding platform was invoked. M1 remains in progress; do not begin M2.

**VERIFIED** — Final browser build's selectable JSON parsed successfully from the rendered textarea: envelope and bundle fingerprints matched, target user was “Hikers without network access”, and all 3 packs / 16 named files were present. “Select all project text” selected the entire JSON value. Clipboard transfer and saving that text in another application were not exercised.
