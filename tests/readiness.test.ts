import { describe, expect, it } from "vitest";
import { READINESS_STATES, currentLock, deriveDeliveryProfile, renderAllPacks } from "../src/core/index.ts";
import type { WorkstreamId } from "../src/core/index.ts";
import { freshNudge, physioPath, showNotes } from "../fixtures/ideas.ts";
import { refineAndLock } from "../fixtures/run-session.ts";

const IDS: WorkstreamId[] = [
  "product_ux",
  "architecture",
  "data_integrations",
  "security_privacy",
  "quality_release",
  "operations",
  "finops",
  "ai_aiops",
];

const profileOf = (f: Parameters<typeof refineAndLock>[0]) => deriveDeliveryProfile(currentLock(refineAndLock(f))!.intent);
const status = (p: ReturnType<typeof profileOf>, id: WorkstreamId) => p.rows.find((r) => r.id === id)!.status;

describe("Delivery profile and readiness matrix (Clarification 001)", () => {
  it.each([
    ["consumer-utility", freshNudge],
    ["ai-product", showNotes("review")],
    ["sensitive-integration", physioPath],
  ] as const)("%s: all eight workstreams present with honest states and full detail", (_k, f) => {
    const p = profileOf(f);
    expect(p.rows.map((r) => r.id)).toEqual(IDS);
    for (const r of p.rows) {
      expect(READINESS_STATES).toContain(r.status);
      // Nothing is built, so nothing can be implemented or verified.
      expect(["VERIFIED", "IMPLEMENTED_NOT_VERIFIED"]).not.toContain(r.status);
      expect(r.whyItMatters.length).toBeGreaterThan(0);
      expect(r.nextProfessionalAction.length).toBeGreaterThan(0);
      expect(r.founderConsequence.length).toBeGreaterThan(0);
      expect(r.basis.length).toBeGreaterThan(0);
    }
    expect(p.disclaimer).toMatch(/not been reviewed by a qualified/);
  });

  it("profiles differ where the products differ", () => {
    const utility = profileOf(freshNudge);
    const ai = profileOf(showNotes("review"));
    const sensitive = profileOf(physioPath);

    expect(status(utility, "ai_aiops")).toBe("NOT_APPLICABLE");
    expect(status(utility, "operations")).toBe("NOT_APPLICABLE");
    expect(status(utility, "security_privacy")).toBe("ASSUMPTION");
    expect(status(utility, "finops")).toBe("ASSUMPTION");

    expect(status(ai, "ai_aiops")).toBe("REQUIRED");
    expect(status(ai, "finops")).toBe("REQUIRED");
    expect(ai.ai).not.toBeNull();

    expect(status(sensitive, "security_privacy")).toBe("REQUIRED");
    expect(status(sensitive, "operations")).toBe("REQUIRED");
    expect(status(sensitive, "data_integrations")).toBe("REQUIRED");
    expect(sensitive.ai).toBeNull();
  });

  it("the cost hypothesis is symbolic: no unverified prices, explicit unknowns, a guardrail", () => {
    for (const f of [freshNudge, showNotes("review"), physioPath]) {
      const c = profileOf(f).cost;
      expect(c.state).toBe("ASSUMPTION");
      expect(c.verifiedPrices).toEqual([]);
      expect(c.scenarios.map((s) => s.name)).toEqual(["low", "base", "high"]);
      expect(c.unknowns.join(" ")).toMatch(/No provider prices have been checked/);
      expect(c.guardrail.length).toBeGreaterThan(0);
      expect(c.alertThreshold.length).toBeGreaterThan(0);
      expect(JSON.stringify(c)).not.toMatch(/[$€£]\s?\d/);
    }
    expect(profileOf(showNotes("review")).cost.drivers.join(" ")).toMatch(/AI model calls/);
  });

  it("not-applicable workstreams are shown, not omitted, in both packs", () => {
    const packs = renderAllPacks(refineAndLock(freshNudge));
    const dr = packs.professional.files.find((f) => f.name === "DELIVERY_READINESS.md")!.content;
    const tn = packs.founder.files.find((f) => f.name === "FOUNDER_TECH_NOTES.md")!.content;
    expect(dr).toContain("| AI system design and AIOps/LLMOps | NOT APPLICABLE |");
    expect(tn).toContain("How the AI part behaves — Not needed for this product right now (NOT APPLICABLE)");
  });

  it("an undecided AI failure behaviour shows as an open question and a decision card", () => {
    const f = showNotes("review");
    f.answers["Q-AI-WRONG"] = { kind: "not_sure" };
    f.previewEdits = undefined;
    const project = refineAndLock(f);
    const p = deriveDeliveryProfile(currentLock(project)!.intent);
    expect(status(p, "ai_aiops")).toBe("OPEN_QUESTION");
    const founder = renderAllPacks(project).founder.files.find((x) => x.name === "WHAT_YOU_ARE_BUILDING.md")!.content;
    expect(founder).toContain("### Decision needed: What should happen when the AI gets something wrong?");
    expect(founder).toContain("**If you leave it for now:** Builders must not let AI output be used or shared automatically");
  });
});
