import test from "node:test";
import assert from "node:assert/strict";
import {
  understand,
  preview,
  lock,
  generate,
  verify,
  SUGGESTED,
} from "../src/intent.js";
import { examples } from "./fixtures.js";

for (const example of examples)
  test(`${example.name}: idea → questions → preview → lock → three packs`, async () => {
    const draft = { ...understand(example.idea), ...example };
    assert.equal(draft.questions.length, 4);
    const p = preview(draft);
    const sealed = await lock(draft, true);
    const result = await generate(sealed);
    for (const pack of Object.values(result.packs)) {
      for (const field of [
        "definition",
        "targetUser",
        "jtbd",
        "scope",
        "acceptance",
      ])
        assert.deepEqual(pack.identity[field], p[field]);
      for (const content of Object.values(pack.files))
        assert.ok(content.includes(sealed.fingerprint));
      const allText = Object.values(pack.files).join("\n");
      for (const field of [
        "definition",
        "targetUser",
        "jtbd",
        "scope",
        "acceptance",
      ])
        for (const value of Array.isArray(p[field]) ? p[field] : [p[field]])
          assert.ok(allText.includes(value));
    }
    assert.ok(
      result.packs.founder.files["VAT_UAT.md"].includes(example.acceptance[0]),
    );
    assert.equal(result.contract.status, "LOCKED");
  });
test("accepted challenge changes the lock and retains provenance; rejected suggestion does not", async () => {
  const draft = {
    ...understand(examples[2].idea),
    ...examples[2],
    accepted: [],
  };
  const before = await lock(draft, true);
  draft.accepted = ["feasibility"];
  const after = await lock(draft, true);
  assert.equal(
    after.contract.acceptance.length,
    before.contract.acceptance.length + 1,
  );
  assert.equal(after.contract.acceptedSuggestions[0].origin, SUGGESTED);
  assert.ok(
    after.contract.acceptedSuggestions[0].reason.includes("TheDuck suggestion"),
  );
  assert.deepEqual(
    after.contract.decisions.acceptance.value,
    examples[2].acceptance,
  );
});
test("drift: nested mutation, serialized tampering, and generation overrides rejected", async () => {
  const sealed = await lock(
    { ...understand(examples[0].idea), ...examples[0] },
    true,
  );
  assert.throws(() => (sealed.contract.targetUser = "Advertisers"), TypeError);
  assert.throws(() => sealed.contract.scope.push("Sell user data"), TypeError);
  await assert.rejects(
    generate(sealed, { targetUser: "Advertisers" }),
    /overrides are forbidden/,
  );
  const tampered = JSON.parse(JSON.stringify(sealed));
  tampered.contract.jtbd = "Sell ads";
  await assert.rejects(generate(tampered), /changed or is invalid/);
  await assert.rejects(verify(tampered), /changed or is invalid/);
  assert.equal(
    (await generate(sealed)).contract.targetUser,
    examples[0].targetUser,
  );
});
test("lock requires explicit approval and a complete preview", async () => {
  await assert.rejects(
    lock({ ...understand(examples[0].idea), ...examples[0] }, false),
    /Explicit approval/,
  );
  await assert.rejects(
    lock(understand("A new journal"), true),
    /Please complete/,
  );
  assert.throws(() => understand(""), /8–5,000/);
});
test("lock is independent of draft changes and can round-trip as portable JSON", async () => {
  const draft = { ...understand(examples[1].idea), ...examples[1] };
  const sealed = await lock(draft, true);
  draft.targetUser = "Someone else";
  const restored = await verify(JSON.parse(JSON.stringify(sealed)));
  assert.equal(restored.contract.targetUser, examples[1].targetUser);
  assert.deepEqual(await generate(restored), await generate(sealed));
});
test("caller cannot inject a fabricated suggestion as approved provenance", () => {
  const draft = {
    ...understand(examples[0].idea),
    ...examples[0],
    suggestions: [{ id: "evil", field: "scope", value: "Sell personal data" }],
    accepted: ["evil"],
  };
  assert.equal(preview(draft).acceptedSuggestions.length, 0);
});

test("question rules do not confuse incidental letters with AI and do not fabricate owner assumptions", () => {
  const plain = understand("A plain reading journal for rainy days");
  assert.equal(plain.suggestions.length, 1);
  assert.deepEqual(plain.assumptions, []);
  assert.equal(understand("An AI plant field guide").suggestions.length, 2);
});
