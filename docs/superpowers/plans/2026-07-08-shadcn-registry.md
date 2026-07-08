# shadcn Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the existing 21 components and 6 blocks as a shadcn registry so consumers pull full, editable source (`npx shadcn add <url>`) with all dependencies auto-copied; drop npm publishing.

**Architecture:** A generator in `apps/docs/scripts/registry/` reads the monorepo source, rewrites `@manpowerhub/ui` barrel imports into shadcn aliases (`@/components/ui/*`, `@/lib/utils`), stages the transformed files, and emits a `registry.json`. `shadcn build` compiles that into static `apps/docs/public/r/*.json`, served by the existing `apps/docs` Vercel deploy. The generator runs at docs `prebuild`, so registry JSON is regenerated on every deploy — no committed generated artifacts.

**Tech Stack:** TypeScript, `ts-morph` (AST parse for exported-symbol resolution), `shadcn` CLI v4, Vitest (existing docs test runner), Next.js (docs host), pnpm workspaces.

## Global Constraints

- Emitted registry source files MUST contain no `@manpowerhub/*` import — every barrel import is rewritten to `@/components/ui/<name>`, `@/components/blocks/<name>`, or `@/lib/utils`. A residual `@manpowerhub/` in output is a build failure.
- `react` and `react-dom` are consumer-owned peers — never listed in an item's `dependencies`.
- Registry item names are the kebab-case component/block dir names (e.g. `pricing-table`), matching `packages/ui/src/components/**` and `packages/blocks/src/components/**`.
- The shared `cn` util is registry item `utils` (type `registry:lib`), target `lib/utils.ts`. Anything resolving to `cn`/`ClassValue` maps to `@/lib/utils`.
- All new tooling lives in `apps/docs` (the host); do not add a new workspace package.
- No npm publishing anywhere after this work — registry is the only distribution channel.

---

## File Structure

- `apps/docs/scripts/registry/symbol-map.ts` — build `Map<exportedSymbol, registryName>` from the `@manpowerhub/ui` barrel.
- `apps/docs/scripts/registry/rewrite-imports.ts` — transform `@manpowerhub/*` imports in a source file into alias imports.
- `apps/docs/scripts/registry/scan-deps.ts` — from a file's imports, compute npm `dependencies` and `registryDependencies`.
- `apps/docs/scripts/registry/build-registry.ts` — orchestrator: walk source, stage rewritten files, emit `registry.json`.
- `apps/docs/scripts/registry/*.test.ts` — Vitest tests colocated.
- `apps/docs/registry.json` — generated (gitignored).
- `apps/docs/registry/**` — staged transformed source the registry entries point at (gitignored).
- `apps/docs/public/r/*.json` — `shadcn build` output (gitignored).
- `apps/docs/package.json` — add `ts-morph` + `shadcn` devDeps, wire `gen:registry` into `gen`.
- `apps/docs/content/**` — one consumer-facing "Install via registry" docs page.
- `.github/workflows/release.yml` — remove npm publish.
- `.github/workflows/ci.yml` — add registry generation check.
- `.gitignore` — ignore generated registry paths.

---

### Task 1: Symbol → registry-name map

**Files:**
- Create: `apps/docs/scripts/registry/symbol-map.ts`
- Test: `apps/docs/scripts/registry/symbol-map.test.ts`

**Interfaces:**
- Produces: `buildSymbolMap(uiSrcDir: string): Map<string, string>` — maps every exported symbol name (e.g. `Card`, `CardBody`, `Field`, `KPICard`, `cn`) to its registry item name (`card`, `card`, `input`, `kpi-card`, `utils`).

- [ ] **Step 1: Add ts-morph devDep**

Run: `pnpm --filter @manpowerhub/docs add -D ts-morph`
Expected: `ts-morph` appears in `apps/docs/package.json` devDependencies.

- [ ] **Step 2: Write the failing test**

