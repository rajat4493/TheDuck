/**
 * After lock, the ONLY way intent changes: a Change Proposal that the human
 * product owner explicitly approves. Approval creates a new immutable lock
 * version; earlier versions are never edited.
 */
import type { Ctx } from "../model/context.ts";
import { LockViolationError, StateError } from "../model/errors.ts";
import { ChangeProposal, HumanOwner, IntentContent, INTENT_FIELDS, LIST_FIELDS, Project } from "../model/schema.ts";
import type { Actor, ChangeOrigin, IntentField, Item, Provenance } from "../model/schema.ts";
import { currentLock, sealLock } from "./gate.ts";

export const ORIGIN_TO_PROVENANCE: Record<ChangeOrigin, Provenance> = {
  HUMAN: "HUMAN",
  THEDUCK_SUGGESTED: "THEDUCK_SUGGESTED_HUMAN_APPROVED",
  IMPLEMENTATION_NECESSARY: "IMPLEMENTATION_NECESSARY",
  EVIDENCE_DISCOVERED: "EVIDENCE_DISCOVERED",
};

export interface ProposalInput {
  field: IntentField;
  /** New value. List fields take plain strings; scalars take their value. */
  after: unknown;
  reason: string;
  origin: ChangeOrigin;
}

function buildCandidate(intent: IntentContent, field: IntentField, after: unknown, provenance: Provenance, ctx: Ctx) {
  const candidate = structuredClone(intent) as Record<string, unknown>;
  if ((LIST_FIELDS as readonly string[]).includes(field)) {
    if (!Array.isArray(after) || !after.every((t) => typeof t === "string")) {
      throw new StateError(`Field "${field}" needs a list of text items.`);
    }
    const old = intent[field as (typeof LIST_FIELDS)[number]];
    candidate[field] = (after as string[]).map(
      (text): Item => old.find((i) => i.text === text) ?? { id: ctx.id("item"), text, provenance },
    );
  } else {
    candidate[field] = after;
  }
  const parsed = IntentContent.safeParse(candidate);
  if (!parsed.success) throw new StateError(`Proposed value for "${field}" is not valid: ${parsed.error.message}`);
  return parsed.data;
}

/** Anyone (human or agent) may propose. Nothing changes until the owner approves. */
export function proposeChange(project: Project, input: ProposalInput, by: Actor, ctx: Ctx): Project {
  const lock = currentLock(project);
  if (project.status !== "locked" || !lock) {
    throw new StateError("Change Proposals apply only after lock. Before lock, edit the preview instead.");
  }
  if (!(INTENT_FIELDS as readonly string[]).includes(input.field)) {
    throw new StateError(`"${input.field}" is not a product-intent field.`);
  }
  if (input.origin === "HUMAN" && !HumanOwner.safeParse(by).success) {
    throw new LockViolationError("Only the product owner can raise a HUMAN-origin change. Agents must use another origin.");
  }
  if (!input.reason.trim()) throw new StateError("A Change Proposal needs a reason.");
  // Validate now so invalid proposals never reach the owner.
  buildCandidate(lock.intent, input.field, input.after, ORIGIN_TO_PROVENANCE[input.origin], ctx);

  const p = structuredClone(project);
  const cp: ChangeProposal = {
    id: ctx.id("cp"),
    field: input.field,
    before: structuredClone(lock.intent[input.field]),
    after: structuredClone(input.after),
    reason: input.reason.trim(),
    origin: input.origin,
    proposedBy: by,
    proposedAt: ctx.now(),
    againstLockVersion: lock.version,
    againstFingerprint: lock.fingerprint,
    status: "pending",
  };
  p.changeProposals.push(ChangeProposal.parse(cp));
  p.events.push({
    seq: p.events.length + 1,
    at: ctx.now(),
    actor: by,
    type: "CHANGE_PROPOSED",
    summary: `Change Proposal ${cp.id} for "${cp.field}" is waiting for the product owner.`,
    data: { changeProposalId: cp.id, field: cp.field, origin: cp.origin },
  });
  return Project.parse(p);
}

