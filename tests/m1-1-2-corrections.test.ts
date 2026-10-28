/** M1.1.2 — three narrow corrections from owner review of M1.1.1 output. */
import { describe, expect, it } from "vitest";
import { currentLock, deriveOpenItems, renderAllPacks } from "../src/core/index.ts";
import type { Pack } from "../src/core/index.ts";
import { ALL_FIXTURES, physioPath, showNotes } from "../fixtures/ideas.ts";
import { refineAndLock } from "../fixtures/run-session.ts";

const get = (p: Pack, name: string) => p.files.find((f) => f.name === name)!.content;
const RULE = "Must not use uploaded audio to train AI models.";

describe("M1.1.2-1 — founder grammar", () => {
  it.each(ALL_FIXTURES.map((f) => [f.key, f] as const))("%s: no 'you approves' (or similar) in founder text", (_k, f) => {
    for (const file of renderAllPacks(refineAndLock(f)).founder.files) {
      expect(file.content, file.name).not.toMatch(/\byou (approves|decides|chooses|proposes)\b/);
    }
  });

  it("REGRESSION: the provider question reads 'you approve'", () => {
    const building = get(renderAllPacks(refineAndLock(showNotes("review"))).founder, "WHAT_YOU_ARE_BUILDING.md");
    expect(building).toContain("A builder or professional proposes options; you approve.");
  });
});

describe("M1.1.2-2 — a no-training rule is a locked policy with a conditional verification", () => {
  const project = refineAndLock(showNotes("review"));
  const lock = currentLock(project)!;
  const packs = renderAllPacks(project);
  const ac = lock.intent.acceptanceCriteria.find((a) => a.statement.includes("use uploaded audio to train AI models"))!;

  it("the founder's locked rule is kept, worded as a prohibition", () => {
    expect(lock.intent.mustNot.map((m) => m.text)).toContain("Use uploaded audio to train AI models");
    expect(get(packs.founder, "WHAT_YOU_ARE_BUILDING.md")).toContain(`- ${RULE}`);
    expect(get(packs.builder, "SCOPE.md")).toContain(`- ${RULE}`);
  });

  it("its acceptance criterion covers only the product itself and carries a verification condition", () => {
    expect(ac.statement).toBe("When any part of the product itself attempts to use uploaded audio to train AI models, the system shall prevent it.");
    expect(ac.statement).not.toMatch(/any user or process|connected service/);
    expect(ac.verificationCondition).toMatch(/^Cannot be marked VERIFIED until the outside provider is chosen and its data-use terms and configuration have been checked/);
    expect(ac.verificationCondition).toContain("A test of the product alone does not prove what a provider does with the data.");
  });

  it("the open professional requirement is shown in every audience's pack", () => {
    const q = `Check the chosen provider's data-use terms and settings for this rule: "${RULE}"`;
    expect(deriveOpenItems(lock.intent).professional.map((p) => p.question)).toContain(q);
    expect(get(packs.founder, "WHAT_YOU_ARE_BUILDING.md")).toContain(q);
    expect(get(packs.founder, "CURRENT_OUTCOME.md")).toContain(q);
    expect(get(packs.builder, "CONSTRAINTS.md")).toContain(`Professional question: ${q}`);
    expect(get(packs.professional, "PRODUCT_TEAM_HANDOVER.md")).toContain(q);
    expect(get(packs.universal, "UNIVERSAL_BUILDER_HANDOVER.md")).toContain(`Professional question: ${q}`);
  });

  it("builder and handover packs show the condition next to the criterion; the founder check is honest", () => {
    const acFile = get(packs.builder, "ACCEPTANCE_CRITERIA.md");
    expect(acFile).toContain(`- **Verification condition:** ${ac.verificationCondition}`);
    expect(acFile).toContain("- **Status:** OPEN QUESTION until the provider is chosen and checked");
    expect(get(packs.universal, "UNIVERSAL_BUILDER_HANDOVER.md")).toContain(`  - Condition: ${ac.verificationCondition}`);
    expect(get(packs.professional, "PRODUCT_TEAM_HANDOVER.md")).toContain(`  - Condition: ${ac.verificationCondition}`);
    expect(get(packs.founder, "VAT_UAT.md")).toContain("You cannot fully check this one yourself, because it depends on the outside provider you choose. Ask your builder to show you that provider's terms and settings proving it will not use uploaded audio to train AI models, and when they were checked.");
  });

  it("rules the product fully controls stay unconditional", () => {
    const i = currentLock(refineAndLock(physioPath))!.intent;
    const showOther = i.acceptanceCriteria.find((a) => a.statement.includes("show one patient's information"))!;
    expect(showOther.verificationCondition).toBeUndefined();
    expect(showOther.statement).toMatch(/^When any user or process attempts to/);
  });
});

describe("M1.1.2-3 — an unresolved success check is labelled, not listed as a completion criterion", () => {
  it("REGRESSION: the cost check is labelled 'A success check awaiting your decision'", () => {
    const building = get(renderAllPacks(refineAndLock(showNotes("review"))).founder, "WHAT_YOU_ARE_BUILDING.md");
    const done = building.slice(building.indexOf("## How you will know it is done"), building.indexOf("## What kind of product"));
    expect(done).toContain("- Five podcasters use it on a real episode and say they would use it again");
    expect(done).toContain(
      '- A success check awaiting your decision: The AI cost of one episode stays under the agreed cost limit (it cannot be used to decide "done" until you decide — see "Still waiting for you")',
    );
    expect(done).not.toMatch(/^- The AI cost of one episode stays under the agreed cost limit$/m);
  });
});
