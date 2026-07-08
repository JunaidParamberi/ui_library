# Docs App Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `apps/docs` into a rich, branded component reference — live preview with copyable code, auto-generated props tables, states galleries, Storybook/Playground deep links, and tests.

**Architecture:** Two build-time codegen scripts (`gen-demo-sources`, `gen-props`) emit static modules consumed by upgraded MDX primitives (`ComponentPreview`, `PropsTable`, `VariantGallery`, `FullViewLinks`). Docs remain on Nextra (restyled to `@manpowerhub/tokens`) and keep `output: "export"`, so all code/prop data is produced at build time — never at request time.

**Tech Stack:** Next 15, Nextra 4, React 18, Tailwind 3, `react-docgen-typescript@2.4.0`, Vitest + Testing Library + `vitest-axe`.

## Global Constraints

- Docs app is `output: "export"` in production — no request-time server, no runtime `fs` reads. All code/prop data via prebuild codegen imported as static modules.
- `apps/docs/package.json` is `private: true` — no changeset required for changes scoped to the docs app. A changeset IS required if any `packages/ui`, `packages/blocks`, or `packages/tokens` source changes.
- Node ESM: docs scripts use `.mjs`, `import`, top-level `await` allowed.
- Test stack pinned to repo convention: `vitest run`, `@testing-library/react`, `vitest-axe` (`import { axe } from "vitest-axe"`), jsdom, `ResizeObserver` polyfill in setup (Radix needs it).
- Generated files live in `apps/docs/src/generated/` and are gitignored.
- Generator scripts exit non-zero on failure so CI catches broken generation.
- Branch: `docs/docs-app-overhaul`. Conventional Commits. One logical change per commit.

---

## File Structure

```
apps/docs/
  vitest.config.ts              CREATE  test harness
  vitest.setup.ts               CREATE  jest-dom + ResizeObserver polyfill
  .gitignore                    MODIFY  ignore src/generated
  package.json                  MODIFY  test/predev/prebuild scripts + devDeps
  scripts/
    gen-demo-sources.mjs        CREATE  demos/*.tsx -> demo-sources.generated.ts
    gen-props.mjs               CREATE  ui+blocks types -> props.generated.json
    __fixtures__/               CREATE  generator test fixtures
  src/generated/                CREATE (gitignored) generator output
  src/lib/
    catalog.ts                  CREATE  single list of {slug, demoKey, docgenName, story, storyId}
  src/components/
    component-preview.tsx        MODIFY  Preview|Code tabs + copy + dark toggle
    props-table.tsx             CREATE
    variant-gallery.tsx         CREATE
    full-view-links.tsx         CREATE
  src/components/__tests__/
    demos-smoke.test.tsx        CREATE  render every demo + axe
    component-preview.test.tsx  CREATE
    props-table.test.tsx        CREATE
    variant-gallery.test.tsx    CREATE
    full-view-links.test.tsx    CREATE
    link-integrity.test.tsx     CREATE  catalog <-> demos/stories/anchors
  scripts/__tests__/
    gen-demo-sources.test.mjs   CREATE
    gen-props.test.mjs          CREATE
  app/globals.css               MODIFY  Nextra vars -> tokens (restyle)
  content/components/*.mdx       MODIFY  migrate to new template (x20)
  content/blocks/*.mdx          MODIFY  migrate to new template (x6)
  content/foundations/*.mdx      MODIFY  visual token showcase
apps/playground/
  src/pages/components-showcase.tsx  MODIFY  add id anchors
  src/pages/blocks-showcase.tsx      MODIFY  add id anchors
  src/pages/anchors.test.tsx         CREATE  assert anchors exist
```

`catalog.ts` is the single source of truth mapping a component slug to its demo key, docgen
component name, and story id. Every primitive and test reads it, so links can't silently drift.

---

## Task 1: Docs test harness

**Files:**
- Create: `apps/docs/vitest.config.ts`, `apps/docs/vitest.setup.ts`
- Modify: `apps/docs/package.json`, `apps/docs/.gitignore`

**Interfaces:**
- Produces: `pnpm --filter @manpowerhub/docs test` runs Vitest (jsdom); `src/generated` gitignored.

- [ ] **Step 1: Add devDeps + scripts to `apps/docs/package.json`**

Add to `devDependencies`:
```json
"@testing-library/jest-dom": "^6.4.0",
"@testing-library/react": "^16.0.0",
"@vitejs/plugin-react": "^4.7.0",
"jsdom": "^29.1.1",
"vitest": "^2.0.0",
"vitest-axe": "^0.1.0",
"react-docgen-typescript": "^2.4.0"
```
Add to `scripts`:
```json
"gen": "node scripts/gen-demo-sources.mjs && node scripts/gen-props.mjs",
"predev": "pnpm gen",
"prebuild": "pnpm gen",
"pretest": "pnpm gen",
"test": "vitest run"
```

- [ ] **Step 2: Create `apps/docs/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.mjs"],
  },
});
```

- [ ] **Step 3: Create `apps/docs/vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";

// Radix UI uses ResizeObserver internally; jsdom does not implement it.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
```

- [ ] **Step 4: Add `src/generated` to `apps/docs/.gitignore`**

