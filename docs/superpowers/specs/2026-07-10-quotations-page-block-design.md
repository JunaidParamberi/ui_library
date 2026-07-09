# QuotationsPage Block — Design

**Date:** 2026-07-10
**Status:** Approved (design), pending implementation plan

## Goal

Ship a new **`QuotationsPage`** block: a single, reusable, full-feature quotations
page that matches the ManpowerHub prototype (finance → Quotations screen). A
consumer pulls one block and gets the whole feature — summary stats, status tabs,
search, an enriched list, and the create/edit/detail/print flow — not just a bare
list.

The existing `Quotation` block stays as the minimal variant (list → form → detail
on `DocumentShell`). `QuotationsPage` is a full-feature **sibling** that reuses the
same sub-components; no flow logic is duplicated.

Reference prototype: finance Quotations page with a 5-card stat row, a
`Quotations` header + `New Quotation` action, status tabs
(All / Draft / Pending / Approved / Sent / Rejected) with counts, a search box,
and a table with Number, Customer (+ email), Date, Items, Value (AED), Status,
and row edit/delete actions.

Out of scope: the app chrome (`AppShell` sidebar/topbar). The block renders the
content region only; consumers slot it into their own `AppShell`.

## Architecture

New directory: `packages/blocks/src/components/quotations-page/`

| File | Responsibility |
|------|----------------|
| `quotations-page.tsx` | Controller. Owns the view state machine + `api` prop. Renders `QuotationsOverview` as the landing view; delegates create/edit/detail/print to existing sub-components. |
| `quotations-overview.tsx` | Presentational landing screen (the prototype). Stats + header + tabs + search + enriched table + delete-confirm. Pure props in / callbacks out. |
| `quotations-page.stories.tsx` | Stories: default, dark, loading, empty, error, Customization. |
| `quotations-page.test.tsx` | Vitest + Testing Library + axe. |
| `index.ts` | Barrel export. |

Re-export `QuotationsPage` (and `QuotationsOverview`) from
`packages/blocks/src/index.ts`.

### Reuse (import from `../quotation`, do not copy)

- `QuotationForm`, `QuotationDetail`, `QuotationDocument`, `QuotationStatusPill`
- `subtotal` from `quotation.totals`
- Types from `quotation.types`
- `createMockQuotationApi`, `type QuotationApi`, `seedQuotations` from `quotation.mock`

## Component contract (per CLAUDE.md — non-negotiable)

Both `QuotationsPage` and `QuotationsOverview`:
- Forward `className` composed via `cn()`.
- Forward `ref` (`React.forwardRef`).
- Spread remaining `...props` onto the root element.
- Expose visual variants via `cva` where a visual variant is meaningful
  (`QuotationsOverview` may carry a density/padding variant; `QuotationsPage` at
  minimum forwards className/ref/props — add `cva` only if a real visual axis exists,
  otherwise keep the contract items that apply).

## `QuotationsPage` (controller)

```ts
interface QuotationsPageProps extends React.HTMLAttributes<HTMLDivElement> {
  api?: QuotationApi;       // defaults to createMockQuotationApi()
  currency?: string;        // defaults to "AED", forwarded to Overview
}
```

State machine (identical shape to existing `Quotation`):

```ts
type View =
  | { name: "list" }
  | { name: "form"; id?: string }
  | { name: "detail"; id: string }
  | { name: "document"; id: string };
```

Behavior:
- On mount, `list()` → `items`; `loading` while fetching; `error` surfaces via
  `role="alert"`.
- `list` view renders `<QuotationsOverview … />` (replaces the plain
  `QuotationList` used by the minimal block).
- `onNew` → `{ name: "form" }`; `onOpen(id)` → `{ name: "detail", id }`;
  `onEdit(id)` → `{ name: "form", id }`.
- `onDelete(id)` → `api.remove(id)` → refetch (see delete flow below).
- `form` / `detail` / `document` views reuse existing sub-components exactly as
  the `Quotation` block wires them (create, update, submitForApproval, decide,
  print/back).

## `QuotationsOverview` (presentational)

```ts
interface QuotationsOverviewProps extends React.HTMLAttributes<HTMLDivElement> {
  quotations: PersistedQuotation[];
  isLoading?: boolean;
  currency?: string;                 // default "AED"
  onNew: () => void;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
```

Internal local state: `statusFilter` ("ALL" | QuotationStatus), `search` string.

### Stats — `StatCardRow columns={5}`

Computed from `quotations` (full list, not the filtered view):

