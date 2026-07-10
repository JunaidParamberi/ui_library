# Master-Detail Shell + Quotations Rewire Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Quotations into a master-detail screen (persistent left list, right detail with inline actions, "Full view" → document) built on a reusable generic shell block.

**Architecture:** New generic `MasterDetailShell` block owns layout + responsive stacking + full-view presentation (fully controlled). New compact `QuotationListPane` is the left list. `QuotationsPage` is rewired to own selection/mode state and feed the shell's slots; the quotation API layer is unchanged.

**Tech Stack:** React 18, TypeScript, `@manpowerhub/ui` primitives, Tailwind, `cva`, Vitest + Testing Library + `jest-axe`, Storybook.

## Global Constraints

- Every component in `packages/blocks/src/components/**` MUST: forward `className` composed via `cn()`; forward `ref` (`React.forwardRef`); spread remaining `...props` onto the root element; expose visual variants via `cva` where variants apply; ship `<name>.tsx`, `<name>.stories.tsx`, `<name>.test.tsx`, `index.ts`; be re-exported up the barrel to `packages/blocks/src/index.ts`.
- No API calls, no business logic, no secrets in components.
- Stories must include: default, dark, loading, empty, error (where applicable), plus a "Customization" story.
- Tests use Vitest + Testing Library + axe.
- Run tests from repo root with: `pnpm --filter @manpowerhub/blocks test -- <path>` (or `run <name>` filters).
- Conventional Commits: `type(scope): summary`. Commit at the end of each task.
- Branch already created: `feat/master-detail-shell`.

---

## File Structure

New:
- `packages/blocks/src/components/master-detail-shell/master-detail-shell.tsx`
- `packages/blocks/src/components/master-detail-shell/master-detail-shell.stories.tsx`
- `packages/blocks/src/components/master-detail-shell/master-detail-shell.test.tsx`
- `packages/blocks/src/components/master-detail-shell/index.ts`
- `packages/blocks/src/components/quotation/quotation-list-pane.tsx`
- `packages/blocks/src/components/quotation/quotation-list-pane.test.tsx`

Modified:
- `packages/blocks/src/components/quotation/quotation-detail.tsx` (add optional `onFullView` + button)
- `packages/blocks/src/components/quotation/quotation-detail.test.tsx` (cover new button)
- `packages/blocks/src/components/quotation/index.ts` (export list-pane)
- `packages/blocks/src/components/quotations-page/quotations-page.tsx` (rewire onto shell)
- `packages/blocks/src/components/quotations-page/quotations-page.test.tsx` (master-detail flows)
- `packages/blocks/src/index.ts` (export master-detail-shell)

---

## Task 1: MasterDetailShell block

**Files:**
- Create: `packages/blocks/src/components/master-detail-shell/master-detail-shell.tsx`
- Create: `packages/blocks/src/components/master-detail-shell/index.ts`
- Test: `packages/blocks/src/components/master-detail-shell/master-detail-shell.test.tsx`
- Modify: `packages/blocks/src/index.ts`

**Interfaces:**
- Produces:
  ```tsx
  export interface MasterDetailShellProps extends React.HTMLAttributes<HTMLDivElement> {
    list: React.ReactNode;
    detail?: React.ReactNode;
    detailPlaceholder?: React.ReactNode;
    full?: React.ReactNode;
    isFull?: boolean;
    hasSelection?: boolean;
    onBack?: () => void;
    listWidth?: string; // default "20rem"
  }
  export const MasterDetailShell: React.ForwardRefExoticComponent<...>;
  ```

- [ ] **Step 1: Write the failing test**

