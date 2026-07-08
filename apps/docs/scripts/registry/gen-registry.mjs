// apps/docs/scripts/registry/gen-registry.mjs
//
// Runnable wrapper around buildRegistry() (build-registry.ts):
//   1. builds the registry (writes staged/rewritten source under apps/docs/registry/)
//   2. writes apps/docs/registry.json (stageDir stripped)
//   3. invokes `shadcn build` to emit apps/docs/public/r/*.json
//
// The registry modules are authored in TypeScript. This script is invoked via
// `node --import tsx gen-registry.mjs`, so `tsx`'s ESM loader hook transpiles
// the `.ts` imports on the fly (no ts-node needed).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../../..");
const DOCS = path.resolve(__dirname, "../..");

const { buildRegistry } = await import("./build-registry.ts");

const registry = buildRegistry({
  uiSrc: path.join(ROOT, "packages/ui/src"),
  blocksSrc: path.join(ROOT, "packages/blocks/src"),
  utilsSrc: path.join(ROOT, "packages/ui/src/lib/utils.ts"),
  tokensSrc: path.join(ROOT, "packages/tokens/src"),
  outDir: path.join(DOCS, "public/r"),
  stageDir: path.join(DOCS, "registry"),
});

const { stageDir, ...json } = registry;
const serialized = JSON.stringify(json, null, 2);

// `shadcn build` resolves each item's file `path` relative to the directory
// containing registry.json, and the staged/rewritten source lives under
// `stageDir` (apps/docs/registry/) with paths like "ui/button/button.tsx"
// relative to that directory. So the copy fed to `shadcn build` must sit
// inside stageDir; we also write the canonical copy at apps/docs/registry.json
// as the documented deliverable.
fs.writeFileSync(path.join(DOCS, "registry.json"), serialized);
fs.writeFileSync(path.join(stageDir, "registry.json"), serialized);

execFileSync(
  "npx",
  ["shadcn", "build", path.join(stageDir, "registry.json"), "--output", path.join(DOCS, "public/r")],
  { cwd: stageDir, stdio: "inherit" },
);

console.log(`registry: ${json.items.length} items written to public/r`);