```ts
// apps/docs/scripts/registry/symbol-map.test.ts
import { describe, it, expect } from "vitest";
import path from "node:path";
import { buildSymbolMap } from "./symbol-map";

const UI_SRC = path.resolve(__dirname, "../../../../packages/ui/src");

describe("buildSymbolMap", () => {
  const map = buildSymbolMap(UI_SRC);

  it("maps card sub-exports to card", () => {
    expect(map.get("Card")).toBe("card");
    expect(map.get("CardBody")).toBe("card");
    expect(map.get("CardTitle")).toBe("card");
  });

  it("maps Field to input", () => {
    expect(map.get("Field")).toBe("input");
  });

  it("maps KPICard and KPI to kpi-card", () => {
    expect(map.get("KPICard")).toBe("kpi-card");
    expect(map.get("KPI")).toBe("kpi-card");
  });

  it("maps cn to utils", () => {
    expect(map.get("cn")).toBe("utils");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/docs exec vitest run scripts/registry/symbol-map.test.ts`
Expected: FAIL — "Cannot find module './symbol-map'".

- [ ] **Step 4: Implement symbol-map.ts**

```ts
// apps/docs/scripts/registry/symbol-map.ts
import path from "node:path";
import { Project } from "ts-morph";

/**
 * Reads packages/ui/src/index.ts (the barrel) and, for each
 * `export * from "./components/<name>"` / `export * from "./lib/utils"`,
 * resolves that module's exported symbol names into a
 * Map<symbolName, registryName>. Components → their dir name; lib/utils → "utils".
 */
export function buildSymbolMap(uiSrcDir: string): Map<string, string> {
  const project = new Project({
    tsConfigFilePath: path.join(uiSrcDir, "..", "tsconfig.json"),
    skipAddingFilesFromTsConfig: true,
  });
  const barrel = project.addSourceFileAtPath(path.join(uiSrcDir, "index.ts"));
  const map = new Map<string, string>();

  for (const exp of barrel.getExportDeclarations()) {
    const spec = exp.getModuleSpecifierValue(); // e.g. "./components/card" | "./lib/utils"
    if (!spec) continue;
    const registryName = spec === "./lib/utils"
      ? "utils"
      : spec.replace("./components/", "");

    const modPath = path.join(uiSrcDir, spec + ".ts");
    const tsxPath = path.join(uiSrcDir, spec + ".tsx");
    const dirIndex = path.join(uiSrcDir, spec, "index.ts");
    const target = [modPath, tsxPath, dirIndex].find((p) => project.getFileSystem().fileExistsSync(p));
    if (!target) continue;

    const mod = project.addSourceFileAtPath(target);
    for (const [name] of mod.getExportedDeclarations()) {
      map.set(name, registryName);
    }
  }
  return map;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/docs exec vitest run scripts/registry/symbol-map.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add apps/docs/package.json apps/docs/scripts/registry/symbol-map.ts apps/docs/scripts/registry/symbol-map.test.ts pnpm-lock.yaml
git commit -m "feat(registry): resolve ui barrel symbols to registry item names"
```

---

### Task 2: Rewrite barrel imports to shadcn aliases

**Files:**
- Create: `apps/docs/scripts/registry/rewrite-imports.ts`
- Test: `apps/docs/scripts/registry/rewrite-imports.test.ts`

**Interfaces:**
- Consumes: `Map<string, string>` from Task 1.
- Produces: `rewriteImports(source: string, symbolMap: Map<string,string>, kind: "ui" | "block"): { code: string; registryDeps: Set<string> }` — replaces every `@manpowerhub/ui` and `@manpowerhub/tokens` import with alias imports grouped by target module, and returns the set of registry item names referenced.

Alias rules:
- symbol → `utils` ⇒ import from `@/lib/utils`
- symbol → `<component>` ⇒ import from `@/components/ui/<component>`
- `@manpowerhub/tokens` imports ⇒ dropped from code (tokens are global CSS/preset, not module imports) and NOT added to registryDeps; a comment `// tokens: install @/styles/globals.css + tailwind preset` is inserted once.

- [ ] **Step 1: Write the failing test**

