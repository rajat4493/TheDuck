import type { DataSensitivity, EvidenceState, Provenance, ReadinessState, Stage } from "./schema.ts";

/** Formal labels, exactly as the repository contract spells them. */
export const PROVENANCE_LABEL: Record<Provenance, string> = {
  HUMAN: "HUMAN",
  THEDUCK_SUGGESTED_HUMAN_APPROVED: "THEDUCK-SUGGESTED + HUMAN-APPROVED",
  IMPLEMENTATION_NECESSARY: "IMPLEMENTATION-NECESSARY",
  EVIDENCE_DISCOVERED: "EVIDENCE-DISCOVERED",
};

/** Founder-facing wording for the same provenance. */
export const PROVENANCE_PLAIN: Record<Provenance, string> = {
  HUMAN: "You decided this",
  THEDUCK_SUGGESTED_HUMAN_APPROVED: "TheDuck suggested this and you accepted it",
  IMPLEMENTATION_NECESSARY: "Needed to build it — does not change what the product does",
  EVIDENCE_DISCOVERED: "Discovered while building or checking",
};

export const EVIDENCE_LABEL: Record<EvidenceState, string> = {
  VERIFIED: "VERIFIED",
  IMPLEMENTED_NOT_VERIFIED: "IMPLEMENTED NOT VERIFIED",
  ASSUMPTION: "ASSUMPTION",
  OPEN_QUESTION: "OPEN QUESTION",
  FAILED: "FAILED",
};

export const READINESS_LABEL: Record<ReadinessState, string> = {
  REQUIRED: "REQUIRED",
  NOT_APPLICABLE: "NOT APPLICABLE",
  ASSUMPTION: "ASSUMPTION",
  OPEN_QUESTION: "OPEN QUESTION",
  IMPLEMENTED_NOT_VERIFIED: "IMPLEMENTED NOT VERIFIED",
  VERIFIED: "VERIFIED",
};

export const READINESS_PLAIN: Record<ReadinessState, string> = {
  REQUIRED: "Needs work before real use",
  NOT_APPLICABLE: "Not needed for this product right now",
  ASSUMPTION: "Assumed, not yet checked",
  OPEN_QUESTION: "Still undecided",
  IMPLEMENTED_NOT_VERIFIED: "Built, not yet checked",
  VERIFIED: "Proven",
};

export const STAGE_PLAIN: Record<Stage, string> = {
  demo: "a demo to show people (not for real use yet)",
  pilot: "a pilot with a small number of real users",
  production: "a real product that people will rely on",
};

export const DATA_PLAIN: Record<DataSensitivity, string> = {
  none: "no personal information",
  personal: "basic personal details (such as names, emails or accounts)",
  sensitive_or_regulated: "sensitive or regulated information",
};

export function stagePlain(stage: Stage | null): string {
  return stage ? STAGE_PLAIN[stage] : "not yet decided (demo, pilot or real product)";
}
