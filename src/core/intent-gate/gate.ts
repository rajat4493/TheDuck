/**
 * Intent Gate: rough idea → refinement → editable preview → explicit LOCK.
 *
 * Pre-lock the draft may change freely (by the founder, or by options the
 * founder chose). Post-lock nothing here can change intent: see
 * change-proposals.ts for the only route.
 *
 * All functions are pure: they return a new Project and never mutate input.
 */
import type { Ctx } from "../model/context.ts";
import { LockViolationError, ProviderContractError, StateError } from "../model/errors.ts";
import { canonicalJson, deepFreeze, readonlyCopy, sha256 } from "../model/integrity.ts";
import {
  AcceptanceCriterion,
  Answer,
  Draft,
  HumanOwner,
  IntentContent,
  LIST_FIELDS,
  LockSnapshot,
  Project,
  ProviderInfo,
  SCALAR_FIELDS,
} from "../model/schema.ts";
import type {
  Actor,
  AskedQuestion,
  IntentField,
  Item,
  ListField,
  LockBasis,
  ProjectEvent,
  Provenance,
  ScalarField,
} from "../model/schema.ts";
import { MAX_CORE_QUESTIONS, MAX_FOLLOW_UPS, MAX_QUESTIONS, Question } from "./provider.ts";
import type { Effect, RefinementProvider } from "./provider.ts";
import { deriveAcceptanceCriteria } from "../assurance/verification.ts";
import { deriveOpenItems } from "../assurance/open-items.ts";

export const LOCK_CONFIRMATION_TEXT = "I approve this product intent and want to lock it.";

export interface LockConfirmation {
  /** Must be literally `true`. There is no implied or default lock. */
  confirmed: true;
  /** Must equal LOCK_CONFIRMATION_TEXT exactly. */
  statement: string;
  by: HumanOwner;
}

// ── helpers ─────────────────────────────────────────────────────────────────

export function emptyDraft(): Draft {
  return {
    productName: null,
    targetUser: null,
    jobToBeDone: null,
    desiredOutcome: null,
    stage: null,
    dataSensitivity: null,
    usesAI: null,
    integrationFailureBehaviour: null,
    aiFailureBehaviour: null,
    aiUsageEstimate: null,
    coreWorkflow: [],
    outOfScope: [],
    mustNot: [],
    successCriteria: [],
    integrations: [],
    openQuestions: [],
    acceptanceCriteria: null,
  };
}

export function currentLock(project: Project): LockSnapshot | null {
  return project.locks.at(-1) ?? null;
}

export function lockByVersion(project: Project, version: number): LockSnapshot {
  const lock = project.locks.find((l) => l.version === version);
  if (!lock) throw new StateError(`No lock version ${version} exists.`);
  return lock;
}

function assertHumanOwner(actor: Actor, action: string): asserts actor is HumanOwner {
  if (!HumanOwner.safeParse(actor).success) {
    throw new LockViolationError(`Only the human product owner can ${action}. Got actor kind "${actor.kind}".`);
  }
}

function assertDraft(project: Project, action: string): void {
  if (project.status !== "draft") {
    throw new LockViolationError(
      `Cannot ${action}: product intent is locked (v${currentLock(project)?.version}). Create a Change Proposal instead.`,
    );
  }
}

function pushEvent(
  p: Project,
  ctx: Ctx,
  actor: Actor,
  type: ProjectEvent["type"],
  summary: string,
  data?: Record<string, unknown>,
): void {
  p.events.push({ seq: p.events.length + 1, at: ctx.now(), actor, type, summary, ...(data ? { data } : {}) });
}

const isScalar = (f: string): f is ScalarField => (SCALAR_FIELDS as readonly string[]).includes(f);
const isList = (f: string): f is ListField => (LIST_FIELDS as readonly string[]).includes(f);

function newItem(ctx: Ctx, text: string, provenance: Provenance, ref?: string): Item {
  return { id: ctx.id("item"), text: text.trim(), provenance, ...(ref ? { ref } : {}) };
}

/** Draft fields a question fills; used to close a "not sure" once they are filled. */
function questionFields(q: Question): string[] {
  if (q.kind === "text" || q.kind === "list") return [q.target];
  if (q.kind === "parts") return q.parts.map((p) => p.target);
  const sets = q.options.map((o) => new Set(o.effects.filter((e) => e.op === "set").map((e) => e.field as string)));
  const first = sets[0] ?? new Set<string>();
  return [...first].filter((f) => sets.every((s) => s.has(f)));
}

function isFilled(d: Draft, field: string): boolean {
  const v = (d as Record<string, unknown>)[field];
  return Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined;
}

