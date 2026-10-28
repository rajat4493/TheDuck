import { appendFileSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  FileProjectStore,
  IntegrityError,
  canonicalJson,
  decideChangeProposal,
  fixedCtx,
  proposeChange,
} from "../src/core/index.ts";
import type { Project } from "../src/core/index.ts";
import { physioPath } from "../fixtures/ideas.ts";
import { OWNER, refine, refineAndLock } from "../fixtures/run-session.ts";

let root: string;
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "theduck-store-"));
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

const dir = (p: Project) => join(root, "projects", p.id);

describe("Local prototype storage", () => {
  it("round-trips a locked project exactly", () => {
    const store = new FileProjectStore(root);
    const p = refineAndLock(physioPath);
    store.save(p);
    expect(canonicalJson(store.load(p.id))).toBe(canonicalJson(p));
  });

  it("stores each lock version as its own immutable file", () => {
    const store = new FileProjectStore(root);
    const ctx = fixedCtx("2026-10-28T12:00:00.000Z");
    let p = refineAndLock(physioPath);
    store.save(p);
    const v1 = readFileSync(join(dir(p), "locks", "v1.json"), "utf8");
    p = proposeChange(p, { field: "stage", after: "pilot", reason: "Start smaller.", origin: "HUMAN" }, OWNER, ctx);
    p = decideChangeProposal(p, p.changeProposals[0]!.id, { decision: "approve", confirmed: true, by: OWNER }, ctx);
    store.save(p);
    expect(readFileSync(join(dir(p), "locks", "v1.json"), "utf8")).toBe(v1);
    expect(JSON.parse(readFileSync(join(dir(p), "locks", "v2.json"), "utf8")).version).toBe(2);
  });

  it("refuses to overwrite an existing lock file with different content", () => {
    const store = new FileProjectStore(root);
    const p = refineAndLock(physioPath);
    store.save(p);
    const other = refineAndLock(physioPath, fixedCtx("2026-10-29T09:00:00.000Z")); // same id, different lockedAt
    expect(() => store.save(other)).toThrow(/Locks are immutable/);
  });

  it("detects a lock file altered on disk", () => {
    const store = new FileProjectStore(root);
    const p = refineAndLock(physioPath);
    store.save(p);
    const path = join(dir(p), "locks", "v1.json");
    writeFileSync(path, readFileSync(path, "utf8").replace("Patients of one partner", "Anyone at a"));
    expect(() => store.load(p.id)).toThrow(/altered on disk/);
  });

  it("keeps the event log append-only", () => {
    const store = new FileProjectStore(root);
    const p = refineAndLock(physioPath);
    store.save(p);
    const rewritten = structuredClone(p);
    rewritten.events[0]!.summary = "History rewritten.";
    expect(() => store.save(rewritten)).toThrow(/append-only/);
    const shorter = structuredClone(p);
    shorter.events.pop();
    expect(() => store.save(shorter)).toThrow(/append-only/);
  });

  it("detects events injected into the log on disk", () => {
    const store = new FileProjectStore(root);
    const p = refineAndLock(physioPath);
    store.save(p);
    appendFileSync(join(dir(p), "events.jsonl"), canonicalJson(p.events[0]) + "\n");
    expect(() => store.load(p.id)).toThrow(IntegrityError);
  });

  it("validates against the schema before writing anything", () => {
    const store = new FileProjectStore(root);
    const bad = { ...refine(physioPath), status: "approved-ish" } as unknown as Project;
    expect(() => store.save(bad)).toThrow();
    expect(() => readFileSync(join(root, "projects", bad.id, "project.json"))).toThrow();
  });

  it("refuses unsafe project ids", () => {
    const store = new FileProjectStore(root);
    expect(() => store.load("../../etc")).toThrow(IntegrityError);
  });

  it("leaves no temp files behind", () => {
    const store = new FileProjectStore(root);
    const p = refineAndLock(physioPath);
    store.save(p);
    store.save(p);
    const all = [...readdirSync(dir(p)), ...readdirSync(join(dir(p), "locks"))];
    expect(all.filter((n) => n.endsWith(".tmp"))).toEqual([]);
  });
});

