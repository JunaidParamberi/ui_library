# @manpowerhub/blocks — Composed Sections Package — Design

**Date:** 2026-07-04
**Status:** Approved (design), pending implementation plan
**Parent spec:** `docs/superpowers/specs/2026-07-04-multiapp-ui-platform-design.md`

## Goal

Build `packages/blocks` — the composed-section layer of the platform. Blocks are
opinionated, app-shaped compositions built **from** `@manpowerhub/ui` primitives
(never from raw tokens). They give the docs site and playground real,
recognizable content to show and give consumers drop-in page sections.

Ship all six blocks named in the parent spec: `EmptyState`, `PageHeader`,
`StatCardRow`, `AuthForm`, `DataTableToolbar`, `PricingTable`.

## Non-goals (now)

- Business logic, data fetching, or global state inside blocks.
- Internal component state of any kind (fully controlled — see below).
- Nextra docs pages for blocks (that is the docs phase; blocks ship Storybook
  stories now).
- Any block beyond the six above.

## Dependency direction (strict, one-way)

```
tokens  ←  ui  ←  blocks  ←  apps
```

- `blocks` imports **only** from the `@manpowerhub/ui` public API plus semantic
  Tailwind classes / CSS vars for incidental layout styling.
- `blocks` **never** imports `@manpowerhub/tokens` directly.
- This one-way flow keeps a future React Native extraction clean.

## Package shape (mirror `packages/ui` exactly)

```
packages/blocks/
├─ package.json            name @manpowerhub/blocks, tsup build, own storybook
├─ tsup.config.ts          entry src/index.ts, esm+cjs, dts, external react/react-dom
├─ tsconfig.json           extends ../../tsconfig.base.json, excludes *.stories
├─ vitest.config.ts        jsdom, globals, setupFiles vitest.setup.ts
├─ vitest.setup.ts         jest-dom + vitest-axe toHaveNoViolations (copy from ui)
├─ tailwind.config.ts      presets:[tokens preset], content src + ui src
├─ postcss.config.js       postcss-import → tailwindcss → autoprefixer
├─ .storybook/
│  ├─ main.ts              stories src/**, aliases (see below)
│  └─ preview.ts           theme-by-classname, imports ../src/styles.css
├─ src/
│  ├─ styles.css           @import tokens/globals.css; @tailwind base/components/utilities
│  ├─ index.ts             re-export every block
│  ├─ lib/utils.ts         cn() — re-export from @manpowerhub/ui if exported, else copy
│  └─ components/
│     ├─ empty-state/      empty-state.tsx .stories.tsx .test.tsx index.ts
│     ├─ page-header/
│     ├─ stat-card-row/
│     ├─ auth-form/
│     ├─ data-table-toolbar/
│     └─ pricing-table/
```

### Tooling parity notes

- **Build:** `tsup` — `entry: ["src/index.ts"]`, `format: ["esm","cjs"]`,
  `dts: true`, `clean: true`, `external: ["react","react-dom"]`, `treeshake: true`.
  Also `external` `@manpowerhub/ui` and `@manpowerhub/tokens` so they are not
  bundled (peer/workspace deps resolve at consume time).
- **package.json exports:** identical `.` shape to ui (`types`/`import`/`require`
  → `dist`), `type: "module"`, `sideEffects: ["*.css"]`, `files: ["dist"]`.
- **deps:** `@manpowerhub/ui` (workspace:*), `@manpowerhub/tokens` (workspace:*),
  `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`.
  **peerDeps:** `react ^18.3.0`, `react-dom ^18.3.0`.
- **devDeps:** same Storybook + testing + tailwind/postcss/tsup/vitest stack as ui.

### Storybook aliases

