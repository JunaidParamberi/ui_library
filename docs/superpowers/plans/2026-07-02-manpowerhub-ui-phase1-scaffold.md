# @manpowerhub/ui — Phase 1: Scaffold + Free Publish/Deploy Pipeline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the pnpm monorepo from the handoff `starter/`, get `@manpowerhub/tokens` + `@manpowerhub/ui` building with Storybook showing the 4 starter components, and wire the free CI + npm-publish + GitHub Pages pipeline so the end-to-end loop works.

**Architecture:** Copy the vetted `manpowerhub-ui-handoff/starter/` tree into the repo root as the live monorepo, verify it builds/tests, then add the pieces the starter lacks: Changesets, GitHub Actions CI, a GitHub Pages Storybook deploy workflow, an npm release workflow, and the CLAUDE.md component contract. Storybook is co-located in `packages/ui` (per the starter), not a separate `apps/storybook`.

**Tech Stack:** pnpm 9 workspaces · TypeScript 5.5 strict · Vite 5 · Vitest 2 · tsup 8 · Tailwind 3.4 + CSS vars · shadcn/ui (Radix) · Storybook 8 (react-vite) · Changesets · GitHub Actions · GitHub Pages.

## Global Constraints

- Package manager: `pnpm@9.7.0`. Node 20 in CI.
- Scopes/names verbatim: `@manpowerhub/tokens`, `@manpowerhub/ui`. Both `version` start at `0.1.0`, both `"type": "module"`.
- `@manpowerhub/tokens` has ZERO React. Exports `.`, `./preset`, `./globals.css`.
- `@manpowerhub/ui` peerDeps: `react ^18.3.0`, `react-dom ^18.3.0`. Depends on `@manpowerhub/tokens: workspace:*`.
- Every component contract: forward `className` (merge via `cn()`), forward `ref`, spread `...props`, variants via `cva`. (Enforced from Phase 2; starter components already comply.)
- Repo: `github.com/junaidparamberi/manpowerhub-ui` (public). npm packages published public.
- Cost constraint: $0 recurring. Only GitHub Actions + Pages + npm public + Changesets.
- Publish/deploy triggers only on `main`; CI runs on every PR + push.

---

## File Structure

Repo root (`/Users/junaidparamberi/Codes/manpowerhub_ui/`) becomes the monorepo:

- `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json` — copied from `starter/`, edited.
- `packages/tokens/**` — copied from `starter/packages/tokens/` (source of truth for theme).
- `packages/ui/**` — copied from `starter/packages/ui/` (4 starter components + Storybook config to add).
- `CLAUDE.md` — component contract rules (new).
- `.changeset/config.json` — Changesets config (new).
- `.github/workflows/ci.yml` — lint/typecheck/test/build on PR + push (new).
- `.github/workflows/release.yml` — Changesets publish to npm + build Storybook + deploy Pages on `main` (new).
- `README.md` — install / usage / customization / docs link (new).
- `.gitignore`, `.npmrc` — hygiene (new).

Note: `manpowerhub-ui-handoff/` stays in the repo as reference docs; it is not published (excluded via package `files` allowlists — packages only ship their own `dist`/`src/globals.css`).

---

### Task 1: Copy starter into repo root and install

**Files:**
- Create (copy): `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `packages/tokens/**`, `packages/ui/**` from `manpowerhub-ui-handoff/starter/`.
- Create: `.gitignore`, `.npmrc`

**Interfaces:**
- Produces: a pnpm workspace with `@manpowerhub/tokens` and `@manpowerhub/ui` packages resolvable via `workspace:*`.

- [ ] **Step 1: Copy the starter tree to repo root**

Run:
```bash
cd /Users/junaidparamberi/Codes/manpowerhub_ui
cp -R manpowerhub-ui-handoff/starter/. .
```
This brings `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `packages/`, and `starter/CLAUDE.md`/`starter/README.md` (which we overwrite later).

- [ ] **Step 2: Add `.gitignore`**

Create `.gitignore`:
```
node_modules/
dist/
storybook-static/
*.log
.DS_Store
.turbo/
coverage/
```

- [ ] **Step 3: Add `.npmrc`**

Create `.npmrc` (root):
```
auto-install-peers=true
```

- [ ] **Step 4: Install dependencies**

Run:
```bash
corepack enable
pnpm install
```
Expected: resolves workspace packages, no missing-peer fatal errors, exits 0.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold monorepo from handoff starter"
```

---

### Task 2: Verify tokens + ui build and starter tests pass

**Files:**
- Modify (only if a build error requires it): `packages/tokens/tsup` config via its `build` script, `packages/ui/tsup.config.ts`.
- Test: existing `packages/ui/src/components/*/**.stories.tsx` and any `.test.tsx`.

**Interfaces:**
- Consumes: workspace from Task 1.
- Produces: `packages/tokens/dist/{index.js,index.d.ts,preset.js,preset.d.ts}` and `packages/ui/dist/{index.js,index.cjs,index.d.ts}`.

- [ ] **Step 1: Build all packages**

Run:
```bash
pnpm -r build
```
Expected: PASS. `packages/tokens/dist/` and `packages/ui/dist/` created. If tokens fails because `src/index.ts` imports something not built, fix the import path shown in the error, then re-run. Do not change public export names.

- [ ] **Step 2: Typecheck**

Run:
```bash
pnpm -r exec tsc --noEmit
```
Expected: PASS (no type errors). Fix any strict-mode errors in starter components inline (typically missing `React.forwardRef` generics); keep public prop types unchanged.

- [ ] **Step 3: Run tests**

Run:
```bash
pnpm test
```
Expected: PASS or "no test files found". If zero tests exist, that is acceptable for this task — Task 3 adds the first real test.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: make starter packages build and typecheck clean"
```

