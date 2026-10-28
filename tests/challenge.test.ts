import { describe, expect, it } from "vitest";
import { AI_AUTO_SUCCESS, AI_REVIEW_RULE, AI_REVIEW_STEP, SENSITIVE_DATA_RULE, currentLock } from "../src/core/index.ts";
import { freshNudge, physioPath, showNotes } from "../fixtures/ideas.ts";
import { refineAndLock } from "../fixtures/run-session.ts";

describe("Exit criterion 2 — a challenge question materially changes the locked intent", () => {
  it("'what happens when the AI is wrong?' changes the journey, the rules and the acceptance criteria", () => {
    const review = currentLock(refineAndLock(showNotes("review")))!;
    const auto = currentLock(refineAndLock(showNotes("auto")))!;

    expect(review.fingerprint).not.toBe(auto.fingerprint);

    const steps = (l: typeof review) => l.intent.coreWorkflow.map((s) => s.text);
    const rules = (l: typeof review) => l.intent.mustNot.map((s) => s.text);
    const done = (l: typeof review) => l.intent.successCriteria.map((s) => s.text);

    expect(steps(review)).toContain(AI_REVIEW_STEP);
    expect(steps(auto)).not.toContain(AI_REVIEW_STEP);
    expect(rules(review)).toContain(AI_REVIEW_RULE);
    expect(rules(auto)).not.toContain(AI_REVIEW_RULE);
    expect(done(auto)).toContain(AI_AUTO_SUCCESS);
    expect(review.intent.acceptanceCriteria.some((a) => a.statement.includes(AI_REVIEW_RULE))).toBe(true);
    expect(auto.intent.acceptanceCriteria.some((a) => a.statement.includes(AI_REVIEW_RULE))).toBe(false);

    // TheDuck-authored additions keep their provenance.
    const added = review.intent.mustNot.find((m) => m.text === AI_REVIEW_RULE)!;
    expect(added.provenance).toBe("THEDUCK_SUGGESTED_HUMAN_APPROVED");
  });

  it("the 'everyone' challenge replaces a too-broad target user", () => {
    const p = refineAndLock(freshNudge);
    const ids = p.refinement.asked.map((a) => a.questionId);
    expect(ids).toContain("Q-TARGET-USER-NARROW");
    expect(currentLock(p)!.intent.targetUser).toBe("Busy home cooks who do one big weekly shop");
  });

  it("choosing 'sensitive' adds a disclosed protection rule to the lock", () => {
    const l = currentLock(refineAndLock(physioPath))!;
    const rule = l.intent.mustNot.find((m) => m.text === SENSITIVE_DATA_RULE);
    expect(rule?.provenance).toBe("THEDUCK_SUGGESTED_HUMAN_APPROVED");
  });

  it("founder preview edits are recorded as HUMAN and keep TheDuck's item provenance", () => {
    const p = refineAndLock(showNotes("review"));
    expect(p.events.some((e) => e.type === "DRAFT_EDITED")).toBe(true);
    const step = currentLock(p)!.intent.coreWorkflow;
    expect(step[2]?.text).toBe(AI_REVIEW_STEP); // moved by the founder
    expect(step[2]?.provenance).toBe("THEDUCK_SUGGESTED_HUMAN_APPROVED");
    expect(step[0]?.provenance).toBe("HUMAN");
  });
});
