/**
 * Canonical Product Model — the single source of truth.
 *
 * Every pack, handover and adapter output is a rendering of a LockSnapshot.
 * Nothing rendered from these types is ever authoritative over them.
 */
import { z } from "zod";

// ── Vocabularies ────────────────────────────────────────────────────────────

/** Material-change provenance. Every material change carries exactly one. */
export const PROVENANCE = [
  "HUMAN",
  "THEDUCK_SUGGESTED_HUMAN_APPROVED",
  "IMPLEMENTATION_NECESSARY",
  "EVIDENCE_DISCOVERED",
] as const;
export const Provenance = z.enum(PROVENANCE);
export type Provenance = z.infer<typeof Provenance>;

/** Evidence states. The only words allowed for claims about what is proven. */
export const EVIDENCE_STATES = [
  "VERIFIED",
  "IMPLEMENTED_NOT_VERIFIED",
  "ASSUMPTION",
  "OPEN_QUESTION",
  "FAILED",
] as const;
export const EvidenceState = z.enum(EVIDENCE_STATES);
export type EvidenceState = z.infer<typeof EvidenceState>;

/** Delivery-readiness states for the professional workstream matrix. */
export const READINESS_STATES = [
  "REQUIRED",
  "NOT_APPLICABLE",
  "ASSUMPTION",
  "OPEN_QUESTION",
  "IMPLEMENTED_NOT_VERIFIED",
  "VERIFIED",
] as const;
export const ReadinessState = z.enum(READINESS_STATES);
export type ReadinessState = z.infer<typeof ReadinessState>;

export const Stage = z.enum(["demo", "pilot", "production"]);
export type Stage = z.infer<typeof Stage>;

export const DataSensitivity = z.enum(["none", "personal", "sensitive_or_regulated"]);
export type DataSensitivity = z.infer<typeof DataSensitivity>;

export const AiUsageEstimate = z.enum(["low", "base", "high"]);
export type AiUsageEstimate = z.infer<typeof AiUsageEstimate>;

// ── Actors ──────────────────────────────────────────────────────────────────

export const HumanOwner = z.object({
  kind: z.literal("human"),
  role: z.literal("product_owner"),
  name: z.string().min(1),
});
export type HumanOwner = z.infer<typeof HumanOwner>;

export const Actor = z.discriminatedUnion("kind", [
  HumanOwner,
  z.object({ kind: z.literal("agent"), name: z.string().min(1) }),
  z.object({ kind: z.literal("system"), name: z.literal("theduck") }),
]);
export type Actor = z.infer<typeof Actor>;

// ── Intent content ──────────────────────────────────────────────────────────

/** A list entry that remembers who authored it. */
export const Item = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  provenance: Provenance,
  /** Optional link, e.g. the question that produced an open question. */
  ref: z.string().optional(),
  /** For open questions: the draft fields that, once filled, close this question. */
  fields: z.array(z.string()).optional(),
});
export type Item = z.infer<typeof Item>;

export const AcceptanceCriterion = z.object({
  id: z.string().regex(/^AC-\d{2}$/),
  statement: z.string().min(1),
  /** How a builder or professional checks it. */
  howToCheck: z.string().min(1),
  /** Plain-English instruction for the founder's own test (VAT/UAT). */
  founderCheck: z.string().min(1),
  /**
   * Only explicit, testable commitments become locked acceptance criteria:
   * must-not rules, measurable success checks, and criteria the owner wrote.
   * Journey steps are NOT acceptance criteria; they become draft verification
   * candidates (assurance/verification.ts).
   */
  source: z.enum(["must_not", "success", "human"]),
  provenance: Provenance,
});
export type AcceptanceCriterion = z.infer<typeof AcceptanceCriterion>;

export const SCALAR_FIELDS = [
  "productName",
  "targetUser",
  "jobToBeDone",
  "desiredOutcome",
  "stage",
  "dataSensitivity",
  "usesAI",
  "integrationFailureBehaviour",
  "aiFailureBehaviour",
  "aiUsageEstimate",
] as const;
export type ScalarField = (typeof SCALAR_FIELDS)[number];