---

### Task 3: Add a smoke test proving the public API + customization contract

**Files:**
- Create: `packages/ui/src/components/button/button.test.tsx`
- Test: same file.

**Interfaces:**
- Consumes: `Button` from `@manpowerhub/ui` public barrel (`packages/ui/src/index.ts`).
- Produces: a passing Vitest + Testing Library + axe test that guards the `className`-merge contract.

- [ ] **Step 1: Add test deps**

Run:
```bash
pnpm --filter @manpowerhub/ui add -D @testing-library/react @testing-library/jest-dom jsdom vitest-axe @vitejs/plugin-react
```

- [ ] **Step 2: Configure Vitest for the ui package**

Create `packages/ui/vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

Create `packages/ui/vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Write the failing test**

Create `packages/ui/src/components/button/button.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Button } from "../../index";

describe("Button", () => {
  it("renders its children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("merges a consumer className over defaults (customization contract)", () => {
    render(<Button className="custom-class">X</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Button>Accessible</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 4: Run the test to verify it fails (if API mismatch) or passes**

Run:
```bash
pnpm --filter @manpowerhub/ui exec vitest run src/components/button/button.test.tsx
```
Expected: PASS if `Button` already exports and forwards `className`. If it FAILS on the className assertion, fix `packages/ui/src/components/button/button.tsx` so it composes classes with `cn(..., className)` and spreads `...props`, then re-run to PASS. If `vitest-axe` matcher is unrecognized, add `import "vitest-axe/extend-expect";` to `vitest.setup.ts` and re-run.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: guard Button public API and className-merge contract"
```

---

### Task 4: Wire Storybook and produce a static build

**Files:**
- Verify/Create: `packages/ui/.storybook/main.ts`, `packages/ui/.storybook/preview.ts`
- Uses existing: `packages/ui/src/components/*/*.stories.tsx`

**Interfaces:**
- Consumes: starter stories.
- Produces: `packages/ui/storybook-static/` (deployable), and `build-storybook` script confirmed working.

- [ ] **Step 1: Ensure Storybook config exists**

If `packages/ui/.storybook/main.ts` is absent, create it:
```ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: { name: "@storybook/react-vite", options: {} },
};
export default config;
```

Create `packages/ui/.storybook/preview.ts` if absent (loads tokens so components are themed, wires light/dark):
```ts
import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "@manpowerhub/tokens/globals.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: { light: "", dark: "dark" },
      defaultTheme: "light",
    }),
  ],
};
export default preview;
```

- [ ] **Step 2: Build Storybook static**

Run:
```bash
pnpm --filter @manpowerhub/ui build-storybook
```
Expected: PASS, `packages/ui/storybook-static/index.html` exists. Fix any missing-addon errors by installing the named addon with `pnpm --filter @manpowerhub/ui add -D <addon>`, then re-run.

- [ ] **Step 3: Sanity-run Storybook dev (optional manual check)**

