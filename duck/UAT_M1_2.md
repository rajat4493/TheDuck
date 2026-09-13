# M1.2 human UAT

Status: **OPEN QUESTION** — zero human approvals recorded.

1. Copy .env.example to .env.local. Set OPENAI_API_KEY and a structured-output-capable OPENAI_MODEL locally; never commit credentials. Run `PORT=4319 npm start` and `npm run verify:live`.
2. Inspect twelve actual live results for missing statements, wrong interpretations, unnecessary questions and invented certainty. Authored fixtures are not semantic evidence.
3. Ask three people to enter unfamiliar ideas. Record raw idea, first reflection, questions, suggestions, corrections, final preview, final lock if approved, misunderstandings, and whether “what I meant, but clearer” is fair. Keep private evidence in ignored duck/evidence/private/.
4. Exercise material answers, misunderstanding corrections and suggestion acceptance/rejection. Confirm decisions survive navigation and the optional single “Reflect my decisions” update.
5. Review desktop/phone layouts, keyboard focus, labels, fidelity, suggestion separation and lock moment. Confirm canonical and pack downloads in your normal browser.
6. Record findings using VERIFIED, IMPLEMENTED NOT VERIFIED, ASSUMPTION, OPEN QUESTION or FAILED. Address M1.2 findings; M2 requires a separate human decision.
