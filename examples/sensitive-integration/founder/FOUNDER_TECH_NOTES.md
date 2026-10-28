<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c038f4d788b4aa5ff7eb9e27611871e482eb40bdd564bdf8406fe2a1d71f038c pack=founder file=FOUNDER_TECH_NOTES.md -->
> Made from your locked product definition (version 1, fingerprint `c038f4d788b4`). If anything here looks different from what you approved, the locked version wins.

# What you should know as the owner

These notes turn the professional checklist into what it means for you. Most important first.

### Checking it does what you approved — Still undecided (OPEN QUESTION)

Some of your checks are not precise enough to test yet. Your builder must make them precise with you before calling anything done.

<details><summary>Technical detail</summary>

- Workstream: Quality and release engineering
- Why this status: 5 locked acceptance criteria; 4 draft verification candidate(s) not yet testable; no evidence yet.
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

Real people will use it, so how it is hosted and backed up matters.

<details><summary>Technical detail</summary>

- Workstream: Solution architecture
- Why this status: Stage is production.
- Next professional action: Write an ADR covering hosting, data storage, backups, environments and how integrations connect.
- Unknowns: Stack and hosting not chosen.

</details>

### Information and connected services — Needs work before real use (REQUIRED)

It depends on "The clinic's practice management system — the source of each patient's exercise plan". If that changes or goes down, your product is affected.

<details><summary>Technical detail</summary>

- Workstream: Data and integrations
- Why this status: Holds personal information and/or depends on connected services.
- Next professional action: Confirm the provider, access, limits, terms and costs for: The clinic's practice management system — the source of each patient's exercise plan.
- Unknowns: Whether "The clinic's practice management system — the source of each patient's exercise plan" offers the access needed (not checked).

</details>

### Keeping people's information safe — Needs work before real use (REQUIRED)

Do not put real people's sensitive information in until a qualified person has reviewed it.

<details><summary>Technical detail</summary>

- Workstream: Security and privacy
- Why this status: Handles sensitive or regulated information.
- Next professional action: A qualified security/privacy reviewer assesses data handling and which regulations apply before any real data is used.
- Unknowns: Which regulations apply (not assessed).

</details>

### Keeping it running — Needs work before real use (REQUIRED)

People will rely on it — someone must notice and fix outages.

<details><summary>Technical detail</summary>

- Workstream: Operations and reliability
- Why this status: Real users will rely on it.
- Next professional action: Define uptime expectations, monitoring, alerts, backups and who responds.
- Unknowns: Who responds to problems (not decided).

</details>

### Running costs — Needs work before real use (REQUIRED)

Running costs should be low (hosting and storage only), but this is an assumption — no prices have been checked.

<details><summary>Technical detail</summary>

- Workstream: FinOps / cost model
- Why this status: Uses AI and/or will run in production; costs need a model and limits.
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

## Running costs

Running costs should be low (hosting and storage only), but this is an assumption — no prices have been checked.

<details><summary>Technical detail</summary>

- Measured per month for the whole product. Status: ASSUMPTION.
- Suggested limit: Choose a hosting plan with a fixed monthly cap or a budget limit.
- Alert: Alert at the hosting plan's monthly price + 50%.

</details>

## Important

TheDuck wrote these notes from your locked product definition using fixed rules. No qualified technical, security, cost or legal expert has reviewed them, and they are not an approval of any kind.
