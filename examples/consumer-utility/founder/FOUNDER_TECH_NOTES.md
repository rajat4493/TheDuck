<!-- theduck:rendering project=prj-0001 lock=v1 fingerprint=sha256:c18ef76142175bb618e17b826e291cc1dcc51533ae1c012a57db31b9565ceddb pack=founder file=FOUNDER_TECH_NOTES.md -->
> Made from your locked product definition (version 1, fingerprint `c18ef7614217`). If anything here looks different from what you approved, the locked version wins.

# What you should know as the owner

These notes turn the professional checklist into what it means for you. Most important first.

### The experience for your users — Needs work before real use (REQUIRED)

Nobody has tried the journey yet. Watching a few real people use it is the cheapest way to find problems.

<details><summary>Technical detail</summary>

- Workstream: Product and UX
- Why this status: Always required.
- Next professional action: Turn the 4-step main journey into screen flows and watch 3–5 real Busy home cooks who do one big weekly shop try them.
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

### Checking it does what you approved — Needs work before real use (REQUIRED)

You have a checklist (VAT_UAT) to try yourself before anyone calls it done.

<details><summary>Technical detail</summary>

- Workstream: Quality and release engineering
- Why this status: 6 acceptance criteria locked; no evidence yet.
- Next professional action: Automate checks for the 6 acceptance criteria and record evidence per criterion.
- Unknowns: Nothing is built, so there is no evidence yet.

</details>

### Information and connected services — Assumed, not yet checked (ASSUMPTION)

It does not depend on outside services, as far as we know.

<details><summary>Technical detail</summary>

- Workstream: Data and integrations
- Why this status: Founder said no personal information and no connected services; assumed simple data only.
- Next professional action: Define the data the product stores and where it lives.
- Unknowns: Where data is stored (not chosen).

</details>

### Keeping people's information safe — Assumed, not yet checked (ASSUMPTION)

Low risk — as long as it really never collects personal information.

<details><summary>Technical detail</summary>

- Workstream: Security and privacy
- Why this status: Founder said no personal information; assumed basic security hygiene only.
- Next professional action: Basic hygiene: dependency updates, no secrets in code, HTTPS.
- Unknowns: none recorded.

</details>

### Running costs — Assumed, not yet checked (ASSUMPTION)

Running costs should be low (hosting and storage only), but this is an assumption — no prices have been checked.

<details><summary>Technical detail</summary>

- Workstream: FinOps / cost model
- Why this status: No AI and not production: expected low running cost (hosting and storage only) — not measured.
- Next professional action: Replace the symbolic cost model with verified provider prices (record source and date) and set a spending alert.
- Unknowns: No provider prices have been checked. All prices are symbols, not numbers. Hosting provider and plan not chosen.

</details>

### Keeping it running — Not needed for this product right now (NOT APPLICABLE)

It is a demo, so it does not need round-the-clock monitoring yet.

<details><summary>Technical detail</summary>

- Workstream: Operations and reliability
- Why this status: Demo only: no one relies on it staying up.
- Next professional action: Revisit if the demo becomes a pilot.
- Unknowns: none recorded.

</details>

### How the AI part behaves — Not needed for this product right now (NOT APPLICABLE)

No AI in the product, so no AI-specific risk.

<details><summary>Technical detail</summary>

- Workstream: AI system design and AIOps/LLMOps
- Why this status: The founder said the product does not use AI.
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
