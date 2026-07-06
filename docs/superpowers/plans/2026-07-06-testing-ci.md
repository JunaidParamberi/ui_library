# Testing / CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an 80% Vitest coverage gate to all three packages and wire Chromatic visual regression into the existing CI workflow.

**Architecture:** Three self-contained tasks. Task 1 installs `@vitest/coverage-v8` and configures coverage thresholds in all packages, adding one new test to `apps/playground` to reach the threshold. Task 2 installs the `chromatic` CLI in `packages/ui` and `packages/blocks` and adds a `chromatic` script. Task 3 extends `.github/workflows/ci.yml` with the new coverage and Chromatic steps.

**Tech Stack:** `@vitest/coverage-v8`, `chromatic` CLI, GitHub Actions YAML.

## Global Constraints

- pnpm workspace monorepo — install deps with `pnpm --filter <name> add -D <pkg>`, not `npm install`.
- Node 20, pnpm 9.7.0.
- Never import `@manpowerhub/tokens` in `.tsx` source files inside `packages/blocks` or `packages/ui` (devDep only).
- Coverage threshold: 80% for lines, functions, branches, and statements in every package.
- Chromatic steps must skip gracefully when the secret token is absent (`if: ${{ secrets.TOKEN != '' }}`).
- All existing tests must remain passing after every task.

---

### Task 1: Coverage gate — all packages

**Files:**
- Modify: `packages/ui/package.json` — add `@vitest/coverage-v8` devDep + `coverage` script
- Modify: `packages/ui/vitest.config.ts` — add `coverage` block
- Modify: `packages/blocks/package.json` — add `@vitest/coverage-v8` devDep + `coverage` script
- Modify: `packages/blocks/vitest.config.ts` — add `coverage` block
- Modify: `apps/playground/package.json` — add `@vitest/coverage-v8` devDep + `coverage` script
- Modify: `apps/playground/vitest.config.ts` — add `coverage` block
- Create: `apps/playground/src/pages/blocks-showcase.test.tsx` — render test to lift playground coverage above 80%

**Interfaces:**
- Produces: `coverage` script in each of the three `package.json` files, callable as `pnpm --filter <name> coverage`.

- [ ] **Step 1: Install `@vitest/coverage-v8` in all three packages**

```bash
pnpm --filter @manpowerhub/ui add -D @vitest/coverage-v8
pnpm --filter @manpowerhub/blocks add -D @vitest/coverage-v8
pnpm --filter @manpowerhub/playground add -D @vitest/coverage-v8
```

Expected: three `package.json` files updated, lockfile regenerated.

- [ ] **Step 2: Add `coverage` script to `packages/ui/package.json`**

In `packages/ui/package.json`, inside `"scripts"`, add after the `"test"` line:

```json
"coverage": "vitest run --coverage"
```

- [ ] **Step 3: Add coverage config to `packages/ui/vitest.config.ts`**

Replace the entire file with:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      include: ["src/**"],
      exclude: [
        "src/**/*.stories.tsx",
        "src/index.ts",
        "src/**/index.ts",
      ],
    },
  },
});
```

- [ ] **Step 4: Run ui coverage to verify it passes ≥80%**

```bash
pnpm --filter @manpowerhub/ui coverage
```

Expected: all four thresholds (lines/functions/branches/statements) show ≥80%. If any threshold is missed, inspect the coverage report to identify uncovered code and add targeted tests until all thresholds pass before proceeding.

- [ ] **Step 5: Add `coverage` script to `packages/blocks/package.json`**

In `packages/blocks/package.json`, inside `"scripts"`, add after the `"test"` line:

```json
"coverage": "vitest run --coverage"
```

- [ ] **Step 6: Add coverage config to `packages/blocks/vitest.config.ts`**

Replace the entire file with:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      include: ["src/**"],
      exclude: [
        "src/**/*.stories.tsx",
        "src/index.ts",
        "src/**/index.ts",
      ],
    },
  },
});
```

- [ ] **Step 7: Run blocks coverage to verify it passes ≥80%**