```tsx
// master-detail-shell.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { MasterDetailShell } from "./master-detail-shell";

describe("MasterDetailShell", () => {
  it("shows placeholder when no selection", () => {
    render(
      <MasterDetailShell
        list={<div>LIST</div>}
        detail={<div>DETAIL</div>}
        detailPlaceholder={<div>PLACEHOLDER</div>}
        hasSelection={false}
      />,
    );
    expect(screen.getByText("LIST")).toBeInTheDocument();
    expect(screen.getByText("PLACEHOLDER")).toBeInTheDocument();
    expect(screen.queryByText("DETAIL")).not.toBeInTheDocument();
  });

  it("shows detail when hasSelection", () => {
    render(
      <MasterDetailShell
        list={<div>LIST</div>}
        detail={<div>DETAIL</div>}
        detailPlaceholder={<div>PLACEHOLDER</div>}
        hasSelection
      />,
    );
    expect(screen.getByText("DETAIL")).toBeInTheDocument();
    expect(screen.queryByText("PLACEHOLDER")).not.toBeInTheDocument();
  });

  it("swaps to full view and hides list on isFull", () => {
    render(
      <MasterDetailShell
        list={<div>LIST</div>}
        detail={<div>DETAIL</div>}
        full={<div>FULL</div>}
        hasSelection
        isFull
      />,
    );
    expect(screen.getByText("FULL")).toBeInTheDocument();
    expect(screen.queryByText("LIST")).not.toBeInTheDocument();
    expect(screen.queryByText("DETAIL")).not.toBeInTheDocument();
  });

  it("fires onBack from the back control", async () => {
    const onBack = vi.fn();
    render(
      <MasterDetailShell list={<div>LIST</div>} full={<div>FULL</div>} isFull hasSelection onBack={onBack} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("forwards ref, className, and props; axe clean", async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <MasterDetailShell ref={ref} className="custom-x" data-testid="shell" list={<div>LIST</div>} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("shell")).toHaveClass("custom-x");
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test -- master-detail-shell`
Expected: FAIL — cannot resolve `./master-detail-shell`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// master-detail-shell.tsx
import * as React from "react";
import { Button, cn } from "@manpowerhub/ui";

export interface MasterDetailShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left pane, always mounted in split mode. */
  list: React.ReactNode;
  /** Right pane, shown when hasSelection is true. */
  detail?: React.ReactNode;
  /** Right pane shown on desktop when nothing is selected. */
  detailPlaceholder?: React.ReactNode;
  /** Full-width content (e.g. a printable document). */
  full?: React.ReactNode;
  /** When true, hide the split and show `full` across the whole width. */
  isFull?: boolean;
  /** Drives which pane shows on mobile and split vs placeholder on desktop. */
  hasSelection?: boolean;
  /** Back / exit-full handler. Renders a back control on mobile detail and in full view. */
  onBack?: () => void;
  /** Width of the list column on desktop. Default "20rem". */
  listWidth?: string;
}

export const MasterDetailShell = React.forwardRef<HTMLDivElement, MasterDetailShellProps>(
  (
    { className, list, detail, detailPlaceholder, full, isFull = false, hasSelection = false, onBack, listWidth = "20rem", ...props },
    ref,
  ) => {
    const backButton = onBack ? (
      <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>
    ) : null;

    if (isFull) {
      return (
        <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
          {backButton}
          <div>{full}</div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4 md:grid-cols-[var(--md-list-w)_1fr]",
          className,
        )}
        style={{ ["--md-list-w" as string]: listWidth, ...props.style }}
        {...props}
      >
        {/* List: full-width on mobile only when nothing selected; always visible on desktop */}
        <div className={cn("min-w-0", hasSelection && "hidden md:block")}>{list}</div>

        {/* Detail column */}
        <div className={cn("min-w-0", !hasSelection && "hidden md:block")}>
          {hasSelection ? (
            <div className="flex flex-col gap-4">
              <div className="md:hidden">{backButton}</div>
              {detail}
            </div>
          ) : (
            detailPlaceholder
          )}
        </div>
      </div>
    );
  },
);
MasterDetailShell.displayName = "MasterDetailShell";
```

```ts
// index.ts
export * from "./master-detail-shell";
```

Add to `packages/blocks/src/index.ts` (after the `document-shell` line):
```ts
export * from "./components/master-detail-shell";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test -- master-detail-shell`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/master-detail-shell packages/blocks/src/index.ts
git commit -m "feat(blocks): add MasterDetailShell layout block"
```

