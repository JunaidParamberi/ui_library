# Starter code

Copy-ready starter for the monorepo described in `../01-ARCHITECTURE.md`. Copy
`packages/`, the root config files, and `CLAUDE.md` into a fresh repo root, then:

```bash
pnpm install
pnpm --filter @manpowerhub/ui build
```

**What's included (working):**
- `packages/tokens` — the full theming layer (globals.css, Tailwind preset, typed tokens). Complete.
- `packages/ui` — `cn()` util + example components proving the pattern: **Button**, **Badge** + **StatusBadge**, **Card**, **KPICard** — each with a `.stories.tsx`.

**What Claude Code fills in:** the rest of the components from docs 03–04, using
these as the template. Every new component follows the exact shape of `button/`
(component + stories + index, cva variants, forwardRef, tokened classes).

> Storybook, Vitest, and the shadcn CLI aren't pre-run here (they need
> `pnpm install`). `../CLAUDE_CODE_PROMPT.md` Phase 0 wires them.
