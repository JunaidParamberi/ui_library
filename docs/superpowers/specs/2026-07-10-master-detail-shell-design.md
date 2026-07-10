# Master-Detail Shell + Quotations Page Rewire — Design

**Date:** 2026-07-10
**Status:** Approved (pending spec review)

## Problem

Feature pages (starting with Quotations) currently use a full-page **view switcher**:
`QuotationsPage` renders one screen at a time — list → detail → form → document.
Every navigation replaces the whole viewport. There is no persistent list, no fast
scanning between records, and "open document" loses the list context entirely.

Target UX (per reference "Clients" screen): a **master-detail** layout —
a persistent list pane on the left, a detail pane on the right with inline
Edit / Delete / actions, and a **"Full view"** button that expands the detail into
the printable document.

This pattern must be reusable across future feature pages (invoices, clients, LPOs),
so the layout mechanics are extracted into a **generic block**.

## Goals

- Reusable `MasterDetailShell` block: split layout, responsive stacking, full-view toggle.
- Compact selectable left list (`QuotationListPane`) with search + selected highlight.
- Rewire `QuotationsPage` onto the shell without changing its API layer.
- Preserve all existing quotation behaviors (create, edit, submit, decide, delete, print).

## Non-Goals

- No changes to `QuotationApi` / mock API / totals logic.
- No rewrite of `QuotationDetail`, `QuotationDocument`, `QuotationForm` internals
  (only wiring + a new "Full view" trigger on detail).
- No new feature pages yet — shell is built generic, but only Quotations consumes it now.
- The wide `QuotationsOverview` / table-based `QuotationList` stay as-is for other uses.

## Architecture — three parts

### 1. `MasterDetailShell` (new generic block)

Location: `packages/blocks/src/components/master-detail-shell/`.
Knows nothing about quotations. Owns layout + responsive + full-view presentation only.
Selection/mode state is **controlled** by the consumer.

```tsx
interface MasterDetailShellProps extends React.HTMLAttributes<HTMLDivElement> {
  list: React.ReactNode;               // left pane, always mounted
  detail?: React.ReactNode;            // right pane, compact — when a record is selected
  detailPlaceholder?: React.ReactNode; // right pane when nothing selected (desktop)
  full?: React.ReactNode;              // full-width content (e.g. document render)
  isFull?: boolean;                    // controlled: full view active
  hasSelection?: boolean;              // drives mobile stacking + which pane shows
  onBack?: () => void;                 // mobile back / exit full
  listWidth?: string;                  // default "20rem"
}
```

Behavior:

- **Desktop (`md` and up):** CSS grid, columns `[listWidth] 1fr`.
  Left column = `list`. Right column = `detail` when `hasSelection`, else `detailPlaceholder`.
  When `isFull` is true → left column hidden, `full` spans full width.
- **Mobile (below `md`):**
  - `isFull` → show `full` full-width, back arrow calls `onBack`.
  - else `hasSelection` → show `detail` full-width, back arrow calls `onBack`.
  - else → show `list` full-width.
- Contract: `className` composed via `cn()`, `ref` forwarded, `...props` spread on root.
  `cva` not required (single visual form); may add a `listWidth`/density variant later.

### 2. `QuotationListPane` (new compact left list)

Location: `packages/blocks/src/components/quotation/quotation-list-pane.tsx`.
Selectable card rows tuned for a narrow (~20rem) column — NOT a wide table.

Each row: quotation number (mono), customer name + email, status pill, value.
Selected row gets a highlight (ring/background, like the reference). Includes a search
box and a "New quotation" button in the pane header; optional status filter.

```tsx
interface QuotationListPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  quotations: PersistedQuotation[];
  selectedId?: string | null;
  currency?: string;
  isLoading?: boolean;
  onOpen: (id: string) => void;
  onNew: () => void;
}
```

Search filters by quotation number / customer name / email (same predicate as
`QuotationsOverview`). Empty + loading states inline. Contract as above.

### 3. `QuotationsPage` (rewire)

Location: `packages/blocks/src/components/quotations-page/quotations-page.tsx` (rewrite render).
Owns selection + mode; API layer unchanged.

