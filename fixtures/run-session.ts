import {
  LOCK_CONFIRMATION_TEXT,
  answerQuestion,
  createProject,
  editDraft,
  fixedCtx,
  lockIntent,
  nextQuestion,
  rulesProvider,
} from "../src/core/index.ts";
import type { Ctx, HumanOwner, Project, RefinementProvider } from "../src/core/index.ts";
import type { FixtureSession } from "./ideas.ts";

export const OWNER: HumanOwner = { kind: "human", role: "product_owner", name: "Test Founder" };

/** Drive a fixture through refinement (and optional preview edits), stopping before lock. */
export function refine(
  f: FixtureSession,
  ctx: Ctx = fixedCtx(),
  provider: RefinementProvider = rulesProvider,
): Project {
  let p = createProject(ctx, {
    roughIdea: f.roughIdea,
    ...(f.workingName ? { workingName: f.workingName } : {}),
    provider: provider.info,
    by: OWNER,
  });
  for (let q = nextQuestion(p, provider); q; q = nextQuestion(p, provider)) {
    const answer = f.answers[q.id];
    if (!answer) throw new Error(`Fixture "${f.key}" has no answer for ${q.id}: ${q.prompt}`);
    p = answerQuestion(p, q, answer, OWNER, ctx);
  }
  if (f.previewEdits) p = editDraft(p, f.previewEdits, OWNER, ctx);
  return p;
}

/** Refine, then explicitly lock. */
export function refineAndLock(f: FixtureSession, ctx: Ctx = fixedCtx()): Project {
  const p = refine(f, ctx);
  return lockIntent(p, { confirmed: true, statement: LOCK_CONFIRMATION_TEXT, by: OWNER }, ctx);
}
