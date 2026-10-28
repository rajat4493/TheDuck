import { describe, expect, it } from "vitest";
import {
  LOCK_CONFIRMATION_TEXT,
  StateError,
  LockViolationError,
  createProject,
  fixedCtx,
  lockIntent,
  lockReadiness,
  renderAllPacks,
  renderInputFor,
  rulesProvider,
} from "../src/core/index.ts";
import type { LockConfirmation } from "../src/core/index.ts";
import { physioPath } from "../fixtures/ideas.ts";
import { OWNER, refine } from "../fixtures/run-session.ts";

describe("Exit criterion 3 — the founder must explicitly lock; nothing is locked before", () => {
  it("a fully refined project is still a draft with no locks and no packs", () => {
    const p = refine(physioPath);
    expect(lockReadiness(p).ready).toBe(true);
    expect(p.status).toBe("draft");
    expect(p.locks).toEqual([]);
    expect(() => renderAllPacks(p)).toThrow(/No packs before lock/);
    expect(() => renderInputFor(p)).toThrow(StateError);
  });

  it("refuses to lock without the exact confirmation", () => {
    const ctx = fixedCtx();
    const p = refine(physioPath, ctx);
    const bad: unknown[] = [
      undefined,
      {},
      { confirmed: false, statement: LOCK_CONFIRMATION_TEXT, by: OWNER },
      { confirmed: "yes", statement: LOCK_CONFIRMATION_TEXT, by: OWNER },
      { confirmed: true, statement: "ok", by: OWNER },
    ];
    for (const c of bad) expect(() => lockIntent(p, c as LockConfirmation, ctx)).toThrow(StateError);
  });

  it("refuses a lock confirmed by an agent", () => {
    const ctx = fixedCtx();
    const p = refine(physioPath, ctx);
    const agent = { kind: "agent", name: "some-coding-agent" } as unknown as LockConfirmation["by"];
    expect(() => lockIntent(p, { confirmed: true, statement: LOCK_CONFIRMATION_TEXT, by: agent }, ctx)).toThrow(
      LockViolationError,
    );
  });

  it("refuses to lock an incomplete draft and explains what is missing in plain English", () => {
    const ctx = fixedCtx();
    const p = createProject(ctx, { roughIdea: "A thing", provider: rulesProvider.info, by: OWNER });
    const r = lockReadiness(p);
    expect(r.ready).toBe(false);
    expect(r.blockers).toContain("We still need to know who the first version is for.");
    expect(r.blockers).toContain("We still need your decision about what information it holds about people.");
    expect(() => lockIntent(p, { confirmed: true, statement: LOCK_CONFIRMATION_TEXT, by: OWNER }, ctx)).toThrow(
      /Not ready to lock/,
    );
  });

  it("locking once is final: a second lock is refused", () => {
    const ctx = fixedCtx();
    const locked = lockIntent(refine(physioPath, ctx), { confirmed: true, statement: LOCK_CONFIRMATION_TEXT, by: OWNER }, ctx);
    expect(() => lockIntent(locked, { confirmed: true, statement: LOCK_CONFIRMATION_TEXT, by: OWNER }, ctx)).toThrow(
      LockViolationError,
    );
  });
});
