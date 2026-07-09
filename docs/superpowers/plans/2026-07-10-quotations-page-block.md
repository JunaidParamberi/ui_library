# QuotationsPage Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a `QuotationsPage` block — a single full-feature quotations screen (stat row, status tabs, search, enriched table, create/edit/detail/print flow) matching the ManpowerHub prototype.

**Architecture:** A controller (`QuotationsPage`) owns the list/form/detail/document state machine and an injectable `QuotationApi`, reusing `QuotationForm`/`QuotationDetail`/`QuotationDocument` from the existing `quotation` block. Its landing view is a new presentational `QuotationsOverview` that composes `StatCardRow`, `PageHeader`, `Tabs`, `DataTableToolbar`, and an enriched `Table` with row edit/delete.

**Tech Stack:** React 18 + TypeScript, `@manpowerhub/ui` (Radix-based), Tailwind, cva, Vitest + Testing Library + vitest-axe, Storybook.

## Global Constraints

- Every component forwards `className` (composed via `cn()`), forwards `ref` (`React.forwardRef`), spreads `...props` onto its root element.
- Visual variants via `cva`, typed on props, where a real visual axis exists.
- Each component ships: `<name>.tsx`, `<name>.stories.tsx`, `<name>.test.tsx`, `index.ts`, and is re-exported from `packages/blocks/src/index.ts`.
- No API calls / business logic / secrets in components — mock api only; consumers inject `QuotationApi`.
- Currency default is the string `"AED"`.
- Button variants: `primary | secondary | ghost | danger | outline`; destructive action uses `danger`. Icon buttons use `size="icon"`.
- Run block tests with: `pnpm --filter @manpowerhub/blocks test` (append `-- <path>` to scope; append `run` for non-watch).
- Run ui tests with: `pnpm --filter @manpowerhub/ui test`.

---

### Task 1: Add `columns:5` variant to StatCardRow

**Files:**
- Modify: `packages/ui/src/components/kpi-card/…` — none.
- Modify: `packages/blocks/src/components/stat-card-row/stat-card-row.tsx`
- Test: `packages/blocks/src/components/stat-card-row/stat-card-row.test.tsx`

**Interfaces:**
- Produces: `StatCardRow` now accepts `columns={5}` → grid class `lg:grid-cols-5`.

- [ ] **Step 1: Write the failing test**

Add to `stat-card-row.test.tsx`:

```tsx
it("applies the 5-column grid class", () => {
  const { container } = render(<StatCardRow stats={stats} columns={5} />);
  expect(container.firstChild).toHaveClass("lg:grid-cols-5");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test run -- stat-card-row`
Expected: FAIL — `columns={5}` is a type error / no `lg:grid-cols-5` class.

- [ ] **Step 3: Add the variant**

In `stat-card-row.tsx`, extend `statCardRowVariants.variants.columns`:

```ts
columns: {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
},
```

Also update the loading-count fallback so a numeric `columns={5}` still works — it already reads `typeof columns === "number" ? columns : 3`, so no change needed.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test run -- stat-card-row`
Expected: PASS (all StatCardRow tests).

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/stat-card-row/
git commit -m "feat(blocks): add columns:5 variant to StatCardRow"
```

---

### Task 2: Expand mock seed to 5 rows (all statuses)

**Files:**
- Modify: `packages/blocks/src/components/quotation/quotation.mock.ts` (`seedQuotations`)
- Test: `packages/blocks/src/components/quotation/quotation.mock.test.ts`

**Interfaces:**
- Consumes: `PersistedQuotation`, `QuotationItem`, `ApprovalStep` from `quotation.types`.
- Produces: `seedQuotations()` returns 5 rows covering DRAFT, PENDING_APPROVAL, APPROVED, SENT, REJECTED. Existing rows `Q-1001` (DRAFT) and `Q-1002` (PENDING_APPROVAL) are preserved and remain first.

- [ ] **Step 1: Write the failing test**

Add to `quotation.mock.test.ts`:

```ts
it("seeds one quotation per status", async () => {
  const api = createMockQuotationApi();
  const list = await api.list();
  const statuses = new Set(list.map((q) => q.status));
  expect(statuses).toEqual(
    new Set(["DRAFT", "PENDING_APPROVAL", "APPROVED", "SENT", "REJECTED"]),
  );
  expect(list.length).toBe(5);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test run -- quotation.mock`