export const LIST_FIELDS = [
  "coreWorkflow",
  "outOfScope",
  "mustNot",
  "successCriteria",
  "integrations",
  "openQuestions",
] as const;
export type ListField = (typeof LIST_FIELDS)[number];

/** Every field of locked intent is protected. Changing one needs a Change Proposal. */
export const INTENT_FIELDS = [...SCALAR_FIELDS, ...LIST_FIELDS, "acceptanceCriteria"] as const;
export type IntentField = (typeof INTENT_FIELDS)[number];

/**
 * The locked product intent. The five core commitments are required to lock.
 * Profile fields (stage, data, AI) may be locked as undecided: TheDuck then
 * shows them as an explicit assumption or an open decision, never a guess.
 */
export const IntentContent = z
  .object({
    productName: z.string().min(1),
    targetUser: z.string().min(1),
    jobToBeDone: z.string().min(1),
    desiredOutcome: z.string().min(1),
    stage: Stage.nullable(),
    dataSensitivity: DataSensitivity.nullable(),
    usesAI: z.boolean().nullable(),
    integrationFailureBehaviour: z.string().min(1).nullable(),
    aiFailureBehaviour: z.string().min(1).nullable(),
    aiUsageEstimate: AiUsageEstimate.nullable(),
    coreWorkflow: z.array(Item).min(1),
    outOfScope: z.array(Item),
    mustNot: z.array(Item),
    successCriteria: z.array(Item).min(1),
    integrations: z.array(Item),
    openQuestions: z.array(Item),
    acceptanceCriteria: z.array(AcceptanceCriterion),
  })
  .refine((i) => i.outOfScope.length + i.mustNot.length >= 1, {
    message: "Locked intent needs at least one exclusion or must-not rule.",
  });
export type IntentContent = z.infer<typeof IntentContent>;

/** Pre-lock working copy. Same shape, but anything may still be missing. */
export const Draft = z.object({
  productName: z.string().min(1).nullable(),
  targetUser: z.string().min(1).nullable(),
  jobToBeDone: z.string().min(1).nullable(),
  desiredOutcome: z.string().min(1).nullable(),
  stage: Stage.nullable(),
  dataSensitivity: DataSensitivity.nullable(),
  usesAI: z.boolean().nullable(),
  integrationFailureBehaviour: z.string().min(1).nullable(),
  aiFailureBehaviour: z.string().min(1).nullable(),
  aiUsageEstimate: AiUsageEstimate.nullable(),
  coreWorkflow: z.array(Item),
  outOfScope: z.array(Item),
  mustNot: z.array(Item),
  successCriteria: z.array(Item),
  integrations: z.array(Item),
  openQuestions: z.array(Item),
  /** null = TheDuck derives them at lock; a list = the founder edited them. */
  acceptanceCriteria: z.array(AcceptanceCriterion).nullable(),
});
export type Draft = z.infer<typeof Draft>;

export const FieldProvenance = z.record(z.string(), Provenance);
export type FieldProvenance = z.infer<typeof FieldProvenance>;

// ── Refinement record ───────────────────────────────────────────────────────

export const ProviderKind = z.enum(["deterministic-rules", "llm", "test-fake"]);
export type ProviderKind = z.infer<typeof ProviderKind>;

export const ProviderInfo = z.object({
  id: z.string().min(1),
  kind: ProviderKind,
  usesAI: z.boolean(),
  /** Plain-English description shown to founders. Must be honest. */
  description: z.string().min(1),
});
export type ProviderInfo = z.infer<typeof ProviderInfo>;

export const Answer = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("text"), value: z.string().trim().min(1) }),
  z.object({ kind: z.literal("list"), values: z.array(z.string().trim().min(1)) }),
  z.object({ kind: z.literal("choice"), value: z.string().min(1) }),
  /** One question with several labelled boxes; keys are the part keys. */
  z.object({
    kind: z.literal("parts"),
    values: z.record(z.string(), z.union([z.string(), z.array(z.string().trim().min(1))])),
  }),
  z.object({ kind: z.literal("not_sure") }),
]);
export type Answer = z.infer<typeof Answer>;