Append line:
```
/src/generated
```

- [ ] **Step 5: Sanity test the harness**

Create `apps/docs/src/components/__tests__/harness.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("renders JSX in jsdom", () => {
    render(<button>ok</button>);
    expect(screen.getByRole("button", { name: "ok" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Install + run**

Run: `pnpm install && pnpm --filter @manpowerhub/docs test`
Expected: harness test PASS. (Generators don't exist yet — `pretest` will fail; temporarily run `pnpm --filter @manpowerhub/docs exec vitest run src/components/__tests__/harness.test.tsx` for this step, or add generators first. To keep order clean, comment out `pretest` until Task 3, then restore.)

- [ ] **Step 7: Commit**

```bash
git add apps/docs/vitest.config.ts apps/docs/vitest.setup.ts apps/docs/package.json apps/docs/.gitignore apps/docs/src/components/__tests__/harness.test.tsx pnpm-lock.yaml
git commit -m "test(docs): add vitest harness"
```

---

## Task 2: gen-demo-sources script

**Files:**
- Create: `apps/docs/scripts/gen-demo-sources.mjs`, `apps/docs/scripts/__tests__/gen-demo-sources.test.mjs`, `apps/docs/scripts/__fixtures__/sample-demo.tsx`

**Interfaces:**
- Produces: `apps/docs/src/generated/demo-sources.generated.ts` exporting
  `export const demoSources: Record<string, string>` keyed by demo file basename
  (e.g. `"button-demo"`), value = source with leading `"use client";` line removed.
- Exposes pure helper `stripUseClient(src: string): string` and
  `buildSourcesMap(dir: string): Record<string,string>` for testing.

- [ ] **Step 1: Write the failing generator test**

`apps/docs/scripts/__tests__/gen-demo-sources.test.mjs`:
```js
import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { stripUseClient, buildSourcesMap } from "../gen-demo-sources.mjs";

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "__fixtures__");

describe("gen-demo-sources", () => {
  it("strips the use client directive", () => {
    expect(stripUseClient('"use client";\nimport x;')).toBe("import x;");
    expect(stripUseClient("import x;")).toBe("import x;");
  });

  it("keys the map by basename without extension", () => {
    const map = buildSourcesMap(fixtures);
    expect(Object.keys(map)).toContain("sample-demo");
    expect(map["sample-demo"]).toContain("SampleDemo");
    expect(map["sample-demo"]).not.toContain("use client");
  });
});
```

- [ ] **Step 2: Create the fixture `apps/docs/scripts/__fixtures__/sample-demo.tsx`**

```tsx
"use client";
export function SampleDemo() {
  return <div>sample</div>;
}
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/docs exec vitest run scripts/__tests__/gen-demo-sources.test.mjs`
Expected: FAIL — cannot resolve `../gen-demo-sources.mjs`.

- [ ] **Step 4: Implement `apps/docs/scripts/gen-demo-sources.mjs`**

```js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const DEMOS_DIR = path.join(here, "..", "src", "components", "demos");
const OUT = path.join(here, "..", "src", "generated", "demo-sources.generated.ts");

export function stripUseClient(src) {
  return src.replace(/^\s*["']use client["'];?\s*\n/, "");
}

export function buildSourcesMap(dir) {
  const map = {};
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".tsx")) continue;
    const key = file.replace(/\.tsx$/, "");
    map[key] = stripUseClient(fs.readFileSync(path.join(dir, file), "utf8")).trimEnd();
  }
  return map;
}

function main() {
  const map = buildSourcesMap(DEMOS_DIR);
  const body =
    "// AUTO-GENERATED by scripts/gen-demo-sources.mjs. Do not edit.\n" +
    "export const demoSources: Record<string, string> = " +
    JSON.stringify(map, null, 2) +
    ";\n";
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, body);
  console.log(`gen-demo-sources: wrote ${Object.keys(map).length} demos`);
}

// Run only when executed directly, not when imported by tests.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error("gen-demo-sources failed:", err);
    process.exit(1);
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/docs exec vitest run scripts/__tests__/gen-demo-sources.test.mjs`
Expected: PASS (2 tests).

- [ ] **Step 6: Run the generator for real**

Run: `pnpm --filter @manpowerhub/docs exec node scripts/gen-demo-sources.mjs`
Expected: prints `gen-demo-sources: wrote 26 demos`; creates `src/generated/demo-sources.generated.ts`.

- [ ] **Step 7: Commit**

```bash
git add apps/docs/scripts/gen-demo-sources.mjs apps/docs/scripts/__tests__ apps/docs/scripts/__fixtures__
git commit -m "feat(docs): generate demo source map at build"
```

---

## Task 3: gen-props script

**Files:**
- Create: `apps/docs/scripts/gen-props.mjs`, `apps/docs/scripts/__tests__/gen-props.test.mjs`
- Modify: `apps/docs/package.json` (restore `pretest` if commented in Task 1)

**Interfaces:**
- Produces: `apps/docs/src/generated/props.generated.json` — shape
  `Record<string, Array<{ name: string; type: string; defaultValue: string | null; required: boolean; description: string }>>`
  keyed by component display name (e.g. `"Button"`).
- Exposes pure helper `normalizeProps(docgenComponent)` mapping react-docgen-typescript output
  to the shape above, for testing.

- [ ] **Step 1: Write the failing test**

`apps/docs/scripts/__tests__/gen-props.test.mjs`:
```js
import { describe, expect, it } from "vitest";
import { normalizeProps } from "../gen-props.mjs";