// ── create ──────────────────────────────────────────────────────────────────

export function createProject(
  ctx: Ctx,
  input: { roughIdea: string; workingName?: string; provider: ProviderInfo; by: HumanOwner },
): Project {
  const roughIdea = input.roughIdea.trim();
  if (!roughIdea) throw new StateError("A rough idea is required.");
  const provider = ProviderInfo.parse(input.provider);
  const draft = emptyDraft();
  const fieldProvenance: Record<string, Provenance> = {};
  if (input.workingName?.trim()) {
    draft.productName = input.workingName.trim();
    fieldProvenance.productName = "HUMAN";
  }
  const p: Project = {
    schemaVersion: 1,
    id: ctx.id("prj"),
    createdAt: ctx.now(),
    roughIdea,
    status: "draft",
    draft,
    fieldProvenance,
    refinement: { provider, asked: [] },
    locks: [],
    changeProposals: [],
    evidence: [],
    events: [],
  };
  pushEvent(p, ctx, input.by, "PROJECT_CREATED", "Rough idea submitted.", { roughIdea });
  return Project.parse(p);
}

// ── refinement ──────────────────────────────────────────────────────────────

/** Ask the provider for the next question and check it against the contract. */
export function nextQuestion(project: Project, provider: RefinementProvider): Question | null {
  if (project.status !== "draft") return null;
  if (provider.info.id !== project.refinement.provider.id) {
    throw new ProviderContractError(
      `Provider "${provider.info.id}" does not match the project's recorded provider "${project.refinement.provider.id}".`,
    );
  }
  if (project.refinement.asked.length >= MAX_QUESTIONS) return null;
  const state = readonlyCopy({
    roughIdea: project.roughIdea,
    draft: project.draft,
    asked: project.refinement.asked,
  });
  const raw = provider.nextQuestion(state);
  if (raw === null) return null;
  const parsed = Question.safeParse(raw);
  if (!parsed.success) {
    throw new ProviderContractError(`Provider returned an invalid question: ${parsed.error.message}`);
  }
  const q = parsed.data;
  if (project.refinement.asked.some((a) => a.questionId === q.id)) {
    throw new ProviderContractError(`Provider repeated question ${q.id}.`);
  }
  const used = project.refinement.asked.filter((a) => a.tier === q.tier).length;
  const limit = q.tier === "core" ? MAX_CORE_QUESTIONS : MAX_FOLLOW_UPS;
  if (used >= limit) {
    throw new ProviderContractError(
      `Provider asked a ${q.tier} question beyond the first-session limit (${limit}). Remaining detail belongs in the Product Preview.`,
    );
  }
  if (q.kind === "parts") {
    for (const part of q.parts) {
      const ok = part.kind === "list" ? isList(part.target) : isScalar(part.target);
      if (!ok) throw new ProviderContractError(`Question ${q.id} part "${part.key}" targets an incompatible field.`);
    }
  }
  return deepFreeze(q);
}

