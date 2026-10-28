import { createHash } from "node:crypto";

/** JSON with object keys sorted recursively, so equal content hashes equally. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value).sort()) {
      const v = (value as Record<string, unknown>)[key];
      if (v !== undefined) out[key] = sortKeys(v);
    }
    return out;
  }
  return value;
}

export function sha256(text: string): string {
  return "sha256:" + createHash("sha256").update(text, "utf8").digest("hex");
}

export function shortFingerprint(fp: string): string {
  return fp.replace(/^sha256:/, "").slice(0, 12);
}

/** Recursively freezes an object so accidental or hostile mutation throws in strict mode. */
export function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const v of Object.values(value)) deepFreeze(v);
  }
  return value;
}

/** A frozen deep copy: safe to hand to renderers, adapters and providers. */
export function readonlyCopy<T>(value: T): T {
  return deepFreeze(structuredClone(value));
}
