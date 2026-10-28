/**
 * Never hide an unresolved material decision.
 *
 * Derives, deterministically from intent (draft or lock):
 * - unresolved references: statements that rely on a value, decision,
 *   threshold, provider or policy that has not been defined;
 * - founder decision cards (what the owner must decide);
 * - professional actions (open questions a builder/professional answers);
 * - explicit assumptions (what TheDuck assumed because nobody said).
 *
 * An assumption is something TheDuck took as true and says so. A decision is
 * something nobody has answered yet. They are never mixed.
 */
import type { Draft } from "../model/schema.ts";

export type IntentLike = Omit<Draft, "acceptanceCriteria">;

export interface UnresolvedReference {
  id: string;
  field: string;
  text: string;
  phrase: string;
  kind: "placeholder" | "vague_value" | "undefined_limit" | "undefined_provider";
  owner: "founder" | "professional";
}

export interface DecisionCard {
  id: string;
  decisionNeeded: string;
  whyItMatters: string;
  options: { label: string; tradeOff: string }[];
  recommendation: string;
  ifDeferred: string;
  /** The locked statement this decision is about, when there is one. */
  about?: string;
}

export interface ProfessionalAction {
  id: string;
  question: string;
  whyItMatters: string;
  about?: string;
}

export interface Assumption {
  id: string;
  text: string;
}

export interface OpenItems {
  unresolved: UnresolvedReference[];
  decisions: DecisionCard[];
  professional: ProfessionalAction[];
  assumptions: Assumption[];
}

const PLACEHOLDER =
  /\b(TBD|TBC|TODO)\b|\bto be (decided|determined|confirmed|agreed|defined)\b|\bdecided? later\b|\bnot (yet )?decided\b|\?{2,}|\[[^\]]+\]/i;
const VAGUE_VALUE =
  /\b(agreed|agreed-upon|appropriate|reasonable|acceptable|suitable|sufficient|adequate)\s+(?:[a-z-]+\s+)?(cost|costs|spend|spending|price|budget|limit|cap|threshold|retention|period|time|timeframe|deadline|level|amount|number|accuracy|quality|speed|uptime|security|privacy|policy|terms)\b/i;
const UNDEFINED_LIMIT = /\b(cost|spend|spending|budget|price)\s+(limit|cap|ceiling|threshold|target)\b/i;
const HAS_NUMBER = /\d|[$€£¥]/;
const GENERIC_PROVIDER = /^(a|an|some|any)\s+/i;
const COST_WORD = /\b(cost|costs|spend|spending|price|budget)\b/i;

function textsOf(i: IntentLike): { field: string; text: string }[] {
  const out: { field: string; text: string }[] = [];
  for (const f of ["targetUser", "jobToBeDone", "desiredOutcome", "integrationFailureBehaviour", "aiFailureBehaviour"] as const) {
    const v = i[f];
    if (v) out.push({ field: f, text: v });
  }
  for (const f of ["coreWorkflow", "outOfScope", "mustNot", "successCriteria", "integrations"] as const) {
    for (const item of i[f]) out.push({ field: f, text: item.text });
  }
  return out;
}

export function findUnresolvedReferences(i: IntentLike): UnresolvedReference[] {
  const refs: UnresolvedReference[] = [];
  for (const { field, text } of textsOf(i)) {
    let m: RegExpExecArray | null;
    let hit: Omit<UnresolvedReference, "id" | "field" | "text" | "owner"> | null = null;
    if ((m = PLACEHOLDER.exec(text))) hit = { phrase: m[0], kind: "placeholder" };
    else if ((m = VAGUE_VALUE.exec(text))) hit = { phrase: m[0], kind: "vague_value" };
    else if ((m = UNDEFINED_LIMIT.exec(text)) && !HAS_NUMBER.test(text)) hit = { phrase: m[0], kind: "undefined_limit" };
    else if (field === "integrations" && (m = GENERIC_PROVIDER.exec(text)))
      hit = { phrase: text.split(/\s+[—–-]\s+/)[0] ?? text, kind: "undefined_provider" };
    if (hit) {
      refs.push({
        id: `UR-${String(refs.length + 1).padStart(2, "0")}`,
        field,
        text,
        ...hit,
        owner: hit.kind === "undefined_provider" ? "professional" : "founder",
      });
    }
  }
  return refs;
}

function unitOf(text: string): string | null {
  const m = /\b(?:per|of one|for one|of each|for each|each)\s+([a-z]+)/i.exec(text);
  return m?.[1]?.toLowerCase() ?? null;
}

function cardForReference(r: UnresolvedReference, i: IntentLike): DecisionCard {
  const isSuccess = r.field === "successCriteria";
  const where = isSuccess ? "Your definition of done" : "Your product definition";
  if (COST_WORD.test(r.phrase) || COST_WORD.test(r.text)) {
    const unit = unitOf(r.text);
    const ai = i.usesAI === true && /\bAI\b/.test(r.text) ? "AI " : "";
    return {
      id: `DC-${r.id}`,
      decisionNeeded: `Set the maximum acceptable ${ai}cost${unit ? ` per ${unit}` : ""}.`,
      whyItMatters: `${where} says "${r.text}", but no limit has been set. Until you set one, this check cannot be measured, so it cannot be used to decide whether the product is done — and nobody can warn you before costs run over.`,
      options: [
        { label: `Set a maximum amount${unit ? ` per ${unit}` : ""} now`, tradeOff: "The check becomes measurable and a spending alert can be set." },
        { label: "Remove this check", tradeOff: "Cost stops being part of \"done\"." },
      ],
      recommendation: `Set a maximum amount${unit ? ` per ${unit}` : ""} now. You can change it later through a Change Proposal.`,
      ifDeferred: "This check stays unmeasurable and is not treated as an acceptance criterion. Builders must not pick a number for you.",
      about: r.text,
    };
  }
  return {
    id: `DC-${r.id}`,
    decisionNeeded: `Decide what "${r.phrase}" means.`,
    whyItMatters: `${where} says "${r.text}", but "${r.phrase}" has not been defined. Until it is, nobody can build or check it the way you intend.`,
    options: [],
    recommendation: "Replace it with a concrete value or rule in your own words.",
    ifDeferred: "It stays an open question. Builders must not invent the value.",
    about: r.text,
  };
}

