/**
 * LOCAL PROTOTYPE STORAGE ONLY. Not production or multi-user persistence:
 * no locking between processes, no auth, no backups. See ADR-001.
 *
 * Layout under <root>/projects/<id>/:
 *   project.json   current state (no locks, no events) — atomic replace
 *   events.jsonl   append-only event log
 *   locks/vN.json  immutable lock snapshots — written once, never replaced
 */
import { closeSync, existsSync, fsyncSync, linkSync, mkdirSync, openSync, readdirSync, readFileSync, renameSync, unlinkSync, writeSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { IntegrityError } from "../model/errors.ts";
import { canonicalJson } from "../model/integrity.ts";
import { LockSnapshot, Project, ProjectEvent } from "../model/schema.ts";
import { computeFingerprint } from "../intent-gate/gate.ts";

const StoredProject = Project.omit({ locks: true, events: true }).extend({
  lockIndex: z.array(z.object({ version: z.number().int().min(1), fingerprint: z.string() })),
  eventCount: z.number().int().min(0),
});

const SAFE_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;

function writeFileDurable(path: string, data: string): void {
  const fd = openSync(path, "wx");
  try {
    writeSync(fd, data);
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}

/** Write to a temp file, fsync, then rename over the target. */
function atomicReplace(path: string, data: string): void {
  const tmp = `${path}.${randomUUID()}.tmp`;
  writeFileDurable(tmp, data);
  renameSync(tmp, path);
}

/** Write once. Fails if the file already exists (hard link refuses to overwrite). */
function atomicCreateOnce(path: string, data: string): void {
  const tmp = `${path}.${randomUUID()}.tmp`;
  writeFileDurable(tmp, data);
  try {
    linkSync(tmp, path);
  } finally {
    unlinkSync(tmp);
  }
}

export class FileProjectStore {
  readonly root: string;
  constructor(root: string) {
    this.root = root;
  }

  private dir(id: string): string {
    if (!SAFE_ID.test(id)) throw new IntegrityError(`Unsafe project id "${id}".`);
    return join(this.root, "projects", id);
  }

  save(project: Project): void {
    const p = Project.parse(project); // schema-validated before anything is written
    const dir = this.dir(p.id);
    mkdirSync(join(dir, "locks"), { recursive: true });

    // 1. Locks: immutable. Existing files must match byte-for-byte content.
    for (const lock of p.locks) {
      if (computeFingerprint(lock) !== lock.fingerprint) {
        throw new IntegrityError(`Refusing to save lock v${lock.version}: fingerprint does not match content.`);
      }
      const path = join(dir, "locks", `v${lock.version}.json`);
      const data = canonicalJson(lock) + "\n";
      if (existsSync(path)) {
        if (readFileSync(path, "utf8") !== data) {
          throw new IntegrityError(`Lock v${lock.version} already exists with different content. Locks are immutable.`);
        }
      } else {
        atomicCreateOnce(path, data);
      }
    }

    // 2. Events: append-only. Stored events must be an exact prefix of the new list.
    const eventsPath = join(dir, "events.jsonl");
    const stored = existsSync(eventsPath) ? readFileSync(eventsPath, "utf8").split("\n").filter(Boolean) : [];
    if (stored.length > p.events.length) {
      throw new IntegrityError("Refusing to save: the event log would shrink. The log is append-only.");
    }
    stored.forEach((line, n) => {
      if (line !== canonicalJson(p.events[n])) {
        throw new IntegrityError(`Refusing to save: stored event #${n + 1} would be rewritten. The log is append-only.`);
      }
    });
    const fresh = p.events.slice(stored.length).map((e) => canonicalJson(e) + "\n").join("");
    if (fresh) {
      const fd = openSync(eventsPath, "a");
      try {
        writeSync(fd, fresh);
        fsyncSync(fd);
      } finally {
        closeSync(fd);
      }
    }

    // 3. Current state: atomic replace.
    const { locks, events, ...rest } = p;
    const doc = StoredProject.parse({
      ...rest,
      lockIndex: locks.map((l) => ({ version: l.version, fingerprint: l.fingerprint })),
      eventCount: events.length,
    });
    atomicReplace(join(dir, "project.json"), JSON.stringify(doc, null, 2) + "\n");
  }

  load(id: string): Project {
    const dir = this.dir(id);
    const doc = StoredProject.parse(JSON.parse(readFileSync(join(dir, "project.json"), "utf8")));
    const events = readFileSync(join(dir, "events.jsonl"), "utf8")
      .split("\n")
      .filter(Boolean)
      .map((l) => ProjectEvent.parse(JSON.parse(l)));
    if (events.length !== doc.eventCount) {
      throw new IntegrityError(`Event log has ${events.length} events; project.json expects ${doc.eventCount}.`);
    }
    events.forEach((e, n) => {
      if (e.seq !== n + 1) throw new IntegrityError(`Event log out of order at #${n + 1}.`);
    });
    const lockFiles = readdirSync(join(dir, "locks")).filter((f) => /^v\d+\.json$/.test(f));
    if (lockFiles.length !== doc.lockIndex.length) {
      throw new IntegrityError(`Found ${lockFiles.length} lock files; project.json expects ${doc.lockIndex.length}.`);
    }
    const locks = doc.lockIndex.map(({ version, fingerprint }) => {
      const lock = LockSnapshot.parse(JSON.parse(readFileSync(join(dir, "locks", `v${version}.json`), "utf8")));
      if (lock.fingerprint !== fingerprint || computeFingerprint(lock) !== lock.fingerprint) {
        throw new IntegrityError(`Lock v${version} has been altered on disk: its fingerprint no longer matches.`);
      }
      return lock;
    });
    const { lockIndex: _li, eventCount: _ec, ...rest } = doc;
    return Project.parse({ ...rest, locks, events });
  }
}
