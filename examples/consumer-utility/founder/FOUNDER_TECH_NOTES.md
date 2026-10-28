<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:5fabde37258c5beeab07abc4fc812eabec1a559cb44521e82fc0ed599bb6a1b7 pack=founder file=FOUNDER_TECH_NOTES.md -->
> Made from your locked product definition (version 1, fingerprint `5fabde37258c`). If anything here looks different from what you approved, the locked version wins.

# What you should know as the owner

These notes turn the professional checklist into what it means for you. Most important first.

### Checking it does what you approved — Still undecided (OPEN QUESTION)

Some of your checks are not precise enough to test yet. Your builder must make them precise with you before calling anything done.

<details><summary>Technical detail</summary>

- Workstream: Quality and release engineering
- Why this status: 2 locked acceptance criteria; 4 draft verification candidate(s) not yet testable; no evidence yet.
- Next professional action: Refine the 4 draft verification candidate(s) with the product owner into testable criteria, then automate checks for all acceptance criteria and record evidence per criterion.
- Unknowns: Nothing is built, so there is no evidence yet. VC-01: the expected result, what happens on error, limits (sizes, formats, timing) not defined. VC-02: the expected result, what happens on error, limits (sizes, formats, timing) not defined. VC-03: the expected result, what happens on error, limits (sizes, formats, timing) not defined. VC-04: the expected result, what happens on error, limits (sizes, formats, timing) not defined.

</details>

### The experience for your users — Needs work before real use (REQUIRED)

Nobody has tried the journey yet. Watching a few real people use it is the cheapest way to find problems.

<details><summary>Technical detail</summary>

- Workstream: Product and UX
- Why this status: Always required.
- Next professional action: Turn the 4-step main journey into screen flows and watch 3–5 people from the target group try them.
- Unknowns: No one has tried the journey yet.

</details>

### How it is put together — Needs work before real use (REQUIRED)

Keep the technology simple — this is a demo.

<details><summary>Technical detail</summary>

- Workstream: Solution architecture
- Why this status: Stage is demo.
- Next professional action: Choose the simplest stack and hosting that can show the main journey; record the choice in an ADR.
- Unknowns: Stack and hosting not chosen.

</details>

### Information and connected services — Assumed, not yet checked (ASSUMPTION)

It does not depend on outside services, as far as we know.

<details><summary>Technical detail</summary>

- Workstream: Data and integrations
- Why this status: No connected services named and no personal information confirmed; assumed simple data only.
- Next professional action: Define the data the product stores and where it lives.
- Unknowns: Where data is stored (not chosen).

</details>

### Keeping people's information safe — Assumed, not yet checked (ASSUMPTION)

Low risk — as long as it really never collects sensitive information.

<details><summary>Technical detail</summary>

- Workstream: Security and privacy
- Why this status: Not asked: assumed no sensitive or regulated information (ASSUMPTION).
- Next professional action: Confirm what information it holds; until then apply basic hygiene: dependency updates, no secrets in code, HTTPS.
- Unknowns: What information it holds (not confirmed).

</details>

### Running costs — Assumed, not yet checked (ASSUMPTION)

Running costs should be low (hosting and storage only), but this is an assumption — no prices have been checked.

<details><summary>Technical detail</summary>

- Workstream: FinOps / cost model
- Why this status: No AI confirmed and not production: expected low running cost (hosting and storage only) — not measured.
- Next professional action: Replace the symbolic cost model with verified provider prices (record source and date) and set a spending alert.
- Unknowns: No provider prices have been checked. All prices are symbols, not numbers. Hosting provider and plan not chosen.

</details>

### How the AI part behaves — Assumed, not yet checked (ASSUMPTION)

TheDuck assumes there is no AI in the product. Tell us if that is wrong.

<details><summary>Technical detail</summary>

- Workstream: AI system design and AIOps/LLMOps
- Why this status: AI was not mentioned; assumed not used (ASSUMPTION).
- Next professional action: None unless AI is added through an approved Change Proposal.
- Unknowns: none recorded.

</details>

### Keeping it running — Not needed for this product right now (NOT APPLICABLE)

It is a demo, so it does not need round-the-clock monitoring yet.

<details><summary>Technical detail</summary>

- Workstream: Operations and reliability
- Why this status: Demo only: no one relies on it staying up.
- Next professional action: Revisit if the demo becomes a pilot.
- Unknowns: none recorded.

</details>

## Running costs

Running costs should be low (hosting and storage only), but this is an assumption — no prices have been checked.

<details><summary>Technical detail</summary>

- Measured per month for the whole product. Status: ASSUMPTION.
- Suggested limit: Choose a hosting plan with a fixed monthly cap or a budget limit.
- Alert: Alert at the hosting plan's monthly price + 50%.

</details>

## Important

TheDuck wrote these notes from your locked product definition using fixed rules. No qualified technical, security, cost or legal expert has reviewed them, and they are not an approval of any kind.