const openFor = (i: IntentLike, field: string) => i.openQuestions.some((q) => q.fields?.includes(field));

export type AiState = "yes" | "no" | "open" | "assumed_no";
export type DataState = "none" | "personal" | "sensitive_or_regulated" | "open" | "assumed_not_sensitive";

export function aiState(i: IntentLike): AiState {
  if (i.usesAI === true) return "yes";
  if (i.usesAI === false) return "no";
  return openFor(i, "usesAI") ? "open" : "assumed_no";
}

export function dataState(i: IntentLike): DataState {
  if (i.dataSensitivity) return i.dataSensitivity;
  return openFor(i, "dataSensitivity") ? "open" : "assumed_not_sensitive";
}

export function deriveOpenItems(i: IntentLike): OpenItems {
  const unresolved = findUnresolvedReferences(i);
  const decisions: DecisionCard[] = [];
  const professional: ProfessionalAction[] = [];
  const assumptions: Assumption[] = [];

  if (i.stage === null) {
    decisions.push({
      id: "DC-STAGE",
      decisionNeeded: "Decide what this first version is for: a demo, a pilot with a few real users, or a real product people rely on.",
      whyItMatters: "It decides how much care, protection and running cost the first version needs.",
      options: [
        { label: "A demo", tradeOff: "Simplest. Not for real users or real data." },
        { label: "A pilot", tradeOff: "Real people use it, so basic reliability and support matter." },
        { label: "A real product", tradeOff: "Needs hosting, monitoring, backups and someone on call." },
      ],
      recommendation: "If you are unsure, start with a demo or a small pilot.",
      ifDeferred: "Builders must treat it as a demo: not for real users or real data.",
    });
  }
  if (i.usesAI === true && i.aiFailureBehaviour === null && !openFor(i, "usesAI")) {
    decisions.push({
      id: "DC-AI-WRONG",
      decisionNeeded: "Decide what should happen when the AI gets something wrong.",
      whyItMatters: "This decides whether an AI mistake can reach your users or the public without anyone checking.",
      options: [
        { label: "A person checks AI work before it is used", tradeOff: "Safer, slightly slower." },
        { label: "Use AI work straight away; fix mistakes later", tradeOff: "Faster, riskier." },
      ],
      recommendation: "Have a person check AI work first in the first version.",
      ifDeferred: "Builders must not let AI output be used or shared automatically until you decide.",
    });
  }
  if (i.integrations.length > 0 && i.integrationFailureBehaviour === null) {
    decisions.push({
      id: "DC-INTEGRATION-DOWN",
      decisionNeeded: `Decide what people should experience when "${i.integrations[0]?.text ?? "a connected service"}" is unavailable.`,
      whyItMatters: "Every outside service fails sometimes. Without a decision, the builder will guess.",
      options: [
        { label: "Show a clear message; try again later", tradeOff: "Simpler, people wait." },
        { label: "Keep working with saved information; catch up later", tradeOff: "Better for people, more work." },
      ],
      recommendation: "Show a clear message for the first version.",
      ifDeferred: "Builders must show a clear error rather than invent a workaround.",
    });
  }
  for (const r of unresolved) {
    if (r.owner === "founder") decisions.push(cardForReference(r, i));
    else
      professional.push({
        id: `PA-${r.id}`,
        question: `Which specific service or provider will be used for: "${r.text}"?`,
        whyItMatters: "The choice affects cost, privacy terms and reliability. A builder or professional proposes options; the product owner approves.",
        about: r.text,
      });
  }
  for (const q of i.openQuestions) {
    decisions.push({
      id: `DC-${q.id}`,
      decisionNeeded: q.text,
      whyItMatters: "You said you are not sure yet. If it stays open, a builder will have to guess — and that guess becomes your product.",
      options: [],
      recommendation: "Decide before anyone builds the part this affects.",
      ifDeferred: "It stays listed as an open question. Builders must not invent an answer.",
    });
  }
  if (i.usesAI === true && i.aiUsageEstimate === null) {
    professional.push({
      id: "PA-AI-USAGE",
      question: "Estimate how often one active person will use the AI feature each month.",
      whyItMatters: "AI costs money every time it runs. Without an estimate there is no cost model; treat any estimate as an assumption until real usage is measured.",
    });
  }
  if (aiState(i) === "assumed_no") {
    assumptions.push({ id: "A-AI", text: "TheDuck assumes the product does not use AI, because AI was not mentioned." });
  }
  if (dataState(i) === "assumed_not_sensitive") {
    assumptions.push({
      id: "A-DATA",
      text: "TheDuck assumes it holds no sensitive or regulated information (such as health, money or children's data), because nothing said so. It may still hold basic personal details such as names or emails.",
    });
  }
  return { unresolved, decisions, professional, assumptions };
}

/** Back-compatible name used by M1.1 code: founder decision cards only. */
export function deriveDecisionCards(i: IntentLike): DecisionCard[] {
  return deriveOpenItems(i).decisions;
}