```bash
pnpm --filter @manpowerhub/blocks coverage
```

Expected: all four thresholds ≥80%. If any threshold is missed, add targeted tests to the relevant block until all thresholds pass.

- [ ] **Step 8: Add `coverage` script to `apps/playground/package.json`**

In `apps/playground/package.json`, inside `"scripts"`, add after the `"test"` line:

```json
"coverage": "vitest run --coverage"
```

- [ ] **Step 9: Add coverage config to `apps/playground/vitest.config.ts`**

Replace the entire file with:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      include: ["src/**"],
      exclude: [
        "src/main.tsx",
        "src/**/*.stories.tsx",
        "src/index.ts",
        "src/**/index.ts",
      ],
    },
  },
});
```

Note: `src/main.tsx` is excluded — it is a React entry bootstrapper (`ReactDOM.createRoot`) and has no testable logic.

- [ ] **Step 10: Create `apps/playground/src/pages/blocks-showcase.test.tsx`**

The playground's existing test covers `App.tsx` and `KitchenSink` but not `BlocksShowcase`. This test covers it directly:

```tsx
import { render, screen } from "@testing-library/react";
import { BlocksShowcase } from "./blocks-showcase";

describe("BlocksShowcase", () => {
  it("renders the page heading", () => {
    render(<BlocksShowcase />);
    expect(screen.getByText("Blocks Showcase")).toBeInTheDocument();
  });

  it("renders EmptyState section", () => {
    render(<BlocksShowcase />);
    expect(screen.getByText("EmptyState")).toBeInTheDocument();
  });

  it("renders AuthForm section", () => {
    render(<BlocksShowcase />);
    expect(screen.getByText("AuthForm")).toBeInTheDocument();
  });
});
```

> **Note:** If `BlocksShowcase` does not render headings matching those exact strings, inspect `apps/playground/src/pages/blocks-showcase.tsx` and adjust the `getByText` queries to match actual rendered text. The goal is to render the component and assert on any stable text it contains.

- [ ] **Step 11: Run playground coverage to verify it passes ≥80%**

```bash
pnpm --filter @manpowerhub/playground coverage
```

Expected: all four thresholds ≥80%. If a threshold is missed, check which files lack coverage in the report and add render tests for them.

- [ ] **Step 12: Run full test suite to confirm nothing is broken**

```bash
pnpm -r test
```

Expected: all tests pass (previously 79 + any new tests).

- [ ] **Step 13: Commit**

```bash
git add \
  packages/ui/package.json packages/ui/vitest.config.ts \
  packages/blocks/package.json packages/blocks/vitest.config.ts \
  apps/playground/package.json apps/playground/vitest.config.ts \
  apps/playground/src/pages/blocks-showcase.test.tsx \
  pnpm-lock.yaml