Expected: FAIL — only 2 seeded rows / 2 statuses.

- [ ] **Step 3: Append 3 rows to `seedQuotations()`**

In `quotation.mock.ts`, inside the returned array in `seedQuotations()`, after the existing `Q-1002` object add three more objects (keep the `now` const already in scope):

```ts
{
  id: uid(),
  quotationNumber: "Q-1003",
  quotationDate: "2026-07-05",
  status: "APPROVED",
  customer: { name: "Emaar Properties PJSC", address: "Downtown Dubai, UAE", phoneNumber: "+971 4 555 0300", emailId: "rania@emaar.ae" },
  items: [
    { category: "Site Engineer", quantity: "2", rate: "1500", otRate: "220" },
    { category: "Foreman", quantity: "3", rate: "700", otRate: "100" },
  ],
  approvers: [
    { approverId: "u1", approverName: "Lena Marchetti", approverEmail: "lena@studio.com", decision: "APPROVED", requestedAt: now, approvedAt: now },
  ],
  createdAt: now, updatedAt: now, createdBy: "system",
},
{
  id: uid(),
  quotationNumber: "Q-1004",
  quotationDate: "2026-07-06",
  status: "SENT",
  customer: { name: "Al Naboodah Contracting", address: "Deira, Dubai, UAE", phoneNumber: "+971 4 555 0400", emailId: "hamad@alnaboodah.ae" },
  items: [
    { category: "Scaffolder", quantity: "4", rate: "500", otRate: "75" },
    { category: "Helper", quantity: "5", rate: "300", otRate: "45" },
  ],
  approvers: [
    { approverId: "u1", approverName: "Lena Marchetti", approverEmail: "lena@studio.com", decision: "APPROVED", requestedAt: now, approvedAt: now },
  ],
  createdAt: now, updatedAt: now, createdBy: "system",
},
{
  id: uid(),
  quotationNumber: "Q-1005",
  quotationDate: "2026-07-07",
  status: "REJECTED",
  customer: { name: "Shapoorji Pallonji M.E.", address: "Business Bay, Dubai, UAE", phoneNumber: "+971 4 555 0500", emailId: "rustom@shapoorji.ae" },
  items: [
    { category: "Mason", quantity: "6", rate: "400", otRate: "60" },
  ],
  approvers: [
    { approverId: "u1", approverName: "Lena Marchetti", approverEmail: "lena@studio.com", decision: "REJECTED", comment: "Rates too high", requestedAt: now, approvedAt: now },
  ],
  createdAt: now, updatedAt: now, createdBy: "system",
},
```

- [ ] **Step 4: Run the full quotation block suite (guard against regressions)**

