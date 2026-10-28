# TheDuck — cost hypothesis

State: **ASSUMPTION**. No provider price has been checked against official documentation; none is stated.

Last updated: 2026-10-28 (M1.1).

## M1.1 (now)

- External runtime spend: **zero**. No AI calls, no hosting, no paid services, no accounts.
- Cost drivers today: a developer machine and disk (negligible; not measured).
- Dev dependencies are open-source packages from npm (no licence fees).

## Future cost drivers (if approved later)

| Driver | Unit | Notes |
|---|---|---|
| LLM calls during refinement | per refinement question | Only if an LLM provider is approved after M1.2. |
| LLM calls for pack drafting | per locked project | Not planned: packs are rendered deterministically. |
| Hosting | per month | Only if a hosted version is approved. |
| Storage | per locked project | Small JSON documents; immutable lock versions accumulate. |

## Symbolic model (LLM refinement, if ever added)

Cost per locked project ≈ Q × (T_in × P_in + T_out × P_out)

| Scenario | Q (questions with an LLM call) | Note |
|---|---|---|
| low | 8 | ASSUMPTION |
| base | 13 | M1.1 fixtures asked 12–14 questions (VERIFIED by fixture runs) |
| high | 25 | retries / re-asks; ASSUMPTION |

Unknowns: T_in / T_out (tokens per call) not measured; P_in / P_out not verified;
provider not chosen.

## Guardrail recommendation

- Before adding any LLM: a hard cap on calls per project (suggest 2 × base Q) and
  per-run logging of tokens and estimated cost.
- Future alert threshold: alert when cost per locked project exceeds 1.5 × the
  base scenario, once prices are verified and dated.