```ts
// apps/docs/scripts/registry/rewrite-imports.test.ts
import { describe, it, expect } from "vitest";
import { rewriteImports } from "./rewrite-imports";

const map = new Map<string, string>([
  ["Card", "card"], ["CardBody", "card"], ["Button", "button"],
  ["Badge", "badge"], ["cn", "utils"],
]);

describe("rewriteImports", () => {
  it("splits a barrel import into per-module alias imports", () => {
    const src = `import { Card, CardBody, Button, Badge, cn } from "@manpowerhub/ui";\n`;
    const { code, registryDeps } = rewriteImports(src, map, "block");
    expect(code).toContain(`from "@/components/ui/card"`);
    expect(code).toContain(`from "@/components/ui/button"`);
    expect(code).toContain(`from "@/components/ui/badge"`);
    expect(code).toContain(`from "@/lib/utils"`);
    expect(code).not.toContain("@manpowerhub");
    expect(registryDeps).toEqual(new Set(["card", "button", "badge", "utils"]));
  });

  it("groups multiple symbols from the same module into one import", () => {
    const src = `import { Card, CardBody } from "@manpowerhub/ui";\n`;
    const { code } = rewriteImports(src, map, "block");
    const cardImports = code.match(/from "@\/components\/ui\/card"/g) ?? [];
    expect(cardImports).toHaveLength(1);
    expect(code).toMatch(/import \{ Card, CardBody \} from "@\/components\/ui\/card"/);
  });

  it("leaves type-only imports intact", () => {
    const src = `import { KPICard, type KPI } from "@manpowerhub/ui";\n`;
    const m = new Map([["KPICard", "kpi-card"], ["KPI", "kpi-card"]]);
    const { code } = rewriteImports(src, m, "block");
    expect(code).toMatch(/import \{ KPICard, type KPI \} from "@\/components\/ui\/kpi-card"/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/docs exec vitest run scripts/registry/rewrite-imports.test.ts`
Expected: FAIL — "Cannot find module './rewrite-imports'".

- [ ] **Step 3: Implement rewrite-imports.ts**

```ts
// apps/docs/scripts/registry/rewrite-imports.ts
type Rewrite = { code: string; registryDeps: Set<string> };

const BARREL = /import\s+\{([^}]*)\}\s+from\s+["']@manpowerhub\/ui["'];?/g;
const TOKENS = /import\s+[^;]*from\s+["']@manpowerhub\/tokens["'];?/g;

/** Split one `{ A, type B }` clause into named entries preserving `type` modifier. */
function parseSpecifiers(clause: string): { text: string; name: string }[] {
  return clause.split(",").map((raw) => raw.trim()).filter(Boolean).map((text) => {
    const name = text.replace(/^type\s+/, "").trim();
    return { text, name };
  });
}

export function rewriteImports(
  source: string,
  symbolMap: Map<string, string>,
  _kind: "ui" | "block",
): Rewrite {
  const registryDeps = new Set<string>();

  let code = source.replace(BARREL, (_full, clause: string) => {
    const byModule = new Map<string, string[]>(); // aliasPath -> specifier texts
    for (const spec of parseSpecifiers(clause)) {
      const reg = symbolMap.get(spec.name);
      if (!reg) throw new Error(`Unknown @manpowerhub/ui export: ${spec.name}`);
      registryDeps.add(reg);
      const aliasPath = reg === "utils" ? "@/lib/utils" : `@/components/ui/${reg}`;
      const list = byModule.get(aliasPath) ?? [];
      list.push(spec.text);
      byModule.set(aliasPath, list);
    }
    return [...byModule.entries()]
      .map(([aliasPath, specs]) => `import { ${specs.join(", ")} } from "${aliasPath}";`)
      .join("\n");
  });

  code = code.replace(TOKENS, "// tokens: install @/styles/globals.css + tailwind preset");

  return { code, registryDeps };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/docs exec vitest run scripts/registry/rewrite-imports.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/docs/scripts/registry/rewrite-imports.ts apps/docs/scripts/registry/rewrite-imports.test.ts
git commit -m "feat(registry): rewrite @manpowerhub/ui barrel imports to shadcn aliases"
```

---

### Task 3: Scan npm + registry dependencies

**Files:**
- Create: `apps/docs/scripts/registry/scan-deps.ts`
- Test: `apps/docs/scripts/registry/scan-deps.test.ts`

**Interfaces:**
- Produces: `scanNpmDeps(source: string): string[]` — bare npm specifiers imported by a file, excluding `react`, `react-dom`, anything starting `@/`, and anything starting `@manpowerhub/`. Scoped packages keep scope (`@radix-ui/react-dialog`); deep paths reduce to the package root (`lucide-react`).

- [ ] **Step 1: Write the failing test**