Run: `pnpm --filter @manpowerhub/blocks test run -- quotation`
Expected: PASS. Existing assertions use `findByText("Q-1001")`, `findByText("Q-1002")`, and `toBeGreaterThan(0)` — all still hold. If any test asserts an exact count of 2, update it to 5.

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation.mock.ts packages/blocks/src/components/quotation/quotation.mock.test.ts
git commit -m "feat(blocks): seed quotations across all five statuses"
```

---

### Task 3: `QuotationsOverview` presentational component

**Files:**
- Create: `packages/blocks/src/components/quotations-page/quotations-overview.tsx`
- Test: `packages/blocks/src/components/quotations-page/quotations-overview.test.tsx`

**Interfaces:**
- Consumes: `StatCardRow` (`../stat-card-row`), `PageHeader` (`../page-header`), `DataTableToolbar` (`../data-table-toolbar`); `QuotationStatusPill`, `subtotal`, `PersistedQuotation`, `QuotationStatus` (`../quotation`); `Button`, `Table*`, `Tabs`, `TabsList`, `TabsTrigger`, `Dialog*`, `cn`, `type KPI` (`@manpowerhub/ui`).
- Produces:

```ts
interface QuotationsOverviewProps extends React.HTMLAttributes<HTMLDivElement> {
  quotations: PersistedQuotation[];
  isLoading?: boolean;
  currency?: string;            // default "AED"
  onNew: () => void;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
```

- [ ] **Step 1: Write the failing test**

Create `quotations-overview.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { QuotationsOverview } from "./quotations-overview";
import { seedQuotations } from "../quotation";

const rows = seedQuotations();
const noop = () => {};
const baseProps = {
  quotations: rows,
  onNew: noop,
  onOpen: noop,
  onEdit: noop,
  onDelete: noop,
};

describe("QuotationsOverview", () => {
  it("shows total quotations and per-status counts in the stat row", () => {
    render(<QuotationsOverview {...baseProps} />);
    expect(screen.getByText("Total Quotations")).toBeInTheDocument();
    // 5 seeded rows
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("awaiting submission")).toBeInTheDocument();
    expect(screen.getByText("in review")).toBeInTheDocument();
    expect(screen.getByText("ready to send")).toBeInTheDocument();
  });

  it("formats total value with the currency prefix", () => {
    render(<QuotationsOverview {...baseProps} currency="AED" />);
    expect(screen.getByText("Total Value")).toBeInTheDocument();
    // subtotal sums: 4800 + 2000 + 5100 + 3500 + 2400 = 17800
    expect(screen.getByText("AED 17,800")).toBeInTheDocument();
  });

  it("filters rows to the selected status tab", async () => {
    render(<QuotationsOverview {...baseProps} />);
    await userEvent.click(screen.getByRole("tab", { name: /^Draft/ }));
    expect(screen.getByText("Q-1001")).toBeInTheDocument();
    expect(screen.queryByText("Q-1003")).not.toBeInTheDocument();
  });

  it("filters rows by search across number, name, and email", async () => {
    render(<QuotationsOverview {...baseProps} />);
    await userEvent.type(screen.getByRole("searchbox"), "emaar");
    expect(screen.getByText("Q-1003")).toBeInTheDocument();
    expect(screen.queryByText("Q-1001")).not.toBeInTheDocument();
  });

  it("shows a distinct message when filters exclude everything", async () => {
    render(<QuotationsOverview {...baseProps} />);
    await userEvent.type(screen.getByRole("searchbox"), "zzzznomatch");
    expect(screen.getByText(/no quotations match/i)).toBeInTheDocument();
  });

  it("fires onEdit without opening the row", async () => {
    const onEdit = vi.fn();
    const onOpen = vi.fn();
    render(<QuotationsOverview {...baseProps} onEdit={onEdit} onOpen={onOpen} />);
    await userEvent.click(screen.getByRole("button", { name: /edit Q-1001/i }));
    expect(onEdit).toHaveBeenCalledWith(rows[0].id);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("confirms before firing onDelete and does nothing on cancel", async () => {
    const onDelete = vi.fn();
    render(<QuotationsOverview {...baseProps} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: /delete Q-1001/i }));
    const dialog = screen.getByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: /cancel/i }));
    expect(onDelete).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: /delete Q-1001/i }));
    const dialog2 = screen.getByRole("dialog");
    await userEvent.click(within(dialog2).getByRole("button", { name: /^delete$/i }));
    expect(onDelete).toHaveBeenCalledWith(rows[0].id);
  });

  it("renders loading skeletons instead of rows", () => {
    render(<QuotationsOverview {...baseProps} isLoading />);
    expect(screen.getAllByTestId("stat-skeleton").length).toBe(5);
    expect(screen.queryByText("Q-1001")).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<QuotationsOverview {...baseProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<QuotationsOverview ref={ref} className="gx" {...baseProps} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("gx");
  });
});
```

> Note on the value assertion: seeded subtotals are Q-1001 `2*1200+6*400=4800`, Q-1002 `4*500=2000`, Q-1003 `2*1500+3*700=5100`, Q-1004 `4*500+5*300=3500`, Q-1005 `6*400=2400` → total `17800`. If Task 2's seed numbers change, update this expectation to match.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test run -- quotations-overview`
Expected: FAIL — module `./quotations-overview` not found.

- [ ] **Step 3: Implement `quotations-overview.tsx`**