describe("gen-props normalizeProps", () => {
  it("maps docgen props to the doc shape", () => {
    const input = {
      props: {
        variant: {
          name: "variant",
          type: { name: '"primary" | "secondary"' },
          required: false,
          defaultValue: { value: "secondary" },
          description: "Visual style",
        },
        id: { name: "id", type: { name: "string" }, required: true, defaultValue: null, description: "" },
      },
    };
    const out = normalizeProps(input);
    expect(out).toContainEqual({
      name: "variant",
      type: '"primary" | "secondary"',
      defaultValue: "secondary",
      required: false,
      description: "Visual style",
    });
    expect(out.find((p) => p.name === "id")).toMatchObject({ required: true, defaultValue: null });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/docs exec vitest run scripts/__tests__/gen-props.test.mjs`
Expected: FAIL — cannot resolve `../gen-props.mjs`.

- [ ] **Step 3: Implement `apps/docs/scripts/gen-props.mjs`**

```js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withCompilerOptions } from "react-docgen-typescript";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(here, "..", "..", "..");
const OUT = path.join(here, "..", "src", "generated", "props.generated.json");

const SOURCES = [
  path.join(ROOT, "packages", "ui", "src", "components"),
  path.join(ROOT, "packages", "blocks", "src", "components"),
];

export function normalizeProps(component) {
  return Object.values(component.props ?? {}).map((p) => ({
    name: p.name,
    type: p.type?.name ?? "unknown",
    defaultValue: p.defaultValue ? p.defaultValue.value : null,
    required: Boolean(p.required),
    description: p.description ?? "",
  }));
}

function collectTsx(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectTsx(full));
    else if (
      entry.name.endsWith(".tsx") &&
      !entry.name.endsWith(".stories.tsx") &&
      !entry.name.endsWith(".test.tsx")
    ) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  const parser = withCompilerOptions(
    { esModuleInterop: true, jsx: 4 /* react-jsx */ },
    {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        !(prop.parent && /node_modules/.test(prop.parent.fileName)),
    },
  );

  const files = SOURCES.flatMap((d) => (fs.existsSync(d) ? collectTsx(d) : []));
  const result = {};
  for (const comp of parser.parse(files)) {
    if (!comp.displayName) continue;
    result[comp.displayName] = normalizeProps(comp);
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + "\n");
  console.log(`gen-props: wrote ${Object.keys(result).length} components`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error("gen-props failed:", err);
    process.exit(1);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/docs exec vitest run scripts/__tests__/gen-props.test.mjs`
Expected: PASS.

- [ ] **Step 5: Run generator for real + eyeball output**

Run: `pnpm --filter @manpowerhub/docs exec node scripts/gen-props.mjs`
Expected: prints `gen-props: wrote N components` (N ≥ 20); `src/generated/props.generated.json` contains a `"Button"` key with a `variant` prop entry.
If `Button` is missing (docgen can't resolve `forwardRef` displayName), verify each component sets `Button.displayName = "Button"` — if not, note the gap for Task 9 and rely on catalog `docgenName` mapping.

- [ ] **Step 6: Restore `pretest` in `package.json` (if commented in Task 1) and run full docs test**

Run: `pnpm --filter @manpowerhub/docs test`
Expected: `pretest` runs both generators, then all current tests PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/docs/scripts/gen-props.mjs apps/docs/scripts/__tests__/gen-props.test.mjs apps/docs/package.json pnpm-lock.yaml
git commit -m "feat(docs): generate props tables from component types"
```

---

## Task 4: Component catalog + demo smoke/axe test

**Files:**
- Create: `apps/docs/src/lib/catalog.ts`, `apps/docs/src/components/__tests__/demos-smoke.test.tsx`

**Interfaces:**
- Produces: `export interface CatalogEntry { slug: string; demoKey: string; docgenName: string; story: string; storyId: string; pkg: "ui" | "blocks"; }`
  and `export const catalog: CatalogEntry[]`. Consumed by `FullViewLinks`,
  `link-integrity.test`, and page authors.

- [ ] **Step 1: Create `apps/docs/src/lib/catalog.ts`**

One entry per component/block. Example head (fill all 26 — slug = doc route, demoKey = demo
file basename, docgenName = component display name, story/storyId = Storybook path):
```ts
export interface CatalogEntry {
  slug: string;
  demoKey: string;
  docgenName: string;
  story: string;
  storyId: string;
  pkg: "ui" | "blocks";
}

export const catalog: CatalogEntry[] = [
  { slug: "button", demoKey: "button-demo", docgenName: "Button", story: "core-button", storyId: "primary", pkg: "ui" },
  { slug: "badge", demoKey: "badge-demo", docgenName: "Badge", story: "core-badge", storyId: "default", pkg: "ui" },
  // …one line per component + block (26 total)…
  { slug: "auth-form", demoKey: "auth-form-demo", docgenName: "AuthForm", story: "blocks-authform", storyId: "default", pkg: "blocks" },
];
```
(Derive `story`/`storyId` from each `*.stories.tsx` `title`/export; confirm against a running
Storybook or the story `title` field.)

- [ ] **Step 2: Write the failing demo smoke test**

`apps/docs/src/components/__tests__/demos-smoke.test.tsx`:
```tsx
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

const modules = import.meta.glob("../demos/*.tsx", { eager: true });

describe("all demos", () => {
  for (const [file, mod] of Object.entries(modules)) {
    const entries = Object.entries(mod as Record<string, unknown>).filter(
      ([, v]) => typeof v === "function",
    );
    for (const [name, Comp] of entries) {
      it(`${file} › ${name} renders without crash and is axe-clean`, async () => {
        const { container, unmount } = render(<>{(Comp as () => JSX.Element)()}</>);
        expect(await axe(container)).toHaveNoViolations();
        unmount();
      });
    }
  }
});
```

- [ ] **Step 3: Run — expect pass (demos already exist)**

Run: `pnpm --filter @manpowerhub/docs exec vitest run src/components/__tests__/demos-smoke.test.tsx`
Expected: PASS for all demo exports. If a demo throws or has axe violations, fix that demo (real defect) before continuing.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/src/lib/catalog.ts apps/docs/src/components/__tests__/demos-smoke.test.tsx
git commit -m "test(docs): smoke-render + axe every demo; add component catalog"
```

---

## Task 5: Upgrade ComponentPreview (Preview | Code tabs)

**Files:**
- Modify: `apps/docs/src/components/component-preview.tsx`
- Create: `apps/docs/src/components/__tests__/component-preview.test.tsx`

**Interfaces:**
- Consumes: nothing generated at import time (source passed as prop).
- Produces: `ComponentPreview({ children, source }: { children: ReactNode; source?: string })`.
  When `source` present, renders Preview/Code tab buttons + a copy button
  (`navigator.clipboard.writeText`). When absent, preview only.

- [ ] **Step 1: Write the failing test**

`apps/docs/src/components/__tests__/component-preview.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ComponentPreview } from "../component-preview";

describe("ComponentPreview", () => {
  it("renders preview only when no source", () => {
    render(<ComponentPreview><span>demo</span></ComponentPreview>);
    expect(screen.getByText("demo")).toBeVisible();
    expect(screen.queryByRole("tab", { name: /code/i })).toBeNull();
  });

  it("shows Code tab and copies source", async () => {
    const writeText = vi.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    render(
      <ComponentPreview source={'<Button>Hi</Button>'}>
        <span>demo</span>
      </ComponentPreview>,
    );
    await userEvent.click(screen.getByRole("tab", { name: /code/i }));
    expect(screen.getByText(/<Button>Hi<\/Button>/)).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: /copy/i }));
    expect(writeText).toHaveBeenCalledWith("<Button>Hi</Button>");
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @manpowerhub/docs exec vitest run src/components/__tests__/component-preview.test.tsx`
Expected: FAIL — no tabs / copy button.

- [ ] **Step 3: Implement `apps/docs/src/components/component-preview.tsx`**

```tsx
"use client";
import { useState, type ReactNode } from "react";

export function ComponentPreview({
  children,
  source,
}: {
  children: ReactNode;
  source?: string;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!source) return;
    await navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-border bg-background">
      {source && (
        <div
          role="tablist"
          className="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1"
        >
          <button
            role="tab"
            aria-selected={tab === "preview"}
            onClick={() => setTab("preview")}
            className={`rounded px-3 py-1 text-sm ${tab === "preview" ? "bg-background font-medium" : "text-muted-foreground"}`}
          >
            Preview
          </button>
          <button
            role="tab"
            aria-selected={tab === "code"}
            onClick={() => setTab("code")}
            className={`rounded px-3 py-1 text-sm ${tab === "code" ? "bg-background font-medium" : "text-muted-foreground"}`}
          >
            Code
          </button>
          <button
            onClick={copy}
            className="ml-auto rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            aria-label="Copy code"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      {tab === "preview" || !source ? (
        <div className="p-6">{children}</div>
      ) : (
        <pre className="overflow-x-auto p-4 text-sm">
          <code>{source}</code>
        </pre>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @manpowerhub/docs exec vitest run src/components/__tests__/component-preview.test.tsx`
Expected: PASS.

- [ ] **Step 5: Add `@testing-library/user-event` devDep if missing**

Check `apps/docs/package.json`; if `@testing-library/user-event` absent, add `"@testing-library/user-event": "^14.6.1"`, run `pnpm install`.

- [ ] **Step 6: Commit**

```bash
git add apps/docs/src/components/component-preview.tsx apps/docs/src/components/__tests__/component-preview.test.tsx apps/docs/package.json pnpm-lock.yaml
git commit -m "feat(docs): ComponentPreview gains copyable Code tab"
```

---

## Task 6: PropsTable

**Files:**
- Create: `apps/docs/src/components/props-table.tsx`, `apps/docs/src/components/__tests__/props-table.test.tsx`

**Interfaces:**
- Consumes: `src/generated/props.generated.json`.
- Produces: `PropsTable({ of }: { of: string })` rendering name/type/default/description; missing
  key → a single "No documented props" row.

- [ ] **Step 1: Write the failing test**

`apps/docs/src/components/__tests__/props-table.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../generated/props.generated.json", () => ({
  default: {
    Button: [
      { name: "variant", type: '"primary" | "secondary"', defaultValue: "secondary", required: false, description: "Style" },
    ],
  },
}));

import { PropsTable } from "../props-table";

describe("PropsTable", () => {
  it("renders rows for a known component", () => {
    render(<PropsTable of="Button" />);
    expect(screen.getByText("variant")).toBeInTheDocument();
    expect(screen.getByText("secondary")).toBeInTheDocument();
  });

  it("renders fallback for unknown component", () => {
    render(<PropsTable of="Nope" />);
    expect(screen.getByText(/no documented props/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @manpowerhub/docs exec vitest run src/components/__tests__/props-table.test.tsx`
Expected: FAIL — module `../props-table` missing.

- [ ] **Step 3: Implement `apps/docs/src/components/props-table.tsx`**

```tsx
import propsData from "../generated/props.generated.json";

interface PropRow {
  name: string;
  type: string;
  defaultValue: string | null;
  required: boolean;
  description: string;
}

const data = propsData as Record<string, PropRow[]>;

export function PropsTable({ of }: { of: string }) {
  const rows = data[of];
  if (!rows || rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No documented props for <code>{of}</code>.
      </p>
    );
  }
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2 pr-4 font-medium">Prop</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 pr-4 font-medium">Default</th>
            <th className="py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-border/50 align-top">
              <td className="py-2 pr-4 font-mono">
                {r.name}
                {r.required && <span className="text-danger"> *</span>}
              </td>
              <td className="py-2 pr-4 font-mono text-muted-foreground">{r.type}</td>
              <td className="py-2 pr-4 font-mono">{r.defaultValue ?? "—"}</td>
              <td className="py-2">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @manpowerhub/docs exec vitest run src/components/__tests__/props-table.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/components/props-table.tsx apps/docs/src/components/__tests__/props-table.test.tsx
git commit -m "feat(docs): PropsTable from generated types"
```

---

## Task 7: VariantGallery

**Files:**
- Create: `apps/docs/src/components/variant-gallery.tsx`, `apps/docs/src/components/__tests__/variant-gallery.test.tsx`

**Interfaces:**
- Produces: `VariantGallery({ children })` wrapping labeled cells, and
  `GalleryCell({ label, children })`. Renders a titled grid of state cells.

- [ ] **Step 1: Write the failing test**

`apps/docs/src/components/__tests__/variant-gallery.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VariantGallery, GalleryCell } from "../variant-gallery";

describe("VariantGallery", () => {
  it("labels each cell", () => {
    render(
      <VariantGallery>
        <GalleryCell label="Default"><span>a</span></GalleryCell>
        <GalleryCell label="Loading"><span>b</span></GalleryCell>
      </VariantGallery>,
    );
    expect(screen.getByText("Default")).toBeInTheDocument();
    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(screen.getByText("a")).toBeVisible();
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @manpowerhub/docs exec vitest run src/components/__tests__/variant-gallery.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement `apps/docs/src/components/variant-gallery.tsx`**

```tsx
import type { ReactNode } from "react";

export function VariantGallery({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-6 grid gap-4 rounded-lg border border-border bg-background p-4 sm:grid-cols-2">
      {children}
    </div>
  );
}

export function GalleryCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border/60 p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-1 items-center">{children}</div>
    </div>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @manpowerhub/docs exec vitest run src/components/__tests__/variant-gallery.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/components/variant-gallery.tsx apps/docs/src/components/__tests__/variant-gallery.test.tsx
git commit -m "feat(docs): VariantGallery for state matrices"
```

---

## Task 8: FullViewLinks + Playground env

**Files:**
- Create: `apps/docs/src/components/full-view-links.tsx`, `apps/docs/src/components/__tests__/full-view-links.test.tsx`
- Modify: `apps/docs/.env.example`

**Interfaces:**
- Consumes: existing `StorybookLink` (`src/components/storybook-link.tsx`), `catalog`.
- Produces: `FullViewLinks({ slug }: { slug: string })` rendering a Storybook link (via
  `StorybookLink` using the catalog entry's `pkg`/`story`/`storyId`) and a Playground link to
  `${NEXT_PUBLIC_PLAYGROUND_URL}/#<slug>` (default base `http://localhost:5173`).

- [ ] **Step 1: Write the failing test**

`apps/docs/src/components/__tests__/full-view-links.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FullViewLinks } from "../full-view-links";

describe("FullViewLinks", () => {
  it("links to storybook and playground for a known slug", () => {
    render(<FullViewLinks slug="button" />);
    const sb = screen.getByRole("link", { name: /storybook/i });
    expect(sb).toHaveAttribute("href", expect.stringContaining("core-button--primary"));
    const pg = screen.getByRole("link", { name: /playground/i });
    expect(pg).toHaveAttribute("href", expect.stringContaining("#button"));
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @manpowerhub/docs exec vitest run src/components/__tests__/full-view-links.test.tsx`
Expected: FAIL — module missing.

- [ ] **Step 3: Implement `apps/docs/src/components/full-view-links.tsx`**

```tsx
import { catalog } from "../lib/catalog";
import { StorybookLink } from "./storybook-link";

const PLAYGROUND =
  process.env.NEXT_PUBLIC_PLAYGROUND_URL ?? "http://localhost:5173";

export function FullViewLinks({ slug }: { slug: string }) {
  const entry = catalog.find((c) => c.slug === slug);
  if (!entry) return null;
  return (
    <div className="not-prose my-4 flex flex-wrap gap-4 text-sm">
      <StorybookLink package={entry.pkg} story={entry.story} storyId={entry.storyId} />
      <a
        href={`${PLAYGROUND}/#${slug}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        Open in Playground →
      </a>
    </div>
  );
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @manpowerhub/docs exec vitest run src/components/__tests__/full-view-links.test.tsx`
Expected: PASS.

- [ ] **Step 5: Document the env var**

Append to `apps/docs/.env.example`:
```
NEXT_PUBLIC_PLAYGROUND_URL=http://localhost:5173
```

- [ ] **Step 6: Commit**

```bash
git add apps/docs/src/components/full-view-links.tsx apps/docs/src/components/__tests__/full-view-links.test.tsx apps/docs/.env.example
git commit -m "feat(docs): FullViewLinks bridging Storybook + Playground"
```

---

## Task 9: Migrate component pages to the new template

**Files:**
- Modify: all 20 `apps/docs/content/components/*.mdx`
- Modify: demo files needing a `*StatesDemo` export under `apps/docs/src/components/demos/`
- Modify: `apps/docs/src/components/dynamic-demos.tsx` (register any new `*StatesDemo` dynamics)

**Interfaces:**
- Consumes: `demoSources` (generated), `ComponentPreview`, `PropsTable`, `VariantGallery`,
  `GalleryCell`, `FullViewLinks`, existing `*Demo` dynamics.

Do this component-by-component. `button.mdx` is the worked example; repeat the shape for the
other 19 (badge, card, input, select, checkbox, avatar, tabs, tooltip, dialog, dropdown-menu,
progress, skeleton, table, kpi-card, area-chart, app-shell, command-menu, theme-toggle, icons).

- [ ] **Step 1: Add a states demo export where the component has meaningful states**

In `apps/docs/src/components/demos/button-demo.tsx`, add:
```tsx
export function ButtonStatesDemo() {
  return null; // replaced below
}
```
then implement real cells (default / loading / disabled). Full file:
```tsx
"use client";
import { Button } from "@manpowerhub/ui";

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button loading>Loading</Button>
    </div>
  );
}

export function ButtonDefaultState() { return <Button variant="primary">Save</Button>; }
export function ButtonLoadingState() { return <Button loading>Save</Button>; }
export function ButtonDisabledState() { return <Button disabled>Save</Button>; }
```
(For components without distinct states — e.g. `icons` — skip the States section entirely.)

- [ ] **Step 2: Register new state demos as dynamics**

In `apps/docs/src/components/dynamic-demos.tsx`, add dynamic wrappers mirroring the existing
pattern:
```tsx
export const ButtonDefaultState = dynamic(
  () => import("./demos/button-demo").then((m) => m.ButtonDefaultState),
  { ssr: false, loading },
);
export const ButtonLoadingState = dynamic(
  () => import("./demos/button-demo").then((m) => m.ButtonLoadingState),
  { ssr: false, loading },
);
export const ButtonDisabledState = dynamic(
  () => import("./demos/button-demo").then((m) => m.ButtonDisabledState),
  { ssr: false, loading },
);
```

- [ ] **Step 3: Rewrite `apps/docs/content/components/button.mdx`**

```mdx
import { ButtonDemo, ButtonDefaultState, ButtonLoadingState, ButtonDisabledState } from "../../src/components/dynamic-demos";
import { ComponentPreview } from "../../src/components/component-preview";
import { PropsTable } from "../../src/components/props-table";
import { VariantGallery, GalleryCell } from "../../src/components/variant-gallery";
import { FullViewLinks } from "../../src/components/full-view-links";
import { demoSources } from "../../src/generated/demo-sources.generated";

# Button

Primary action control with variant and size options.

<FullViewLinks slug="button" />

## Preview

<ComponentPreview source={demoSources["button-demo"]}>
  <ButtonDemo />
</ComponentPreview>

## States

<VariantGallery>
  <GalleryCell label="Default"><ButtonDefaultState /></GalleryCell>
  <GalleryCell label="Loading"><ButtonLoadingState /></GalleryCell>
  <GalleryCell label="Disabled"><ButtonDisabledState /></GalleryCell>
</VariantGallery>

## Usage

Use `primary` for the single most important action on a view. Use `secondary` or `ghost`
for lower-emphasis actions. Reserve `danger` for destructive actions. Avoid more than one
`primary` button per section.

## Props

<PropsTable of="Button" />

## Accessibility

Renders a native `<button>`; keyboard-activatable with Enter/Space. When `loading`, the button
is disabled and exposes `aria-busy="true"`. Icon-only buttons must pass an `aria-label`.
```

- [ ] **Step 4: Repeat Steps 1–3 for the remaining 19 component pages**

Same shape, correct `slug`, `demoKey`, `of=` docgen name, and per-component states/usage/a11y
copy. Skip the States section only where no meaningful states exist.

- [ ] **Step 5: Build the docs app to verify MDX + imports compile**

Run: `pnpm --filter @manpowerhub/docs build`
Expected: build succeeds; no missing-import or undefined-component errors.

- [ ] **Step 6: Commit** (may split into a few commits across components)

```bash
git add apps/docs/content/components apps/docs/src/components/demos apps/docs/src/components/dynamic-demos.tsx
git commit -m "feat(docs): migrate component pages to rich template"
```

---

## Task 10: Migrate block pages

**Files:**
- Modify: all 6 `apps/docs/content/blocks/*.mdx` (auth-form, data-table-toolbar, empty-state, page-header, pricing-table, stat-card-row)

**Interfaces:** same primitives as Task 9; `pkg: "blocks"` catalog entries.

- [ ] **Step 1: Rewrite each block page** using the Task 9 template shape, e.g.
`apps/docs/content/blocks/empty-state.mdx`:
```mdx
import { EmptyStateDemo } from "../../src/components/dynamic-demos";
import { ComponentPreview } from "../../src/components/component-preview";
import { PropsTable } from "../../src/components/props-table";
import { FullViewLinks } from "../../src/components/full-view-links";
import { demoSources } from "../../src/generated/demo-sources.generated";

# Empty State

Placeholder shown when a collection has no items.

<FullViewLinks slug="empty-state" />

## Preview

<ComponentPreview source={demoSources["empty-state-demo"]}>
  <EmptyStateDemo />
</ComponentPreview>

## Props

<PropsTable of="EmptyState" />

## Accessibility

Uses a heading + descriptive text; the primary action is a real button/link and is
keyboard-reachable.
```
(States section optional for blocks — include where a loading/error variant exists, e.g.
`data-table-toolbar`, `auth-form`.)

- [ ] **Step 2: Build to verify**

Run: `pnpm --filter @manpowerhub/docs build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add apps/docs/content/blocks
git commit -m "feat(docs): migrate block pages to rich template"
```

---

## Task 11: Link integrity test

**Files:**
- Create: `apps/docs/src/components/__tests__/link-integrity.test.tsx`

**Interfaces:**
- Consumes: `catalog`, `demoSources` (generated), `props.generated.json`.

- [ ] **Step 1: Write the test**

`apps/docs/src/components/__tests__/link-integrity.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { catalog } from "../../lib/catalog";
import { demoSources } from "../../generated/demo-sources.generated";
import propsData from "../../generated/props.generated.json";

const props = propsData as Record<string, unknown>;

describe("catalog integrity", () => {
  it("every catalog demoKey has generated source", () => {
    for (const c of catalog) {
      expect(Object.keys(demoSources), `demoKey ${c.demoKey}`).toContain(c.demoKey);
    }
  });

  it("every catalog docgenName has a props entry", () => {
    for (const c of catalog) {
      expect(Object.keys(props), `docgenName ${c.docgenName}`).toContain(c.docgenName);
    }
  });

  it("slugs are unique", () => {
    const slugs = catalog.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
```

- [ ] **Step 2: Run**

Run: `pnpm --filter @manpowerhub/docs exec vitest run src/components/__tests__/link-integrity.test.tsx`
Expected: PASS. If a `docgenName` has no props entry (docgen couldn't resolve it), fix the
component's `displayName` in its package or correct the catalog entry — do not weaken the test.

- [ ] **Step 3: Commit**

```bash
git add apps/docs/src/components/__tests__/link-integrity.test.tsx
git commit -m "test(docs): assert catalog matches demos + props"
```

---

## Task 12: Nextra restyle + foundations visuals

**Files:**
- Modify: `apps/docs/app/globals.css`, `apps/docs/content/foundations/color.mdx`,
  `apps/docs/content/foundations/spacing.mdx`, `apps/docs/content/foundations/typography.mdx`
- Create: `apps/docs/src/components/token-swatches.tsx` (+ dynamic registration)

**Interfaces:**
- Produces: `ColorSwatches`, `SpacingScale`, `TypeRamp` components rendering from token CSS vars.

- [ ] **Step 1: Map Nextra theme vars to tokens in `app/globals.css`**

After the existing imports, add overrides binding Nextra's CSS custom properties to
`@manpowerhub/tokens` variables (primary, radius, font). Example:
```css
:root {
  --nextra-primary-hue: 0;      /* tune to brand */
  --nextra-primary-saturation: 0%;
}
/* Bind preview/foundation surfaces to token vars already imported by tokens/globals.css */
.nextra-content { font-family: var(--font-sans, ui-sans-serif); }
```
(Confirm the token var names from `packages/tokens/src/globals.css`; bind `--primary`,
`--border`, `--muted`, `--radius` where the docs chrome references color.)

- [ ] **Step 2: Create `apps/docs/src/components/token-swatches.tsx`**

```tsx
const COLORS = ["primary", "secondary", "muted", "danger", "border", "background", "foreground"];

export function ColorSwatches() {
  return (
    <div className="not-prose my-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {COLORS.map((c) => (
        <div key={c} className="rounded-md border border-border p-3 text-xs">
          <div className="mb-2 h-10 rounded" style={{ background: `var(--${c})` }} />
          <code>--{c}</code>
        </div>
      ))}
    </div>
  );
}

export function SpacingScale() {
  const steps = [1, 2, 3, 4, 6, 8, 12, 16];
  return (
    <div className="not-prose my-6 space-y-2">
      {steps.map((s) => (
        <div key={s} className="flex items-center gap-3 text-xs">
          <span className="w-10 font-mono">{s}</span>
          <div className="h-3 bg-primary" style={{ width: `${s * 0.25}rem` }} />
        </div>
      ))}
    </div>
  );
}

export function TypeRamp() {
  const sizes = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl"];
  return (
    <div className="not-prose my-6 space-y-1">
      {sizes.map((s) => (
        <p key={s} className={s}>
          {s} — The quick brown fox
        </p>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Embed the showcases in the foundations MDX**

In `color.mdx` add `import { ColorSwatches } from "../../src/components/token-swatches"` and
`<ColorSwatches />`; likewise `SpacingScale` in `spacing.mdx`, `TypeRamp` in `typography.mdx`.

- [ ] **Step 4: Build + eyeball**

Run: `pnpm --filter @manpowerhub/docs dev` then open `http://localhost:3001` and check a
component page + foundations pages render branded, tabs work, swatches show.
Expected: no console errors; restyle visible.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/app/globals.css apps/docs/src/components/token-swatches.tsx apps/docs/content/foundations
git commit -m "feat(docs): restyle to brand tokens + visual foundations"
```

---

## Task 13: Playground anchors + wiring test

**Files:**
- Modify: `apps/playground/src/pages/components-showcase.tsx`, `apps/playground/src/pages/blocks-showcase.tsx`
- Create: `apps/playground/src/pages/anchors.test.tsx`

**Interfaces:**
- Produces: each component/block section wrapped with `id="<slug>"` matching docs catalog slugs.

- [ ] **Step 1: Add `id` anchors to showcase sections**

In `components-showcase.tsx`, wrap each component's section with an `id` equal to its docs slug
(e.g. `<section id="button">…</section>`). Same in `blocks-showcase.tsx` for the 6 blocks.

- [ ] **Step 2: Write the anchor test**

`apps/playground/src/pages/anchors.test.tsx`:
```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComponentsShowcase } from "./components-showcase";

const EXPECTED = ["button", "badge", "card", "input", "select"]; // extend to full slug list

describe("playground anchors", () => {
  it("renders an id anchor for each known component slug", () => {
    const { container } = render(<ComponentsShowcase />);
    for (const slug of EXPECTED) {
      expect(container.querySelector(`#${slug}`), slug).not.toBeNull();
    }
  });
});
```
(If `ComponentsShowcase` is not currently a named export, add one; keep default export intact.)

- [ ] **Step 3: Run**

Run: `pnpm --filter @manpowerhub/playground test`
Expected: PASS. Extend `EXPECTED` to the full slug list once anchors added; keep in sync with
docs catalog.

- [ ] **Step 4: Commit**

```bash
git add apps/playground/src/pages
git commit -m "feat(playground): anchor ids for docs deep-links"
```

---

## Task 14: Full green + CI check

- [ ] **Step 1: Run docs + playground test suites**

Run: `pnpm --filter @manpowerhub/docs test && pnpm --filter @manpowerhub/playground test`
Expected: all PASS (generators run via `pretest`).

- [ ] **Step 2: Build both**

Run: `pnpm --filter @manpowerhub/docs build && pnpm --filter @manpowerhub/playground build`
Expected: both succeed.

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: clean (or only pre-existing warnings).

- [ ] **Step 4: Open PR**

```bash
git push -u origin docs/docs-app-overhaul
gh pr create --title "docs: overhaul docs app (live code, props tables, wiring, tests)" --body "Implements docs/superpowers/specs/2026-07-07-docs-app-overhaul-design.md"
```

---

## Self-Review

**Spec coverage:**
- Rich page template → Tasks 9, 10. Live code tab → Task 5. Auto props → Tasks 3, 6.
  States gallery → Task 7 + Task 9 states demos. Restyle + foundations → Task 12.
  Storybook/Playground wiring → Tasks 8, 13. Tests (demo smoke+axe, generators, link
  integrity, anchors) → Tasks 2, 3, 4, 11, 13. Static-export constraint honored (build-time
  generators, Tasks 2–3). All spec sections covered.

**Placeholder scan:** All code steps contain full code. The only intentional repetition
instruction is Task 9 Step 4 ("repeat for 19 pages") — deliberate mechanical repetition with a
complete worked example, not a hidden TODO. Catalog (Task 4) requires filling all 26 entries —
format + example given.

**Type consistency:** `demoSources: Record<string,string>` (Task 2) consumed identically in
Tasks 5, 9, 10, 11. `props.generated.json` shape (Task 3 `normalizeProps`) matches `PropRow`
(Task 6) and integrity check (Task 11). `CatalogEntry` fields (Task 4) consumed by
`FullViewLinks` (Task 8) and integrity test (Task 11) with matching names
(`slug/demoKey/docgenName/story/storyId/pkg`).
