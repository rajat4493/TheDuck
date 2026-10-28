/**
 * Future Adapter Boundary.
 *
 * An adapter turns a frozen lock into target-specific files. It cannot write
 * back: it receives frozen copies, and runAdapter verifies afterwards that the
 * lock is unchanged and that the output is anchored to the same fingerprint and
 * carries the locked fields verbatim.
 *
 * M1 implements Universal only. Nothing here calls an external service.
 */
import { canonicalJson } from "../model/integrity.ts";
import type { Project } from "../model/schema.ts";
import { computeFingerprint } from "../intent-gate/gate.ts";
import { makePack, renderInputFor } from "../renderer/common.ts";
import type { Pack, RenderInput, RenderedFile } from "../renderer/common.ts";
import { checkCoverage, checkHeaders } from "../renderer/checks.ts";

export interface BuilderAdapter {
  readonly id: string;
  readonly target: string;
  /** Always false in M1: adapters render files; they do not call any platform. */
  readonly isLiveIntegration: false;
  render(input: RenderInput): RenderedFile[];
}

export type AdapterResult = { ok: true; pack: Pack } | { ok: false; violations: string[] };

export function runAdapter(adapter: BuilderAdapter, project: Project, version?: number): AdapterResult {
  const input = renderInputFor(project, version);
  const before = canonicalJson(project.locks);
  const violations: string[] = [];
  let files: RenderedFile[] = [];
  try {
    files = adapter.render(input);
  } catch (err) {
    violations.push(
      err instanceof TypeError
        ? `Adapter "${adapter.id}" tried to modify the locked intent (${err.message}). Refused.`
        : `Adapter "${adapter.id}" failed: ${(err as Error).message}`,
    );
  }
  if (canonicalJson(project.locks) !== before) violations.push("The project's locks changed during rendering. Refused.");
  for (const lock of project.locks) {
    if (computeFingerprint(lock) !== lock.fingerprint) violations.push(`Lock v${lock.version} fingerprint no longer matches.`);
  }
  if (violations.length === 0) {
    violations.push(...checkHeaders(files, input.lock), ...checkCoverage(files.map((f) => f.content).join("\n"), input.lock, adapter.id));
  }
  if (adapter.isLiveIntegration !== false) violations.push(`Adapter "${adapter.id}" claims to be a live integration; M1 forbids that.`);
  return violations.length ? { ok: false, violations } : { ok: true, pack: makePack("universal", input, files) };
}