State:

```tsx
const [selectedId, setSelectedId] = React.useState<string | null>(null);
const [mode, setMode] = React.useState<"split" | "full" | "form">("split");
// mode "form" carries create-vs-edit via selectedId (null = create)
```

Slot wiring into `MasterDetailShell`:

- `list` = `QuotationListPane` (selectedId, onOpen → select + `mode="split"`, onNew → `mode="form"` + clear selection).
- `detail` = `QuotationDetail` (current), extended with a **"Full view"** button → `mode="full"`.
  Keeps existing Edit / Print / Submit / Decide actions; Edit → `mode="form"`.
- `detailPlaceholder` = `EmptyState` block ("Select a quotation to view details").
- `full` = `QuotationDocument` (current) + Print/Download; back → `mode="split"`.
- `hasSelection` = `current != null && mode !== "form"`.
- `isFull` = `mode === "full" && current != null`.

Form is rendered as a focused overlay when `mode === "form"` (not inside the split),
preserving the current create/edit form UX. Save returns to `mode="split"` with the
saved record selected.

## Data flow

- Row click → `setSelectedId(id)`, `mode="split"`.
- "Full view" → `mode="full"` (same `selectedId`).
- Edit → `mode="form"`; Save → `mode="split"`, keep `selectedId`; Cancel → `mode="split"`.
- New → `mode="form"`, `selectedId=null`; Save → select new record, `mode="split"`.
- Delete → confirm dialog → `remove()` → refetch → if deleted was selected, clear `selectedId`.
- Submit / Decide → mutate → refetch → stay in `split`; detail reflects new status.
- Mobile back → from detail clears `selectedId`; from full sets `mode="split"`.

## Edge cases

- **Nothing selected (desktop):** right pane shows `detailPlaceholder` empty-state.
- **Selected record removed / dropped on refetch:** `current` becomes `undefined` →
  clear `selectedId`, fall back to placeholder; guard forbids `isFull` without `current`.
- **Loading:** list pane shows its own loading; detail shows placeholder until a pick.
- **`isFull` guard:** full view only renders when `current` exists, else force `split`.

## Stats / tabs / toolbar placement

- Keep a slim `StatCardRow` band **above** the shell (optional, top of page).
- Move search (and optional status filter) **into** `QuotationListPane` so the left
  pane is self-contained — matches the reference where search lives in the list.
- The wide `QuotationsOverview` (stats + tabs + wide table) is no longer the primary
  Quotations screen but remains available as a block for consumers who want the table view.

## Testing (component contract)

Every new component ships `.tsx`, `.stories.tsx`, `.test.tsx`, `index.ts`, and is
re-exported from `packages/blocks/src/index.ts`. Tests use Vitest + Testing Library + axe.

- **`MasterDetailShell`:** renders `list`; shows `detail` vs `detailPlaceholder` by
  `hasSelection`; `isFull` swaps to `full` and hides list; mobile back fires `onBack`;
  `className`/`ref`/`...props` forwarded; axe clean.
- **`QuotationListPane`:** rows render; search filters; selected row highlighted;
  `onOpen`/`onNew` fire; empty + loading states; axe clean.
- **`QuotationsPage`:** click row → detail; Full view → document; Edit → form → back
  to split with selection; delete selected → placeholder; submit updates status; axe clean.

Stories per component: default, dark, loading, empty, error (where applicable),
plus a "Customization" story.

## Files

New:
- `packages/blocks/src/components/master-detail-shell/{master-detail-shell.tsx,.stories.tsx,.test.tsx,index.ts}`
- `packages/blocks/src/components/quotation/quotation-list-pane.tsx` (+ test, + story or covered in page stories)

Changed:
- `packages/blocks/src/components/quotations-page/quotations-page.tsx` (rewire render)
- `packages/blocks/src/components/quotation/quotation-detail.tsx` (add "Full view" button + `onFullView` prop)
- `packages/blocks/src/components/quotation/index.ts` (export `QuotationListPane`)
- `packages/blocks/src/index.ts` (export `MasterDetailShell`)
- Registry: regenerate `apps/docs` registry JSON for changed blocks at docs build.