---

## Task 2: MasterDetailShell stories

**Files:**
- Create: `packages/blocks/src/components/master-detail-shell/master-detail-shell.stories.tsx`

**Interfaces:**
- Consumes: `MasterDetailShell` from Task 1.

- [ ] **Step 1: Write the stories file**

```tsx
// master-detail-shell.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MasterDetailShell } from "./master-detail-shell";

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-border p-4 text-sm text-foreground">{children}</div>
);

const meta: Meta<typeof MasterDetailShell> = {
  title: "Blocks/MasterDetailShell",
  component: MasterDetailShell,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof MasterDetailShell>;

const list = <Panel>List pane<br />Row A<br />Row B<br />Row C</Panel>;
const detail = <Panel>Detail pane for selected row</Panel>;
const placeholder = <Panel>Select an item to view details</Panel>;
const full = <Panel>Full document view</Panel>;

export const Default: Story = {
  args: { list, detail, detailPlaceholder: placeholder, hasSelection: true, onBack: () => {} },
};

export const NoSelection: Story = {
  args: { list, detail, detailPlaceholder: placeholder, hasSelection: false },
};

export const FullView: Story = {
  args: { list, detail, full, isFull: true, hasSelection: true, onBack: () => {} },
};

export const Dark: Story = {
  args: { list, detail, detailPlaceholder: placeholder, hasSelection: true, onBack: () => {} },
  parameters: { backgrounds: { default: "dark" } },
  decorators: [(S) => <div className="dark bg-background p-4"><S /></div>],
};

export const Customization: Story = {
  args: {
    list, detail, detailPlaceholder: placeholder, hasSelection: true, onBack: () => {},
    listWidth: "26rem",
    className: "gap-8",
  },
};
```

- [ ] **Step 2: Verify story typechecks/builds**

Run: `pnpm --filter @manpowerhub/blocks build-storybook`
Expected: builds without type errors for this file (full build may be slow; a `pnpm -w typecheck` is an acceptable faster substitute if configured).

- [ ] **Step 3: Commit**

```bash
git add packages/blocks/src/components/master-detail-shell/master-detail-shell.stories.tsx
git commit -m "docs(blocks): add MasterDetailShell stories"
```

---

## Task 3: QuotationListPane (compact selectable left list)

**Files:**
- Create: `packages/blocks/src/components/quotation/quotation-list-pane.tsx`
- Test: `packages/blocks/src/components/quotation/quotation-list-pane.test.tsx`
- Modify: `packages/blocks/src/components/quotation/index.ts`

**Interfaces:**
- Consumes: `PersistedQuotation`, `QuotationStatusPill`, `subtotal` from `../quotation` barrel (same dir).
- Produces:
  ```tsx
  export interface QuotationListPaneProps extends React.HTMLAttributes<HTMLDivElement> {
    quotations: PersistedQuotation[];
    selectedId?: string | null;
    currency?: string;
    isLoading?: boolean;
    onOpen: (id: string) => void;
    onNew: () => void;
  }
  export const QuotationListPane: React.ForwardRefExoticComponent<...>;
  ```

- [ ] **Step 1: Write the failing test**