/** Apply the founder's answer. Only the human product owner can answer. */
export function answerQuestion(
  project: Project,
  question: Question,
  rawAnswer: Answer,
  by: Actor,
  ctx: Ctx,
): Project {
  assertDraft(project, "answer refinement questions");
  assertHumanOwner(by, "answer refinement questions");
  const q = Question.parse(question);
  const answer = Answer.parse(rawAnswer);
  const p = structuredClone(project);
  const changed = new Set<string>();
  const theduckAdditions: string[] = [];

  const applyEffect = (e: Effect) => {
    if (e.op === "set") {
      (p.draft as Record<string, unknown>)[e.field] = e.value;
      p.fieldProvenance[e.field] = "HUMAN"; // the founder chose this option
      changed.add(e.field);
    } else {
      const prov: Provenance = e.authoredBy === "theduck" ? "THEDUCK_SUGGESTED_HUMAN_APPROVED" : "HUMAN";
      if (!p.draft[e.field].some((i) => i.text === e.text)) {
        p.draft[e.field].push(newItem(ctx, e.text, prov));
        if (e.authoredBy === "theduck") theduckAdditions.push(e.text);
      }
      changed.add(e.field);
    }
  };

  if (answer.kind === "not_sure") {
    const item = newItem(ctx, q.notSureText, "HUMAN", q.id);
    item.fields = questionFields(q);
    p.draft.openQuestions.push(item);
    changed.add("openQuestions");
  } else if (q.kind === "parts") {
    if (answer.kind !== "parts") throw new StateError(`Question ${q.id} expects an answer for each box.`);
    let filled = 0;
    for (const part of q.parts) {
      const v = answer.values[part.key];
      if (part.kind === "text") {
        const text = typeof v === "string" ? v.trim() : "";
        if (!text) {
          if (!part.optional) throw new StateError(`Question ${q.id} needs "${part.label}".`);
          continue;
        }
        applyEffect({ op: "set", field: part.target as ScalarField, value: text });
        filled++;
      } else {
        const values = Array.isArray(v) ? v : [];
        if (values.length === 0 && !part.optional) throw new StateError(`Question ${q.id} needs "${part.label}".`);
        for (const text of values) applyEffect({ op: "append", field: part.target as ListField, text, authoredBy: "founder" });
        if (values.length) filled++;
      }
    }
    if (q.requireAny && filled === 0) throw new StateError(`Question ${q.id} needs at least one box filled in, or "not sure yet".`);
  } else if (q.kind === "text") {
    if (answer.kind !== "text") throw new StateError(`Question ${q.id} expects a text answer.`);
    applyEffect({ op: "set", field: q.target, value: answer.value.trim() });
  } else if (q.kind === "list") {
    if (answer.kind !== "list") throw new StateError(`Question ${q.id} expects a list answer.`);
    if (answer.values.length < q.minItems) {
      throw new StateError(`Question ${q.id} needs at least ${q.minItems} item(s).`);
    }
    for (const text of answer.values) applyEffect({ op: "append", field: q.target, text, authoredBy: "founder" });
    if (answer.values.length === 0) changed.add(q.target);
  } else {
    if (answer.kind !== "choice") throw new StateError(`Question ${q.id} expects a choice.`);
    const option = q.options.find((o) => o.value === answer.value);
    if (!option) throw new StateError(`"${answer.value}" is not an option for ${q.id}.`);
    option.effects.forEach(applyEffect);
  }

  // A real answer closes any earlier "not sure" for the same question.
  if (answer.kind !== "not_sure") {
    const before = p.draft.openQuestions.length;
    p.draft.openQuestions = p.draft.openQuestions.filter((i) => i.ref !== q.id);
    if (p.draft.openQuestions.length !== before) changed.add("openQuestions");
  }

  const record: AskedQuestion = {
    questionId: q.id,
    tier: q.tier,
    prompt: q.prompt,
    answer,
    fieldsChanged: [...changed],
    theduckAdditions,
    at: ctx.now(),
  };
  p.refinement.asked.push(record);
  pushEvent(p, ctx, by, "QUESTION_ANSWERED", `Answered ${q.id}.`, {
    questionId: q.id,
    fieldsChanged: record.fieldsChanged,
    theduckAdditions,
  });
  return Project.parse(p);
}

// ── preview editing (pre-lock only) ─────────────────────────────────────────

export type DraftPatch = Partial<{
  [K in ScalarField]: Draft[K];
}> &
  Partial<Record<ListField, string[]>> & {
    acceptanceCriteria?: Array<Pick<AcceptanceCriterion, "statement" | "howToCheck" | "founderCheck">>;
  };

