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

export const MAX_QUESTIONS = 16;

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
  /** Text stored as an open question if the founder says "not sure yet". */
  notSureText: z.string().min(1).nullable(),
};

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
