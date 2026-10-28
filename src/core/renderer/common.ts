import { StateError } from "../model/errors.ts";
import { readonlyCopy, sha256, shortFingerprint } from "../model/integrity.ts";
import type {
  AskedQuestion,
  ChangeProposal,
  EvidenceItem,
  LockSnapshot,
  Project,
  ProviderInfo,
} from "../model/schema.ts";
import { deriveOpenItems } from "../assurance/open-items.ts";
import type { OpenItems } from "../assurance/open-items.ts";
import { deriveVerificationCandidates } from "../assurance/verification.ts";
import type { VerificationCandidate } from "../assurance/verification.ts";
import { deriveDeliveryProfile } from "../assurance/readiness.ts";
import type { DeliveryProfile } from "../assurance/readiness.ts";

export type PackKind = "founder" | "builder" | "professional" | "universal";

export interface RenderedFile {
  name: string;
  content: string;
}

export interface Pack {
  kind: PackKind;
  projectId: string;
  lockVersion: number;
  lockFingerprint: string;
  files: RenderedFile[];
  manifest: { name: string; sha256: string }[];
}

/**
 * Everything a renderer may read. Frozen copies only — renderers cannot write
 * back to the project or the lock.
 */
export interface RenderInput {
  readonly lock: LockSnapshot;
  readonly previousLocks: readonly LockSnapshot[];
  readonly approvedChanges: readonly ChangeProposal[];
  readonly pendingChanges: readonly ChangeProposal[];
  readonly asked: readonly AskedQuestion[];
  readonly provider: ProviderInfo;
  readonly evidence: readonly EvidenceItem[];
  readonly profile: DeliveryProfile;
  /** Decisions, professional actions, assumptions and unresolved references. */
  readonly open: OpenItems;
  /** Draft verification candidates — NOT acceptance criteria. */
  readonly candidates: readonly VerificationCandidate[];
}

export function renderInputFor(project: Project, version?: number): RenderInput {
  if (project.status !== "locked" || project.locks.length === 0) {
    throw new StateError("No packs before lock: the product owner has not explicitly locked the product intent.");
  }
  const lock = version === undefined ? project.locks.at(-1) : project.locks.find((l) => l.version === version);
  if (!lock) throw new StateError(`No lock version ${version}.`);
  const frozen = readonlyCopy(lock);
  return readonlyCopy({
    lock: frozen,
    previousLocks: project.locks.filter((l) => l.version < lock.version),
    approvedChanges: project.changeProposals.filter(
      (c) => c.status === "approved" && (c.resultingLockVersion ?? Infinity) <= lock.version,
    ),
    pendingChanges: project.changeProposals.filter((c) => c.status === "pending" && c.againstLockVersion === lock.version),
    asked: project.refinement.asked,
    provider: project.refinement.provider,
    evidence: project.evidence,
    profile: deriveDeliveryProfile(frozen.intent),
    open: deriveOpenItems(frozen.intent),
    candidates: deriveVerificationCandidates(frozen.intent),
  });
}

/** Readiness rows marked ASSUMPTION, minus those already stated as an explicit assumption. */
export function extraAssumedRows(input: RenderInput): { name: string; founderName: string; basis: string; founderConsequence: string }[] {
  const ids = new Set(input.open.assumptions.map((a) => a.id));
  return input.profile.rows.filter(
    (r) =>
      r.status === "ASSUMPTION" &&
      !(r.id === "ai_aiops" && ids.has("A-AI")) &&
      !(r.id === "security_privacy" && ids.has("A-DATA")),
  );
}

export const HEADER_RE = /^<!-- theduck:rendering project=(\S+) lock=v(\d+) fingerprint=(sha256:[0-9a-f]{64}) pack=(\S+) file=(\S+) -->/;

export function header(input: RenderInput, kind: PackKind, file: string, audience: "founder" | "professional"): string {
  const l = input.lock;
  const machine = `<!-- theduck:rendering project=${l.projectId} lock=v${l.version} fingerprint=${l.fingerprint} pack=${kind} file=${file} -->`;
  const human =
    audience === "founder"
      ? `> Made from your locked product definition (version ${l.version}, fingerprint \`${shortFingerprint(l.fingerprint)}\`). If anything here looks different from what you approved, the locked version wins.`
      : `> Rendered by TheDuck from locked product intent **v${l.version}** (\`${l.fingerprint}\`). This file is a rendering, not the source of truth. If it disagrees with the lock, the lock wins.`;
  return `${machine}\n${human}\n`;
}

export function bullets(items: readonly string[], empty = "_None._"): string {
  return items.length ? items.map((t) => `- ${t}`).join("\n") : empty;
}

export function numbered(items: readonly string[]): string {
  return items.map((t, n) => `${n + 1}. ${t}`).join("\n");
}

export function makePack(kind: PackKind, input: RenderInput, files: RenderedFile[]): Pack {
  return {
    kind,
    projectId: input.lock.projectId,
    lockVersion: input.lock.version,
    lockFingerprint: input.lock.fingerprint,
    files,
    manifest: files.map((f) => ({ name: f.name, sha256: sha256(f.content) })),
  };
}