```ts
// apps/docs/scripts/registry/scan-deps.test.ts
import { describe, it, expect } from "vitest";
import { scanNpmDeps } from "./scan-deps";

describe("scanNpmDeps", () => {
  it("collects npm specifiers, excluding react and aliases", () => {
    const src = [
      `import * as React from "react";`,
      `import { cva } from "class-variance-authority";`,
      `import { Check } from "lucide-react";`,
      `import { Slot } from "@radix-ui/react-slot";`,
      `import { cn } from "@/lib/utils";`,
    ].join("\n");
    expect(scanNpmDeps(src).sort()).toEqual(
      ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"],
    );
  });

  it("reduces deep import paths to package root", () => {
    const src = `import x from "date-fns/format";`;
    expect(scanNpmDeps(src)).toEqual(["date-fns"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/docs exec vitest run scripts/registry/scan-deps.test.ts`
Expected: FAIL — "Cannot find module './scan-deps'".

- [ ] **Step 3: Implement scan-deps.ts**

```ts
// apps/docs/scripts/registry/scan-deps.ts
const IMPORT = /from\s+["']([^"']+)["']/g;
const EXCLUDE = new Set(["react", "react-dom"]);

/** Reduce a specifier to its package root: "@scope/pkg/x" -> "@scope/pkg", "pkg/x" -> "pkg". */
function packageRoot(spec: string): string {
  const parts = spec.split("/");
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

export function scanNpmDeps(source: string): string[] {
  const deps = new Set<string>();
  for (const m of source.matchAll(IMPORT)) {
    const spec = m[1];
    if (spec.startsWith("@/") || spec.startsWith(".") || spec.startsWith("@manpowerhub/")) continue;
    const root = packageRoot(spec);
    if (EXCLUDE.has(root)) continue;
    deps.add(root);
  }
  return [...deps];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/docs exec vitest run scripts/registry/scan-deps.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/docs/scripts/registry/scan-deps.ts apps/docs/scripts/registry/scan-deps.test.ts
git commit -m "feat(registry): scan file imports for npm dependencies"
```

---

### Task 4: Build orchestrator — stage files + emit registry.json

**Files:**
- Create: `apps/docs/scripts/registry/build-registry.ts`
- Test: `apps/docs/scripts/registry/build-registry.test.ts`

**Interfaces:**
- Consumes: `buildSymbolMap` (T1), `rewriteImports` (T2), `scanNpmDeps` (T3).
- Produces: `buildRegistry(opts: { uiSrc: string; blocksSrc: string; utilsSrc: string; tokensSrc: string; outDir: string; stageDir: string }): Registry` where `Registry = { $schema: string; name: string; homepage: string; items: RegistryItem[] }`. Writes staged transformed source into `stageDir` and returns the in-memory registry object (caller writes `registry.json`). Item shape:
  ```ts
  type RegistryItem = {
    name: string;
    type: "registry:ui" | "registry:block" | "registry:lib";
    dependencies?: string[];
    registryDependencies?: string[];
    files: { path: string; type: "registry:component" | "registry:block" | "registry:lib"; target?: string }[];
  };
  ```

Rules the orchestrator applies:
- Walk each dir under `uiSrc/components/*` → one `registry:ui` item; only the primary `<name>.tsx` file is shipped (skip `*.stories.tsx`, `*.test.tsx`, `index.ts`).
- Walk each dir under `blocksSrc/components/*` → one `registry:block` item.
- Each shipped file is read, run through `rewriteImports` (kind by item type), written to `stageDir/<ui|blocks>/<name>/<file>`; `dependencies = scanNpmDeps(rewrittenCode)`; `registryDependencies = [...registryDeps]` from the rewrite.
- The `utils` item (`registry:lib`) ships `utilsSrc` verbatim (no rewrite; it has no barrel import), `target: "lib/utils.ts"`, `dependencies: ["clsx", "tailwind-merge"]`.

- [ ] **Step 1: Write the failing test**

