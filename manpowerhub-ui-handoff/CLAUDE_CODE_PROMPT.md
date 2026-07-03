# Paste this into Claude Code

> Copy everything below the line into Claude Code as your first message, after
> placing this handoff folder at `docs/ui-handoff/` in a fresh repo.

---

You are building **`@manpowerhub/ui`**, a reusable React component library
(TypeScript + Tailwind + shadcn/ui) plus a **`@manpowerhub/tokens`** theming
package and a Storybook catalog. The complete specification is in
`docs/ui-handoff/`. Read it before writing code. The `reference/` folder there is
a working prototype that defines the exact look and behavior — treat it as
design truth, not code to copy. Re-implement it properly on shadcn/ui.

**Read first, in order:** `README.md`, `01-ARCHITECTURE.md`,
`02-TOKENS-AND-TAILWIND.md`. Then the component docs as you build.

Work in phases. **Stop after each phase and summarize for my review before
continuing.**

### Phase 0 — Scaffold
- Set up a pnpm workspace monorepo per `01-ARCHITECTURE.md` (`packages/tokens`,
  `packages/ui`, `apps/storybook`, optionally `apps/workforce`).
- `packages/ui`: Vite library mode + `tsup` for types, React 18 peer dep,
  shadcn/ui initialized, Tailwind configured to consume the tokens preset.
- Add ESLint + Prettier + TypeScript strict + Vitest + Testing Library.
- Create `CLAUDE.md` at repo root and paste in the "Binding rules" block from
  `01-ARCHITECTURE.md` so all future work follows the system.

### Phase 1 — Tokens & theme
- Implement `@manpowerhub/tokens` exactly per `02-TOKENS-AND-TAILWIND.md`:
  `globals.css` with `:root` + `.dark` HSL variables, the Tailwind preset, fonts
  (Geist + JetBrains Mono), and the `ThemeProvider`/theme-toggle contract.
- Verify light and dark render correctly before moving on.

### Phase 2 — Core components (`03-COMPONENTS-CORE.md`)
Button, Input, Textarea, Select, Checkbox, Radio, Switch, Card, Badge,
StatusBadge, Tabs, Table + DataTable, Avatar, Tooltip, Dialog, DropdownMenu,
EmptyState. Each: shadcn base + our tokens, typed props matching the doc, all
variants/sizes/states, a11y, and a Storybook story (see `06-STORYBOOK.md`).

### Phase 3 — Data-viz & shell (`04-COMPONENTS-SHELL-DATAVIZ.md`)
KPICard, AreaChart, MiniBars, Progress, HealthRing, the full Skeleton + Loader
set, then AppShell (Sidebar + Topbar + ThemeToggle) and CommandMenu (⌘K).

### Phase 4 — Documents & emails (`05-DOCUMENTS.md`)
The 7 printable document templates + email templates, with print CSS.

### Phase 5 — Scenarios (`07-SCENARIOS.md`)
Assemble the library into the real screens as Storybook "pages" / example routes,
proving the components compose. Include loading/empty/error variants.

### Phase 6 — Multi-app proof (`08-THEMING-MULTIAPP.md`)
Add a second token theme and show the whole catalog reskins with no component
changes. Document how a new app consumes the library.

### Rules
- Match the reference **visually** (colors, spacing, radii, type, motion) — see tokens doc.
- shadcn/ui components underneath; our styling + API on top. Don't invent new visual language.
- Every async surface needs loading, empty, and error states.
- Everything works in light and dark.
- Keyboard + screen-reader accessible; visible focus rings (`--ring`).
- Don't reference anything in `/archive/` — it's superseded exploration.
