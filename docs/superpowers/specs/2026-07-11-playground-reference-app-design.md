# Playground → Wired Reference App

**Date:** 2026-07-11
**Status:** Approved design, pre-plan
**Scope:** Replace the playground's showcase grids with a wired, routed ManpowerHub
reference app. First slice: App shell + Dashboard + full Quotations flow.

## Problem

The library has three surfaces and none of them show how the pieces fit together:

- **Playground** (Vite SPA) — three static showcase pages (`kitchen-sink`,
  `components-showcase`, `blocks-showcase`). Components float in grids, no context.
- **Docs** (Next.js/MDX) — registry install docs + guides.
- **Storybook** — isolated per-component states.

Storybook already covers "the part" (a component in isolation). Nothing covers
"the whole" — how blocks compose into real screens with real data and real states.
For the maintainer and future developers, the mental model of *how a screen is
built from the library* is missing.

The handoff (`manpowerhub-ui-handoff/07-SCENARIOS.md` + `reference/src/screens/*.jsx`)
always intended an example app of 11 screens. It was never built — the playground
shipped grids instead. This closes that gap.

## Goal

The playground becomes one wired ManpowerHub app. A developer opens a screen file
and reads it as *"compose these blocks, feed them mock data, branch on state."*
That file is the teaching artifact.

**Audience:** the maintainer + developers building on / consuming the library.
Not a customer demo.

## Decisions (locked)

1. **Replace, not alongside** — the wired app replaces the showcase grids. Grids
   already live in Storybook, so they are redundant here.
2. **Deep vertical slice, not broad stubs** — App shell + Dashboard + full
   Quotations flow (list → detail → form), built end-to-end. The remaining 9
   screens are out of scope for this spec and follow the same pattern in later specs.
3. **Simulated data lifecycle** — screens show all four states the handoff mandates
   (loaded / loading / empty / error), not just loaded. Half the blocks (skeletons,
   `empty-state`, error+retry) only appear off the happy path.
4. **Quotations composed from sub-blocks** — NOT the finished `<QuotationsPage/>`
   block. The value is seeing the composition, so screens wire the sub-blocks
   (`QuotationListPane`/`QuotationList`, `MasterDetailShell`, `QuotationDetail`/
   `QuotationDocument`, `QuotationForm`) themselves, with real per-quote URLs.
5. **Real routing** — `react-router-dom`, so `/quotations/:id`, `/new`, back button
   all work and the routing pattern is itself part of the mental model.

## Hard rule (the whole point)

Screens import ONLY from `@manpowerhub/ui` and `@manpowerhub/blocks` (workspace
packages). Never from the handoff reference source. Never reach into a raw primitive
that a block already wraps. A screen file must read as composition of published
library parts over mock data.

## Architecture

Playground stays a Vite SPA. New structure:

```
apps/playground/src/
  main.tsx                 # mounts <RouterProvider router={router} />
  router.tsx               # react-router route table → screens, all under <AppShell/>
  app/
    AppShell.tsx           # wraps app-shell block: sidebar nav + topbar + theme-toggle + <Outlet/>
  data/
    mock.ts                # dashboard mock data (KPIs, revenue series, activity, recent rows), typed
    useResource.ts         # fake-fetch hook for Dashboard: delay -> loading->loaded; forceState override; refetch
    StateToggle.tsx        # dev-only widget + context to force loading/empty/error/loaded on Dashboard
  screens/
    Dashboard.tsx          # route "/"
    QuotationsList.tsx     # route "/quotations"
    QuotationDetail.tsx    # route "/quotations/:id"
    QuotationForm.tsx      # routes "/quotations/new" and "/quotations/:id/edit"
```

**Deleted:** `pages/kitchen-sink.tsx`, `pages/components-showcase.tsx`,
`pages/blocks-showcase.tsx` and their tests (`anchors.test.tsx`,
`blocks-showcase.test.tsx`). Grids now live in Storybook.

**New dependency:** `react-router-dom` in `apps/playground/package.json`.

## Data & lifecycle

Two data sources, same "simulate async delay" philosophy — no duplication:

**Dashboard** — no api exists in the library for it, so:
- `mock.ts` — pure typed mock data ported from
  `manpowerhub-ui-handoff/reference/src/data.jsx` (dashboard slice only): 4 KPIs,
  revenue series for `area-chart`, recent-activity rows, recent-quotations rows.
- `useResource<T>(key, opts)` — returns `{ data, status, refetch }` where
  `status = loading | loaded | empty | error`. Default: `setTimeout` ~600ms flips
  `loading -> loaded`. A `forceState` override (read from `StateToggle` context)
  short-circuits to any state. `refetch()` re-runs (drives error -> retry).
- `StateToggle` — a small fixed-corner dev control (loaded/loading/empty/error)
  that sets the context `useResource` reads. Dev-only chrome, visually separate
  from the "real app". Lets you *see* every block state without hand-faking data.

**Quotations** — the library already ships `QuotationApi` with built-in `delay()`:
`list / get / create / update / remove / submitForApproval`, plus
`createMockQuotationApi(seed?)`. The flow uses this api directly. No `useResource`,
no duplicated mock. Empty state = `createMockQuotationApi([])`.

Each Dashboard render branches on `status`:
- `loading` -> skeleton composition (Skeleton primitives / block skeletons)
- `empty`   -> `empty-state` block with a CTA
- `error`   -> error message + retry button calling `refetch`
- `loaded`  -> real composition

That four-branch shape is the teaching artifact.

## Screens (composition map)

**AppShell** — `app-shell` block. Sidebar nav lists all 11 routes; Dashboard and
Quotations are active, the other 9 are present but disabled/"soon" so the frame
reads as a whole product. Topbar + `theme-toggle`. Renders `<Outlet/>`.

**Dashboard** (`/`) — `page-header` -> `stat-card-row` (4 `kpi-card`) ->
`area-chart` revenue panel + activity list (`card` + `avatar` + `badge`) ->
recent-quotations `table`. States driven by `useResource` + `StateToggle`.
Loading = skeleton KPI row + skeleton chart + skeleton table.

**QuotationsList** (`/quotations`) — `page-header` (title + "New quotation" CTA)
-> `data-table-toolbar` (search/filter) -> `QuotationListPane`/`QuotationList`
fed by `api.list()`. Row click navigates to `/quotations/:id`. Empty =
`empty-state` "No quotations yet" with add CTA. Loading/error handled from the
api promise.

**QuotationDetail** (`/quotations/:id`) — `MasterDetailShell`: list pane (left) +
detail pane rendering `QuotationDetail` / `QuotationDocument` (through
`document-shell`: header, parties, line items, totals, VAT) fed by `api.get(id)`.
"Edit" navigates to `/quotations/:id/edit`. Missing id -> empty/not-found state.

**QuotationForm** (`/quotations/new`, `/quotations/:id/edit`) — `QuotationForm`
block: fields, line items, optional items, live totals. Submit calls
`api.create` (new) or `api.update` (edit), then navigates to the detail route.
Persistence is in-memory only (the mock api's store).

## Testing

The playground is a consumer app, not a library package — the component contract
(stories + axe per component) does NOT apply here. Thin tests only:

- **Router smoke test** — each route renders without crashing (extends the
  existing `App.test.tsx` pattern).
- **Dashboard state test** — forcing loading / empty / error via the `StateToggle`
  context renders the correct block branch.

Real component behavior/accessibility tests stay in the `packages/ui` and
`packages/blocks` suites.

## Out of scope

- The other 9 screens (Workers, Sites, Tasks, Invoices, Expenses, Timesheets,
  Settings, Login, Design-system) — later specs, same pattern.
- Any real backend / persistence beyond the in-memory mock stores.
- Changes to `packages/ui`, `packages/blocks`, or the docs/registry app.
- Mounting the finished `<QuotationsPage/>` block (decision 4 rejects it).

## Success criteria

- Playground boots into the ManpowerHub app shell at `/`.
- Dashboard renders and its four states are all reachable via StateToggle.
- Quotations: list -> click a row -> detail with document -> edit/new form ->
  save -> back to detail, all with real URLs and the mock api.
- Every screen file imports only from `@manpowerhub/ui` / `@manpowerhub/blocks`.
- Old showcase grid pages and their tests are gone.
- `pnpm --filter playground build` + `test` pass; playground Vercel deploy still builds.