Run:
```bash
pnpm --filter @manpowerhub/ui storybook
```
Expected: serves on `http://localhost:6006` showing Button/Badge/Card/KPICard. Stop with Ctrl-C.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: wire Storybook config and static build"
```

---

### Task 5: Initialize Changesets

**Files:**
- Create: `.changeset/config.json`, `.changeset/README.md`
- Modify: root `package.json` (add `@changesets/cli` devDep + `release` scripts)

**Interfaces:**
- Produces: `pnpm changeset` and `pnpm release` scripts consumed by `release.yml` in Task 7.

- [ ] **Step 1: Add Changesets**

Run:
```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
```

- [ ] **Step 2: Configure public access + base branch**

Edit `.changeset/config.json` so publishing is public and base branch is `main`:
```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

- [ ] **Step 3: Add release scripts to root `package.json`**

Add to root `package.json` `"scripts"`:
```json
"changeset": "changeset",
"version-packages": "changeset version",
"release": "pnpm -r build && changeset publish"
```

- [ ] **Step 4: Create an initial changeset for v0.1.0**

Create `.changeset/initial-release.md`:
```md
---
"@manpowerhub/tokens": minor
"@manpowerhub/ui": minor
---

Initial public release: design tokens, Tailwind preset, and the first components (Button, Badge, StatusBadge, Card, KPICard).
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: initialize Changesets for versioning and publishing"
```

---

### Task 6: Add CI workflow (lint, typecheck, test, build)

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: root scripts `lint`, `test`, `build`; `pnpm -r exec tsc --noEmit`.
- Produces: a green CI check on every PR and push.

- [ ] **Step 1: Write the CI workflow**

Create `.github/workflows/ci.yml`:
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
```

- [ ] **Step 2: Verify the steps locally before relying on CI**

Run each step's command locally:
```bash
pnpm install --frozen-lockfile && pnpm -r build && pnpm -r exec tsc --noEmit && pnpm lint && pnpm test
```
Expected: all PASS. If `pnpm lint` fails because no ESLint config exists, create a minimal flat config `eslint.config.js` at root:
```js
import js from "@eslint/js";
export default [js.configs.recommended, { ignores: ["**/dist/**", "**/storybook-static/**"] }];
```
and add `-Dw @eslint/js` if missing, then re-run.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "ci: add build/typecheck/lint/test workflow"
```

---

### Task 7: Add release workflow (publish npm + deploy Storybook to Pages)

**Files:**
- Create: `.github/workflows/release.yml`
- Modify: `packages/ui/package.json` (add `homepage` + `repository` for npm), `packages/tokens/package.json` (same)

**Interfaces:**
- Consumes: `pnpm release` (Task 5), `build-storybook` (Task 4).
- Produces: automatic npm publish via Changesets and Storybook deployed to GitHub Pages on `main`.

- [ ] **Step 1: Add repo metadata to both packages**

Add to `packages/ui/package.json` and `packages/tokens/package.json` (top level):
```json
"publishConfig": { "access": "public", "provenance": true },
"repository": { "type": "git", "url": "https://github.com/junaidparamberi/manpowerhub-ui.git" },
"homepage": "https://junaidparamberi.github.io/manpowerhub-ui",
"license": "MIT"
```
Create root `LICENSE` (MIT, copyright holder "Junaid Paramberi").

- [ ] **Step 2: Write the release workflow**

Create `.github/workflows/release.yml`:
```yaml
name: Release
on:
  push:
    branches: [main]

permissions:
  contents: write
  id-token: write
  pages: write
  pull-requests: write

concurrency:
  group: release
  cancel-in-progress: false

jobs:
  release:
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
          registry-url: https://registry.npmjs.org
      - run: pnpm install --frozen-lockfile
      - name: Create Release PR or publish to npm
        uses: changesets/action@v1
        with:
          publish: pnpm release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

  deploy-docs:
    runs-on: ubuntu-latest
    needs: release
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
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
      - run: pnpm --filter @manpowerhub/ui build-storybook
      - uses: actions/upload-pages-artifact@v3
        with:
          path: packages/ui/storybook-static
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Document required repo setup (manual, one-time)**

Create `docs/RELEASE_SETUP.md` listing the one-time manual steps the user must do in GitHub (these cannot be scripted here):
```md
# One-time release setup
1. Push repo to https://github.com/junaidparamberi/manpowerhub-ui (public).
2. Settings → Pages → Source: "GitHub Actions".
3. Create npm automation token (npmjs.com → Access Tokens → Automation).
4. Repo → Settings → Secrets and variables → Actions → add secret NPM_TOKEN.
5. Ensure the `manpowerhub` org exists on npm (npmjs.com → Add Organization → free) so `@manpowerhub/*` can publish.
6. Push to `main` → Changesets opens a "Version Packages" PR; merging it publishes to npm and deploys Storybook to Pages.
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "ci: add npm publish + GitHub Pages deploy workflow"
```

---

### Task 8: Add CLAUDE.md contract and consumer README

**Files:**
- Create/overwrite: `CLAUDE.md` (root)
- Create/overwrite: `README.md` (root)

**Interfaces:**
- Produces: the binding rules future component work (Phase 2+) reads, and the public-facing install/usage/customization docs.

- [ ] **Step 1: Write CLAUDE.md component contract**

Overwrite root `CLAUDE.md`:
```md
# @manpowerhub/ui — Binding Rules

