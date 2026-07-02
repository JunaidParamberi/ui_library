# @manpowerhub/ui — Publishable, Customizable Component Library

**Date:** 2026-07-02
**Status:** Approved design, pending implementation plan
**Source of truth:** `manpowerhub-ui-handoff/` (docs 01–08 + `starter/` + `reference/`)

## Goal

Turn the existing design-system handoff into a **real, published, open-source npm
library** that outside developers can install, read live documentation for
(hosted Storybook), and customize — using only free tooling ($0 recurring cost).

Success = a developer can:
1. `npm install @manpowerhub/ui @manpowerhub/tokens`
2. Import global styles + Tailwind preset and get themed components immediately.
3. Browse a live, hosted Storybook with every component, every state, and
   auto-generated props tables.
4. Customize at three levels (tokens, className/variants, structural swap)
   without forking.

## Non-goals (YAGNI)

- No private registry / auth gating — the library is public and open source.
- No paid hosting (Chromatic, Vercel Pro) — free tier only, no credit card.
- No business logic, API calls, or secrets in the library — presentation only.
- No visual-regression testing in v1 (can add later; not required for launch).

## Distribution & hosting stack (all free)

| Concern | Choice | Cost |
|---|---|---|
| Source repo | GitHub public — `github.com/junaidparamberi/manpowerhub-ui` | $0 |
| Registry | npm public, scope `@manpowerhub` (free org for public pkgs) | $0 |
| Docs / Storybook host | GitHub Pages | $0 |
| CI (lint/typecheck/test/build/deploy/publish) | GitHub Actions (public repo = unlimited mins) | $0 |
| Versioning + changelog + publish | Changesets | $0 |

Rationale: GitHub Pages + Actions are truly unlimited-free for public repos with
no card and no usage trap, unlike Chromatic (snapshot cap) or Vercel free
(no commercial use). Visual regression can be added later via Chromatic's free
tier if desired.

## Repository layout

```
manpowerhub-ui/
├─ package.json                 # pnpm workspace root
├─ pnpm-workspace.yaml
├─ CLAUDE.md                    # binding component contracts (below)
├─ tsconfig.base.json
├─ .changeset/                  # changesets config + pending changesets
├─ .github/workflows/
│  ├─ ci.yml                    # PR + push: lint, typecheck, vitest, build
│  └─ release.yml               # main: changesets publish to npm + deploy Pages
├─ packages/
│  ├─ tokens/                   # @manpowerhub/tokens — no React
│  │  └─ src/{tokens.ts,globals.css,preset.ts,index.ts}
│  └─ ui/                       # @manpowerhub/ui
│     ├─ src/
│     │  ├─ components/<name>/{<name>.tsx,<name>.stories.tsx,<name>.test.tsx,index.ts}
│     │  ├─ ui/                 # raw shadcn primitives (shadcn CLI generated)
│     │  ├─ lib/utils.ts        # cn()
│     │  ├─ hooks/
│     │  └─ index.ts            # public barrel export
│     ├─ tailwind.config.ts
│     ├─ tsup.config.ts
│     └─ package.json
└─ apps/
   └─ storybook/                # catalog → GitHub Pages
```

Follows the handoff architecture (`01-ARCHITECTURE.md`) exactly. The `starter/`
folder in the handoff seeds tokens + Button/Badge/Card/KPICard as reference
implementations.

## Component contract (enforced via CLAUDE.md)

Every component MUST:
- Forward `className` (merged with `cn()` / tailwind-merge so consumer classes win)
- Forward `ref`
- Spread remaining `...props` onto the root element
- Expose visual variants via `cva` as typed props
- Ship `.tsx` + `.stories.tsx` (states: default, light, dark, loading, empty,
  error where applicable) + `.test.tsx` (Vitest + Testing Library + axe a11y) +
  `index.ts`
- Re-export from `packages/ui/src/index.ts`

These contracts are what make the library customizable *by construction*.

## Customization model (three levels, no fork)

**Level 1 — Tokens (whole-app reskin).** Consumer overrides CSS variables in
their own `globals.css`; all components reskin at once. Proven by the second
demo theme (`08-THEMING-MULTIAPP.md`).
```css
:root { --primary: 240 80% 55%; --radius: 0.75rem; }
```

**Level 2 — Per-instance (`className` + variants).** `className` merged via
`cn()` so consumer utilities override defaults; `cva` variants exposed as props.
```tsx
<Button variant="outline" size="sm" className="rounded-full shadow-lg" />
```

**Level 3 — Structural swap (`asChild`).** Radix `Slot` passthrough swaps the
rendered element while keeping styles.
```tsx
<Button asChild><Link href="/x">Go</Link></Button>
```

**Escape hatch — own the code.** As a shadcn-based OSS lib, a consumer needing
deep changes can copy the component source into their repo and edit freely.
Documented as the last resort.

Each component gets a dedicated "Customization" Storybook story demonstrating all
three levels.

## CI / release flow

```
component + story + test  ──push/PR──►  ci.yml: lint · typecheck · vitest+axe · build
                                              │
                                        merge to main
                                              │
                              ┌───────────────┴────────────────┐
                       release.yml (Changesets)          build Storybook static
                       → version bump                    → deploy to GitHub Pages
                       → publish @manpowerhub/* to npm         (live docs site)
                       → update CHANGELOG
```

- npm publish uses `NPM_TOKEN` repo secret + provenance.
- GitHub Pages deploy uses the `actions/deploy-pages` flow (no token needed).
- Contributors add a changeset (`pnpm changeset`) per PR; the release job
  consumes them.

## Build phases (each pauses for user review)

1. **Scaffold + pipeline skeleton.** pnpm workspace, `@manpowerhub/tokens`
   (from starter), tsup + Tailwind preset, Storybook app, CLAUDE.md contracts,
   `ci.yml` green on the starter components, Changesets initialized.
2. **Core components** (`03-COMPONENTS-CORE.md`): Button, Input, Select,
   Checkbox/Radio/Switch, Card, Badge, StatusBadge, Tabs, Table/DataTable,
   Avatar, Tooltip, Dialog, DropdownMenu, EmptyState.
3. **Shell + dataviz** (`04-COMPONENTS-SHELL-DATAVIZ.md`): AppShell, CommandMenu,
   KPICard, AreaChart, MiniBars, Progress, HealthRing, skeletons/loaders.
4. **Documents** (`05-DOCUMENTS.md`): Invoice, Quote, Proposal, Voucher,
   Statement, Credit Note, Delivery Note + emails.
5. **Go-live pipeline.** First real `npm publish` (v0.1.0) + Storybook live on
   GitHub Pages + README with install/usage/customization docs.
6. **Second demo theme** (`08-THEMING-MULTIAPP.md`) proving reskin-by-tokens.

## Definition of done

- [ ] `@manpowerhub/tokens` + `@manpowerhub/ui` publish to npm, installable by anyone.
- [ ] Live Storybook at `junaidparamberi.github.io/manpowerhub-ui`, all components + states + props tables.
- [ ] Every component honors the contract (className/ref/...props/cva) and has a Customization story.
- [ ] Three-level customization documented and demonstrated.
- [ ] Second demo theme reskins via tokens alone.
- [ ] CI green; release job publishes + deploys automatically from `main`.
- [ ] Total recurring cost: $0.