```tsx
// quotation-list-pane.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { QuotationListPane } from "./quotation-list-pane";
import { seedQuotations } from "./quotation.mock";

const rows = seedQuotations();

describe("QuotationListPane", () => {
  it("renders a row per quotation", () => {
    render(<QuotationListPane quotations={rows} onOpen={() => {}} onNew={() => {}} />);
    expect(screen.getByText(rows[0].quotationNumber)).toBeInTheDocument();
    expect(screen.getByText(rows[0].customer.name)).toBeInTheDocument();
  });

  it("filters by search", async () => {
    render(<QuotationListPane quotations={rows} onOpen={() => {}} onNew={() => {}} />);
    const box = screen.getByPlaceholderText(/search/i);
    await userEvent.type(box, rows[0].customer.name);
    expect(screen.getByText(rows[0].quotationNumber)).toBeInTheDocument();
    // a row whose customer differs is filtered out
    const other = rows.find((r) => r.customer.name !== rows[0].customer.name);
    if (other) expect(screen.queryByText(other.quotationNumber)).not.toBeInTheDocument();
  });

  it("marks the selected row with aria-current", () => {
    render(
      <QuotationListPane quotations={rows} selectedId={rows[0].id} onOpen={() => {}} onNew={() => {}} />,
    );
    expect(screen.getByRole("button", { name: new RegExp(rows[0].quotationNumber) })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("fires onOpen and onNew", async () => {
    const onOpen = vi.fn();
    const onNew = vi.fn();
    render(<QuotationListPane quotations={rows} onOpen={onOpen} onNew={onNew} />);
    await userEvent.click(screen.getByRole("button", { name: new RegExp(rows[0].quotationNumber) }));
    expect(onOpen).toHaveBeenCalledWith(rows[0].id);
    await userEvent.click(screen.getByRole("button", { name: /new quotation/i }));
    expect(onNew).toHaveBeenCalled();
  });

  it("shows loading and empty states", () => {
    const { rerender } = render(
      <QuotationListPane quotations={[]} isLoading onOpen={() => {}} onNew={() => {}} />,
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    rerender(<QuotationListPane quotations={[]} onOpen={() => {}} onNew={() => {}} />);
    expect(screen.getByText(/no quotations/i)).toBeInTheDocument();
  });

  it("forwards ref/className/props and is axe clean", async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <QuotationListPane ref={ref} className="cx" data-testid="pane" quotations={rows} onOpen={() => {}} onNew={() => {}} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("pane")).toHaveClass("cx");
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-list-pane`
Expected: FAIL — cannot resolve `./quotation-list-pane`.

- [ ] **Step 3: Write minimal implementation**

```tsx
// quotation-list-pane.tsx
import * as React from "react";
import { Button, Input, cn } from "@manpowerhub/ui";
import { QuotationStatusPill } from "./quotation-status-pill";
import { subtotal } from "./quotation.totals";
import type { PersistedQuotation } from "./quotation.types";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export interface QuotationListPaneProps extends React.HTMLAttributes<HTMLDivElement> {
  quotations: PersistedQuotation[];
  selectedId?: string | null;
  currency?: string;
  isLoading?: boolean;
  onOpen: (id: string) => void;
  onNew: () => void;
}

export const QuotationListPane = React.forwardRef<HTMLDivElement, QuotationListPaneProps>(
  ({ className, quotations, selectedId, currency = "AED", isLoading = false, onOpen, onNew, ...props }, ref) => {
    const [search, setSearch] = React.useState("");
    const needle = search.trim().toLowerCase();
    const visible = quotations.filter((q) =>
      needle === "" ||
      q.quotationNumber.toLowerCase().includes(needle) ||
      q.customer.name.toLowerCase().includes(needle) ||
      q.customer.emailId.toLowerCase().includes(needle),
    );

    return (
      <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-md font-semibold text-foreground">Quotations</h2>
          <Button variant="primary" size="sm" onClick={onNew}>New quotation</Button>
        </div>

        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quotation / customer…"
          aria-label="Search quotations"
        />

        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : quotations.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No quotations yet.</p>
        ) : visible.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No quotations match.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {visible.map((q) => {
              const active = q.id === selectedId;
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    aria-current={active ? "true" : undefined}
                    aria-label={`Open ${q.quotationNumber}`}
                    onClick={() => onOpen(q.id)}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                      active
                        ? "border-ring bg-accent"
                        : "border-border hover:bg-muted/50",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm text-foreground">{q.quotationNumber}</span>
                      <QuotationStatusPill status={q.status} />
                    </div>
                    <div className="mt-1 truncate text-sm font-medium text-foreground">{q.customer.name}</div>
                    <div className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="truncate">{q.customer.emailId}</span>
                      <span className="tabular-nums">{currency} {fmt(subtotal(q.items))}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);
QuotationListPane.displayName = "QuotationListPane";
```

