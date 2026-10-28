/**
 * Rendering all packs from one lock, inspecting a pack against a lock, and the
 * cross-pack consistency check.
 */
import { sha256 } from "../model/integrity.ts";
import { READINESS_LABEL, READINESS_PLAIN } from "../model/labels.ts";
import type { LockSnapshot, Project } from "../model/schema.ts";
import { computeFingerprint } from "../intent-gate/gate.ts";
import { deriveDeliveryProfile } from "../assurance/readiness.ts";
import { renderInputFor } from "./common.ts";
import { checkCoverage, checkHeaders } from "./checks.ts";
export { anchors, checkCoverage, checkHeaders } from "./checks.ts";
import type { Pack } from "./common.ts";
import { renderFounderPack } from "./founder.ts";
import { renderBuilderPack } from "./builder.ts";
import { renderProfessionalPack } from "./professional.ts";
import { runAdapter } from "../adapters/adapter.ts";
import { universalAdapter } from "../adapters/universal.ts";

export interface PackSet {
  founder: Pack;
  builder: Pack;
  professional: Pack;
  universal: Pack;
}

/** Render every pack from one lock version. Throws before lock. */
export function renderAllPacks(project: Project, version?: number): PackSet {
  const input = renderInputFor(project, version);
  const universal = runAdapter(universalAdapter, project, version);
  if (!universal.ok) throw new Error(`Universal adapter refused: ${universal.violations.join(" ")}`);
  return {
    founder: renderFounderPack(input),
    builder: renderBuilderPack(input),
    professional: renderProfessionalPack(input),
    universal: universal.pack,
  };
}

// ── inspection ──────────────────────────────────────────────────────────────

export interface Inspection {
  valid: boolean;
  problems: string[];
  /** What to tell the founder, in plain English. */
  founderMessage: string;
}

/** Check a pack against a lock. Any mismatch makes the pack visibly invalid. */
export function inspectPack(pack: Pack, lock: LockSnapshot): Inspection {
  const problems: string[] = [];
  if (computeFingerprint(lock) !== lock.fingerprint) {
    problems.push(`Lock v${lock.version} itself has been altered: its fingerprint no longer matches its content.`);
  }
  if (pack.lockFingerprint !== lock.fingerprint || pack.lockVersion !== lock.version || pack.projectId !== lock.projectId) {
    problems.push(
      `Pack "${pack.kind}" was made from lock v${pack.lockVersion} (${pack.lockFingerprint}), not lock v${lock.version} (${lock.fingerprint}).`,
    );
  }
  problems.push(...checkHeaders(pack.files, lock));
  const names = new Set(pack.files.map((f) => f.name));
  for (const m of pack.manifest) {
    const f = pack.files.find((x) => x.name === m.name);
    if (!f) problems.push(`${m.name}: listed in the manifest but missing.`);
    else if (sha256(f.content) !== m.sha256) problems.push(`${m.name}: content changed after TheDuck rendered it.`);
    names.delete(m.name);
  }
  for (const extra of names) problems.push(`${extra}: not part of what TheDuck rendered.`);
  const valid = problems.length === 0;
  return {
    valid,
    problems,
    founderMessage: valid
      ? `This pack matches your locked product definition (version ${lock.version}).`
      : `Do not use this pack: it does not match your locked product definition (version ${lock.version}). Ask TheDuck to render it again.`,
  };
}

// ── consistency across packs ────────────────────────────────────────────────

const file = (p: Pack, name: string) => p.files.find((f) => f.name === name)?.content ?? "";

/** Returns problems; an empty list means all packs agree with the lock and each other. */
export function checkPackConsistency(packs: PackSet, lock: LockSnapshot): string[] {
  const problems: string[] = [];
  for (const pack of Object.values(packs)) {
    const insp = inspectPack(pack, lock);
    problems.push(...insp.problems);
  }
  const i = lock.intent;
  const need = (where: string, text: string, values: string[]) => {
    for (const v of values) if (!text.includes(v)) problems.push(`${where}: missing locked value "${v}"`);
  };
  const core = [i.productName, i.targetUser, i.jobToBeDone, i.desiredOutcome];
  const steps = i.coreWorkflow.map((s) => s.text);
  const oos = i.outOfScope.map((s) => s.text);
  const mn = i.mustNot.map((s) => s.text);
  const acIds = i.acceptanceCriteria.map((a) => a.id);
  const acStatements = i.acceptanceCriteria.map((a) => a.statement);

  // Founder
  const fw = file(packs.founder, "WHAT_YOU_ARE_BUILDING.md");
  need("founder/WHAT_YOU_ARE_BUILDING.md", fw, [...core, ...steps, ...oos, ...mn]);
  need("founder/VAT_UAT.md", file(packs.founder, "VAT_UAT.md"), acIds);
  // Builder
  need("builder/LOCKED_INTENT.md", file(packs.builder, "LOCKED_INTENT.md"), core);
  need("builder/USER_FLOWS.md", file(packs.builder, "USER_FLOWS.md"), steps);
  need("builder/SCOPE.md", file(packs.builder, "SCOPE.md"), [...steps, ...oos, ...mn]);
  need("builder/ACCEPTANCE_CRITERIA.md", file(packs.builder, "ACCEPTANCE_CRITERIA.md"), [...acIds, ...acStatements]);
  // Professional
  need("professional/PRODUCT_TEAM_HANDOVER.md", file(packs.professional, "PRODUCT_TEAM_HANDOVER.md"), [
    ...core,
    ...steps,
    ...oos,
    ...mn,
    ...acIds,
    ...acStatements,
  ]);
  // Universal
  problems.push(...checkCoverage(packs.universal.files.map((f) => f.content).join("\n"), lock, "universal"));

  // Readiness: founder notes and professional matrix must show the same status per workstream.
  const profile = deriveDeliveryProfile(i);
  const dr = file(packs.professional, "DELIVERY_READINESS.md");
  const tn = file(packs.founder, "FOUNDER_TECH_NOTES.md");
  for (const r of profile.rows) {
    const proRow = `| ${r.name} | ${READINESS_LABEL[r.status]} |`;
    const founderRow = `### ${r.founderName} — ${READINESS_PLAIN[r.status]} (${READINESS_LABEL[r.status]})`;
    if (!dr.includes(proRow)) problems.push(`professional/DELIVERY_READINESS.md: workstream row differs: ${proRow}`);
    if (!tn.includes(founderRow)) problems.push(`founder/FOUNDER_TECH_NOTES.md: workstream row differs: ${founderRow}`);
  }
  return problems;
}
