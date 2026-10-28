/**
 * Exit criterion 6 + founder-language quality.
 * Curated assertions on required plain-English content first; a jargon guard
 * second. The manual founder-readability review is scheduled for M1.2.
 */
import { describe, expect, it } from "vitest";
import { currentLock, renderAllPacks } from "../src/core/index.ts";
import type { Pack } from "../src/core/index.ts";
import { ALL_FIXTURES } from "../fixtures/ideas.ts";
import { refineAndLock } from "../fixtures/run-session.ts";

const get = (p: Pack, name: string) => p.files.find((f) => f.name === name)!.content;

/** Founder text outside optional "Technical detail" disclosures and machine headers. */
const visible = (md: string) =>
  md
    .replace(/<details>[\s\S]*?<\/details>/g, "")
    .replace(/^<!-- theduck:rendering .* -->$/m, "");

const JARGON = [
  /\bPII\b/, /\bRBAC\b/, /\bNFRs?\b/, /\bSLA\b/, /\bSLO\b/, /\bJTBD\b/, /\bADR\b/, /\bAPI\b/, /\bschema\b/i,
  /\bpayload\b/i, /\bendpoint\b/i, /\bmicroservices?\b/i, /\bidempotent\b/i, /\bLLMOps\b/, /\bAIOps\b/, /\bFinOps\b/,
  /\btokens?\b/i, /\bprovenance\b/i, /\bfingerprint mismatch\b/i,
  /THEDUCK_SUGGESTED_HUMAN_APPROVED|IMPLEMENTED_NOT_VERIFIED|OPEN_QUESTION|NOT_APPLICABLE/,
];

describe.each(ALL_FIXTURES.map((f) => [f.key, f] as const))("Founder pack in plain English — %s", (_k, f) => {
  const project = refineAndLock(f);
  const lock = currentLock(project)!;
  const i = lock.intent;
  const founder = renderAllPacks(project).founder;

  it("WHAT_YOU_ARE_BUILDING leads with the product and who it is for", () => {
    const body = visible(get(founder, "WHAT_YOU_ARE_BUILDING.md"));
    expect(body).toContain(`You are building **${i.productName}** for ${i.targetUser}.`);
    expect(body).toContain("## What the first version will not do");
    expect(body).toContain("## Still waiting for you");
  });

  it("CURRENT_OUTCOME states plainly that nothing is built and no coding tool was contacted", () => {
    const body = visible(get(founder, "CURRENT_OUTCOME.md"));
    expect(body).toContain("**Nothing has been built yet.");
    expect(body).toContain("TheDuck has not sent anything to a coding tool");
    expect(body).toContain("## Your next step");
  });

  it("VAT_UAT gives a clear personal next step and one self-check per acceptance criterion", () => {
    const body = visible(get(founder, "VAT_UAT.md"));
    expect(body).toMatch(/\*\*Your next step:\*\*/);
    for (const ac of i.acceptanceCriteria) {
      expect(body).toContain(`**${ac.id}** — ${ac.founderCheck}`);
      expect(ac.founderCheck).toMatch(/^(Try it yourself|Try to make this happen|Check for yourself)/);
    }
  });

  it("WHAT_CHANGED is honest that the questions were fixed rules, not AI", () => {
    const body = visible(get(founder, "WHAT_CHANGED.md"));
    expect(body).toContain("Nothing has changed since you locked it.");
    expect(body).toContain("No AI was used");
  });

  it("FOUNDER_TECH_NOTES puts the consequence first and hides technical detail behind a disclosure", () => {
    const md = get(founder, "FOUNDER_TECH_NOTES.md");
    expect(md).toContain("<details><summary>Technical detail</summary>");
    expect(md).toContain("No qualified technical, security, cost or legal expert has reviewed them");
  });

  it("visible founder text avoids engineering jargon and raw codes", () => {
    for (const file of founder.files) {
      const body = visible(file.content);
      for (const j of JARGON) expect(body, `${file.name} contains ${j}`).not.toMatch(j);
    }
  });
});
