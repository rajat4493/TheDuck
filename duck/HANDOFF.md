# Handoff

## Current state

M1 is **IN PROGRESS** on `codex/m1-intent-gate`. A runnable local vertical slice now exists. The locked authority documents are unchanged.

Implemented: rough idea capture → four clarification groups → editable review and opt-in suggestions → read-only Product Preview → approval checkbox plus explicit LOCK → Founder, universal AI Builder, and Professional Product Team packs. All outputs use one canonical immutable contract. Canonical JSON, a pack-file JSON bundle, individual/combined Markdown, and selectable project JSON are exposed for portability.

Implementation: Node.js 22+, no runtime dependencies. `server.mjs` serves loopback only; `src/intent.js` contains rules, preview/lock validation and renderers; `public/` contains the UI. No model, authentication, billing, GitHub connection UI, platform adapters, or downstream coding calls.

## Run and verify

```sh
PORT=4317 npm start
npm test
npm run check
node scripts/exercise.mjs
```

Open `http://127.0.0.1:4317`. Port 3000 was occupied during this session. The running process is session-local; restart if unavailable.

Read `duck/VERIFICATION.md` for actual evidence, `duck/DECISIONS.md` for provenance, and `duck/examples/*.json` for synthetic portable examples. Test approvals are not product-owner decisions.

## Remaining M1 work / exact next action

1. Verify canonical and pack downloads in the owner's normal browser. The in-app browser download-event waits timed out. Copyable JSON is a fallback; do not claim download delivery is verified.
2. Have the owner exercise `duck/UAT.md`, especially whether the rule-based questions actually clarify/challenge a fuzzy idea. M1's inference requirement is not waived: this implementation uses limited keyword rules and owner-entered substance. If insufficient, improve understanding/refinement within the locked intent before calling M1 complete.
3. Record owner feedback, address M1 gaps, and commit/push the next checkpoint with updated evidence. Do not move to M2 until human review approves it.

## Limitations

Browser storage keeps only the latest lock and a draft, not a project archive; export before replacing it. Fingerprints detect accidental drift, not malicious edits with a recomputed hash. No import or full Change Proposal flow exists. Nothing in generated packs proves a downstream product was implemented.