```ts
// apps/docs/scripts/registry/build-registry.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { buildRegistry } from "./build-registry";

const ROOT = path.resolve(__dirname, "../../../..");
let reg: ReturnType<typeof buildRegistry>;

beforeAll(() => {
  const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), "reg-stage-"));
  reg = buildRegistry({
    uiSrc: path.join(ROOT, "packages/ui/src"),
    blocksSrc: path.join(ROOT, "packages/blocks/src"),
    utilsSrc: path.join(ROOT, "packages/ui/src/lib/utils.ts"),
    tokensSrc: path.join(ROOT, "packages/tokens/src"),
    outDir: path.join(ROOT, "apps/docs/public/r"),
    stageDir,
  });
});

describe("buildRegistry", () => {
  const item = (n: string) => reg.items.find((i) => i.name === n)!;

  it("emits a registry:ui item for button", () => {
    expect(item("button").type).toBe("registry:ui");
  });

  it("emits pricing-table as a block that depends on card/button/badge/utils", () => {
    const pt = item("pricing-table");
    expect(pt.type).toBe("registry:block");
    for (const dep of ["card", "button", "badge", "utils"]) {
      expect(pt.registryDependencies).toContain(dep);
    }
  });

  it("includes a utils lib item targeting lib/utils.ts", () => {
    const u = item("utils");
    expect(u.type).toBe("registry:lib");
    expect(u.files[0].target).toBe("lib/utils.ts");
  });

  it("stages files with no residual @manpowerhub import", () => {
    for (const it of reg.items) {
      for (const f of it.files) {
        const staged = fs.readFileSync(path.join(reg.stageDir, f.path), "utf8");
        expect(staged).not.toContain("@manpowerhub/");
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/docs exec vitest run scripts/registry/build-registry.test.ts`
Expected: FAIL — "Cannot find module './build-registry'".

- [ ] **Step 3: Implement build-registry.ts**

```ts
// apps/docs/scripts/registry/build-registry.ts
import fs from "node:fs";
import path from "node:path";
import { buildSymbolMap } from "./symbol-map";
import { rewriteImports } from "./rewrite-imports";
import { scanNpmDeps } from "./scan-deps";

type ItemType = "registry:ui" | "registry:block" | "registry:lib";
type FileType = "registry:component" | "registry:block" | "registry:lib";
export interface RegistryItem {
  name: string;
  type: ItemType;
  dependencies?: string[];
  registryDependencies?: string[];
  files: { path: string; type: FileType; target?: string }[];
}
export interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
  stageDir: string; // convenience for tests/build; stripped before writing registry.json
}

interface Opts {
  uiSrc: string; blocksSrc: string; utilsSrc: string;
  tokensSrc: string; outDir: string; stageDir: string;
}

const isShipped = (f: string) =>
  f.endsWith(".tsx") && !f.endsWith(".stories.tsx") && !f.endsWith(".test.tsx");

function stage(stageDir: string, relPath: string, code: string) {
  const dest = path.join(stageDir, relPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, code);
}

function buildComponentItems(
  baseDir: string, group: "ui" | "blocks", itemType: ItemType,
  fileType: FileType, symbolMap: Map<string, string>, stageDir: string,
): RegistryItem[] {
  const componentsDir = path.join(baseDir, "components");
  return fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const name = d.name;
      const dir = path.join(componentsDir, name);
      const deps = new Set<string>();
      const registryDeps = new Set<string>();
      const files = fs.readdirSync(dir).filter(isShipped).map((file) => {
        const raw = fs.readFileSync(path.join(dir, file), "utf8");
        const { code, registryDeps: rd } = rewriteImports(raw, symbolMap, group === "blocks" ? "block" : "ui");
        scanNpmDeps(code).forEach((x) => deps.add(x));
        rd.forEach((x) => registryDeps.add(x));
        const relPath = `${group}/${name}/${file}`;
        stage(stageDir, relPath, code);
        return { path: relPath, type: fileType };
      });
      const item: RegistryItem = { name, type: itemType, files };
      if (deps.size) item.dependencies = [...deps].sort();
      if (registryDeps.size) item.registryDependencies = [...registryDeps].sort();
      return item;
    });
}

export function buildRegistry(opts: Opts): Registry {
  const symbolMap = buildSymbolMap(opts.uiSrc);

  const uiItems = buildComponentItems(opts.uiSrc, "ui", "registry:ui", "registry:component", symbolMap, opts.stageDir);
  const blockItems = buildComponentItems(opts.blocksSrc, "blocks", "registry:block", "registry:block", symbolMap, opts.stageDir);

  // utils lib item — shipped verbatim.
  const utilsCode = fs.readFileSync(opts.utilsSrc, "utf8");
  stage(opts.stageDir, "lib/utils.ts", utilsCode);
  const utilsItem: RegistryItem = {
    name: "utils",
    type: "registry:lib",
    dependencies: ["clsx", "tailwind-merge"],
    files: [{ path: "lib/utils.ts", type: "registry:lib", target: "lib/utils.ts" }],
  };

  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "manpowerhub",
    homepage: "https://ui.manpowerhub.com",
    items: [utilsItem, ...uiItems, ...blockItems],
    stageDir: opts.stageDir,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/docs exec vitest run scripts/registry/build-registry.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/docs/scripts/registry/build-registry.ts apps/docs/scripts/registry/build-registry.test.ts
git commit -m "feat(registry): orchestrate staging and registry.json generation"
```

