import { mkdir, writeFile } from "node:fs/promises";
import { corpus } from "../test/fixtures/semantic-corpus.js";
import {
  createSemanticExperience,
  acceptInterpretation,
  shapeSemantic,
} from "../src/semantic.js";
import {
  createOpenAIProvider,
  createUnderstandingService,
  providerStatus,
  interpreterPrompt,
  buildInput,
} from "../src/provider.mjs";
import { answerExperience } from "../src/experience.js";
import { lock, generate } from "../src/intent.js";
const folder = new URL("../duck/evidence/m1-2/", import.meta.url);
await mkdir(folder, { recursive: true });
const status = providerStatus();
const report = {
  recordedAt: new Date().toISOString(),
  provider: status.name,
  model: status.model,
  liveCalls: 0,
  state: "IMPLEMENTED NOT VERIFIED",
  cases: [],
};
if (!status.configured) {
  report.reason =
    "OPENAI_API_KEY and OPENAI_MODEL are not both configured. No live model call was made. Fixture tests are not semantic evidence.";
} else {
  const service = createUnderstandingService(createOpenAIProvider());
  for (const item of corpus) {
    const state = createSemanticExperience(item.idea),
      entry = {
        id: item.id,
        rawIdea: item.idea,
        prompt: interpreterPrompt,
        input: buildInput(state),
      };
    try {
      report.liveCalls++;
      const response = await service.understandIdea(state);
      entry.response = response;
      let draft = acceptInterpretation(state, response);
      entry.firstReflection = shapeSemantic(draft);
      // Only option answers can be exercised without inventing free-text owner choices.
      entry.syntheticAnswers = [];
      for (const q of entry.firstReflection.questions)
        if (q.options.length) {
          draft = answerExperience(draft, q.id, q.options[0].id);
          entry.syntheticAnswers.push({
            question: q.title,
            answer: q.options[0].label,
          });
        }
      entry.finalPreview = shapeSemantic(draft);
      entry.corrections = [];
      if (!entry.finalPreview.blocking.length) {
        entry.lock = await lock({ experience: draft }, true);
        entry.packs = await generate(entry.lock);
      }
      entry.state = "VERIFIED";
      entry.limit =
        "Live execution and schema observed; synthetic test approval, not human UAT or a semantic-quality pass.";
    } catch (error) {
      entry.state = "FAILED";
      entry.error = error.code || "VALIDATION_OR_NETWORK_FAILURE";
    }
    report.cases.push(entry);
    await writeFile(
      new URL("live.json", folder),
      JSON.stringify(report, null, 2) + "\n",
    );
  }
  report.state = report.cases.every((c) => c.state === "VERIFIED")
    ? "VERIFIED"
    : "FAILED";
}
await writeFile(
  new URL("live.json", folder),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    state: report.state,
    model: report.model,
    liveCalls: report.liveCalls,
    reason: report.reason,
    cases: report.cases.length,
  }),
);