export const AskedQuestion = z.object({
  questionId: z.string().min(1),
  tier: z.enum(["core", "follow_up"]),
  prompt: z.string().min(1),
  answer: Answer,
  fieldsChanged: z.array(z.string()),
  /** Items TheDuck added because the founder chose an option that disclosed them. */
  theduckAdditions: z.array(z.string()),
  at: z.string(),
});
export type AskedQuestion = z.infer<typeof AskedQuestion>;

export const RefinementRecord = z.object({
  provider: ProviderInfo,
  asked: z.array(AskedQuestion),
});
export type RefinementRecord = z.infer<typeof RefinementRecord>;

// ── Lock snapshot ───────────────────────────────────────────────────────────

export const LockBasis = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("initial-lock") }),
  z.object({
    kind: z.literal("change-proposal"),
    changeProposalId: z.string().min(1),
    previousVersion: z.number().int().min(1),
    previousFingerprint: z.string().min(1),
  }),
]);
export type LockBasis = z.infer<typeof LockBasis>;

export const LockSnapshot = z.object({
  schemaVersion: z.literal(1),
  projectId: z.string().min(1),
  version: z.number().int().min(1),
  lockedAt: z.string(),
  lockedBy: HumanOwner,
  basis: LockBasis,
  refinement: z.object({
    providerId: z.string(),
    providerKind: ProviderKind,
    usedAI: z.boolean(),
    questionsAsked: z.number().int().min(0),
  }),
  intent: IntentContent,
  fieldProvenance: FieldProvenance,
  /** sha256 over the canonical JSON of every other field. */
  fingerprint: z.string().regex(/^sha256:[0-9a-f]{64}$/),
});
export type LockSnapshot = z.infer<typeof LockSnapshot>;

// ── Change proposals, evidence, events ──────────────────────────────────────

export const ChangeOrigin = z.enum([
  "HUMAN",
  "THEDUCK_SUGGESTED",
  "IMPLEMENTATION_NECESSARY",
  "EVIDENCE_DISCOVERED",
]);
export type ChangeOrigin = z.infer<typeof ChangeOrigin>;

export const ChangeProposal = z.object({
  id: z.string().min(1),
  field: z.enum(INTENT_FIELDS),
  before: z.unknown(),
  after: z.unknown(),
  reason: z.string().min(1),
  origin: ChangeOrigin,
  proposedBy: Actor,
  proposedAt: z.string(),
  againstLockVersion: z.number().int().min(1),
  againstFingerprint: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  decidedBy: HumanOwner.optional(),
  decidedAt: z.string().optional(),
  resultingLockVersion: z.number().int().optional(),
});
export type ChangeProposal = z.infer<typeof ChangeProposal>;

export const EvidenceItem = z.object({
  id: z.string().min(1),
  claim: z.string().min(1),
  state: EvidenceState,
  how: z.string().min(1),
  recordedAt: z.string(),
  by: Actor,
});
export type EvidenceItem = z.infer<typeof EvidenceItem>;

export const EVENT_TYPES = [
  "PROJECT_CREATED",
  "QUESTION_ANSWERED",
  "DRAFT_EDITED",
  "INTENT_LOCKED",
  "CHANGE_PROPOSED",
  "CHANGE_APPROVED",
  "CHANGE_REJECTED",
] as const;

export const ProjectEvent = z.object({
  seq: z.number().int().min(1),
  at: z.string(),
  actor: Actor,
  type: z.enum(EVENT_TYPES),
  summary: z.string().min(1),
  data: z.record(z.string(), z.unknown()).optional(),
});
export type ProjectEvent = z.infer<typeof ProjectEvent>;

// ── Project aggregate ───────────────────────────────────────────────────────

export const Project = z.object({
  schemaVersion: z.literal(1),
  id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/),
  createdAt: z.string(),
  roughIdea: z.string().min(1),
  status: z.enum(["draft", "locked"]),
  draft: Draft,
  fieldProvenance: FieldProvenance,
  refinement: RefinementRecord,
  locks: z.array(LockSnapshot),
  changeProposals: z.array(ChangeProposal),
  evidence: z.array(EvidenceItem),
  events: z.array(ProjectEvent),
});
export type Project = z.infer<typeof Project>;