---

### Task 5: CLI entry + wire into docs build

**Files:**
- Create: `apps/docs/scripts/registry/gen-registry.mjs` (thin runnable wrapper)
- Modify: `apps/docs/package.json` (scripts + shadcn devDep)
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `buildRegistry` (T4).
- Produces: on run, writes `apps/docs/registry.json` (with `stageDir` stripped), stages source under `apps/docs/registry/`, then invokes `shadcn build` to emit `apps/docs/public/r/*.json`.

- [ ] **Step 1: Add shadcn devDep**

Run: `pnpm --filter @manpowerhub/docs add -D shadcn@^4`
Expected: `shadcn` in `apps/docs/package.json` devDependencies.

- [ ] **Step 2: Write the runnable wrapper**

Because the modules are `.ts`, run them via a tsx loader available to Vitest's toolchain; the docs app already uses TypeScript ESM. Use a small compiled entry:

```js
// apps/docs/scripts/registry/gen-registry.mjs
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { register } from "node:module";

register("ts-node/esm", import.meta.url); // compile the .ts modules on the fly

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
fs.writeFileSync(path.join(DOCS, "registry.json"), JSON.stringify(json, null, 2));

execFileSync("npx", ["shadcn", "build", path.join(DOCS, "registry.json"), "--output", path.join(DOCS, "public/r")], {
  cwd: DOCS, stdio: "inherit",
});
console.log(`registry: ${json.items.length} items written to public/r`);
```

Note: if `ts-node` is not already present, add it: `pnpm --filter @manpowerhub/docs add -D ts-node`. (The docs test toolchain uses Vitest/esbuild; `ts-node/esm` is the simplest standalone loader for a one-off script.)

- [ ] **Step 3: Wire package.json scripts**

Edit `apps/docs/package.json` `scripts`:

```jsonc
"gen": "node scripts/gen-demo-sources.mjs && node scripts/gen-props.mjs && node scripts/registry/gen-registry.mjs",
"gen:registry": "node scripts/registry/gen-registry.mjs",
```

(`prebuild` already runs `pnpm gen`, so Vercel regenerates the registry on every deploy.)

- [ ] **Step 4: Gitignore generated artifacts**

Add to `.gitignore`:

```
apps/docs/registry.json
apps/docs/registry/
apps/docs/public/r/
```

- [ ] **Step 5: Run the generator end-to-end**

Run: `pnpm --filter @manpowerhub/docs gen:registry`
Expected: prints `registry: 28 items written to public/r`; files exist:
Run: `ls apps/docs/public/r/button.json apps/docs/public/r/pricing-table.json apps/docs/public/r/utils.json`
Expected: all three listed.

- [ ] **Step 6: Verify block JSON carries its component deps**

Run: `cat apps/docs/public/r/pricing-table.json | grep -o '"registryDependencies":\[[^]]*\]'`
Expected: contains `card`, `button`, `badge`, `utils`.

- [ ] **Step 7: Commit**

```bash
git add apps/docs/package.json apps/docs/scripts/registry/gen-registry.mjs .gitignore pnpm-lock.yaml
git commit -m "feat(registry): generate registry.json and build to public/r via shadcn"
```

---

### Task 6: Build guard — fail on residual barrel imports or unresolved block deps

**Files:**
- Create: `apps/docs/scripts/registry/verify-registry.test.ts`

**Interfaces:**
- Consumes: generated `apps/docs/public/r/*.json` + staged `apps/docs/registry/**` from Task 5.

- [ ] **Step 1: Write the guard test**