Add to `packages/blocks/src/components/quotation/index.ts` (after the `quotation-list` line):
```ts
export * from "./quotation-list-pane";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-list-pane`
Expected: PASS (6 tests).

Note: if `Input` is not exported from `@manpowerhub/ui`, verify the export name (`grep "export" packages/ui/src/index.ts | grep -i input`) and use the correct primitive, or fall back to a native `<input>` styled with the same classes.

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation-list-pane.tsx \
        packages/blocks/src/components/quotation/quotation-list-pane.test.tsx \
        packages/blocks/src/components/quotation/index.ts
git commit -m "feat(blocks): add QuotationListPane compact selectable list"
```

---

## Task 4: Add "Full view" action to QuotationDetail

**Files:**
- Modify: `packages/blocks/src/components/quotation/quotation-detail.tsx`
- Modify: `packages/blocks/src/components/quotation/quotation-detail.test.tsx`

**Interfaces:**
- Produces: `QuotationDetailProps` gains optional `onFullView?: () => void`. When provided, a "Full view" button renders in the header actions. `onBack` becomes optional (in the shell, mobile back is handled by the shell). Existing props unchanged.

- [ ] **Step 1: Add a failing test**

Append to `quotation-detail.test.tsx` (reuse existing render helpers/mocks already in that file for a `PersistedQuotation`; if the file builds a quotation inline, mirror that construction):

```tsx
it("renders Full view button and fires onFullView when provided", async () => {
  const onFullView = vi.fn();
  renderDetail({ onFullView }); // use the file's existing render helper; pass onFullView through
  await userEvent.click(screen.getByRole("button", { name: /full view/i }));
  expect(onFullView).toHaveBeenCalledTimes(1);
});

it("omits Full view button when onFullView is not provided", () => {
  renderDetail({});
  expect(screen.queryByRole("button", { name: /full view/i })).not.toBeInTheDocument();
});
```

If `quotation-detail.test.tsx` has no `renderDetail` helper, add one at the top of the file that renders `<QuotationDetail>` with required props filled by `seedQuotations()[0]` and no-op callbacks, spreading an overrides object.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-detail`
Expected: FAIL — no button named "Full view".

- [ ] **Step 3: Implement**

In `quotation-detail.tsx`, change the props interface and header actions.

Interface — make `onBack` optional and add `onFullView`:
```tsx
export interface QuotationDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  quotation: PersistedQuotation;
  onEdit: () => void;
  onSubmitForApproval: () => void;
  onDecide: (approverId: string, decision: "APPROVED" | "REJECTED", comment?: string) => void;
  onPrint: () => void;
  onBack?: () => void;
  onFullView?: () => void;
  busy?: boolean;
}
```

Destructure `onFullView` and `onBack` (already present). Header block — guard the back button and add Full view:
```tsx
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBack && <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>}
            <h2 className="font-display text-lg font-semibold text-foreground">{q.quotationNumber}</h2>
            <QuotationStatusPill status={q.status} />
          </div>
          <div className="flex gap-2">
            {onFullView && <Button variant="secondary" size="sm" onClick={onFullView}>Full view</Button>}
            <Button variant="secondary" size="sm" onClick={onPrint}>Print</Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
          </div>
        </div>
```