git commit -m "test: add vitest coverage-v8 gate (80%) to all packages"
```

---

### Task 2: Chromatic tooling — ui + blocks

**Files:**
- Modify: `packages/ui/package.json` — add `chromatic` devDep + `chromatic` script
- Modify: `packages/blocks/package.json` — add `chromatic` devDep + `chromatic` script

**Interfaces:**
- Consumes: `build-storybook` script already present in both packages.
- Produces: `chromatic` script in both packages, callable as `pnpm --filter <name> chromatic`.

- [ ] **Step 1: Install `chromatic` in ui and blocks**

```bash
pnpm --filter @manpowerhub/ui add -D chromatic
pnpm --filter @manpowerhub/blocks add -D chromatic
```

Expected: both `package.json` files gain `"chromatic": "^..."` in `devDependencies`.

- [ ] **Step 2: Add `chromatic` script to `packages/ui/package.json`**

In `packages/ui/package.json`, inside `"scripts"`, add after the `"build-storybook"` line:

```json
"chromatic": "chromatic"
```

- [ ] **Step 3: Add `chromatic` script to `packages/blocks/package.json`**

In `packages/blocks/package.json`, inside `"scripts"`, add after the `"build-storybook"` line:

```json
"chromatic": "chromatic"
```

- [ ] **Step 4: Verify Storybook builds for both packages**

The Chromatic CLI builds Storybook as part of its run. Confirm the build step works locally without errors:

```bash
pnpm --filter @manpowerhub/ui build-storybook
```

Expected: `packages/ui/storybook-static/` directory created with no errors.

```bash
pnpm --filter @manpowerhub/blocks build-storybook
```

Expected: `packages/blocks/storybook-static/` directory created with no errors.

If either fails, fix the Storybook build error before proceeding — the Chromatic CI step will fail with the same error.

- [ ] **Step 5: Clean up build artifacts**

```bash
rm -rf packages/ui/storybook-static packages/blocks/storybook-static
```

These are build artifacts — do not commit them.

- [ ] **Step 6: Commit**

```bash
git add packages/ui/package.json packages/blocks/package.json pnpm-lock.yaml
git commit -m "chore: add chromatic CLI to ui and blocks packages"
```

---

### Task 3: CI workflow — coverage + Chromatic steps

**Files:**
- Modify: `.github/workflows/ci.yml` — add five new steps after existing `pnpm test` step

**Interfaces:**
- Consumes: `coverage` script from Task 1 (all three packages), `chromatic` script from Task 2 (ui + blocks).
- Produces: updated `ci.yml` that enforces the coverage gate and uploads Chromatic snapshots.

- [ ] **Step 1: Read the current ci.yml**

Read `.github/workflows/ci.yml`. Confirm the existing steps are:
1. `actions/checkout@v4`
2. `pnpm/action-setup@v4`
3. `actions/setup-node@v4`
4. `pnpm install --frozen-lockfile`
5. `pnpm -r build`
6. `pnpm -r exec tsc --noEmit`
7. `pnpm lint`
8. `pnpm test`

The new steps go after step 8.

- [ ] **Step 2: Add coverage and Chromatic steps to `.github/workflows/ci.yml`**

Replace the entire file with:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9.7.0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm -r build
      - run: pnpm -r exec tsc --noEmit
      - run: pnpm lint
      - run: pnpm test

      - name: Test with coverage (ui)
        run: pnpm --filter @manpowerhub/ui coverage

      - name: Test with coverage (blocks)
        run: pnpm --filter @manpowerhub/blocks coverage

      - name: Test with coverage (playground)
        run: pnpm --filter @manpowerhub/playground coverage

      - name: Chromatic (ui)
        if: ${{ secrets.CHROMATIC_UI_TOKEN != '' }}
        run: pnpm --filter @manpowerhub/ui chromatic --exit-zero-on-changes
        env:
          CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_UI_TOKEN }}

      - name: Chromatic (blocks)
        if: ${{ secrets.CHROMATIC_BLOCKS_TOKEN != '' }}
        run: pnpm --filter @manpowerhub/blocks chromatic --exit-zero-on-changes
        env:
          CHROMATIC_PROJECT_TOKEN: ${{ secrets.CHROMATIC_BLOCKS_TOKEN }}
```

- [ ] **Step 3: Verify YAML is valid**

```bash
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/ci.yml'))" && echo "YAML valid"
```

Expected: `YAML valid`

- [ ] **Step 4: Run tests locally one final time to confirm all pass**

```bash
pnpm -r test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add coverage gate (80%) and Chromatic steps to CI workflow"
```

---

## Post-implementation: connecting Chromatic

The Chromatic CI steps are wired but will skip until secrets are configured. To activate them:

1. Go to [chromatic.com](https://www.chromatic.com) and sign in with GitHub.
2. Create two projects: one for `@manpowerhub/ui`, one for `@manpowerhub/blocks`.
3. Copy the project token from each.
4. In the GitHub repo → Settings → Secrets and variables → Actions, add:
   - `CHROMATIC_UI_TOKEN` — token from the ui project
   - `CHROMATIC_BLOCKS_TOKEN` — token from the blocks project
5. Push any commit to trigger CI; the Chromatic steps will now run and upload baseline snapshots.

This step is manual and outside the code changes — it cannot be automated.