```ts
// apps/docs/scripts/registry/verify-registry.test.ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const DOCS = path.resolve(__dirname, "../..");
const R = path.join(DOCS, "public/r");

const files = fs.existsSync(R) ? fs.readdirSync(R).filter((f) => f.endsWith(".json")) : [];

describe("generated registry", () => {
  it("has been generated (run `pnpm gen:registry` first)", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it("contains no @manpowerhub import in any emitted file content", () => {
    for (const f of files) {
      const json = JSON.parse(fs.readFileSync(path.join(R, f), "utf8"));
      for (const file of json.files ?? []) {
        expect(file.content ?? "").not.toContain("@manpowerhub/");
      }
    }
  });

  it("references only registry items that exist as their own file", () => {
    const names = new Set(files.map((f) => f.replace(/\.json$/, "")));
    for (const f of files) {
      const json = JSON.parse(fs.readFileSync(path.join(R, f), "utf8"));
      for (const dep of json.registryDependencies ?? []) {
        expect(names.has(dep)).toBe(true);
      }
    }
  });
});
```

- [ ] **Step 2: Run guard (generate first)**

Run: `pnpm --filter @manpowerhub/docs gen:registry && pnpm --filter @manpowerhub/docs exec vitest run scripts/registry/verify-registry.test.ts`
Expected: PASS (3 tests). If "references only registry items" fails, an auto-detected `registryDependency` (e.g. an icon helper) has no published item — add it to the published set or add an override; re-run.

- [ ] **Step 3: Commit**

```bash
git add apps/docs/scripts/registry/verify-registry.test.ts
git commit -m "test(registry): guard against residual barrel imports and dangling deps"
```

---

### Task 7: End-to-end smoke — install a block into a scratch app

**Files:**
- Create: `apps/docs/scripts/registry/smoke.md` (documented manual/CI procedure)

**Interfaces:**
- Consumes: generated `apps/docs/public/r/*.json`.

- [ ] **Step 1: Document + run the smoke procedure**

Create `apps/docs/scripts/registry/smoke.md`:

```md
# Registry smoke test

1. Serve the registry locally:
   `pnpm --filter @manpowerhub/docs gen:registry`
   `npx serve apps/docs/public -l 5055`   # serves /r/*.json at http://localhost:5055/r/
2. Scaffold a scratch consumer:
   `pnpm dlx create-next-app@latest /tmp/reg-smoke --ts --tailwind --app --eslint --no-src-dir --use-pnpm --yes`
   `cd /tmp/reg-smoke && pnpm dlx shadcn@latest init -d`
3. Add a block:
   `pnpm dlx shadcn@latest add http://localhost:5055/r/pricing-table.json`
   Expect: pricing-table.tsx + card.tsx + button.tsx + badge.tsx + lib/utils.ts written; radix/cva/lucide installed.
4. Typecheck:
   `pnpm exec tsc --noEmit`
   Expect: no errors from the added files.