- [ ] **Step 4: Run tests to verify pass**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-detail`
Expected: PASS (existing + 2 new).

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation-detail.tsx \
        packages/blocks/src/components/quotation/quotation-detail.test.tsx
git commit -m "feat(blocks): add Full view action to QuotationDetail"
```

---

## Task 5: Rewire QuotationsPage onto the shell

**Files:**
- Modify: `packages/blocks/src/components/quotations-page/quotations-page.tsx`
- Modify: `packages/blocks/src/components/quotations-page/quotations-page.test.tsx`

**Interfaces:**
- Consumes: `MasterDetailShell` (Task 1), `QuotationListPane` (Task 3), `onFullView` on `QuotationDetail` (Task 4), existing `QuotationForm`, `QuotationDocument`, `EmptyState`, `createMockQuotationApi`, `QuotationApi`, `PersistedQuotation`, `QuotationAggregateData`.
- Props unchanged: `QuotationsPageProps { api?: QuotationApi; currency?: string }`.

- [ ] **Step 1: Write failing tests for master-detail flows**

Rewrite `quotations-page.test.tsx` to cover the new UX (keep any still-valid existing cases). Core cases:

```tsx
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { QuotationsPage } from "./quotations-page";

const findFirstRowButton = async () => {
  // list pane rows are buttons labelled "Open <number>"
  const btns = await screen.findAllByRole("button", { name: /open q/i });
  return btns[0];
};

describe("QuotationsPage (master-detail)", () => {
  it("shows placeholder until a row is opened, then detail", async () => {
    render(<QuotationsPage />);
    expect(await screen.findByText(/select a quotation/i)).toBeInTheDocument();
    await userEvent.click(await findFirstRowButton());
    // detail header shows Full view + Edit
    expect(await screen.findByRole("button", { name: /full view/i })).toBeInTheDocument();
  });

  it("Full view swaps to the document, back returns to split", async () => {
    render(<QuotationsPage />);
    await userEvent.click(await findFirstRowButton());
    await userEvent.click(await screen.findByRole("button", { name: /full view/i }));
    expect(await screen.findByRole("button", { name: /back/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(await screen.findByRole("button", { name: /full view/i })).toBeInTheDocument();
  });

  it("Edit opens the form and returns to detail on cancel", async () => {
    render(<QuotationsPage />);
    await userEvent.click(await findFirstRowButton());
    await userEvent.click(await screen.findByRole("button", { name: /^edit$/i }));
    const cancel = await screen.findByRole("button", { name: /cancel/i });
    await userEvent.click(cancel);
    expect(await screen.findByRole("button", { name: /full view/i })).toBeInTheDocument();
  });

  it("is axe clean on the split view", async () => {
    const { container } = render(<QuotationsPage />);
    await findFirstRowButton();
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter @manpowerhub/blocks test -- quotations-page`
Expected: FAIL — no "Select a quotation" placeholder / no "Full view" (old view-switcher still active).

- [ ] **Step 3: Rewrite the QuotationsPage render**

Replace the body of `quotations-page.tsx`. Keep the existing api/state/handlers block (lines defining `apiRef`, `items`, `loading`, `busy`, `error`, `refetch`, `run`, `handleCreate`, `handleUpdate`, `handleSubmit`, `handleDecide`, `handleDelete`) and replace the `view` state + returned JSX.