/** Founder edits the Product Preview. Rejected after lock. */
export function editDraft(project: Project, patch: DraftPatch, by: Actor, ctx: Ctx): Project {
  assertDraft(project, "edit the product preview");
  assertHumanOwner(by, "edit the product preview");
  const p = structuredClone(project);
  const fields: string[] = [];
  for (const [field, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    if (isScalar(field)) {
      (p.draft as Record<string, unknown>)[field] = value;
      p.fieldProvenance[field] = "HUMAN";
    } else if (isList(field)) {
      const old = p.draft[field];
      p.draft[field] = (value as string[]).map((text) => {
        const kept = old.find((i) => i.text === text.trim());
        return kept ?? newItem(ctx, text, "HUMAN");
      });
    } else if (field === "acceptanceCriteria") {
      p.draft.acceptanceCriteria = (value as NonNullable<DraftPatch["acceptanceCriteria"]>).map((ac, n) => ({
        id: acId(n),
        statement: ac.statement,
        howToCheck: ac.howToCheck,
        founderCheck: ac.founderCheck,
        source: "human",
        provenance: "HUMAN",
      }));
    } else {
      throw new StateError(`Unknown field "${field}".`);
    }
    fields.push(field);
  }
  // An open "not sure" closes once every field it was about has been filled in.
  const open = p.draft.openQuestions;
  p.draft.openQuestions = open.filter((q) => !(q.fields && q.fields.length > 0 && q.fields.every((f) => isFilled(p.draft, f))));
  if (p.draft.openQuestions.length !== open.length) fields.push("openQuestions");
  pushEvent(p, ctx, by, "DRAFT_EDITED", `Founder edited the preview: ${fields.join(", ")}.`, { fields });
  return Project.parse(p);
}

// ── acceptance criteria & readiness ─────────────────────────────────────────

const acId = (n: number) => `AC-${String(n + 1).padStart(2, "0")}`;

export { deriveAcceptanceCriteria };

export interface LockReadiness {
  ready: boolean;
  /** Plain-English things that must be settled before locking. */
  blockers: string[];
  /** "Not sure yet" answers. They stay visible and are locked as open questions. */
  deferred: string[];
  /** Material decisions still waiting for the founder (never hidden). */
  decisionsWaiting: string[];
}

/** Only the five core commitments (plus a working name) block a lock. */
export function lockReadiness(project: Project): LockReadiness {
  const d = project.draft;
  const blockers: string[] = [];
  if (!d.productName) blockers.push("Give it a working name.");
  if (!d.targetUser) blockers.push("We still need to know who the first version is for.");
  if (!d.jobToBeDone) blockers.push("We still need to know what job it does for them.");
  if (!d.desiredOutcome) blockers.push("We still need to know what will be better for them when it works.");
  if (d.coreWorkflow.length === 0) blockers.push("Describe at least one step of the main journey.");
  if (d.outOfScope.length + d.mustNot.length === 0)
    blockers.push("Name at least one thing the first version will not do, or must never do.");
  if (d.successCriteria.length === 0) blockers.push("Say how you will know the first version is good enough.");
  return {
    ready: blockers.length === 0,
    blockers,
    deferred: d.openQuestions.map((i) => i.text),
    decisionsWaiting: deriveOpenItems(d).decisions.map((c) => c.decisionNeeded),
  };
}

/** The intent that would be locked right now (for the Product Preview). */
export function lockCandidate(project: Project): IntentContent {
  const d = project.draft;
  const readiness = lockReadiness(project);
  if (!readiness.ready) throw new StateError(`Not ready to lock: ${readiness.blockers.join(" ")}`);
  return IntentContent.parse({
    ...d,
    acceptanceCriteria: d.acceptanceCriteria ?? deriveAcceptanceCriteria(d),
  });
}

// ── locking ─────────────────────────────────────────────────────────────────

export function sealLock(fields: Omit<LockSnapshot, "fingerprint">): LockSnapshot {
  const fingerprint = sha256(canonicalJson(fields));
  return deepFreeze(LockSnapshot.parse({ ...fields, fingerprint }));
}

export function computeFingerprint(lock: LockSnapshot): string {
  const { fingerprint: _ignored, ...rest } = lock;
  return sha256(canonicalJson(rest));
}

/** Locks require an explicit, human, exactly-worded confirmation. */
export function lockIntent(project: Project, confirmation: LockConfirmation, ctx: Ctx): Project {
  assertDraft(project, "lock again");
  if (confirmation?.confirmed !== true || confirmation.statement !== LOCK_CONFIRMATION_TEXT) {
    throw new StateError("Locking needs explicit confirmation from the product owner.");
  }
  assertHumanOwner(confirmation.by, "lock product intent");
  const intent = lockCandidate(project);
  const fieldProvenance = structuredClone(project.fieldProvenance);
  fieldProvenance.acceptanceCriteria =
    project.draft.acceptanceCriteria === null ? "THEDUCK_SUGGESTED_HUMAN_APPROVED" : "HUMAN";
  const p = structuredClone(project);
  const lock = sealLock({
    schemaVersion: 1,
    projectId: p.id,
    version: 1,
    lockedAt: ctx.now(),
    lockedBy: confirmation.by,
    basis: { kind: "initial-lock" } satisfies LockBasis,
    refinement: {
      providerId: p.refinement.provider.id,
      providerKind: p.refinement.provider.kind,
      usedAI: p.refinement.provider.usesAI,
      questionsAsked: p.refinement.asked.length,
    },
    intent,
    fieldProvenance,
  });
  p.status = "locked";
  p.locks.push(lock);
  pushEvent(p, ctx, confirmation.by, "INTENT_LOCKED", "Product owner explicitly locked product intent v1.", {
    version: 1,
    fingerprint: lock.fingerprint,
  });
  p.evidence.push({
    id: ctx.id("ev"),
    claim: "The product owner explicitly locked product intent v1.",
    state: "VERIFIED",
    how: `Recorded INTENT_LOCKED event #${p.events.length} with the exact confirmation statement; fingerprint ${lock.fingerprint}.`,
    recordedAt: ctx.now(),
    by: { kind: "system", name: "theduck" },
  });
  return Project.parse(p);
}

export type { IntentField };
