import { writeFile } from "node:fs/promises";
import { understand, lock, generate } from "../src/intent.js";
import { examples } from "../test/fixtures.js";
for (const example of examples) {
  const envelope = await lock(
    { ...understand(example.idea), ...example },
    true,
  );
  const bundle = await generate(envelope);
  const artifact = {
    note: "Synthetic M1 test scenario. Approval is simulated, not a product-owner decision.",
    envelope,
    bundle,
  };
  await writeFile(
    new URL(`../duck/examples/${example.name}.json`, import.meta.url),
    JSON.stringify(artifact, null, 2) + "\n",
  );
  console.log(
    `${example.name}: ${envelope.fingerprint}; ${Object.keys(bundle.packs).length} packs; ${envelope.contract.acceptedSuggestions.length} accepted suggestions`,
  );
}