```tsx
import * as React from "react";
import { cn } from "@manpowerhub/ui";
import { MasterDetailShell } from "../master-detail-shell";
import { EmptyState } from "../empty-state";
import { FileText } from "lucide-react";
import {
  QuotationForm,
  QuotationDetail,
  QuotationDocument,
  QuotationListPane,
  createMockQuotationApi,
  type QuotationApi,
  type PersistedQuotation,
  type QuotationAggregateData,
} from "../quotation";

type Mode = "split" | "full" | "form";

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
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [mode, setMode] = React.useState<Mode>("split");
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

    const current = selectedId ? items.find((q) => q.id === selectedId) : undefined;

    // If the selected record vanished (deleted/refetch), drop the selection + exit full.
    React.useEffect(() => {
      if (selectedId && !loading && !current) {
        setSelectedId(null);
        setMode("split");
      }
    }, [selectedId, current, loading]);

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
        const created = await apiRef.current.create(data);
        await refetch();
        setSelectedId(created?.id ?? null);
        setMode("split");
      });
    const handleUpdate = (id: string, data: QuotationAggregateData) =>
      run(async () => {
        await apiRef.current.update(id, data);
        await refetch();
        setSelectedId(id);
        setMode("split");
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

    const listPane = (
      <QuotationListPane
        quotations={items}
        selectedId={selectedId}
        currency={currency}
        isLoading={loading}
        onOpen={(id) => {
          setSelectedId(id);
          setMode("split");
        }}
        onNew={() => {
          setSelectedId(null);
          setMode("form");
        }}
      />
    );

    // Form overlay takes over the whole area when active.
    if (mode === "form") {
      return (
        <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <QuotationForm
            initial={selectedId ? current : undefined}
            submitting={busy}
            onCancel={() => setMode("split")}
            onSubmit={(data) => (selectedId ? handleUpdate(selectedId, data) : handleCreate(data))}
          />
        </div>
      );
    }

    const detail = current ? (
      <QuotationDetail
        quotation={current}
        busy={busy}
        onFullView={() => setMode("full")}
        onEdit={() => setMode("form")}
        onPrint={() => setMode("full")}
        onSubmitForApproval={() => handleSubmit(current.id)}
        onDecide={(approverId, decision, comment) => handleDecide(current.id, approverId, decision, comment)}
      />
    ) : undefined;

    const placeholder = (
      <EmptyState
        variant="dashed"
        icon={<FileText />}
        title="Select a quotation"
        description="Choose a quotation from the list to see its details."
      />
    );

    const full = current ? (
      <div className="flex flex-col items-center gap-4">
        <QuotationDocument quotation={current} />
      </div>
    ) : undefined;

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <MasterDetailShell
          list={listPane}
          detail={detail}
          detailPlaceholder={placeholder}
          full={full}
          isFull={mode === "full" && !!current}
          hasSelection={!!current}
          onBack={() => (mode === "full" ? setMode("split") : setSelectedId(null))}
        />
      </div>
    );
  },
);
QuotationsPage.displayName = "QuotationsPage";
```

Notes for the implementer:
- Verify `apiRef.current.create` returns the created record (`PersistedQuotation`). If it returns `void`, drop `created?.id` and instead select the newest item after refetch: `setSelectedId(null)` then, in a follow-up, select by matching — simplest is to leave `selectedId` null and let the user pick. Check `quotation.mock.ts` `create` signature before finalizing this line.
- Verify `EmptyState` accepts `icon`, `title`, `description`, `variant` (it does per `empty-state.tsx`).
- `lucide-react` is already a dependency (used across blocks).

- [ ] **Step 4: Run tests to verify pass**

Run: `pnpm --filter @manpowerhub/blocks test -- quotations-page`
Expected: PASS.

- [ ] **Step 5: Run the full blocks test suite**

Run: `pnpm --filter @manpowerhub/blocks test`
Expected: all PASS (no regressions in quotation/detail/list tests).

- [ ] **Step 6: Commit**

```bash
git add packages/blocks/src/components/quotations-page/quotations-page.tsx \
        packages/blocks/src/components/quotations-page/quotations-page.test.tsx
git commit -m "feat(blocks): rewire QuotationsPage onto MasterDetailShell"
```

---

## Task 6: Update stories, registry, docs

