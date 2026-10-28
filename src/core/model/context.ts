import { randomUUID } from "node:crypto";

/** Clock + id source, injected so behaviour is reproducible in tests. */
export interface Ctx {
  now(): string;
  id(prefix: string): string;
}

export function systemCtx(): Ctx {
  return {
    now: () => new Date().toISOString(),
    id: (prefix) => `${prefix}-${randomUUID().slice(0, 8)}`,
  };
}

/** Deterministic context: each now() advances one second; ids count up per prefix. */
export function fixedCtx(start = "2026-10-28T09:00:00.000Z"): Ctx {
  let t = Date.parse(start);
  const counters = new Map<string, number>();
  return {
    now: () => {
      const iso = new Date(t).toISOString();
      t += 1000;
      return iso;
    },
    id: (prefix) => {
      const n = (counters.get(prefix) ?? 0) + 1;
      counters.set(prefix, n);
      return `${prefix}-${String(n).padStart(4, "0")}`;
    },
  };
}
