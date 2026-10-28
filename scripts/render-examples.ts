/**
 * Dev script: render the three M1.1 fixture projects into examples/ for review.
 * Output is a rendering of each fixture's lock — never a source of truth.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { checkPackConsistency, currentLock, renderAllPacks } from "../src/core/index.ts";
import { ALL_FIXTURES } from "../fixtures/ideas.ts";
import { refineAndLock } from "../fixtures/run-session.ts";

const out = "examples";
rmSync(out, { recursive: true, force: true });
const index: string[] = [];
for (const f of ALL_FIXTURES) {
  const project = refineAndLock(f);
  const lock = currentLock(project);
  if (!lock) throw new Error("not locked");
  const packs = renderAllPacks(project);
  const problems = checkPackConsistency(packs, lock);
  if (problems.length) throw new Error(`${f.key}: ${problems.join("; ")}`);
  for (const pack of Object.values(packs)) {
    const dir = join(out, f.key, pack.kind);
    mkdirSync(dir, { recursive: true });
    for (const file of pack.files) writeFileSync(join(dir, file.name), file.content);
    writeFileSync(
      join(dir, "MANIFEST.json"),
      JSON.stringify({ projectId: pack.projectId, lockVersion: pack.lockVersion, lockFingerprint: pack.lockFingerprint, files: pack.manifest }, null, 2) + "\n",
    );
  }
  index.push(`| \`${f.key}\` | ${f.description} | ${project.refinement.asked.length} | \`${lock.fingerprint.slice(7, 19)}\` |`);
  console.log(`${f.key}: ${project.refinement.asked.length} questions, lock ${lock.fingerprint}, consistency problems: 0`);
}
writeFileSync(
  join(out, "README.md"),
  `# Example packs (generated)

Rendered by \`npm run render:examples\` from the made-up M1.1 fixtures in \`fixtures/ideas.ts\`.
These files are renderings of each fixture's lock, not sources of truth. Regenerate; do not edit.

| Fixture | What it represents | Questions asked | Lock fingerprint |
|---|---|---|---|
${index.join("\n")}
`,
);
