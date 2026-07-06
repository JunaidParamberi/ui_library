# Handoff Gap-Fill: Components, Docs, Release, Deploy

**Goal:** Bring `packages/ui` + `packages/blocks` up to full parity with `manpowerhub-ui-handoff/03` and `04`, document everything in `apps/docs`, publish the pending release, and get `apps/docs` + `apps/playground` + both Storybooks live on Vercel as a real library site.

## Scope

### 1. New `packages/ui` components (handoff 03 + 04)
Each follows the binding component contract in `CLAUDE.md` exactly (forwardRef, `cn()` className merge, `...props` spread, `cva` variants, `.tsx` + `.stories.tsx` + `.test.tsx` + `index.ts`, barrel re-export).

- **Radio, Switch, Textarea** — thin wrappers alongside existing Input/Checkbox pattern.
- **Avatar** — image + fallback initials, size variants.
- **Tooltip** — Radix Tooltip primitive wrap.
- **DropdownMenu** — Radix DropdownMenu wrap.
- **Dialog/Modal** — Radix Dialog wrap.
- **Table + DataTable** — static Table primitives + DataTable (sort/paginate wrapper), per handoff 03.
- **AppShell** — layout shell (sidebar/topbar/content), per handoff 04 structure/responsive spec.
- **ThemeToggle** — light/dark toggle using existing token CSS vars.
- **CommandMenu** — ⌘K command palette (`cmdk` or Radix Dialog + list).
- **AreaChart, MiniBars** — dataviz, per handoff 04 (check existing charting dep before adding new one).
- **Progress, HealthRing** — progress bar + radial ring.
- **Skeletons & Loaders** — per handoff 04 list.
- **Icons** — re-export/curated `lucide-react` set per handoff.

Out of scope: no new blocks unless handoff calls for one not yet built — current 6 blocks already match handoff scope; skip unless gap found during implementation.

### 2. Docs (`apps/docs/content`)
One `.mdx` page per new component/block, matching the existing page structure (see `content/components/button.mdx`), plus `_meta.ts` entries updated for both `content/components` and `content/blocks`.

### 3. Release
Existing pending changeset (`.changeset/purple-trees-build.md`) covers the current gap (tokens/ui/blocks minor). Add a second changeset for this batch of new components once built. Publish flow is unchanged (documented in CLAUDE.md git-workflow section already added) — merge to `main` → Changesets "Version Packages" PR → merge that → npm publish + Pages Storybook deploy.

### 4. Deploy — real library site on Vercel
`vercel.json` already exists for `apps/docs`, `apps/playground`, `packages/ui` (Storybook), `packages/blocks` (Storybook) — each builds correctly from its own config. What's missing is the actual Vercel **project** linkage (connecting each path to a Vercel project under the user's account) — this is an account-level action only the user can do via the Vercel dashboard/CLI login, so:
- I will verify each `vercel.json` build actually succeeds locally (`pnpm --filter X build[-storybook]`) before handoff.
- I will not create Vercel projects or link the account — that requires the user's Vercel login. I'll hand back exact steps (`vercel link` per directory, or dashboard "Import Project" with these 4 paths as separate projects) once builds are verified green.

## Testing
Per-component Vitest + Testing Library + axe test (existing pattern in `button.test.tsx`). `pnpm -r build && pnpm -r exec tsc --noEmit && pnpm lint && pnpm test` must stay green (mirrors `ci.yml`).

## Not doing
- No new charting library unless truly absent — check `packages/ui` deps first.
- No changes to release automation (already correct, just documented).
