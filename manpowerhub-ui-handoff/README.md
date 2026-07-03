# @manpowerhub/ui — Design System & Component Library Handoff

This package is the **single source of truth** for building `@manpowerhub/ui`: a
reusable, themeable React component library (TypeScript · Tailwind · shadcn/ui)
that every ManpowerHub app is built on top of.

It replaces the four older `design_handoff_*` folders (now in `/archive/`). Use
only this package.

---

## What you're building

A **published component library** — not a one-off app. The ManpowerHub workforce
app is the *first consumer* of it; future apps reskin it by swapping design
tokens (see `08-THEMING-MULTIAPP.md`). Concretely:

- `@manpowerhub/ui` — components, wrapping shadcn/ui primitives, styled with our tokens
- `@manpowerhub/tokens` — the theming layer: CSS variables + Tailwind preset
- Storybook — the living catalog: every component, every variant, every state (light/dark, loading, empty, error)

## The design is a reference, not code to copy

The files in `reference/` are an **in-browser React prototype** (Babel + CDN
React + plain CSS). They show the intended look, behavior, spacing, and copy
with pixel accuracy. **Do not ship them.** Your job is to re-implement them as a
real TypeScript library on shadcn/ui + Tailwind, matching the reference visually.

- **Fidelity: high.** Colors, type, spacing, radii, motion, and interactions are final. Match them.
- `reference/styles/tokens.css` and `reference/styles/app.css` are the exact values. `02-TOKENS-AND-TAILWIND.md` translates them into the shadcn/Tailwind world.

## How to use this with Claude Code

1. Copy this whole folder into your new repo at `docs/ui-handoff/`.
2. Open the repo in Claude Code.
3. Paste the entire contents of **`CLAUDE_CODE_PROMPT.md`** as your first message.

It bootstraps the monorepo, installs tokens + Tailwind preset, scaffolds
Storybook, then builds components phase by phase — pausing for your review after
each phase.

---

## Read in this order

| Doc | What it covers |
|---|---|
| `CLAUDE_CODE_PROMPT.md` | **Paste this into Claude Code first.** The build plan. |
| `01-ARCHITECTURE.md` | Stack, repo/package layout, exports, naming, a11y, testing, CI |
| `02-TOKENS-AND-TAILWIND.md` | Every token → shadcn CSS vars (HSL) + `tailwind.config` + `globals.css` |
| `03-COMPONENTS-CORE.md` | Button, Input, Select, Checkbox/Radio/Switch, Card, Badge, StatusBadge, Tabs, Table/DataTable, Avatar, Tooltip, Dialog, DropdownMenu, EmptyState |
| `04-COMPONENTS-SHELL-DATAVIZ.md` | AppShell (Sidebar + Topbar + ThemeToggle), CommandMenu (⌘K), KPICard, AreaChart, MiniBars, Progress, HealthRing, Skeletons & Loaders |
| `05-DOCUMENTS.md` | Printable document templates (Invoice, Quote, Proposal, Voucher, Statement, Credit Note, Delivery Note) + emails |
| `06-STORYBOOK.md` | Storybook setup, story conventions, the required state matrix per component |
| `07-SCENARIOS.md` | Full screens as usage examples (Dashboard, Workers, Sites, Quotations, Invoices, Tasks, Timesheets, Expenses, Settings, Login) |
| `08-THEMING-MULTIAPP.md` | How to reuse the library across multiple apps by re-tokening |
| `starter/` | **Copy-ready starter code** — full `@manpowerhub/tokens` + example components (Button, Badge, Card, KPICard) with stories. See `starter/README.md`. |
| `reference/` | The canonical prototype — source of truth for look & behavior |

## The reference prototype

Open `reference/ManpowerHub Prototype.html` in a browser to see the whole app
running. The in-app **Design System** route (bottom of the sidebar → Internal →
Design system) is a live component gallery. Screens live in
`reference/src/screens/`, shared components in `reference/src/components/`,
tokens in `reference/styles/tokens.css`, all component CSS in
`reference/styles/app.css`.

## Definition of done

- [ ] `@manpowerhub/tokens` builds a CSS file + Tailwind preset from the token source
- [ ] Every component in docs 03–04 exists, typed, matching the reference visually in light **and** dark
- [ ] Every component has a Storybook story covering all variants + states (06)
- [ ] Loading / empty / error states exist on every async surface
- [ ] a11y: keyboard nav, focus rings, ARIA per component notes; Storybook a11y addon passes
- [ ] A second demo theme proves the library reskins by tokens alone (08)
