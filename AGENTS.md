# TheDuck Coding-Agent Contract

Read `docs/PRODUCT_INTENT_LOCKED_V1.md` first. It is authoritative.

## Core rule

Challenge before lock. Protect after lock.

Do not silently reinterpret or broaden the locked product.

## Before changing code

1. identify the current milestone in `duck/MILESTONES.md`;
2. read the locked intent and relevant artifact model;
3. state what you intend to change and why;
4. classify any material product-affecting change as `HUMAN`, `THEDUCK-SUGGESTED + HUMAN-APPROVED`, `IMPLEMENTATION-NECESSARY`, or `EVIDENCE-DISCOVERED`;
5. if a change would alter locked product intent, stop and create a human-facing Change Proposal instead of implementing it silently.

## During implementation

- remain on the current JTBD path;
- prefer the smallest implementation that proves the milestone;
- do not add SaaS features, integrations or architecture merely because they seem useful;
- separate facts from assumptions;
- preserve portability of the canonical artifacts;
- do not make downstream platform adapters into separate sources of truth.

## Verification honesty

Use only these evidence states:

- VERIFIED
- IMPLEMENTED NOT VERIFIED
- ASSUMPTION
- OPEN QUESTION
- FAILED

Never claim `works`, `tested`, `passes`, `validated`, or `production ready` without observed evidence for that exact claim.

## GitHub checkpoint rule

At every agreed milestone:

1. commit and push implementation;
2. update `/duck` state;
3. record real verification evidence;
4. update blockers/assumptions/open questions where relevant;
5. update `duck/HANDOFF.md` so a different coding agent can continue without chat history;
6. declare the exact next action;
7. stop if human approval is required before the next milestone.

## Handoff rule

Assume your session may end unexpectedly. Keep the repository understandable to another coding agent at all times.