```tsx
import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Button,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Tabs, TabsList, TabsTrigger,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  cn, type KPI,
} from "@manpowerhub/ui";
import {
  QuotationStatusPill,
  subtotal,
  type PersistedQuotation,
  type QuotationStatus,
} from "../quotation";
import { StatCardRow } from "../stat-card-row";
import { PageHeader } from "../page-header";
import { DataTableToolbar } from "../data-table-toolbar";

const STATUS_TABS: { value: "ALL" | QuotationStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "PENDING_APPROVAL", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "SENT", label: "Sent" },
  { value: "REJECTED", label: "Rejected" },
];

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export interface QuotationsOverviewProps extends React.HTMLAttributes<HTMLDivElement> {
  quotations: PersistedQuotation[];
  isLoading?: boolean;
  currency?: string;
  onNew: () => void;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const QuotationsOverview = React.forwardRef<HTMLDivElement, QuotationsOverviewProps>(
  (
    { className, quotations, isLoading = false, currency = "AED", onNew, onOpen, onEdit, onDelete, ...props },
    ref,
  ) => {
    const [statusFilter, setStatusFilter] = React.useState<"ALL" | QuotationStatus>("ALL");
    const [search, setSearch] = React.useState("");
    const [pendingDelete, setPendingDelete] = React.useState<PersistedQuotation | null>(null);

    const countBy = (s: "ALL" | QuotationStatus) =>
      s === "ALL" ? quotations.length : quotations.filter((q) => q.status === s).length;

    const totalValue = quotations.reduce((sum, q) => sum + subtotal(q.items), 0);

    const stats: KPI[] = [
      { label: "Total Quotations", value: String(quotations.length) },
      { label: "Total Value", value: `${currency} ${fmt(totalValue)}` },
      { label: "Draft", value: String(countBy("DRAFT")), sub: "awaiting submission" },
      { label: "Pending Approval", value: String(countBy("PENDING_APPROVAL")), sub: "in review" },
      { label: "Approved", value: String(countBy("APPROVED")), sub: "ready to send" },
    ];

    const needle = search.trim().toLowerCase();
    const visible = quotations.filter((row) => {
      const matchStatus = statusFilter === "ALL" || row.status === statusFilter;
      const matchSearch =
        needle === "" ||
        row.quotationNumber.toLowerCase().includes(needle) ||
        row.customer.name.toLowerCase().includes(needle) ||
        row.customer.emailId.toLowerCase().includes(needle);
      return matchStatus && matchSearch;
    });

    return (
      <div ref={ref} className={cn("flex flex-col gap-6", className)} {...props}>
        <StatCardRow columns={5} stats={stats} loading={isLoading} />

        <PageHeader
          title="Quotations"
          actions={
            <Button variant="primary" size="sm" onClick={onNew}>
              New Quotation
            </Button>
          }
        />

        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as "ALL" | QuotationStatus)}>
          <TabsList>
            {STATUS_TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value} count={countBy(t.value)}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <DataTableToolbar
          search={{ value: search, onChange: setSearch, placeholder: "Search quotation / customer…" }}
        />

        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : quotations.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No quotations yet.</p>
        ) : visible.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No quotations match.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>{`Value (${currency})`}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => onOpen(row.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open ${row.quotationNumber}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onOpen(row.id);
                  }}
                >
                  <TableCell className="font-mono">{row.quotationNumber}</TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{row.customer.name}</div>
                    <div className="text-xs text-muted-foreground">{row.customer.emailId}</div>
                  </TableCell>
                  <TableCell className="tabular-nums">{row.quotationDate}</TableCell>
                  <TableCell className="tabular-nums">{row.items.length}</TableCell>
                  <TableCell className="tabular-nums font-medium">{fmt(subtotal(row.items))}</TableCell>
                  <TableCell>
                    <QuotationStatusPill status={row.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${row.quotationNumber}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(row.id);
                        }}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${row.quotationNumber}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDelete(row);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog
          open={pendingDelete !== null}
          onOpenChange={(open) => {
            if (!open) setPendingDelete(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete {pendingDelete?.quotationNumber}?</DialogTitle>
              <DialogDescription>This can&rsquo;t be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button
                variant="danger"
                onClick={() => {
                  if (pendingDelete) onDelete(pendingDelete.id);
                  setPendingDelete(null);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  },
);
QuotationsOverview.displayName = "QuotationsOverview";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test run -- quotations-overview`
Expected: PASS (all 10 tests). If the `getByRole("tab")` query fails, confirm Radix `Tabs` renders triggers with `role="tab"` (it does via `RadixTabs.Trigger`).

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotations-page/quotations-overview.tsx packages/blocks/src/components/quotations-page/quotations-overview.test.tsx
git commit -m "feat(blocks): add QuotationsOverview landing screen"
```

---

### Task 4: `QuotationsPage` controller + barrel + exports + stories

**Files:**
- Create: `packages/blocks/src/components/quotations-page/quotations-page.tsx`
- Create: `packages/blocks/src/components/quotations-page/index.ts`
- Create: `packages/blocks/src/components/quotations-page/quotations-page.stories.tsx`
- Test: `packages/blocks/src/components/quotations-page/quotations-page.test.tsx`
- Modify: `packages/blocks/src/index.ts`

**Interfaces:**
- Consumes: `QuotationsOverview` (Task 3); `QuotationForm`, `QuotationDetail`, `QuotationDocument`, `createMockQuotationApi`, `type QuotationApi`, `PersistedQuotation`, `QuotationAggregateData` (`../quotation`); `cn` (`@manpowerhub/ui`).
- Produces:

```ts
interface QuotationsPageProps extends React.HTMLAttributes<HTMLDivElement> {
  api?: QuotationApi;      // default createMockQuotationApi()
  currency?: string;       // default "AED"
}
```

- [ ] **Step 1: Write the failing test**

Create `quotations-page.test.tsx`:

```tsx
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { QuotationsPage } from "./quotations-page";
import { createMockQuotationApi } from "../quotation";