export interface ChangeDecision {
  decision: "approve" | "reject";
  /** Must be literally `true`. */
  confirmed: true;
  by: Actor;
}

/** Only the human product owner can decide. Approval creates lock v(n+1). */
export function decideChangeProposal(project: Project, proposalId: string, d: ChangeDecision, ctx: Ctx): Project {
  if (!HumanOwner.safeParse(d.by).success) {
    throw new LockViolationError("Only the human product owner can approve or reject a Change Proposal.");
  }
  const owner = HumanOwner.parse(d.by);
  if (d.confirmed !== true) throw new StateError("Deciding a Change Proposal needs explicit confirmation.");
  const lock = currentLock(project);
  if (!lock) throw new StateError("Nothing is locked yet.");
  const idx = project.changeProposals.findIndex((c) => c.id === proposalId);
  const cp = project.changeProposals[idx];
  if (!cp) throw new StateError(`No Change Proposal ${proposalId}.`);
  if (cp.status !== "pending") throw new StateError(`Change Proposal ${proposalId} is already ${cp.status}.`);
  if (cp.againstLockVersion !== lock.version || cp.againstFingerprint !== lock.fingerprint) {
    throw new StateError(
      `Change Proposal ${proposalId} was written against lock v${cp.againstLockVersion}, but the current lock is v${lock.version}. Re-propose it.`,
    );
  }

  const p = structuredClone(project);
  const target = p.changeProposals[idx];
  if (!target) throw new StateError(`No Change Proposal ${proposalId}.`);
  target.decidedBy = owner;
  target.decidedAt = ctx.now();

  if (d.decision === "reject") {
    target.status = "rejected";
    p.events.push({
      seq: p.events.length + 1,
      at: ctx.now(),
      actor: owner,
      type: "CHANGE_REJECTED",
      summary: `Product owner rejected ${cp.id}. Lock v${lock.version} is unchanged.`,
      data: { changeProposalId: cp.id },
    });
    return Project.parse(p);
  }

  const provenance = ORIGIN_TO_PROVENANCE[cp.origin];
  const intent = buildCandidate(lock.intent, cp.field, cp.after, provenance, ctx);
  const next = sealLock({
    schemaVersion: 1,
    projectId: p.id,
    version: lock.version + 1,
    lockedAt: ctx.now(),
    lockedBy: owner,
    basis: {
      kind: "change-proposal",
      changeProposalId: cp.id,
      previousVersion: lock.version,
      previousFingerprint: lock.fingerprint,
    },
    refinement: lock.refinement,
    intent,
    fieldProvenance: { ...lock.fieldProvenance, [cp.field]: provenance },
  });
  target.status = "approved";
  target.resultingLockVersion = next.version;
  p.locks.push(next);
  p.events.push({
    seq: p.events.length + 1,
    at: ctx.now(),
    actor: owner,
    type: "CHANGE_APPROVED",
    summary: `Product owner approved ${cp.id}; locked intent is now v${next.version}.`,
    data: { changeProposalId: cp.id, version: next.version, fingerprint: next.fingerprint },
  });
  p.evidence.push({
    id: ctx.id("ev"),
    claim: `The product owner explicitly approved ${cp.id}, creating lock v${next.version}.`,
    state: "VERIFIED",
    how: `Recorded CHANGE_APPROVED event #${p.events.length}; fingerprint ${next.fingerprint}.`,
    recordedAt: ctx.now(),
    by: { kind: "system", name: "theduck" },
  });
  return Project.parse(p);
}

/**
 * A direct edit to a locked field is always refused. Kept as an explicit
 * function so callers (and tests) get a clear, named rejection.
 */
export function changeLockedFieldDirectly(project: Project, field: IntentField, _after: unknown, by: Actor): never {
  throw new LockViolationError(
    `Refused: "${field}" is locked (v${currentLock(project)?.version ?? "?"}). ${by.kind === "human" ? "You" : `Agent "${by.name}"`} must raise a Change Proposal and get the product owner's explicit approval.`,
  );
}