## Component contract (non-negotiable)
Every component in `packages/ui/src/components/**` MUST:
- Forward `className`, composed via `cn()` (tailwind-merge) so consumer classes win.
- Forward `ref` (`React.forwardRef`).
- Spread remaining `...props` onto the root element.
- Expose visual variants via `cva`, typed on the props.
- Ship alongside: `<name>.tsx`, `<name>.stories.tsx` (states: default, dark, loading, empty, error where applicable, plus a "Customization" story), `<name>.test.tsx` (Vitest + Testing Library + axe), `index.ts`.
- Be re-exported from `packages/ui/src/index.ts`.

## Packages
- `@manpowerhub/tokens`: zero React. Theme = CSS vars in `src/globals.css` + Tailwind `preset`.
- `@manpowerhub/ui`: components only. No API calls, no business logic, no secrets.

## Customization (must always hold)
1. Tokens: consumers override CSS vars to reskin globally.
2. className + cva variants: per-instance overrides.
3. `asChild` (Radix Slot): structural element swap where sensible.

## Reference
Source of truth for look/behavior: `manpowerhub-ui-handoff/` docs 01–08, `reference/`.
```

- [ ] **Step 2: Write the consumer README**

Overwrite root `README.md`:
```md
# @manpowerhub/ui

Themeable, customizable React component library (TypeScript · Tailwind · shadcn/ui).

## Install
\`\`\`bash
npm install @manpowerhub/ui @manpowerhub/tokens
npm install -D tailwindcss tailwindcss-animate
\`\`\`

## Setup
\`\`\`ts
// tailwind.config.ts
import preset from "@manpowerhub/tokens/preset";
export default { presets: [preset], content: ["./src/**/*.{ts,tsx}", "./node_modules/@manpowerhub/ui/dist/**/*.js"] };
\`\`\`
\`\`\`ts
// app entry
import "@manpowerhub/tokens/globals.css";
\`\`\`

## Use
\`\`\`tsx
import { Button } from "@manpowerhub/ui";
<Button variant="outline">Hello</Button>
\`\`\`

## Customize
1. **Tokens** — override CSS vars in your own globals: \`:root { --primary: 240 80% 55%; }\`
2. **Per instance** — \`<Button className="rounded-full" />\` (your classes win via tailwind-merge)
3. **Structural** — \`<Button asChild><Link href="/x">Go</Link></Button>\`

## Docs
Live Storybook: https://junaidparamberi.github.io/manpowerhub-ui
\`\`\`
```

- [ ] **Step 3: Verify full pipeline locally one last time**

Run:
```bash
pnpm install --frozen-lockfile && pnpm -r build && pnpm -r exec tsc --noEmit && pnpm test && pnpm --filter @manpowerhub/ui build-storybook
```
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: add component contract (CLAUDE.md) and consumer README"
```

---

## Phase 1 Definition of Done

- [ ] `pnpm -r build` produces `dist/` for both packages; typecheck clean.
- [ ] `pnpm test` passes including the Button contract + a11y test.
- [ ] `pnpm --filter @manpowerhub/ui build-storybook` produces a static site with the 4 starter components.
- [ ] Changesets initialized with an initial v0.1.0 changeset.
- [ ] `ci.yml` and `release.yml` present; all CI commands verified locally.
- [ ] `CLAUDE.md` contract + consumer `README.md` written.
- [ ] `docs/RELEASE_SETUP.md` lists the one-time manual GitHub/npm steps (Pages source, NPM_TOKEN, npm org).
- [ ] Recurring cost: $0.

## Follow-on plans (generated after Phase 1 review)

- Phase 2 — Core components (`03-COMPONENTS-CORE.md`)
- Phase 3 — Shell + dataviz (`04-COMPONENTS-SHELL-DATAVIZ.md`)
- Phase 4 — Documents (`05-DOCUMENTS.md`)
- Phase 5 — Go-live: first publish + Pages verification
- Phase 6 — Second demo theme (`08-THEMING-MULTIAPP.md`)
