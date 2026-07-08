# Design: shadcn Registry for @manpowerhub/ui

**Date:** 2026-07-08
**Status:** Approved (pending spec review)

## Problem

Consuming teams (and their LLMs) must be able to pull components and blocks as
**plain, editable source** into their own repos — not install an opaque npm
package built with tsup/rollup. When a consumer runs one command for a block,
the **entire block must land complete**: the block's own files plus every
component it depends on, plus the shared `cn` util and tokens.

This is the shadcn distribution model. We already author the source
(`packages/ui`, `packages/blocks`); we need to publish it as a **shadcn
registry** and drop npm publishing.

## Goals

- One command → full component or block copied into consumer repo, working.
- Blocks auto-pull all their component dependencies (`registryDependencies`).
- Zero `@manpowerhub/*` runtime dependencies in consumer output — self-contained.
- Keep current authoring setup (monorepo, Storybook, tests, CLAUDE.md contract).
- Drop npm publishing; registry becomes the only distribution channel.

## Non-Goals

- Authoring new full-page feature blocks (quote page, dashboard page). Deferred.
  Only the **existing** 21 components and 6 blocks are published now.
- Changing component APIs, variants, or behavior.
- A custom CLI. Consumers use the standard `shadcn` CLI against our JSON URLs.

## Inventory (published now)

**Components (`registry:ui`)** — 21, from `packages/ui/src/components/**`:
app-shell, area-chart, avatar, badge, button, card, checkbox, command-menu,
dialog, dropdown-menu, icons, input, kpi-card, progress, select, skeleton,
table, tabs, theme-toggle, tooltip.
(`icons` is a shared helper module, published so others can depend on it.)

**Blocks (`registry:block`)** — 6, from `packages/blocks/src/components/**`:
auth-form, data-table-toolbar, empty-state, page-header, pricing-table,
stat-card-row.

**Shared source (copied, not npm):**
- `cn` util — `packages/ui/src/lib/utils.ts` → consumer `lib/utils.ts`
  (`registry:lib`). Deps: `clsx`, `tailwind-merge`.
- tokens — `packages/tokens/src/globals.css` (CSS vars) and `preset.ts`
  (Tailwind preset) → copied `registry:file`s.

## Architecture

### Registry items

Each component/block is described by a `registry-item` entry (shadcn schema):

```jsonc
{
  "name": "pricing-table",
  "type": "registry:block",
  "dependencies": ["class-variance-authority", "lucide-react"],
  "registryDependencies": ["card", "button", "badge", "utils"],
  "files": [
    { "path": "blocks/pricing-table/pricing-table.tsx",
      "type": "registry:component" }
  ]
}
```

- `dependencies` — npm packages the file imports (radix, cva, lucide, cmdk,
  clsx, tailwind-merge). CLI installs these into consumer's `package.json`.
- `registryDependencies` — **other registry items** pulled automatically. This
  is what makes "one command = full block". A block lists the components it
  composes; the CLI recurses and copies them all.
- `files` — the source files copied verbatim (after import rewrite, below).

### Import rewrite (critical)

Source files import from the workspace barrel:

```ts
import { Card, CardBody, Button, Badge, cn } from "@manpowerhub/ui";
```

The shadcn CLI resolves imports against consumer **aliases**
(`@/components/...`, `@/lib/utils`), not our barrel. So the registry **build
step must transform** each file before emitting its JSON:

- `import { cn } from "@manpowerhub/ui"` → `import { cn } from "@/lib/utils"`
- `import { Card } from "@manpowerhub/ui"` →
  `import { Card } from "@/components/ui/card"`
  (one named import → its owning component module)
- `import { X } from "@manpowerhub/tokens"` → mapped to copied token path.

Implementation: a small transform script maps each exported symbol → its source
module (derived from `packages/ui/src/index.ts`), then rewrites barrel imports
into per-module alias imports. Symbols that resolve to `cn`/`utils` map to
`@/lib/utils`. This runs as part of registry build, before `shadcn build`.

### Build pipeline

1. **Generate** `registry.json` (root manifest) from the monorepo:
   walk `packages/ui/src/components/**` and `packages/blocks/src/components/**`,
   emit one item each. Dependency lists derived by scanning each file's imports
   (npm imports → `dependencies`; `@manpowerhub/ui` symbols →
   `registryDependencies`). Hand-maintain a small override map where auto-detect
   is wrong.
2. **Transform** source files (import rewrite above) into a staging dir the
   registry entries point at.
3. **`shadcn build`** compiles `registry.json` → static `public/r/*.json`
   under `apps/docs`.
4. **Serve** from the existing `apps/docs` Vercel deploy:
   `https://<docs-domain>/r/<name>.json`.

Consumer usage:

```bash
# one component
npx shadcn@latest add https://<docs-domain>/r/button.json
# full block — card, button, badge, cn all come with it
npx shadcn@latest add https://<docs-domain>/r/pricing-table.json
```

### CI / release changes

- **Remove** npm publish from `release.yml` (drop `changeset publish` / the
  `pnpm release` publish step). Keep changesets for internal version notes only,
  or remove if unused — decided during planning.
- **Add** a registry-build step so `apps/docs/public/r/*.json` is regenerated on
  every merge to `main` (either in CI committing artifacts, or at Vercel build
  time via `apps/docs` build script — prefer Vercel build time so no committed
  generated files).
- `ci.yml` (build, typecheck, lint, test, coverage) unchanged; add a check that
  registry generation succeeds and every item's files resolve.

## Data flow

```
author source (packages/ui, packages/blocks)
      │
      ▼
generate registry.json  ──►  transform imports (barrel → aliases)
      │                              │
      ▼                              ▼
   shadcn build  ────────────►  apps/docs/public/r/*.json
                                     │
                                     ▼  (Vercel)
                          https://<docs>/r/<name>.json
                                     │
                                     ▼
                 consumer: npx shadcn add <url>
                 → source lands in their repo, deps installed
```

## Error handling / edge cases

- **Missing dependency in output:** guard = a build check that every symbol used
  by a block resolves to a `registryDependencies` entry. Fail build otherwise.
- **Barrel import not rewritten:** build check greps emitted files for
  `@manpowerhub/` — any hit fails the build (would break consumer install).
- **Token classes:** components rely on token CSS vars + Tailwind preset.
  Consumer must install the tokens `globals.css` + preset. The registry ships
  these as files, and each component's docs note the one-time token setup.
- **React/Tailwind peer versions:** documented as prerequisites; not installed by
  the block (consumer app owns them).

## Testing

- **Registry generation unit tests:** given a fixture component with known
  imports, assert generated item has correct `dependencies`,
  `registryDependencies`, and rewritten import lines.
- **Import-rewrite tests:** barrel import → expected per-module alias imports;
  `cn` → `@/lib/utils`; no residual `@manpowerhub/*`.
- **End-to-end smoke:** in a scratch app, `shadcn add` a block against the built
  JSON, then typecheck the scratch app to prove the full block resolves.
- Existing component/block unit + axe tests unchanged (authoring side).

## Open items for planning

- Exact docs domain / whether registry lives under `apps/docs` or a dedicated
  route.
- Whether to keep changesets at all once npm publish is gone.
- Auto-detect vs. hand-maintained dependency map — start auto, override as needed.
