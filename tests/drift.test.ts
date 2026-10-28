import { describe, expect, it } from "vitest";
import {
  LockViolationError,
  StateError,
  canonicalJson,
  changeLockedFieldDirectly,
  computeFingerprint,
  currentLock,
  decideChangeProposal,
  editDraft,
  fixedCtx,
  inspectPack,
  lockByVersion,
  proposeChange,
  renderAllPacks,
  renderUniversal,
  runAdapter,
  universalAdapter,
} from "../src/core/index.ts";
import type { Actor, BuilderAdapter, Project } from "../src/core/index.ts";
import { physioPath, showNotes } from "../fixtures/ideas.ts";
import { OWNER, refineAndLock } from "../fixtures/run-session.ts";

const AGENT: Actor = { kind: "agent", name: "some-coding-agent" };

describe("Exit criterion 5 — downstream rendering cannot silently alter locked intent", () => {
  describe("rendering a Builder Pack does not mutate the canonical model", () => {
    it("project and lock are byte-identical before and after rendering every pack", () => {
      const p = refineAndLock(physioPath);
      const before = canonicalJson(p);
      renderAllPacks(p);
      renderAllPacks(p);
      expect(canonicalJson(p)).toBe(before);
      expect(computeFingerprint(currentLock(p)!)).toBe(currentLock(p)!.fingerprint);
    });
  });

  describe("an adapter cannot alter locked fields", () => {
    const p = refineAndLock(showNotes("review"));
    const base = { target: "test", isLiveIntegration: false as const };

    it("an adapter that writes to the lock is refused and the lock is unchanged", () => {
      const before = canonicalJson(p.locks);
      const hostile: BuilderAdapter = {
        ...base,
        id: "hostile-mutator",
        render(input) {
          (input.lock.intent as { targetUser: string }).targetUser = "Anyone at all";
          return [];
        },
      };
      const r = runAdapter(hostile, p);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.violations.join(" ")).toMatch(/tried to modify the locked intent/);
      expect(canonicalJson(p.locks)).toBe(before);
    });

    it("an adapter that renders a drifted target user is refused", () => {
      const drifting: BuilderAdapter = {
        ...base,
        id: "drifting",
        render: (input) => [
          {
            name: "OUT.md",
            content: renderUniversal(input).replace(input.lock.intent.targetUser, "Professional podcast networks"),
          },
        ],
      };
      const r = runAdapter(drifting, p);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.violations.join(" ")).toMatch(/locked target user missing or altered/);
    });

    it("an adapter that drops a non-scope item is refused", () => {
      const dropping: BuilderAdapter = {
        ...base,
        id: "dropping",
        render: (input) => [{ name: "OUT.md", content: renderUniversal(input).replace("- Audio editing\n", "") }],
      };
      const r = runAdapter(dropping, p);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.violations.join(" ")).toMatch(/out of scope missing or altered: "- Audio editing"/);
    });

    it("an adapter output without the lock fingerprint header is refused", () => {
      const unanchored: BuilderAdapter = {
        ...base,
        id: "unanchored",
        render: (input) => [{ name: "OUT.md", content: renderUniversal(input).split("\n").slice(1).join("\n") }],
      };
      const r = runAdapter(unanchored, p);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.violations.join(" ")).toMatch(/missing TheDuck rendering header/);
    });

    it("an adapter claiming to be a live integration is refused", () => {
      const live = { ...universalAdapter, id: "live", isLiveIntegration: true } as unknown as BuilderAdapter;
      const r = runAdapter(live, p);
      expect(r.ok).toBe(false);
    });

    it("the Universal adapter passes and says it is not a live integration", () => {
      const r = runAdapter(universalAdapter, p);
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.pack.files[0]!.content).toContain("This is a rendered instruction set, not a live integration.");
    });
  });

  describe("a locked-field change without an approved Change Proposal is rejected", () => {
    it("editing the preview after lock is refused", () => {
      const p = refineAndLock(physioPath);
      expect(() => editDraft(p, { targetUser: "All clinics" }, OWNER, fixedCtx())).toThrow(LockViolationError);
    });

    it("a direct locked-field change is refused for agents and humans alike", () => {
      const p = refineAndLock(physioPath);
      expect(() => changeLockedFieldDirectly(p, "outOfScope", [], AGENT)).toThrow(LockViolationError);
      expect(() => changeLockedFieldDirectly(p, "outOfScope", [], OWNER)).toThrow(/Change Proposal/);
    });

    it("an agent can propose but cannot approve; a pending proposal changes nothing", () => {
      const ctx = fixedCtx("2026-10-28T12:00:00.000Z");
      let p: Project = refineAndLock(physioPath);
      const v1 = canonicalJson(currentLock(p));
      p = proposeChange(
        p,
        {
          field: "outOfScope",
          after: ["Diagnosis, medical advice or symptom checking", "Booking appointments or taking payments"],
          reason: "Messaging would be quick to add.",
          origin: "THEDUCK_SUGGESTED",
        },
        AGENT,
        ctx,
      );
      const cp = p.changeProposals[0]!;
      expect(cp.status).toBe("pending");
      expect(p.locks).toHaveLength(1);
      expect(canonicalJson(currentLock(p))).toBe(v1);
      expect(() => decideChangeProposal(p, cp.id, { decision: "approve", confirmed: true, by: AGENT }, ctx)).toThrow(
        LockViolationError,
      );
    });

    it("an agent cannot claim a HUMAN-origin change", () => {
      const p = refineAndLock(physioPath);
      expect(() =>
        proposeChange(p, { field: "stage", after: "demo", reason: "Simpler.", origin: "HUMAN" }, AGENT, fixedCtx()),
      ).toThrow(LockViolationError);
    });

    it("an invalid proposal is rejected before it reaches the owner", () => {
      const p = refineAndLock(physioPath);
      expect(() =>
        proposeChange(p, { field: "outOfScope", after: [], reason: "Remove limits.", origin: "THEDUCK_SUGGESTED" }, AGENT, fixedCtx()),
      ).toThrow(StateError);
    });

    it("only owner approval creates v2; v1 stays byte-identical and provenance is recorded", () => {
      const ctx = fixedCtx("2026-10-28T12:00:00.000Z");
      let p: Project = refineAndLock(physioPath);
      const v1 = canonicalJson(currentLock(p));
      p = proposeChange(p, { field: "stage", after: "pilot", reason: "Start smaller.", origin: "EVIDENCE_DISCOVERED" }, AGENT, ctx);
      const id = p.changeProposals[0]!.id;
      p = decideChangeProposal(p, id, { decision: "approve", confirmed: true, by: OWNER }, ctx);
      expect(p.locks).toHaveLength(2);
      expect(canonicalJson(lockByVersion(p, 1))).toBe(v1);
      const v2 = lockByVersion(p, 2);
      expect(v2.intent.stage).toBe("pilot");
      expect(v2.fieldProvenance.stage).toBe("EVIDENCE_DISCOVERED");
      expect(v2.basis).toMatchObject({ kind: "change-proposal", changeProposalId: id, previousVersion: 1 });
      expect(() => decideChangeProposal(p, id, { decision: "approve", confirmed: true, by: OWNER }, ctx)).toThrow(/already approved/);
    });

    it("a rejected proposal leaves the lock unchanged", () => {
      const ctx = fixedCtx("2026-10-28T12:00:00.000Z");
      let p: Project = refineAndLock(physioPath);
      p = proposeChange(p, { field: "stage", after: "demo", reason: "Faster.", origin: "THEDUCK_SUGGESTED" }, AGENT, ctx);
      p = decideChangeProposal(p, p.changeProposals[0]!.id, { decision: "reject", confirmed: true, by: OWNER }, ctx);
      expect(p.locks).toHaveLength(1);
      expect(p.changeProposals[0]!.status).toBe("rejected");
    });
  });

  describe("a pack whose fingerprint does not match its lock is visibly invalid", () => {
    it("v1 packs are invalid against v2, with a plain-English warning", () => {
      const ctx = fixedCtx("2026-10-28T12:00:00.000Z");
      let p: Project = refineAndLock(physioPath);
      const v1Packs = renderAllPacks(p);
      expect(inspectPack(v1Packs.builder, currentLock(p)!).valid).toBe(true);
      p = proposeChange(p, { field: "stage", after: "pilot", reason: "Start smaller.", origin: "HUMAN" }, OWNER, ctx);
      p = decideChangeProposal(p, p.changeProposals[0]!.id, { decision: "approve", confirmed: true, by: OWNER }, ctx);
      const r = inspectPack(v1Packs.builder, currentLock(p)!);
      expect(r.valid).toBe(false);
      expect(r.problems.join(" ")).toMatch(/made from lock v1/);
      expect(r.founderMessage).toMatch(/^Do not use this pack/);
    });

    it("a pack edited after rendering is invalid", () => {
      const p = refineAndLock(physioPath);
      const packs = renderAllPacks(p);
      packs.builder.files[2]!.content += "\n- Also add messaging.\n";
      const r = inspectPack(packs.builder, currentLock(p)!);
      expect(r.valid).toBe(false);
      expect(r.problems.join(" ")).toMatch(/content changed after TheDuck rendered it/);
    });

    it("a pack whose header was re-pointed to a fake fingerprint is invalid", () => {
      const p = refineAndLock(physioPath);
      const packs = renderAllPacks(p);
      const fake = "sha256:" + "0".repeat(64);
      packs.founder.lockFingerprint = fake;
      packs.founder.files = packs.founder.files.map((f) => ({ ...f, content: f.content.replace(currentLock(p)!.fingerprint, fake) }));
      const r = inspectPack(packs.founder, currentLock(p)!);
      expect(r.valid).toBe(false);
    });

    it("a lock altered in memory no longer matches its own fingerprint", () => {
      const p = refineAndLock(physioPath);
      const lock = structuredClone(currentLock(p)!);
      lock.intent.targetUser = "Everyone";
      const r = inspectPack(renderAllPacks(p).builder, lock);
      expect(r.valid).toBe(false);
      expect(r.problems.join(" ")).toMatch(/itself has been altered/);
    });
  });
});
