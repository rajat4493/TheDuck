# Handoff

## Current state

M1.1 is **IMPLEMENTED NOT VERIFIED** on `codex/m1-intent-gate`. The M1 locked authority and contract/lock engine remain unchanged. The front door is now conversational: idea → “Here’s what I heard” → focused material question(s) → shaped idea → Idea Fidelity → explicit lock → existing three packs.

Implemented: plain-language capture, inferred reflection, 0–3 material questions, visible suggestions with Accept/Reject, misunderstanding and “Almost” correction paths, auditable Idea Fidelity rows, unresolved coverage blocking, explicit lock, and the existing Founder / universal AI Builder / Professional Product Team packs. All outputs still use one canonical immutable contract. Canonical JSON, a pack-file JSON bundle, individual/combined Markdown, and selectable project JSON remain available.

Implementation: Node.js 22+, no runtime dependencies. `server.mjs` serves loopback only; `src/intent.js` contains rules, preview/lock validation and renderers; `public/` contains the UI. No model, authentication, billing, GitHub connection UI, platform adapters, or downstream coding calls.

## Run and verify

```sh
PORT=4317 npm start
npm test
npm run check
node scripts/exercise.mjs
```

Open `http://127.0.0.1:4317`. Port 3000 was occupied during this session. The running process is session-local; restart if unavailable.

Read `duck/VERIFICATION_M1_1.md` for M1.1 evidence, `duck/VERIFICATION.md` for M1 evidence, `duck/DECISIONS.md` for provenance, and `duck/examples/*.json` for synthetic portable examples. Test approvals are not product-owner decisions.

## Remaining M1.1 work / exact next action

1. Have the owner exercise `duck/UAT_M1_1.md`, especially whether “Here’s what I heard” and the shaped preview feel substantially clearer without becoming falsely confident.
2. Verify canonical and pack downloads in the owner's normal browser. The in-app browser download-event waits timed out previously; copyable JSON is a fallback. Do not claim download delivery is verified.
3. Record owner feedback and address M1.1 gaps. Stop for human review; do not move to M2.

## Limitations

Browser storage keeps only the latest lock and a draft, not a project archive; export before replacing it. Fingerprints detect accidental drift, not malicious edits with a recomputed hash. No import or full Change Proposal flow exists. Nothing in generated packs proves a downstream product was implemented.
