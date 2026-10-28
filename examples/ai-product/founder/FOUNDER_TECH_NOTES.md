<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:0db8680577a98167d1676dc2be0e8e48c7e0ba0ae1f911a7d565c3f13ea99743 pack=founder file=FOUNDER_TECH_NOTES.md -->
> Made from your locked product definition (version 1, fingerprint `0db8680577a9`). If anything here looks different from what you approved, the locked version wins.

# What you should know as the owner

These notes turn the professional checklist into what it means for you. Most important first.

### The experience for your users — Still undecided (OPEN QUESTION)

Nobody has tried the journey yet. Watching a few real people use it is the cheapest way to find problems.

<details><summary>Technical detail</summary>

- Workstream: Product and UX
- Why this status: 1 product decision(s) still open.
- Next professional action: Turn the 4-step main journey into screen flows and watch 3–5 people from the target group try them.
- Unknowns: No one has tried the journey yet. Set the maximum acceptable AI cost per episode.

</details>

### Information and connected services — Still undecided (OPEN QUESTION)

It depends on "A speech-to-text and AI writing service — to transcribe the episode and draft the text". If that changes or goes down, your product is affected.

<details><summary>Technical detail</summary>

- Workstream: Data and integrations
- Why this status: A connected service, its provider, its failure behaviour or the kind of data held is still undecided.
- Next professional action: Confirm the provider, access, limits, terms and costs for: A speech-to-text and AI writing service — to transcribe the episode and draft the text.
- Unknowns: Whether "A speech-to-text and AI writing service — to transcribe the episode and draft the text" offers the access needed (not checked).

</details>

### Checking it does what you approved — Still undecided (OPEN QUESTION)

Some of your checks are not precise enough to test yet. Your builder must make them precise with you before calling anything done.

<details><summary>Technical detail</summary>

- Workstream: Quality and release engineering
- Why this status: 3 locked acceptance criteria; 5 draft verification candidate(s) not yet testable; no evidence yet.
- Next professional action: Refine the 5 draft verification candidate(s) with the product owner into testable criteria, then automate checks for all acceptance criteria and record evidence per criterion.
- Unknowns: Nothing is built, so there is no evidence yet. VC-01: the expected result, what happens on error, limits (sizes, formats, timing) not defined. VC-02: the expected result, what happens on error, limits (sizes, formats, timing) not defined. VC-03: the expected result, what happens on error, limits (sizes, formats, timing) not defined. VC-04: the expected result, what happens on error, limits (sizes, formats, timing) not defined. VC-05: It depends on "agreed cost limit", which has not been decided. not defined.

</details>

### Running costs — Still undecided (OPEN QUESTION)

AI costs money every time it runs, so your running cost grows with use. Nobody knows the real number yet; set a spending limit before inviting users.

<details><summary>Technical detail</summary>

- Workstream: FinOps / cost model
- Why this status: A cost limit or usage estimate is still undecided.
- Next professional action: Replace the symbolic cost model with verified provider prices (record source and date) and set a spending alert.
- Unknowns: No provider prices have been checked. All prices are symbols, not numbers. Hosting provider and plan not chosen. Founder cost limit not set: Set the maximum acceptable AI cost per episode. (OPEN QUESTION) T_in / T_out (tokens per request) not measured. P_in / P_out (price per token) not verified from official provider pricing. Usage per person not estimated yet (OPEN QUESTION); scenarios below are placeholders.

</details>

### How it is put together — Needs work before real use (REQUIRED)

Real people will use it, so how it is hosted and backed up matters.

<details><summary>Technical detail</summary>

- Workstream: Solution architecture
- Why this status: Stage is pilot.
- Next professional action: Write an ADR covering hosting, data storage, backups, environments and how integrations connect.
- Unknowns: Stack and hosting not chosen.

</details>

### Keeping people's information safe — Needs work before real use (REQUIRED)

It stores people's personal details, so it needs basic protection and a privacy notice.

<details><summary>Technical detail</summary>

- Workstream: Security and privacy
- Why this status: Handles basic personal details.
- Next professional action: Basic protections: sign-in, access limits, a privacy notice and deletion on request.
- Unknowns: none recorded.

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
- Suggested limit: Use the founder's maximum acceptable cost (once set) as a hard limit per unit; cap AI requests per user and log tokens per request from day one.
- Alert: Alert when monthly AI spend exceeds 1.5 × the base scenario, once real prices are verified.

</details>

## Important

TheDuck wrote these notes from your locked product definition using fixed rules. No qualified technical, security, cost or legal expert has reviewed them, and they are not an approval of any kind.