```

- [ ] **Step 2: Execute the procedure once, capture result**

Run the steps in `smoke.md`. Expected: step 3 writes the block plus its four `registryDependencies`; step 4 typechecks clean. If typecheck fails on token classes, that is expected (consumer must install tokens) — only import/resolution errors are failures.

- [ ] **Step 3: Commit**

```bash
git add apps/docs/scripts/registry/smoke.md
git commit -m "docs(registry): add end-to-end install smoke procedure"
```

---

### Task 8: Consumer docs page

**Files:**
- Create: `apps/docs/content/registry.mdx` (path per existing docs content convention — mirror an existing page's frontmatter)

- [ ] **Step 1: Inspect an existing content page for frontmatter/format**

Run: `ls apps/docs/content && head -20 apps/docs/content/*.mdx 2>/dev/null | head -40`
Expected: shows the frontmatter shape (title, etc.) to mirror.

- [ ] **Step 2: Write the page**

Create `apps/docs/content/registry.mdx` mirroring the observed frontmatter, with body:

```md
# Install via registry

Components and blocks are distributed as source you copy into your own repo —
no `@manpowerhub/*` package to install. Uses the standard shadcn CLI.

## One component

    npx shadcn@latest add https://ui.manpowerhub.com/r/button.json

## A full block (pulls its component deps automatically)

    npx shadcn@latest add https://ui.manpowerhub.com/r/pricing-table.json

This copies `pricing-table.tsx` plus `card`, `button`, `badge`, and the `cn`
util into your project, and installs the required npm packages
(`class-variance-authority`, `lucide-react`, the relevant `@radix-ui/*`).

## One-time setup: tokens

Components use CSS variables and a Tailwind preset. Copy the tokens once:

- `globals.css` — the CSS variable definitions (import in your root layout).
- `tailwind-preset` — add to your `tailwind.config` `presets: [...]`.

React and Tailwind are peer prerequisites your app already owns.
```

- [ ] **Step 3: Build docs to verify the page renders**

Run: `pnpm --filter @manpowerhub/docs build`
Expected: build succeeds; no MDX errors for `registry.mdx`.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/content/registry.mdx
git commit -m "docs(registry): add consumer install guide"
```

---

### Task 9: Drop npm publishing from release workflow

**Files:**
- Modify: `.github/workflows/release.yml`
- Modify: root `package.json` (remove `release` publish script)

- [ ] **Step 1: Remove the npm publish job**

In `.github/workflows/release.yml`, delete the `release` job (the `changesets/action@v1` step with `publish: pnpm release` and the `NPM_TOKEN`/`NODE_AUTH_TOKEN` env). Change `deploy-docs` to no longer `needs: release` (make it run directly on push to `main`). Remove `registry-url: https://registry.npmjs.org` from any `setup-node`.

Resulting `release.yml` top-level jobs: only `deploy-docs`. (Keep its `pnpm -r build` and pages deploy of Storybook — that still ships the Storybook site; registry JSON is served by the separate Vercel `apps/docs` deploy.)

- [ ] **Step 2: Remove the publish script**

In root `package.json`, delete the `"release": "pnpm -r build && changeset publish"` line. (Keep `changeset` / `version-packages` only if still used for internal notes; otherwise remove those and the `@changesets/cli` devDep in a follow-up — out of scope here.)

- [ ] **Step 3: Verify workflow YAML is valid**

Run: `npx --yes yaml-lint .github/workflows/release.yml || node -e "require('js-yaml').load(require('fs').readFileSync('.github/workflows/release.yml','utf8')); console.log('ok')"`
Expected: prints `ok` (or lint passes) — no YAML syntax error.

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/release.yml package.json
git commit -m "chore(release): drop npm publishing; registry is sole distribution"
```

---

### Task 10: CI check for registry generation

**Files:**
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Add a registry generation + guard step**

In `.github/workflows/ci.yml` `build-test` job, after the existing `pnpm test` step, add:

```yaml
      - name: Generate registry
        run: pnpm --filter @manpowerhub/docs gen:registry

      - name: Verify registry
        run: pnpm --filter @manpowerhub/docs exec vitest run scripts/registry/verify-registry.test.ts
```

- [ ] **Step 2: Verify YAML valid**

Run: `node -e "require('js-yaml').load(require('fs').readFileSync('.github/workflows/ci.yml','utf8')); console.log('ok')"`
Expected: prints `ok`.

- [ ] **Step 3: Run the full docs test suite locally as a final gate**

Run: `pnpm --filter @manpowerhub/docs gen:registry && pnpm --filter @manpowerhub/docs test`
Expected: all registry tests (symbol-map, rewrite-imports, scan-deps, build-registry, verify-registry) pass alongside existing docs tests.

- [ ] **Step 4: Add a changeset-free commit and open PR**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: generate and verify shadcn registry"
git push -u origin feat/shadcn-registry
gh pr create --fill --base main
```

Expected: PR opens; CI runs build, typecheck, lint, test, and the new registry generation + verify steps.

---

## Notes carried from spec (open items resolved here)

- **Docs domain:** plan uses `https://ui.manpowerhub.com` as the homepage/base in generated JSON and docs copy. If the real Vercel domain differs, change the `homepage` in `build-registry.ts` and the URLs in `registry.mdx` — single source each.
- **Changesets:** left in place; removing them entirely is a follow-up, not required for registry-only distribution.
- **Auto-detected deps:** the generator auto-derives `dependencies`/`registryDependencies`. Task 6's guard catches dangling registry deps; fix by publishing the missing item or narrowing imports. No hand-maintained override map is introduced unless the guard forces it.
