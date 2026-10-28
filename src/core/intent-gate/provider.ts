/**
 * RefinementProvider: proposes the next clarification/challenge question.
 *
 * Boundary: a provider only *proposes* questions as data. It never writes to the
 * draft. The Intent Gate validates every question, applies effects itself, and
 * records provenance. This keeps a future LLM provider swappable and unable to
 * silently change product intent.
 */
import { z } from "zod";
import { LIST_FIELDS, SCALAR_FIELDS } from "../model/schema.ts";
import type { AskedQuestion, Draft, ProviderInfo } from "../model/schema.ts";

/** First-session limits (M1.1.1): a short core pass, a few material follow-ups, then the preview. */
export const MAX_CORE_QUESTIONS = 5;
export const MAX_FOLLOW_UPS = 3;
export const MAX_QUESTIONS = MAX_CORE_QUESTIONS + MAX_FOLLOW_UPS;

const ScalarFieldEnum = z.enum(SCALAR_FIELDS);
const ListFieldEnum = z.enum(LIST_FIELDS);

/**
 * What choosing an option does to the draft.
 * `authoredBy: "theduck"` marks text TheDuck wrote; the option label must disclose it.
 */
export const Effect = z.discriminatedUnion("op", [
  z.object({
    op: z.literal("set"),
    field: ScalarFieldEnum,
    value: z.union([z.string().min(1), z.boolean()]),
  }),
  z.object({
    op: z.literal("append"),
    field: ListFieldEnum,
    text: z.string().min(1),
    authoredBy: z.enum(["founder", "theduck"]),
  }),
]);
export type Effect = z.infer<typeof Effect>;

export const QuestionOption = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  /** Plain-English consequence of picking this option. */
  consequence: z.string().min(1),
  effects: z.array(Effect).min(1),
});
export type QuestionOption = z.infer<typeof QuestionOption>;

const QuestionBase = {
  id: z.string().regex(/^Q-[A-Z0-9-]+$/),
  /** Which kind of gap this question closes, e.g. "target_user". */
  gap: z.string().min(1),
  prompt: z.string().min(1),
  /** Why it matters, in plain English. Shown behind "Why?". */
  reason: z.string().min(1),
  /** "core" = first pass; "follow_up" = only when an answer materially changes the product. */
  tier: z.enum(["core", "follow_up"]),
  /** Every question offers "I am not sure yet"; this text becomes a visible open question. */
  notSureText: z.string().min(1),
};

export const QuestionPart = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  kind: z.enum(["text", "list"]),
  target: z.union([ScalarFieldEnum, ListFieldEnum]),
  optional: z.boolean(),
});
export type QuestionPart = z.infer<typeof QuestionPart>;

export const Question = z.discriminatedUnion("kind", [
  z.object({ ...QuestionBase, kind: z.literal("text"), target: ScalarFieldEnum }),
  z.object({
    ...QuestionBase,
    kind: z.literal("list"),
    target: ListFieldEnum,
    minItems: z.number().int().min(0),
  }),
  z.object({
    ...QuestionBase,
    kind: z.literal("parts"),
    parts: z.array(QuestionPart).min(2),
    /** At least one part must be filled in. */
    requireAny: z.boolean(),
  }),
  z.object({
    ...QuestionBase,
    kind: z.literal("choice"),
    options: z.array(QuestionOption).min(2),
    /** Option TheDuck pre-selects, and why. The founder still chooses. */
    suggested: z.object({ value: z.string(), why: z.string() }).nullable(),
  }),
]);
export type Question = z.infer<typeof Question>;

export interface RefinementState {
  readonly roughIdea: string;
  readonly draft: Draft;
  readonly asked: readonly AskedQuestion[];
}

export interface RefinementProvider {
  readonly info: ProviderInfo;
  /** Next question, or null when refinement is complete. Must not mutate `state`. */
  nextQuestion(state: RefinementState): Question | null;
}
