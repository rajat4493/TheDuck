import { describe, expect, it } from "vitest";
import {
  BUILDER_FILES,
  FOUNDER_FILES,
  PROFESSIONAL_FILES,
  UNIVERSAL_FILE,
  checkPackConsistency,
  computeFingerprint,
  currentLock,
  renderAllPacks,
} from "../src/core/index.ts";
import { ALL_FIXTURES } from "../fixtures/ideas.ts";
import { refineAndLock } from "../fixtures/run-session.ts";

describe("Exit criterion 1 — three materially different ideas complete the flow end to end", () => {
  it.each(ALL_FIXTURES.map((f) => [f.key, f] as const))("%s: idea → questions → lock → four packs", (_k, f) => {
    const project = refineAndLock(f);
    const lock = currentLock(project)!;
    expect(project.status).toBe("locked");
    expect(lock.version).toBe(1);
    expect(computeFingerprint(lock)).toBe(lock.fingerprint);
    expect(project.refinement.asked.length).toBeGreaterThanOrEqual(5);
    expect(project.refinement.asked.length).toBeLessThanOrEqual(8);

    const packs = renderAllPacks(project);
    expect(packs.founder.files.map((x) => x.name)).toEqual([...FOUNDER_FILES]);
    expect(packs.builder.files.map((x) => x.name)).toEqual([...BUILDER_FILES]);
    expect(packs.professional.files.map((x) => x.name)).toEqual([...PROFESSIONAL_FILES]);
    expect(packs.universal.files.map((x) => x.name)).toEqual([UNIVERSAL_FILE]);
  });

  it("the three ideas produce materially different locks", () => {
    const locks = ALL_FIXTURES.map((f) => currentLock(refineAndLock(f))!);
    const profiles = locks.map((l) => [l.intent.stage, l.intent.dataSensitivity, l.intent.usesAI].join("/"));
    expect(new Set(profiles).size).toBe(3);
    expect(new Set(locks.map((l) => l.fingerprint)).size).toBe(3);
  });
});

describe("Exit criterion 4 — all packs derive from the same lock and stay consistent", () => {
  it.each(ALL_FIXTURES.map((f) => [f.key, f] as const))("%s: no consistency problems", (_k, f) => {
    const project = refineAndLock(f);
    const lock = currentLock(project)!;
    const packs = renderAllPacks(project);
    for (const pack of Object.values(packs)) {
      expect(pack.lockFingerprint).toBe(lock.fingerprint);
      expect(pack.lockVersion).toBe(1);
    }
    expect(checkPackConsistency(packs, lock)).toEqual([]);
  });

  it("rendering is deterministic: same session, same packs", () => {
    const f = ALL_FIXTURES[1]!;
    const a = renderAllPacks(refineAndLock(f));
    const b = renderAllPacks(refineAndLock(f));
    expect(a).toEqual(b);
  });

  it("the consistency check catches a pack that disagrees", () => {
    const project = refineAndLock(ALL_FIXTURES[0]!);
    const lock = currentLock(project)!;
    const packs = renderAllPacks(project);
    const f = packs.builder.files.find((x) => x.name === "SCOPE.md")!;
    f.content = f.content.replace("Recipe suggestions", "Recipe suggestions are fine");
    const problems = checkPackConsistency(packs, lock);
    expect(problems.some((p) => p.includes("SCOPE.md: content changed after TheDuck rendered it"))).toBe(true);
  });
});
