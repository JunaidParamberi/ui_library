# Multi-App UI Platform — Design

**Date:** 2026-07-04
**Status:** Approved (design), pending implementation plan

## Goal

Grow the existing `@manpowerhub/tokens` + `@manpowerhub/ui` monorepo into an
organization-wide UI platform: components, blocks, a primitive playground,
detailed documentation, and full testing/CI/deploy wiring.

Primary target now: **web SaaS**. Architected defensively so **mobile (React
Native)** and **native desktop (Electron/Tauri)** can be added later without
rearchitecting — by sharing the token layer and keeping logic separable from
rendering.

Approach chosen: **A — evolve the current repo** (no premature platform split),
with headless discipline (keep logic in `hooks/`, rendering thin) so a native UI
package can be extracted cleanly when that work is scheduled. No
`@manpowerhub/headless` and no `ui-native` package are built now — YAGNI until
native work is on the roadmap.

## Non-goals (now)

- React Native package (`@manpowerhub/ui-native`) — future, not this cycle.
- Electron/Tauri desktop shell — future.
- Any consumer app beyond the docs/playground surfaces.

## Preexisting fixes folded in

Two build bugs were fixed while diagnosing Storybook and are part of this baseline:

1. **`@manpowerhub/tokens` dual build.** `package.json` `exports` for `.` and
   `./preset` gained a `require` condition; build now emits `esm,cjs`. Reason:
   Tailwind loads `tailwind.config.ts` in a CJS context (jiti) and could not
   resolve the ESM-only `./preset` subpath (`Package subpath './preset' is not
   defined by "exports"`).
2. **`globals.css` `@layer base` scope.** `packages/ui/postcss.config.js` now runs
   `postcss-import` before `tailwindcss`; `packages/ui/src/styles.css` `@import`s
   `@manpowerhub/tokens/globals.css` at the top; the direct `globals.css` import
   was removed from `.storybook/preview.ts`. Reason: Tailwind processed
   `globals.css` in isolation, so `@layer base` had no matching `@tailwind base`
   directive in scope (`@layer base is used but no matching @tailwind base
   directive is present`).

## Monorepo shape (target)

```
manpowerhub_ui/
├─ packages/
│  ├─ tokens/          exists — theme layer (CSS vars + Tailwind preset)
│  ├─ ui/              exists — primitives + styled components
│  └─ blocks/          NEW — composed sections built from @manpowerhub/ui
├─ apps/
│  ├─ docs/            NEW — Nextra documentation site
│  └─ playground/      NEW — Vite sandbox app (dev + deployed)
```

**Dependency direction (strict, one-way):**

```
tokens  ←  ui  ←  blocks  ←  apps
```

`blocks` composes `@manpowerhub/ui` components and uses only semantic Tailwind
classes / CSS vars for any extra styling — it never reaches into `tokens`
directly. This one-way flow keeps a future native extraction clean.

### Why `blocks` is a separate package

- `ui` = reusable primitives. Stable, heavily tested, slow release cadence, a
  hard stability promise.
- `blocks` = opinionated compositions (e.g. `AuthForm`, `PageHeader`,
  `StatCardRow`, `DataTableToolbar`, `EmptyState`, `PricingTable`). App-shaped,
  faster cadence, looser stability promise.

Different cadence + different stability promise ⇒ different package, versioned
independently.

## Documentation

Two surfaces, one landing page:

- **Nextra (Next.js) docs site** — prose, guides, foundations, "when to use",
  live examples. The main entry point.
- **Storybook** — the living interactive catalog (states, controls, a11y). Kept
  as-is. Component doc pages in Nextra link out to the matching Storybook story.

```
apps/docs/                Nextra
  content/
    getting-started/      install, consume in an app, theming
    foundations/          tokens, color, type, spacing, dark mode
    components/           one page per component → live example + Storybook link
    blocks/               one page per block
    guides/               build a new app, add a brand, contribute a component
```

## Testing & CI

**Per-component (existing CLAUDE.md contract, unchanged):**

- `*.test.tsx` — Vitest + Testing Library + axe (render, variants, callbacks, a11y).
- `*.stories.tsx` — all states (default, dark, loading, empty, error, Customization).

**Added layers:**

1. **Coverage gate** — Vitest `--coverage`, threshold **80% lines** on
   `packages/ui/src` (and `packages/blocks/src` once populated). CI fails below.
2. **Visual regression — Chromatic** on the Storybook build, light + dark. Per-PR
   visual diffs with approve/reject review workflow. Free tier (5000
   snapshots/month) is the starting budget.
3. **CI pipeline (GitHub Actions), on PR:**
   ```
   lint → typecheck → test+coverage → build (all packages) → build-storybook → chromatic
   ```
   Plus a **changeset check**: any PR touching `packages/**` must include a
   changeset (enforces version-bump discipline).

## Release

- **Changesets** for semver + changelogs.
- Publish `@manpowerhub/tokens`, `@manpowerhub/ui`, `@manpowerhub/blocks` to
  **GitHub Packages** (private npm registry). Each package versioned
  independently; a token rename/removal is a major on `tokens`.

## Playground app

`apps/playground` — Vite + React, consumes `@manpowerhub/ui` +
`@manpowerhub/blocks` via workspace deps. Free sandbox for integration testing and
scratch pages, no Storybook ceremony.

```
apps/playground/
  src/
    App.tsx        route list to scratch pages
    pages/         one file per experiment (kitchen-sink, forms, tables…)
  imports "@manpowerhub/tokens/globals.css"
  tailwind preset from tokens
```

Runs on `pnpm dev` (existing `pnpm -r --parallel dev`). **Also deployed** (below).

## Deploy

All three surfaces on **Vercel** — one dashboard, per-PR preview deploys (every PR
gets live docs + playground + storybook links for review), custom domains.

| Surface | Host | URL (placeholder now) |
|---|---|---|
| Docs (Nextra) | Vercel | `ui.<org>.com` (main landing) |
| Storybook | Vercel | `storybook.<org>.com` |
| Playground | Vercel | `playground.<org>.com` |

Three Vercel projects, one repo, each pointed at its `apps/*` (or `packages/ui`
for the Storybook build) directory. CI builds the output; Vercel deploys. Real
domains wired later; `*.vercel.app` until then.

## Success criteria

- `pnpm dev` runs playground locally; components render themed.
- `pnpm storybook` runs the catalog clean (no PostCSS/preset errors).
- `@manpowerhub/blocks` package builds and is consumed by playground + docs.
- Nextra docs site builds and links out to Storybook stories.
- CI green: lint, typecheck, tests ≥80% coverage, all builds, Chromatic.
- Changeset required on `packages/**` PRs.
- All three surfaces deploy to Vercel with per-PR previews.
- A new brand can be added via token overrides alone (existing multi-app
  acceptance test from handoff doc 08) and the whole catalog reskins.

## Future (out of scope, kept clean-for)

- `@manpowerhub/ui-native` (React Native) sharing `tokens`; logic lifted from
  `ui/hooks` into a shared headless layer if/when native is scheduled.
- Electron/Tauri desktop shell consuming the same web `ui`.