| Card | Value | Sub |
|------|-------|-----|
| Total Quotations | `count` | — |
| Total Value | `{currency} {formatThousands(Σ subtotal(items))}` | — |
| Draft | count `DRAFT` | "awaiting submission" |
| Pending Approval | count `PENDING_APPROVAL` | "in review" |
| Approved | count `APPROVED` | "ready to send" |

`StatCardRow` currently maxes at `columns:4`. **Add a `columns:5` variant**:
`grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`. This is the only change to an
existing block. Keep its stories/tests green; add coverage for the new variant.

While `isLoading`, pass `loading` to `StatCardRow` (skeletons).

### Header — `PageHeader`

`<PageHeader title="Quotations" actions={<Button variant="primary">New Quotation</Button>} />`
Button `onClick={onNew}`.

### Tabs — Radix `Tabs` / `TabsList` / `TabsTrigger`

Triggers: All / Draft / Pending / Approved / Sent / Rejected, each showing a
count of matching quotations. Selecting a tab sets `statusFilter`. Counts come
from the full list.

### Search — `DataTableToolbar`

Use `DataTableToolbar` with `search` only (no select `filters` — status is owned
by the tabs). Search matches `quotationNumber`, `customer.name`, and
`customer.emailId`, case-insensitive.

The visible rows = quotations filtered by `statusFilter` **and** `search`
combined.

### Table (enriched)

Columns: Number (mono) · Customer (name + `emailId` as muted sub-line) · Date
(tabular-nums) · Items (tabular-nums) · Value (`{currency} {formatThousands(subtotal(items))}`,
tabular-nums) · Status (`QuotationStatusPill`) · Actions.

- Row is clickable → `onOpen(id)` (keeps existing `role="button"` / `tabIndex` /
  Enter-key behavior).
- Actions cell: edit (pencil) → `onEdit(id)`; delete (trash) → opens confirm.
  Both action buttons call `stopPropagation` so they don't trigger row open.
- Loading → "Loading…"; empty (no quotations at all) → empty message; filtered-empty
  (filters exclude everything) → a distinct "No quotations match" message.

### Delete flow (guarded, not instant)

Trash icon → controlled `Dialog` confirm ("Delete {quotationNumber}? This can't
be undone."). Confirm → `onDelete(id)`. Cancel → close. The controller performs
`api.remove(id)` then refetches. No auto-delete on click.

## Mock seed

Expand `seedQuotations()` to **5 rows** covering all five statuses (DRAFT,
PENDING_APPROVAL, APPROVED, SENT, REJECTED) with realistic AED-scale rates, so
tabs, counts, and stats look real in stories/docs/registry demo. The existing
`Quotation` block consumes the same seed and must still pass its tests — update
those expectations if row count/content is asserted.

## Docs + registry wiring

- **Registry:** auto-discovered — `build-registry.ts` reads
  `packages/blocks/src/components/*`, so the new dir is included with no script
  change. Verify `gen:registry` output contains `quotations-page`.
- **Docs nav:** add `"quotations-page": "QuotationsPage"` to
  `apps/docs/content/blocks/_meta.ts`.
- **Docs catalog:** add a `quotations-page` entry to `apps/docs/src/lib/catalog.ts`
  (slug, demoKey, docgenName `QuotationsPage`, story, pkg `blocks`).
- **Demo:** add `apps/docs/src/components/demos/quotations-page-demo.tsx`
  (renders `<QuotationsPage />` with mock api).
- **MDX page:** add `apps/docs/content/blocks/quotations-page.mdx` following the
  `quotation.mdx` structure (Preview, Usage, Props, Accessibility).

## Testing

`quotations-page.test.tsx` (+ overview coverage):
- Stat math: total count, total value = Σ subtotal, per-status counts.
- Tab filter narrows rows to the selected status; counts correct.
- Search filters by number / customer name / email; combines with tab filter.
- Row click → `onOpen`; edit → `onEdit`; delete → confirm dialog → `onDelete`
  (and does **not** delete on cancel).
- Empty vs filtered-empty render distinct messages.
- Loading shows stat skeletons + list loading state.
- axe: no violations (default + dark).
- `StatCardRow` `columns:5` variant covered in its own test.

## YAGNI / non-goals

- No `AppShell` embedding.
- No real persistence — mock api only; consumers inject their own `QuotationApi`.
- No bulk selection / bulk actions (single-row edit/delete only).
- No column sorting (prototype doesn't show it).
- No pagination (dataset is small; add later if needed).
