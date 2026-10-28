/** Header and coverage checks shared by packs and adapters. */
import type { LockSnapshot } from "../model/schema.ts";
import { prohibition } from "../model/text.ts";
import { deriveOpenItems } from "../assurance/open-items.ts";
import { deriveVerificationCandidates } from "../assurance/verification.ts";
import { HEADER_RE } from "./common.ts";
import type { RenderedFile } from "./common.ts";

// ── header / coverage checks ────────────────────────────────────────────────

export function checkHeaders(files: readonly RenderedFile[], lock: LockSnapshot): string[] {
  const problems: string[] = [];
  for (const f of files) {
    if (f.name.endsWith(".json")) {
      try {
        const parsed = JSON.parse(f.content) as { fingerprint?: string };
        if (parsed.fingerprint !== lock.fingerprint) problems.push(`${f.name}: fingerprint does not match lock v${lock.version}.`);
      } catch {
        problems.push(`${f.name}: not valid JSON.`);
      }
      continue;
    }
    const m = HEADER_RE.exec(f.content);
    if (!m) problems.push(`${f.name}: missing TheDuck rendering header.`);
    else if (m[3] !== lock.fingerprint || Number(m[2]) !== lock.version || m[1] !== lock.projectId) {
      problems.push(`${f.name}: made from lock v${m[2]} (${m[3]}), not the current lock v${lock.version}.`);
    }
  }
  return problems;
}

/**
 * Canonical labelled lines a complete handover must contain, exactly.
 * Line-level matching means a drifted value cannot hide behind the same text
 * appearing elsewhere (for example inside an acceptance criterion).
 */
export function anchors(lock: LockSnapshot): { label: string; line: string }[] {
  const i = lock.intent;
  return [
    { label: "target user", line: `- Target user: ${i.targetUser}` },
    { label: "job to be done", line: `- Job to be done: ${i.jobToBeDone}` },
    { label: "promised outcome", line: `- Promised outcome: ${i.desiredOutcome}` },
    ...i.coreWorkflow.map((s, n) => ({ label: "journey step", line: `${n + 1}. ${s.text}` })),
    ...i.outOfScope.map((s) => ({ label: "out of scope", line: `- ${s.text}` })),
    ...i.mustNot.map((s) => ({ label: "must never", line: `- ${prohibition(s.text)}` })),
    ...i.acceptanceCriteria.map((a) => ({ label: `acceptance ${a.id}`, line: `- **${a.id}** — ${a.statement}` })),
    ...deriveVerificationCandidates(i).map((c) => ({ label: `draft candidate ${c.id}`, line: `- **${c.id}** (draft) — ${c.commitment}` })),
    ...deriveOpenItems(i).decisions.map((d) => ({ label: "open decision", line: `- Product owner decision: ${d.decisionNeeded}` })),
  ];
}

export function checkCoverage(text: string, lock: LockSnapshot, where: string): string[] {
  const lines = new Set(text.split("\n").map((l) => l.trimEnd()));
  return [
    ...(text.includes(lock.intent.productName) ? [] : [`${where}: locked product name missing: "${lock.intent.productName}"`]),
    ...anchors(lock)
      .filter((a) => !lines.has(a.line))
      .map((a) => `${where}: locked ${a.label} missing or altered: "${a.line}"`),
  ];
}
