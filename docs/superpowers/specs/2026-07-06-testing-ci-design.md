# Testing / CI Phase — Design

**Date:** 2026-07-06  
**Status:** Approved  
**Parent spec:** `docs/superpowers/specs/2026-07-04-multiapp-ui-platform-design.md`

## Goal

Harden the monorepo with two quality gates:

1. **Coverage gate** — 80% line/function/branch/statement threshold enforced per package via Vitest + `@vitest/coverage-v8`.
2. **Visual regression** — Chromatic snapshots all Storybook stories in `packages/ui` and `packages/blocks`; visual diffs surfaced in Chromatic dashboard, not as hard CI failures.

Both gates slot into the existing `ci.yml` single-job workflow with no structural changes.

## Scope

Packages receiving coverage gates:

| Package | Path |
|---------|------|
| `@manpowerhub/ui` | `packages/ui` |
| `@manpowerhub/blocks` | `packages/blocks` |
| `@manpowerhub/playground` | `apps/playground` |

Packages receiving Chromatic snapshots:

| Package | Storybook port | Chromatic secret |
|---------|---------------|------------------|
| `@manpowerhub/ui` | 6006 | `CHROMATIC_UI_TOKEN` |
| `@manpowerhub/blocks` | 6007 | `CHROMATIC_BLOCKS_TOKEN` |

## Coverage Gate

### Tooling

- Add `@vitest/coverage-v8` to `devDependencies` in each of the three packages above.
- Add `coverage` script to each `package.json`: `"coverage": "vitest run --coverage"`.
- Configure `coverage` block in each `vitest.config.ts`.

### Threshold config (identical for all three packages)

```ts
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
```

Storybook files and barrel re-exports are excluded — they contain no testable logic.

### CI steps (added to `build-test` job after existing `pnpm test`)

```yaml
- name: Test with coverage (ui)
  run: pnpm --filter @manpowerhub/ui vitest run --coverage

- name: Test with coverage (blocks)
  run: pnpm --filter @manpowerhub/blocks vitest run --coverage

- name: Test with coverage (playground)
  run: pnpm --filter @manpowerhub/playground vitest run --coverage
```

Each step fails the job if its package falls below any threshold. Failures are reported distinctly per package.

## Visual Regression (Chromatic)

### Tooling

- Add `chromatic` CLI package to `devDependencies` in `packages/ui` and `packages/blocks`.
- Add `chromatic` script to each `package.json`: `"chromatic": "chromatic"`.
- No Storybook addon required — Chromatic CLI builds Storybook and uploads snapshots directly.

### Two separate Chromatic projects

One project per Storybook. This scopes visual diffs: a regression in a primitive doesn't pollute the blocks report and vice versa.

| Project | Token secret |
|---------|-------------|
| `@manpowerhub/ui` Storybook | `CHROMATIC_UI_TOKEN` |
| `@manpowerhub/blocks` Storybook | `CHROMATIC_BLOCKS_TOKEN` |

Both secrets must be created in the GitHub repo settings **after** connecting each Storybook to chromatic.com.

### CI steps (added after coverage steps)

```yaml
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

`--exit-zero-on-changes` — Chromatic captures snapshots and surfaces diffs in its UI but does not fail CI. Reviewers accept/reject in the Chromatic dashboard. This avoids blocking CI before tokens are configured or before a baseline is established.

### Graceful skip

Both Chromatic steps guard with `if: ${{ secrets.CHROMATIC_UI_TOKEN != '' }}` / `if: ${{ secrets.CHROMATIC_BLOCKS_TOKEN != '' }}`. CI stays green on forks, draft PRs, and any environment where tokens are not yet configured.

## Non-goals (now)

- Chromatic PR status checks (can be enabled from the Chromatic dashboard later).
- Per-PR coverage diff comments.
- Separate coverage reporting job or artifact upload.
- Chromatic on `apps/playground` (it has no Storybook).

## Success criteria

- `pnpm --filter @manpowerhub/ui vitest run --coverage` passes with ≥80% on all metrics.
- `pnpm --filter @manpowerhub/blocks vitest run --coverage` passes with ≥80% on all metrics.
- `pnpm --filter @manpowerhub/playground vitest run --coverage` passes with ≥80% on all metrics.
- CI (`ci.yml`) runs coverage steps and exits non-zero when a threshold is missed.
- Chromatic steps skip gracefully when tokens absent; run and upload when present.
- `pnpm -r build` and `pnpm -r test` remain green.