describe("QuotationsPage", () => {
  it("loads and lists seeded quotations with the stat row", async () => {
    render(<QuotationsPage api={createMockQuotationApi()} />);
    expect(await screen.findByText("Q-1001")).toBeInTheDocument();
    expect(screen.getByText("Total Quotations")).toBeInTheDocument();
  });

  it("opens a quotation into detail view on row click", async () => {
    render(<QuotationsPage api={createMockQuotationApi()} />);
    await userEvent.click(await screen.findByText("Q-1001"));
    expect(await screen.findByRole("button", { name: /submit for approval/i })).toBeInTheDocument();
  });

  it("edit action jumps straight to the form", async () => {
    render(<QuotationsPage api={createMockQuotationApi()} />);
    await screen.findByText("Q-1001");
    await userEvent.click(screen.getByRole("button", { name: /edit Q-1001/i }));
    expect(await screen.findByLabelText(/customer name/i)).toBeInTheDocument();
  });

  it("new action opens an empty form", async () => {
    render(<QuotationsPage api={createMockQuotationApi()} />);
    await userEvent.click(await screen.findByRole("button", { name: /new quotation/i }));
    expect(await screen.findByLabelText(/customer name/i)).toBeInTheDocument();
  });

  it("deletes a quotation after confirmation", async () => {
    render(<QuotationsPage api={createMockQuotationApi()} />);
    await screen.findByText("Q-1005");
    await userEvent.click(screen.getByRole("button", { name: /delete Q-1005/i }));
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: /^delete$/i }));
    await waitFor(() => expect(screen.queryByText("Q-1005")).not.toBeInTheDocument());
  });

  it("has no axe violations on the landing view", async () => {
    const { container } = render(<QuotationsPage api={createMockQuotationApi()} />);
    await screen.findByText("Q-1001");
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test run -- quotations-page`
Expected: FAIL — module `./quotations-page` not found.

- [ ] **Step 3: Implement `quotations-page.tsx`**

```tsx
import * as React from "react";
import { cn } from "@manpowerhub/ui";
import { QuotationsOverview } from "./quotations-overview";
import {
  QuotationForm,
  QuotationDetail,
  QuotationDocument,
  createMockQuotationApi,
  type QuotationApi,
  type PersistedQuotation,
  type QuotationAggregateData,
} from "../quotation";

type View =
  | { name: "list" }
  | { name: "form"; id?: string }
  | { name: "detail"; id: string }
  | { name: "document"; id: string };

export interface QuotationsPageProps extends React.HTMLAttributes<HTMLDivElement> {
  api?: QuotationApi;
  currency?: string;
}

export const QuotationsPage = React.forwardRef<HTMLDivElement, QuotationsPageProps>(
  ({ className, api, currency = "AED", ...props }, ref) => {
    const apiRef = React.useRef<QuotationApi>(api ?? createMockQuotationApi());
    const [items, setItems] = React.useState<PersistedQuotation[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [busy, setBusy] = React.useState(false);
    const [view, setView] = React.useState<View>({ name: "list" });
    const [error, setError] = React.useState<string | null>(null);

    const refetch = React.useCallback(async () => {
      setLoading(true);
      try {
        setItems(await apiRef.current.list());
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }, []);

    React.useEffect(() => {
      void refetch();
    }, [refetch]);

    const current = "id" in view && view.id ? items.find((q) => q.id === view.id) : undefined;

    const run = async (fn: () => Promise<void>) => {
      setBusy(true);
      setError(null);
      try {
        await fn();
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setBusy(false);
      }
    };

    const handleCreate = (data: QuotationAggregateData) =>
      run(async () => {
        await apiRef.current.create(data);
        await refetch();
        setView({ name: "list" });
      });
    const handleUpdate = (id: string, data: QuotationAggregateData) =>
      run(async () => {
        await apiRef.current.update(id, data);
        await refetch();
        setView({ name: "detail", id });
      });
    const handleSubmit = (id: string) =>
      run(async () => {
        await apiRef.current.submitForApproval(id);
        await refetch();
      });
    const handleDecide = (
      id: string,
      approverId: string,
      decision: "APPROVED" | "REJECTED",
      comment?: string,
    ) =>
      run(async () => {
        await apiRef.current.decide(id, approverId, decision, comment);
        await refetch();
      });
    const handleDelete = (id: string) =>
      run(async () => {
        await apiRef.current.remove(id);
        await refetch();
      });

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        {view.name === "list" && (
          <QuotationsOverview
            quotations={items}
            isLoading={loading}
            currency={currency}
            onNew={() => setView({ name: "form" })}
            onOpen={(id) => setView({ name: "detail", id })}
            onEdit={(id) => setView({ name: "form", id })}
            onDelete={handleDelete}
          />
        )}

        {view.name === "form" && (
          <QuotationForm
            initial={view.id ? current : undefined}
            submitting={busy}
            onCancel={() => setView(view.id ? { name: "detail", id: view.id } : { name: "list" })}
            onSubmit={(data) => (view.id ? handleUpdate(view.id, data) : handleCreate(data))}
          />
        )}

        {view.name === "detail" && current && (
          <QuotationDetail
            quotation={current}
            busy={busy}
            onBack={() => setView({ name: "list" })}
            onEdit={() => setView({ name: "form", id: current.id })}
            onPrint={() => setView({ name: "document", id: current.id })}
            onSubmitForApproval={() => handleSubmit(current.id)}
            onDecide={(approverId, decision, comment) =>
              handleDecide(current.id, approverId, decision, comment)
            }
          />
        )}

        {view.name === "document" && current && (
          <div className="flex flex-col items-center gap-4">
            <button
              className="self-start text-sm text-muted-foreground underline"
              onClick={() => setView({ name: "detail", id: current.id })}
            >
              ← Back to detail
            </button>
            <QuotationDocument quotation={current} />
          </div>
        )}
      </div>
    );
  },
);
QuotationsPage.displayName = "QuotationsPage";
```

- [ ] **Step 4: Create `index.ts`**

```ts
export * from "./quotations-page";
export * from "./quotations-overview";
```

- [ ] **Step 5: Re-export from the blocks barrel**

In `packages/blocks/src/index.ts`, add after the `quotation` export line (`export * from "./components/quotation";`):

```ts
export * from "./components/quotations-page";
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm --filter @manpowerhub/blocks test run -- quotations-page`
Expected: PASS (all 6 tests).

- [ ] **Step 7: Create `quotations-page.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { QuotationsPage } from "./quotations-page";
import { createMockQuotationApi, seedQuotations } from "../quotation";

const meta: Meta<typeof QuotationsPage> = {
  title: "blocks/QuotationsPage",
  component: QuotationsPage,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof QuotationsPage>;

export const Default: Story = {
  render: () => <QuotationsPage api={createMockQuotationApi()} />,
};

export const Dark: Story = {
  parameters: { themes: { themeOverride: "dark" } },
  render: () => (
    <div className="dark bg-background p-6">
      <QuotationsPage api={createMockQuotationApi()} />
    </div>
  ),
};

export const Loading: Story = {
  render: () => {
    const never: ReturnType<typeof createMockQuotationApi> = {
      ...createMockQuotationApi(),
      list: () => new Promise(() => {}),
    };
    return <QuotationsPage api={never} />;
  },
};

export const Empty: Story = {
  render: () => <QuotationsPage api={createMockQuotationApi([])} />,
};

export const Error: Story = {
  render: () => {
    const failing: ReturnType<typeof createMockQuotationApi> = {
      ...createMockQuotationApi(),
      list: () => Promise.reject(new Error("Failed to load quotations")),
    };
    return <QuotationsPage api={failing} />;
  },
};

export const Customization: Story = {
  name: "Customization (currency + className)",
  render: () => (
    <QuotationsPage
      api={createMockQuotationApi(seedQuotations())}
      currency="USD"
      className="rounded-lg border border-border p-4"
    />
  ),
};
```

- [ ] **Step 8: Verify stories typecheck / build**

Run: `pnpm --filter @manpowerhub/blocks build` (or the repo's typecheck: `pnpm --filter @manpowerhub/blocks run typecheck` if present).
Expected: no type errors. If `@storybook/react` Meta import path differs, mirror an existing block story's imports (e.g. `stat-card-row.stories.tsx`).

- [ ] **Step 9: Commit**

```bash
git add packages/blocks/src/components/quotations-page/ packages/blocks/src/index.ts
git commit -m "feat(blocks): add QuotationsPage full-feature block"
```

---

### Task 5: Docs + registry wiring

**Files:**
- Modify: `apps/docs/content/blocks/_meta.ts`
- Modify: `apps/docs/src/lib/catalog.ts`
- Create: `apps/docs/src/components/demos/quotations-page-demo.tsx`
- Create: `apps/docs/content/blocks/quotations-page.mdx`

**Interfaces:**
- Consumes: `QuotationsPage`, `createMockQuotationApi` from `@manpowerhub/blocks`; existing docs catalog/demo conventions.

- [ ] **Step 1: Add the nav entry**

In `apps/docs/content/blocks/_meta.ts`, add the key (keep alphabetical grouping near `quotation`):

```ts
  quotation: "Quotation",
  "quotations-page": "QuotationsPage",
```

- [ ] **Step 2: Add the catalog entry**

In `apps/docs/src/lib/catalog.ts`, add next to the `quotation` entry (line ~60):

```ts
  { slug: "quotations-page", demoKey: "quotations-page-demo", docgenName: "QuotationsPage", story: "blocks-quotationspage", storyId: "default", pkg: "blocks" },
```

> `story` mirrors the Storybook id derived from the story `title: "blocks/QuotationsPage"`. If the docs `StorybookLink` in the MDX uses a different id, keep this value equal to that link's `story` prop.

- [ ] **Step 3: Create the demo component**

Create `apps/docs/src/components/demos/quotations-page-demo.tsx`:

```tsx
"use client";
import * as React from "react";
import { QuotationsPage, createMockQuotationApi } from "@manpowerhub/blocks";

export function QuotationsPageDemo() {
  // One mock API per mount so the demo's CRUD edits stay isolated and reset on reload.
  const api = React.useMemo(() => createMockQuotationApi(), []);
  return <QuotationsPage api={api} />;
}
```

- [ ] **Step 4: Wire the demo into the dynamic-demos registry (if manual)**

Check `apps/docs/src/components/dynamic-demos.tsx` — if demos are registered by an explicit map keyed on `demoKey`, add:

```tsx
"quotations-page-demo": dynamic(() =>
  import("./demos/quotations-page-demo").then((m) => m.QuotationsPageDemo),
),
```

If demos are auto-resolved by filename convention, no edit is needed — verify by matching how `quotation-demo` is registered there.

- [ ] **Step 5: Create the MDX page**

Create `apps/docs/content/blocks/quotations-page.mdx`, mirroring `quotation.mdx`'s structure (Preview via the demo, Usage, Props, Accessibility). Minimal content:

```mdx
# QuotationsPage

Full-feature quotations screen: summary stats, status tabs, search, and an
enriched list, with the built-in create / edit / detail / print flow. Ships with
an in-memory mock API so it runs standalone — swap in your own `QuotationApi`
implementation to wire real persistence.

<DynamicDemo demoKey="quotations-page-demo" />

## Usage

Render `<QuotationsPage />` and it manages its own list → form → detail flow. By
default it uses `createMockQuotationApi()`; pass an `api` prop implementing the
`QuotationApi` interface to back it with a real service. Pass `currency` (default
`"AED"`) to change the value formatting.

## Props

<PropsTable name="QuotationsPage" />

## Accessibility

- Rows are keyboard-focusable and open on Enter.
- Row edit/delete actions have explicit `aria-label`s and stop row propagation.
- Delete is guarded by a confirmation dialog.
```

> Match the exact MDX component names (`DynamicDemo` / `PropsTable` / `StorybookLink`) used in `quotation.mdx` — copy that file's imports/frontmatter and swap the demoKey and prop names.

- [ ] **Step 6: Regenerate registry + props and verify**

Run: `pnpm --filter @manpowerhub/docs run gen:registry` (or the repo's `prebuild` script that runs it).
Expected: `quotations-page` appears in the generated registry JSON (`apps/docs/public/r/` or `apps/docs/registry/registry.json`). Also run the props generator if separate (`gen:props` or equivalent) so `QuotationsPage` lands in `props.generated.json`.

- [ ] **Step 7: Build docs to verify the page renders**

Run: `pnpm --filter @manpowerhub/docs build`
Expected: build succeeds; `/blocks/quotations-page` route present. If `PropsTable name="QuotationsPage"` errors on a missing docgen entry, ensure Step 6's props generation ran.

- [ ] **Step 8: Commit**

```bash
git add apps/docs/content/blocks/_meta.ts apps/docs/content/blocks/quotations-page.mdx apps/docs/src/lib/catalog.ts apps/docs/src/components/demos/quotations-page-demo.tsx apps/docs/src/components/dynamic-demos.tsx apps/docs/public/r apps/docs/registry apps/docs/src/generated
git commit -m "docs(blocks): document QuotationsPage block"
```

---

### Task 6: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Run the whole blocks + ui suites**

Run:
```bash
pnpm --filter @manpowerhub/ui test run
pnpm --filter @manpowerhub/blocks test run
```
Expected: all green.

- [ ] **Step 2: Typecheck + lint the touched packages**

Run:
```bash
pnpm --filter @manpowerhub/blocks run typecheck
pnpm -w lint
```
Expected: no errors. Fix any lint issues (import order, unused imports) inline and re-run.

- [ ] **Step 3: Drive the docs page (verify skill)**

Start docs dev server (`pnpm --filter @manpowerhub/docs dev`), open `/blocks/quotations-page`, confirm: 5 stat cards, tabs with counts, search filters rows, Value (AED) column populated, New/edit/delete flow works, delete asks for confirmation. Compare against the prototype screenshot.

- [ ] **Step 4: Final commit (if any fixes)**

```bash
git add -A
git commit -m "chore(blocks): verification fixups for QuotationsPage"
```

---

## Self-Review Notes

- **Spec coverage:** stats (Task 3), tabs (3), search (3), enriched table + value (3), delete-confirm (3), reuse of form/detail/document (4), `columns:5` (1), seed 5 rows (2), registry+docs (5). All spec sections mapped.
- **Type consistency:** `QuotationsOverviewProps` and `QuotationsPageProps` signatures match across Tasks 3–4; callbacks (`onNew/onOpen/onEdit/onDelete`) identical; `subtotal`/`QuotationStatus`/`PersistedQuotation` imported from `../quotation` throughout; button `danger` variant used for destructive (not `destructive`).
- **Assumptions to verify at execution:** docs demo registration mechanism (Task 5 Step 4) and MDX helper component names (Step 5) — copy from `quotation.mdx`/`quotation-demo.tsx` rather than guessing. Seeded total value `17,800` (Task 3 test) depends on Task 2's exact rates — recompute if changed.
