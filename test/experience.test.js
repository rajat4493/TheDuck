import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  createExperience,
  shapeExperience,
  answerExperience,
  chooseSuggestion,
  correctExperience,
  accountStatement,
} from "../src/experience.js";
import { lock, generate, verify } from "../src/intent.js";
const accountAll = (state) =>
  shapeExperience(state)
    .fidelity.filter((r) => r.id !== undefined)
    .reduce((s, r) => accountStatement(s, r.id), state);
const antique = () =>
  createExperience(
    "I want to take a photo of an antique and tell me if it is valuable and why.",
  );
test("M1.1 simple idea shapes without PM questions; interpretation retains its source", async () => {
  let s = createExperience(
    "A private reading journal to remember my books and notes.",
  );
  const shape = shapeExperience(s);
  assert.equal(shape.questions.length, 0);
  assert.equal(shape.model.targetUser, "You, as a reader");
  assert.equal(shape.model.journey.length, 3);
  assert.ok(
    shape.model.constraints.includes("Only the owner can read their notes."),
  );
  const result = await lock({ experience: accountAll(s) }, true);
  assert.equal(result.contract.decisions.journey.kind, "INTERPRETED");
  assert.equal(
    result.contract.decisions.journey.origin,
    "THEDUCK-SUGGESTED + HUMAN-APPROVED",
  );
  assert.ok(
    result.contract.decisions.journey.source.includes("reading journal"),
  );
});
test("M1.1 ambiguous value answer materially changes shape and lock", async () => {
  const s = antique();
  const q = shapeExperience(s).questions;
  assert.equal(q.length, 1);
  assert.equal(q[0].id, "value");
  const a = await lock(
    { experience: accountAll(answerExperience(s, "value", "estimate")) },
    true,
  );
  const b = await lock(
    { experience: accountAll(answerExperience(s, "value", "listings")) },
    true,
  );
  assert.notEqual(a.contract.jtbd, b.contract.jtbd);
  assert.notDeepEqual(a.contract.acceptance, b.contract.acceptance);
  assert.ok(
    b.contract.scope.includes("Actual comparable listings with their sources"),
  );
  assert.ok(
    !a.contract.scope.includes("Actual comparable listings with their sources"),
  );
});
test("M1.1 accept and reject suggestion including reversal: no rejected content in lock or packs", async () => {
  let s = accountAll(answerExperience(antique(), "value", "estimate"));
  const text = shapeExperience(s).proposals[0].value;
  s = chooseSuggestion(s, "another-photo", "accepted");
  const accepted = await lock({ experience: s }, true);
  assert.ok(accepted.contract.acceptance.includes(text));
  assert.equal(
    accepted.contract.acceptedSuggestions[0].origin,
    "THEDUCK-SUGGESTED + HUMAN-APPROVED",
  );
  s = chooseSuggestion(s, "another-photo", "rejected");
  const rejected = await lock({ experience: s }, true);
  const packs = await generate(rejected);
  assert.ok(!JSON.stringify(rejected).includes(text));
  assert.ok(!JSON.stringify(packs).includes(text));
  assert.equal(rejected.contract.acceptedSuggestions.length, 0);
});
test("M1.1 misunderstanding correction preserves choices and changes intended user", async () => {
  let s = chooseSuggestion(
    answerExperience(antique(), "value", "listings"),
    "another-photo",
    "accepted",
  );
  s = correctExperience(
    s,
    "Museum volunteers cataloguing donated antiques",
    "targetUser",
  );
  assert.equal(s.answers.value, "listings");
  assert.equal(s.suggestionChoices["another-photo"], "accepted");
  const sealed = await lock({ experience: accountAll(s) }, true);
  assert.equal(
    sealed.contract.targetUser,
    "Museum volunteers cataloguing donated antiques",
  );
  assert.equal(sealed.contract.decisions.targetUser.origin, "HUMAN");
  assert.ok(!sealed.contract.scope.includes("Museum volunteers cataloguing donated antiques"));
  assert.equal(sealed.contract.acceptedSuggestions.length, 1);
});
test("M1.1 fidelity retains raw statements and prevents lock until missing coverage is reviewed", async () => {
  let s = createExperience(
    "I want to photograph an antique and see roughly what it is worth and why. Also connect it to my secret collection.",
  );
  const shape = shapeExperience(s);
  assert.equal(shape.questions.length, 0);
  assert.ok(
    shape.fidelity.some((r) => r.said === "roughly" || r.said === "rough"),
  );
  assert.ok(
    shape.fidelity.some(
      (r) => r.status === "UNRESOLVED" && r.said.includes("secret collection"),
    ),
  );
  await assert.rejects(lock({ experience: s }, true), /Before locking/);
  s = correctExperience(
    s,
    "Record the result in my personal collection",
    "scope",
  );
  const sealed = await lock({ experience: accountAll(s) }, true);
  assert.ok(
    sealed.contract.fidelity.some((r) => r.said.includes("secret collection")),
  );
  assert.ok(
    sealed.contract.scope.includes(
      "Record the result in my personal collection",
    ),
  );
});
test("M1.1 WOW case preserves photo, value and why; challenges evidence; accepts separate fallback; three consistent packs", async () => {
  const state = accountAll(
    chooseSuggestion(
      answerExperience(antique(), "value", "listings"),
      "another-photo",
      "accepted",
    ),
  );
  const shape = shapeExperience(state);
  const sealed = await lock({ experience: state }, true);
  const result = await generate(sealed);
  assert.ok(shape.model.journey.includes("Review actual comparable listings"));
  assert.ok(
    shape.model.journey.includes("Read why the evidence supports the result"),
  );
  for (const pack of Object.values(result.packs)) {
    for (const field of [
      "definition",
      "targetUser",
      "jtbd",
      "scope",
      "acceptance",
    ])
      assert.deepEqual(pack.identity[field], sealed.contract[field]);
    const text = Object.values(pack.files).join("\n");
    for (const criterion of sealed.contract.acceptance)
      assert.ok(text.includes(criterion));
    assert.ok(text.includes(sealed.fingerprint));
  }
  assert.ok(
    result.packs.founder.files["VAT_UAT.md"].includes(
      "write what you did, what you saw",
    ),
  );
  assert.ok(
    result.packs.builder.files["LOCKED_INTENT.md"].includes("Idea Fidelity"),
  );
});
test("M1.1 keeps M1 drift protections and approval boundary", async () => {
  const s = accountAll(answerExperience(antique(), "value", "estimate"));
  await assert.rejects(lock({ experience: s }, false), /Explicit approval/);
  const sealed = await lock({ experience: s }, true);
  assert.throws(() => sealed.contract.scope.push("Sell user data"), TypeError);
  await assert.rejects(
    generate(sealed, { targetUser: "Buyers of private data" }),
    /overrides are forbidden/,
  );
  const bad = structuredClone(sealed);
  bad.contract.targetUser = "Changed";
  await assert.rejects(verify(bad), /changed or is invalid/);
  s.answers.value = "listings";
  assert.equal(sealed.contract.conversation.answers.value, "estimate");
});
test("M1.1 unknown idea stays unresolved instead of fabricating a complete product", async () => {
  const s = createExperience("A blorple for the flibberty market.");
  assert.equal(shapeExperience(s).model.targetUser, "");
  assert.equal(shapeExperience(s).questions.length, 1);
  await assert.rejects(
    lock({ experience: accountAll(s) }, true),
    /Before locking/,
  );
});
test("M1.1 simple/ambiguous/risky examples never ask more than three material questions", () => {
  for (const idea of [
    "A private reading journal to remember books.",
    "A team leave request app.",
    "A photo antique value guide.",
    "An offline medical app for my clinic.",
  ])
    assert.ok(shapeExperience(createExperience(idea)).questionCount <= 3);
});
test("M1.1 old saved M1 lock fixtures remain readable and generatable", async () => {
  const { envelope } = JSON.parse(
    await readFile(
      new URL("../duck/examples/consumer.json", import.meta.url),
      "utf8",
    ),
  );
  const result = await generate(envelope);
  assert.equal(result.fingerprint, envelope.fingerprint);
});