**Files:**
- Modify: `packages/blocks/src/components/quotations-page/quotations-page.stories.tsx` (ensure default/dark/loading/empty stories still render the new layout; add a "Customization" story if missing)
- Check: `apps/docs/registry/blocks/*` — the registry mirrors block source. If registry blocks are hand-maintained copies (they are, per repo layout under `apps/docs/registry/blocks/`), add `master-detail-shell.tsx` and `quotation-list-pane.tsx` copies and update `quotations-page.tsx` copy + `quotation-detail.tsx` copy to match.

- [ ] **Step 1: Confirm how the registry is populated**

Run:
```bash
cat apps/docs/package.json | grep -A2 prebuild
ls apps/docs/registry/blocks
```
Expected: identify whether `gen:registry` copies from `packages/blocks` automatically or the `apps/docs/registry/blocks/*.tsx` files are maintained by hand.

- [ ] **Step 2a: If auto-generated** — run the generator and commit output:
```bash
pnpm --filter @manpowerhub/docs gen:registry
git add apps/docs/registry apps/docs/public/r
git commit -m "chore(docs): regenerate registry for master-detail blocks"
```

- [ ] **Step 2b: If hand-maintained** — copy the new/changed sources into `apps/docs/registry/blocks/` (matching the existing file naming: `master-detail-shell.tsx`, `quotation-list-pane.tsx`, updated `quotations-page.tsx`, updated `quotation-detail.tsx`), then regenerate JSON if a generator exists, and add MDX pages under `apps/docs/content/blocks/` for the new `master-detail-shell` following the pattern of `document-shell.mdx`.
```bash
git add apps/docs/registry apps/docs/content/blocks apps/docs/public/r
git commit -m "docs(blocks): document MasterDetailShell + QuotationListPane in registry"
```

- [ ] **Step 3: Update the QuotationsPage story if needed**

Ensure `quotations-page.stories.tsx` still compiles against the rewired component (props unchanged, so it should). Add/verify a "Customization" story passing `className`. Run:
```bash
pnpm --filter @manpowerhub/blocks test -- quotations-page
```

- [ ] **Step 4: Commit any story change**
```bash
git add packages/blocks/src/components/quotations-page/quotations-page.stories.tsx
git commit -m "docs(blocks): refresh QuotationsPage stories for master-detail layout"
```

---

## Task 7: Verify end-to-end + typecheck/lint

**Files:** none (verification only).

- [ ] **Step 1: Typecheck + lint the workspace**
```bash
pnpm -w typecheck
pnpm -w lint
```
Expected: clean. Fix any type errors surfaced by the new props/wiring.

- [ ] **Step 2: Run the full blocks test suite with coverage**
```bash
pnpm --filter @manpowerhub/blocks coverage
```
Expected: all pass; new files covered.

- [ ] **Step 3: Visually verify in Storybook (manual)**
```bash
pnpm --filter @manpowerhub/blocks storybook
```
Check: `Blocks/MasterDetailShell` (Default, NoSelection, FullView, Dark), and the QuotationsPage story — open a row → detail shows; Full view → document; resize narrow → list/detail stack.

- [ ] **Step 4: Final commit if any fixes were needed**
```bash
git add -A
git commit -m "chore(blocks): typecheck/lint fixes for master-detail shell"
```

---

## Self-Review Notes

- **Spec coverage:** MasterDetailShell (Task 1–2), QuotationListPane (Task 3), Full view button (Task 4), QuotationsPage rewire incl. data flow + edge cases (Task 5), stats/registry/docs (Task 6), verification (Task 7). All spec sections mapped.
- **Edge cases from spec:** placeholder when unselected (Task 5 `placeholder`), selected-record-vanished guard (Task 5 effect), `isFull` guard (`mode === "full" && !!current`), loading (list pane), mobile stacking (shell `hasSelection`).
- **Open verifications flagged inline (do before finalizing that line):** `Input` export name (Task 3), `api.create` return type (Task 5), registry generation mechanism (Task 6). These are the only unknowns; each has a stated fallback.