`blocks` composes built `@manpowerhub/ui`, but for live source-driven dev the
blocks Storybook aliases workspace source (mirrors ui's existing tokens alias):

```ts
resolve.alias:
  "@manpowerhub/ui"     → ../ui/src
  "@manpowerhub/tokens" → ../tokens/src
```

### `cn()` sourcing

Prefer re-exporting `cn` from `@manpowerhub/ui` (it is exported from
`packages/ui/src/index.ts` via `./lib/utils`). If importing it from the ui public
API works cleanly in build + test + storybook, use that (no duplication). Only
copy `lib/utils.ts` locally if the re-export causes a resolution problem.

## Component contract (per CLAUDE.md — non-negotiable, unchanged)

Every block MUST:
- Forward `className`, composed via `cn()` (tailwind-merge) so consumer classes win.
- Forward `ref` (`React.forwardRef`) to the root element.
- Spread remaining `...props` onto the root element.
- Expose visual variants via `cva`, typed on the props.
- Ship `<name>.tsx`, `<name>.stories.tsx` (states: default, dark, loading, empty,
  error where applicable, plus a "Customization" story), `<name>.test.tsx`
  (Vitest + Testing Library + axe), `index.ts`.
- Be re-exported from `packages/blocks/src/index.ts`.

## State model — fully controlled

Blocks hold **no internal state and do no fetching**. All data, current values,
and callbacks arrive via props; the consumer owns state. This maximizes reuse,
keeps rendering thin, and keeps a native extraction clean. Concretely:

- `AuthForm` input values are controlled by the consumer (`value` + `onChange`
  per field, or a single `values`/`onChange` map). No internal
  password-visibility state — if a show/hide toggle is desired it is a controlled
  prop (`showPassword` + `onTogglePassword`), optional.
- `DataTableToolbar` search + filter values are controlled props.
- `PricingTable` `billingPeriod` is a controlled prop.

## The six blocks

Each row lists the ui primitives it composes and its principal props. Exact prop
names are finalized in the implementation plan; variants are `cva`-typed.

### `EmptyState`
- **Composes:** `Card`, `Button`, a `lucide-react` icon slot.
- **Props:** `icon?`, `title`, `description?`, `action?` ({ label, onClick } or
  render), `secondaryAction?`.
- **Variants (cva):** `variant: dashed | plain`, `size: sm | md`.
- **States for stories:** default, dashed, with/without action, dark, Customization.

### `PageHeader`
- **Composes:** `Badge`, `Button` (semantic wrapper — header region).
- **Props:** `title`, `description?`, `badge?`, `actions?` (ReactNode),
  `breadcrumbs?` (array of { label, href? }).
- **Variants (cva):** `align: start | between`, `bordered?: boolean`.
- **Root:** a `<header>` element; forward ref to it.
- **States for stories:** default, with badge + actions, with breadcrumbs, dark,
  Customization.

### `StatCardRow`
- **Composes:** `KPICard` (from ui).
- **Props:** `stats: KPICardProps[]` (typed from ui's exported KPICard props),
  `columns?` (2 | 3 | 4), `loading?` (renders KPICard loading state across row).
- **Variants (cva):** `columns` → responsive grid classes.
- **States for stories:** 3-up, 4-up, loading, empty (no stats), dark,
  Customization.

### `AuthForm`
- **Composes:** `Card`, `Input`, `Button`, `Checkbox`.
- **Props:** `mode: "login" | "signup"`, `fields` (controlled — values +
  onChange), `onSubmit`, `error?`, `loading?`, `remember?` (controlled),
  `footer?` (ReactNode, e.g. "Sign up" link), optional controlled
  `showPassword`/`onTogglePassword`.
- **Variants (cva):** `mode`, `width: sm | md`.
- **Form semantics:** real `<form>` with labelled inputs, submit button reflects
  `loading` (disabled + busy), `error` rendered in an alert region.
- **States for stories:** login, signup, loading, error, dark, Customization.

### `DataTableToolbar`
- **Composes:** `Input` (search), `Select` (filters), `Button` (actions),
  `Badge` (selected count).
- **Props:** `search` ({ value, onChange, placeholder? }), `filters?` (array of
  Select configs, each controlled), `actions?` (ReactNode),
  `selectedCount?` (renders Badge + bulk actions area when > 0).
- **Variants (cva):** `density: comfortable | compact`.
- **States for stories:** default, with filters, with selection (badge shown),
  dark, Customization.

### `PricingTable`
- **Composes:** `Card`, `Button`, `Badge`.
- **Props:** `tiers: Tier[]` (name, price, period, description, features[],
  cta { label, onClick }, `highlighted?`), `billingPeriod` (controlled value +
  onChange for a monthly/annual toggle), `columns?`.
- **Variants (cva):** `columns` → responsive grid; highlighted tier styling.
- **States for stories:** 3 tiers, highlighted middle tier, annual toggle, dark,
  Customization.

## Testing (per-block, existing contract)

- `*.test.tsx` — Vitest + Testing Library + axe: renders, variant classes,
  callbacks fire (onClick / onChange / onSubmit), controlled behavior, and
  `toHaveNoViolations()` a11y pass.
- `*.stories.tsx` — all applicable states above, so Chromatic (docs/CI phase)
  gets light+dark snapshots later.
- Coverage counts toward the 80% line gate once the CI phase extends coverage to
  `packages/blocks/src`.

## Playground integration (proves consumption)

Add a **Blocks showcase** page to `apps/playground` that imports
`@manpowerhub/blocks` via the workspace dep and renders each block with sample
data, wired to the existing route list. This proves the `apps ← blocks` edge:
the package builds, resolves, and renders themed inside a real consuming app.

Add `@manpowerhub/blocks` to `apps/playground` deps and its Storybook/vite
aliases where the playground already aliases ui/tokens, if needed for live dev.

## Execution plan (subagent-driven)

Branch: `feat/blocks-package` off `main`.

- **Task 1 — Scaffold.** All package config (package.json, tsup, tsconfig,
  vitest(+setup), tailwind, postcss, styles.css, .storybook), empty `index.ts`,
  `lib` cn sourcing, and ONE trivial block (`EmptyState`) end-to-end to prove
  build + test + storybook wire green. Install at root.
- **Tasks 2–6 — one block each:** `PageHeader`, `StatCardRow`, `AuthForm`,
  `DataTableToolbar`, `PricingTable`. Each: component + stories + test + index,
  re-exported, tests + build green.
- **Task 7 — Playground showcase page** consuming `@manpowerhub/blocks`.

Fresh implementer subagent per task, review between tasks, final whole-branch
review before finishing the branch. Progress tracked in `.superpowers/sdd/progress.md`.

## Success criteria

- `packages/blocks` builds (esm+cjs+dts) via tsup; `pnpm -r build` green.
- All six blocks satisfy the CLAUDE.md contract (className/ref/props/cva/files/export).
- `blocks` imports only `@manpowerhub/ui` (+ semantic classes); no `tokens` import.
- Blocks Storybook runs clean (no PostCSS/preset errors), light + dark.
- All block tests pass incl. axe; behavior is fully controlled (no internal state).
- `apps/playground` renders a blocks showcase page, themed, via the workspace dep.
- Adding a brand via token overrides reskins the blocks too (inherited from ui).
