# M1.2 verification — 2026-09-13

Overall: **IMPLEMENTED NOT VERIFIED**. No M2 work. General semantic quality and three human reviewers remain required.

## Automated — VERIFIED

`npm test`: 43 passed, zero failures. `npm run check`: exit 0. Original M1/M1.1 regressions and twelve hand-authored structured fixtures cover the pipeline, three material ambiguity cases, correction persistence, suggestion rejection/reversal, missing material blocking, schema/source rejection, prompt injection, explicit approval, tamper/override protection, three-pack consistency, cache reuse and mocked provider failures.

Fixtures are not evidence of model generalization. `src/intent.js` is unchanged from the pre-M1.2 checkpoint. Synthetic approvals are not owner approval.

## Live model — IMPLEMENTED NOT VERIFIED

Executed `npm run verify:live`; report: `evidence/m1-2/live.json`. Provider: OpenAI Responses API, strict structured output. Model: unavailable. Actual live calls: **0**. OPENAI_API_KEY and OPENAI_MODEL were not configured.

With configuration, the script executes twelve generalization inputs and records prompts, inputs, responses, reflections, questions, synthetic answers, previews and locks/packs where possible. Human review must assess semantic quality; successful execution alone does not establish it.

## Browser — VERIFIED for observed failure/sample flow

Codex in-app browser at http://127.0.0.1:4319:

- Submitted “A tool to coordinate repairs in a community garden.” Missing-provider state showed “Your idea is still here”, exact raw idea and retry/back/sample controls. Reload restored the draft.
- Explicitly opened the restaurant sample. Reflection and shaped preview retained a hand-authored SAMPLE notice and original-idea disclosure.
- Rejected party-size suggestion; observed rejected status and fidelity row.
- Explicitly locked this synthetic sample. Observed fingerprint `e347a748430e6f24440ad5be6715b30cf26d773e317b5a6c75df9d0daee0c144` and Founder, AI Builder and Professional Product Team pack sections.

Download delivery and real-model browser interaction: **IMPLEMENTED NOT VERIFIED**. Copyable export remains available. Samples do not persist over personal drafts/locks.

## Design — VERIFIED for inspected implementation

Inspected screenshots and DOM geometry: 1280 CSS px desktop had dark rail and document width 1280; 390 × 844 CSS px mobile had top navigation and document width 390. Measured buttons were 44–48 CSS px high. The browser tool scales requested dimensions; these are measured CSS dimensions.

Observed cream/white surfaces, restrained yellow, readable reflection, amber suggestions, named nonnumeric fidelity and a distinct lock section. One original `public/duck.svg` supplies logo/favicon. No photos or proprietary mascot artwork. Inter 400/600/700 is self-hosted from @fontsource/inter 5.3.0; OFL license included.

Computed relative-luminance contrast ratios: Ink/Yellow 11.36:1; secondary/Cream 7.08:1; Slate/White 4.76:1; Ink/Mist 12.28:1; Ink/Amber 14.63:1; error/Soft Red 7.14:1. CSS supplies focus, labels, skip link and reduced-motion treatment. Full keyboard/screen-reader audit and perceived brand quality: **OPEN QUESTION**.

## Exact next action

Configure a model locally, execute twelve live cases, and conduct three unfamiliar-idea reviews using `UAT_M1_2.md`. Fix findings before claiming M1.2 complete. Stop for human UAT; do not start M2.
