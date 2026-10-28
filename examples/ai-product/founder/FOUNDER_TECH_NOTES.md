<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:8eefb103c25e6dc1ecb8e7c2cd3aa5df390a5a13f6007e036b9b1bd5d6f6f7a7 pack=founder file=FOUNDER_TECH_NOTES.md -->
> Made from your locked product definition (version 1, fingerprint `8eefb103c25e`). If anything here looks different from what you approved, the locked version wins.

# What you should know as the owner

These notes turn the professional checklist into what it means for you. Most important first.

### The experience for your users — Needs work before real use (REQUIRED)

Nobody has tried the journey yet. Watching a few real people use it is the cheapest way to find problems.

<details><summary>Technical detail</summary>

- Workstream: Product and UX
- Why this status: Always required.
- Next professional action: Turn the 4-step main journey into screen flows and watch 3–5 real Independent podcasters who publish weekly and edit their own shows try them.
- Unknowns: No one has tried the journey yet.

</details>

### How it is put together — Needs work before real use (REQUIRED)

Real people will use it, so how it is hosted and backed up matters.

<details><summary>Technical detail</summary>

- Workstream: Solution architecture
- Why this status: Stage is pilot.
- Next professional action: Write an ADR covering hosting, data storage, backups, environments and how integrations connect.
- Unknowns: Stack and hosting not chosen.

</details>

### Information and connected services — Needs work before real use (REQUIRED)

It depends on "A speech-to-text and AI writing service — to transcribe the episode and draft the text". If that changes or goes down, your product is affected.

<details><summary>Technical detail</summary>

- Workstream: Data and integrations
- Why this status: Holds personal information and/or depends on connected services.
- Next professional action: Confirm access, limits, terms and costs for: A speech-to-text and AI writing service — to transcribe the episode and draft the text.
- Unknowns: Whether "A speech-to-text and AI writing service — to transcribe the episode and draft the text" offers the access needed (not checked).

</details>

### Keeping people's information safe — Needs work before real use (REQUIRED)

It stores people's personal details, so it needs basic protection and a privacy notice.

<details><summary>Technical detail</summary>

- Workstream: Security and privacy
- Why this status: Handles basic personal details.
- Next professional action: Basic protections: sign-in, access limits, a privacy notice and deletion on request.
- Unknowns: none recorded.

</details>

### Checking it does what you approved — Needs work before real use (REQUIRED)

You have a checklist (VAT_UAT) to try yourself before anyone calls it done.

<details><summary>Technical detail</summary>

- Workstream: Quality and release engineering
- Why this status: 8 acceptance criteria locked; no evidence yet.
- Next professional action: Automate checks for the 8 acceptance criteria and record evidence per criterion.
- Unknowns: Nothing is built, so there is no evidence yet.

</details>

### Running costs — Needs work before real use (REQUIRED)

AI costs money every time it runs, so your running cost grows with use. Nobody knows the real number yet; set a spending limit before inviting users.

<details><summary>Technical detail</summary>

- Workstream: FinOps / cost model
- Why this status: Uses AI and/or will run in production; costs need a model and limits.
- Next professional action: Replace the symbolic cost model with verified provider prices (record source and date) and set a spending alert.
- Unknowns: No provider prices have been checked. All prices are symbols, not numbers. Hosting provider and plan not chosen. T_in / T_out (tokens per request) not measured. P_in / P_out (price per token) not verified from official provider pricing. Founder's usage estimate is "base" — an ASSUMPTION until real usage is observed.

</details>

### How the AI part behaves — Needs work before real use (REQUIRED)

AI can be wrong. You decided: A person reviews and can edit every AI result before it is used or shared.

<details><summary>Technical detail</summary>

- Workstream: AI system design and AIOps/LLMOps
- Why this status: Uses AI.
- Next professional action: Define AI jobs, provider choice behind an interface, an evaluation set, failure fallback and privacy-safe logging.
- Unknowns: Model/provider not chosen. No evaluation set yet.

</details>

### Keeping it running — Assumed, not yet checked (ASSUMPTION)

Pilot users need a way to tell you when something breaks.

<details><summary>Technical detail</summary>

- Workstream: Operations and reliability
- Why this status: Pilot: assumed basic error logging and a way for pilot users to report problems is enough.
- Next professional action: Add error logging and a simple way for pilot users to report problems.
- Unknowns: Who responds to problems (not decided).

</details>

## Running costs

AI costs money every time it runs, so your running cost grows with use. Nobody knows the real number yet; set a spending limit before inviting users.

<details><summary>Technical detail</summary>

- Measured per active user per month. Status: ASSUMPTION.
- Suggested limit: Cap AI requests per user at the high scenario (200/month) and log tokens per request from day one.
- Alert: Alert when monthly AI spend exceeds 1.5 × the base scenario, once real prices are verified.

</details>

## Important

TheDuck wrote these notes from your locked product definition using fixed rules. No qualified technical, security, cost or legal expert has reviewed them, and they are not an approval of any kind.
