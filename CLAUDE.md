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

## Git workflow (non-negotiable)

**Model:** trunk-based. `main` always releasable. No `develop`, no long-lived branches.

**Branches:**
- Naming: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>`, `refactor/<slug>` — slug is kebab-case, describes the change, not a ticket number alone.
- Branch off latest `main`. Keep short-lived (days, not weeks) — rebase on `main` if it drifts, don't let it rot.
- One logical change per branch/PR. Don't bundle unrelated component additions with release plumbing.

**Commits:**
- Conventional Commits: `type(scope): summary` — `feat(ui): add Tooltip component`, `fix(blocks): forward ref in PricingTable`.
- Changesets (`pnpm changeset`) are now optional, kept only for internal changelog notes — no publish step consumes them.

**Pull requests:**
- Required before merge to `main`: CI green (`ci.yml` — build, typecheck, lint, test, coverage) **and** at least one approving review.
- Never push directly to `main`. Never merge with failing CI. Never merge your own PR without review unless explicitly told to bypass for a hotfix.
- Merge strategy: **squash merge** — one commit per PR on `main`, keeps history readable.
- Delete the branch after merge.

**Distribution — shadcn registry, not npm:**
- Components/blocks are NOT published to npm. They ship as a shadcn registry: consumers pull source via `npx shadcn add <url>`, which copies files straight into their own repo.
- The registry JSON is generated at docs build time — `apps/docs` `prebuild` runs `gen:registry` — and served by the `apps/docs` Vercel deploy at `/r/*.json`.
- `release.yml` now only deploys `packages/ui` Storybook to GitHub Pages. There is no npm publish, no `changeset publish`, no `NPM_TOKEN`, no provenance step.
- Vercel deploys (`apps/docs`, `apps/playground`, `packages/ui` + `packages/blocks` Storybooks) are separate, git-integration-based — they build on every push per their own `vercel.json`.
