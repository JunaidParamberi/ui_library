# Quotation block v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the quotation block (form, detail, list pane, approval timeline) to a Zoho-style form + Craftly-style detail/list look, add optional quotation fields, and tighten the global radius scale in `@manpowerhub/tokens`.

**Architecture:** Pure presentation refactor of `packages/blocks/src/components/quotation/*` built on `@manpowerhub/ui` primitives (`Field`, `Input`, `Textarea`, `Select*`, `Button`, `Card*`, `Badge`, `cn`). New quotation fields are optional additions to existing types; totals math is unchanged. Radius reduction edits three token sources (`preset.ts`, `tokens.ts`, `globals.css`) in sync.

**Tech Stack:** React 18 + TypeScript, Tailwind (via `@manpowerhub/tokens` preset), Vitest + Testing Library + vitest-axe, Storybook.

## Global Constraints

- Component contract (CLAUDE.md): every component forwards `className` via `cn()`, forwards `ref` (`React.forwardRef`), spreads `...props` onto the root, exposes variants via `cva` where visual variants exist, and ships `<name>.tsx` + `.stories.tsx` + `.test.tsx` + `index.ts`, re-exported from the package `index.ts`.
- Stories must cover: default, dark, loading, empty, error (where applicable), plus a "Customization" story.
- No API calls / business logic / secrets in `@manpowerhub/ui`. Blocks may hold view state only (mock API already exists).
- Use semantic token classes (`text-muted-foreground`, `bg-accent`, `border-border`, `rounded-md`, etc.). No raw hex.
- Conventional Commits: `type(scope): summary`. Scope `blocks` for component work, `tokens` for token work.
- Totals math unchanged: `subtotal(items) + otGrandTotal(items)`; per-line amount is `lineTotal(item)` (`qty*rate`). Never store amount.
- Run tests from repo root with `pnpm --filter @manpowerhub/blocks test` (blocks) / `pnpm --filter @manpowerhub/tokens build` + `pnpm -w typecheck` (tokens).

---

### Task 1: Data model — new optional fields

**Files:**
- Modify: `packages/blocks/src/components/quotation/quotation.types.ts`
- Modify: `packages/blocks/src/components/quotation/quotation.mock.ts` (seed new fields)
- Test: `packages/blocks/src/components/quotation/quotation.mock.test.ts` (existing — extend)

**Interfaces:**
- Consumes: nothing new.
- Produces:
  - `QuotationTerms = "DUE_ON_RECEIPT" | "NET_15" | "NET_30" | "NET_45" | "CUSTOM"`
  - `QuotationItem` gains `description?: string`
  - `QuotationAggregateData` gains `terms?: QuotationTerms; dueDate?: string; customerNotes?: string; termsAndConditions?: string`
  - `PersistedQuotation` inherits these (already `QuotationAggregateData & meta & { id }`)

- [ ] **Step 1: Add the failing test**

Append to `quotation.mock.test.ts`:

```ts
import { seedQuotations } from "./quotation.mock";

it("seeds quotations carrying the new optional fields", () => {
  const seed = seedQuotations();
  const withTerms = seed.find((q) => q.terms);
  expect(withTerms).toBeDefined();
  expect(withTerms!.dueDate).toBeTruthy();
  expect(withTerms!.customerNotes).toBeTruthy();
  expect(withTerms!.items.some((i) => i.description)).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation.mock`
Expected: FAIL — `withTerms` is undefined (no seed has `terms`).

- [ ] **Step 3: Extend the types**

In `quotation.types.ts`, add the terms union above `Customer`:

```ts
export type QuotationTerms =
  | "DUE_ON_RECEIPT" | "NET_15" | "NET_30" | "NET_45" | "CUSTOM";
```

Add to `QuotationItem`:

```ts
export interface QuotationItem {
  category: string;
  quantity: string;
  rate: string;
  otRate: string;
  description?: string;
}
```

Add to `QuotationAggregateData` (after `items`):

```ts
export interface QuotationAggregateData {
  quotationNumber: string;
  quotationDate: string;
  customer: Customer;
  status: QuotationStatus;
  approvers: ApprovalStep[];
  items: QuotationItem[];
  terms?: QuotationTerms;
  dueDate?: string;
  customerNotes?: string;
  termsAndConditions?: string;
}
```

- [ ] **Step 4: Populate the seed**

In `quotation.mock.ts` `seedQuotations()`, add the new fields to at least the first two quotations. For `Q-1001` add after `quotationDate`:

```ts
      terms: "NET_15",
      dueDate: "2026-07-16",
      customerNotes: "Thanks for your business.",
      termsAndConditions: "50% advance, balance on delivery.",
```

and give its first item a description:

```ts
        { category: "Site Engineer", quantity: "2", rate: "1200", otRate: "180", description: "Grade A, site supervised" },
```

For `Q-1002` add `terms: "DUE_ON_RECEIPT"`, `dueDate: "2026-07-03"`, `customerNotes: "Payment on receipt."`.

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation.mock`
Expected: PASS. Then `pnpm -w typecheck` — Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation.types.ts packages/blocks/src/components/quotation/quotation.mock.ts packages/blocks/src/components/quotation/quotation.mock.test.ts
git commit -m "feat(blocks): add optional terms/dueDate/notes/description to quotation types"
```

---

### Task 2: Tokens — tighten radius scale

**Files:**
- Modify: `packages/tokens/src/preset.ts:37-45` (borderRadius)
- Modify: `packages/tokens/src/tokens.ts:15-23` (radius object)
- Modify: `packages/tokens/src/globals.css:23` (`--radius`)

**Interfaces:**
- Consumes: nothing.
- Produces: reduced radius scale — every `rounded-{xs,sm,md,lg,xl,2xl}` and `rounded` (DEFAULT) across all packages renders tighter.

- [ ] **Step 1: Edit `preset.ts` borderRadius**

Replace the `borderRadius` block:

```ts
      borderRadius: {
        xs: "3px",
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
      },
```

- [ ] **Step 2: Edit `tokens.ts` radius object to match**

```ts
export const radius = {
  xs: 3,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  full: 9999,
} as const;
```

- [ ] **Step 3: Edit `globals.css` `--radius`**

Change line 23 from `--radius: 0.5625rem;` to:

```css
    --radius: 0.375rem;
```

- [ ] **Step 4: Build tokens + typecheck**

Run: `pnpm --filter @manpowerhub/tokens build && pnpm -w typecheck`
Expected: build succeeds, no type errors.

- [ ] **Step 5: Visual sanity (manual)**

Run: `pnpm --filter @manpowerhub/ui storybook` (or the running Storybook), open Button / Card / Input stories.
Expected: corners visibly tighter, nothing clipped or broken. This is a visual check; no automated assertion.

- [ ] **Step 6: Commit**

```bash
git add packages/tokens/src/preset.ts packages/tokens/src/tokens.ts packages/tokens/src/globals.css
git commit -m "feat(tokens): tighten global corner-radius scale"
```

---

### Task 3: Form — Zoho-style layout + new fields

**Files:**
- Modify: `packages/blocks/src/components/quotation/quotation-form.tsx`
- Test: `packages/blocks/src/components/quotation/quotation-form.test.tsx` (rewrite)
- Modify: `packages/blocks/src/components/quotation/quotation.stories.tsx` (form story unaffected structurally; verify renders)

**Interfaces:**
- Consumes: `Field`, `Input`, `Textarea`, `Button`, `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `cn` from `@manpowerhub/ui`; `lineTotal` from `./quotation.totals`; types from `./quotation.types`.
- Produces: `QuotationForm` with unchanged prop signature:
  `{ initial?: QuotationAggregateData; onSubmit: (data: QuotationAggregateData) => void; onCancel: () => void; submitting?: boolean }`.
  Two save actions: "Save as Draft" submits `data.status = "DRAFT"`, "Save and Send" submits `data.status = "SENT"`. New fields (`terms`, `dueDate`, `customerNotes`, `termsAndConditions`, item `description`) flow into the submitted payload. Amount column is read-only, computed via `lineTotal`.

- [ ] **Step 1: Rewrite the failing test**

Replace `quotation-form.test.tsx` body. Key new assertions (keep existing validation tests, update labels):

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { QuotationForm } from "./quotation-form";

const fill = async () => {
  await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
  await userEvent.type(screen.getByLabelText(/^email/i), "a@acme.com");
  await userEvent.type(screen.getByLabelText(/item details/i), "Mason");
  await userEvent.type(screen.getByLabelText(/^quantity/i), "2");
  await userEvent.type(screen.getByLabelText(/^rate/i), "100");
};

describe("QuotationForm", () => {
  it("submits DRAFT status from Save as Draft", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit.mock.calls[0]![0].status).toBe("DRAFT");
    expect(onSubmit.mock.calls[0]![0].items[0].category).toBe("Mason");
  });

  it("submits SENT status from Save and Send", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /save and send/i }));
    expect(onSubmit.mock.calls[0]![0].status).toBe("SENT");
  });

  it("computes the amount cell from qty * rate", async () => {
    render(<QuotationForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/item details/i), "Mason");
    await userEvent.type(screen.getByLabelText(/^quantity/i), "3");
    await userEvent.type(screen.getByLabelText(/^rate/i), "50");
    expect(screen.getByTestId("row-amount-0")).toHaveTextContent("150.00");
  });

  it("captures terms, due date, notes and item description", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await fill();
    await userEvent.type(screen.getByLabelText(/due date/i), "2026-07-20");
    await userEvent.type(screen.getByLabelText(/customer notes/i), "Cheers");
    await userEvent.type(screen.getByLabelText(/terms & conditions/i), "Net terms");
    await userEvent.type(screen.getByLabelText(/description/i), "Grade A");
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    const data = onSubmit.mock.calls[0]![0];
    expect(data.dueDate).toBe("2026-07-20");
    expect(data.customerNotes).toBe("Cheers");
    expect(data.termsAndConditions).toBe("Net terms");
    expect(data.items[0].description).toBe("Grade A");
  });

  it("blocks submit when required fields are missing", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/customer name is required/i)).toBeInTheDocument();
  });

  it("blocks submit when the customer email is invalid", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/^email/i), "foo@bar");
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/valid customer email is required/i)).toBeInTheDocument();
  });

  it("blocks submit when no item has details", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/^email/i), "a@acme.com");
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    expect(screen.getByText(/at least one item is required/i)).toBeInTheDocument();
  });

  it("adds and removes item rows", async () => {
    render(<QuotationForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /add new row/i }));
    expect(screen.getAllByLabelText(/item details/i).length).toBe(2);
    await userEvent.click(screen.getAllByRole("button", { name: /remove item/i })[0]!);
    expect(screen.getAllByLabelText(/item details/i).length).toBe(1);
  });

  it("adds an approver and includes it in the payload", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /add approver/i }));
    await userEvent.type(screen.getByLabelText(/approver name/i), "Boss");
    await userEvent.type(screen.getByLabelText(/approver email/i), "boss@acme.com");
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    const data = onSubmit.mock.calls[0]![0];
    expect(data.approvers).toHaveLength(1);
    expect(data.approvers[0].decision).toBe("PENDING");
  });

  it("blocks submit when an approver email is invalid", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /add approver/i }));
    await userEvent.type(screen.getByLabelText(/approver name/i), "Boss");
    await userEvent.type(screen.getByLabelText(/approver email/i), "boss@bar");
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/valid email is required for each approver/i)).toBeInTheDocument();
  });

  it("prefills from initial", () => {
    render(
      <QuotationForm onSubmit={vi.fn()} onCancel={vi.fn()}
        initial={{ quotationNumber: "Q-1", quotationDate: "2026-07-09", status: "DRAFT",
          customer: { name: "Existing", address: "", phoneNumber: "", emailId: "e@e.com" },
          items: [{ category: "Helper", quantity: "1", rate: "50", otRate: "5" }],
          approvers: [], terms: "NET_30", dueDate: "2026-07-15", customerNotes: "Hi" }} />,
    );
    expect(screen.getByDisplayValue("Existing")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Helper")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hi")).toBeInTheDocument();
  });

  it("fires onCancel", async () => {
    const onCancel = vi.fn();
    render(<QuotationForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("forwards className and ref", () => {
    const ref = { current: null as HTMLFormElement | null };
    const { container } = render(<QuotationForm ref={ref} className="px" onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(ref.current).toBeInstanceOf(HTMLFormElement);
    expect(container.firstChild).toHaveClass("px");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<QuotationForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-form`
Expected: FAIL — labels `item details`, buttons `save as draft`/`save and send`, `row-amount-0` testid don't exist yet.

- [ ] **Step 3: Rewrite `quotation-form.tsx`**

Full replacement:

```tsx
import * as React from "react";
import {
  Button, Field, Input, Textarea,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem, cn,
} from "@manpowerhub/ui";
import { lineTotal } from "./quotation.totals";
import type {
  ApprovalStep, Customer, QuotationAggregateData, QuotationItem, QuotationStatus, QuotationTerms,
} from "./quotation.types";

interface ApproverDraft { approverName: string; approverEmail: string; }

const emptyItem = (): QuotationItem => ({ category: "", quantity: "", rate: "", otRate: "", description: "" });
const emptyCustomer = (): Customer => ({ name: "", address: "", phoneNumber: "", emailId: "" });
const emptyApprover = (): ApproverDraft => ({ approverName: "", approverEmail: "" });
const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TERMS: { value: QuotationTerms; label: string }[] = [
  { value: "DUE_ON_RECEIPT", label: "Due on Receipt" },
  { value: "NET_15", label: "Net 15" },
  { value: "NET_30", label: "Net 30" },
  { value: "NET_45", label: "Net 45" },
  { value: "CUSTOM", label: "Custom" },
];

export interface QuotationFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  initial?: QuotationAggregateData;
  onSubmit: (data: QuotationAggregateData) => void;
  onCancel: () => void;
  submitting?: boolean;
}

export const QuotationForm = React.forwardRef<HTMLFormElement, QuotationFormProps>(
  ({ className, initial, onSubmit, onCancel, submitting = false, ...props }, ref) => {
    const [customer, setCustomer] = React.useState<Customer>(initial?.customer ?? emptyCustomer());
    const [items, setItems] = React.useState<QuotationItem[]>(initial?.items ?? [emptyItem()]);
    const [date, setDate] = React.useState(initial?.quotationDate ?? new Date().toISOString().slice(0, 10));
    const [terms, setTerms] = React.useState<QuotationTerms>(initial?.terms ?? "DUE_ON_RECEIPT");
    const [dueDate, setDueDate] = React.useState(initial?.dueDate ?? "");
    const [customerNotes, setCustomerNotes] = React.useState(initial?.customerNotes ?? "");
    const [termsText, setTermsText] = React.useState(initial?.termsAndConditions ?? "");
    const [approvers, setApprovers] = React.useState<ApproverDraft[]>(
      initial?.approvers?.map((a) => ({ approverName: a.approverName, approverEmail: a.approverEmail })) ?? [],
    );
    const [error, setError] = React.useState<string | null>(null);

    const setItem = (i: number, key: keyof QuotationItem, v: string) =>
      setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)));
    const setApprover = (i: number, key: keyof ApproverDraft, v: string) =>
      setApprovers((prev) => prev.map((a, idx) => (idx === i ? { ...a, [key]: v } : a)));

    const submitWith = (status: QuotationStatus) => {
      if (!customer.name.trim()) return setError("Customer name is required.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.emailId)) return setError("A valid customer email is required.");
      if (!items.some((it) => it.category.trim())) return setError("At least one item is required.");
      const named = approvers.filter((a) => a.approverName.trim());
      if (named.some((a) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a.approverEmail)))
        return setError("A valid email is required for each approver.");
      setError(null);
      const approvalSteps: ApprovalStep[] = named.map((a) => ({
        approverId: crypto.randomUUID(),
        approverName: a.approverName.trim(),
        approverEmail: a.approverEmail.trim(),
        decision: "PENDING",
      }));
      onSubmit({
        quotationNumber: initial?.quotationNumber ?? "",
        quotationDate: date,
        customer,
        status,
        approvers: approvalSteps,
        items: items.filter((it) => it.category.trim()),
        terms,
        dueDate: dueDate || undefined,
        customerNotes: customerNotes || undefined,
        termsAndConditions: termsText || undefined,
      });
    };

    const cell = "border border-transparent rounded-sm px-2 py-1 text-right tabular-nums focus-within:border-ring";

    return (
      <form ref={ref} className={cn("flex flex-col gap-6", className)}
        onSubmit={(e) => { e.preventDefault(); submitWith("DRAFT"); }} {...props}>
        {/* customer + meta */}
        <div className="flex flex-col gap-4">
          <div className="grid items-center gap-3 sm:grid-cols-[minmax(150px,180px)_1fr]">
            <label htmlFor="cust-name" className="text-sm font-medium text-foreground">Customer Name<span className="ml-0.5 text-destructive" aria-hidden>*</span></label>
            <Input id="cust-name" aria-label="Customer name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
            <label htmlFor="cust-email" className="text-sm font-medium text-foreground">Email<span className="ml-0.5 text-destructive" aria-hidden>*</span></label>
            <Input id="cust-email" type="email" aria-label="Email" value={customer.emailId} onChange={(e) => setCustomer({ ...customer, emailId: e.target.value })} />
            <label htmlFor="cust-phone" className="text-sm font-medium text-foreground">Phone number</label>
            <Input id="cust-phone" aria-label="Phone number" value={customer.phoneNumber} onChange={(e) => setCustomer({ ...customer, phoneNumber: e.target.value })} />
            <label htmlFor="cust-addr" className="text-sm font-medium text-foreground">Address</label>
            <Input id="cust-addr" aria-label="Address" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
            <label htmlFor="q-date" className="text-sm font-medium text-foreground">Quotation Date</label>
            <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
              <Input id="q-date" type="date" aria-label="Quotation date" value={date} onChange={(e) => setDate(e.target.value)} />
              <span className="justify-self-center text-xs font-medium text-muted-foreground">Terms</span>
              <Select value={terms} onValueChange={(v) => setTerms(v as QuotationTerms)}>
                <SelectTrigger aria-label="Terms"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TERMS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <label htmlFor="due-date" className="text-sm font-medium text-foreground">Due Date</label>
            <Input id="due-date" type="date" aria-label="Due date" className="sm:max-w-[280px]" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>

        {/* item table */}
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-accent text-[10px] uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2.5 text-left font-semibold">Item Details</th>
                <th className="px-3 py-2.5 text-right font-semibold">Qty</th>
                <th className="px-3 py-2.5 text-right font-semibold">Rate</th>
                <th className="px-3 py-2.5 text-right font-semibold">OT Rate</th>
                <th className="px-3 py-2.5 text-right font-semibold">Amount</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i} className="border-t border-border/60 align-top">
                  <td className="px-3 py-2">
                    <input aria-label={`Item details ${i + 1}`} className="w-full bg-transparent outline-none" placeholder="Type item name…" value={it.category} onChange={(e) => setItem(i, "category", e.target.value)} />
                    <input aria-label={`Description ${i + 1}`} className="mt-1 w-full bg-transparent text-xs text-muted-foreground outline-none" placeholder="Description" value={it.description ?? ""} onChange={(e) => setItem(i, "description", e.target.value)} />
                  </td>
                  <td className="px-1 py-2 text-right"><input aria-label={`Quantity ${i + 1}`} inputMode="numeric" className={cn(cell, "w-16")} value={it.quantity} onChange={(e) => setItem(i, "quantity", e.target.value)} /></td>
                  <td className="px-1 py-2 text-right"><input aria-label={`Rate ${i + 1}`} inputMode="numeric" className={cn(cell, "w-20")} value={it.rate} onChange={(e) => setItem(i, "rate", e.target.value)} /></td>
                  <td className="px-1 py-2 text-right"><input aria-label={`OT rate ${i + 1}`} inputMode="numeric" className={cn(cell, "w-20")} value={it.otRate} onChange={(e) => setItem(i, "otRate", e.target.value)} /></td>
                  <td className="px-3 py-2 text-right tabular-nums" data-testid={`row-amount-${i}`}>{fmt(lineTotal(it))}</td>
                  <td className="px-1 py-2 text-right">
                    <Button type="button" variant="ghost" size="sm" aria-label={`Remove item ${i + 1}`}
                      onClick={() => setItems((prev) => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev)}>✕</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4">
          <Button type="button" variant="ghost" size="sm" className="self-start px-0" onClick={() => setItems((p) => [...p, emptyItem()])}>+ Add New Row</Button>
        </div>

        {/* notes + totals */}
        <div className="grid gap-6 sm:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-4">
            <Field label="Customer Notes" htmlFor="cust-notes" hint="Will be displayed on the quotation">
              <Textarea id="cust-notes" aria-label="Customer notes" value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} />
            </Field>
            <Field label="Terms & Conditions" htmlFor="tc">
              <Textarea id="tc" aria-label="Terms & conditions" placeholder="Enter your terms and conditions…" value={termsText} onChange={(e) => setTermsText(e.target.value)} />
            </Field>
          </div>
          <div className="rounded-md border border-border bg-accent p-4 text-sm">
            <div className="flex justify-between py-1 text-muted-foreground"><span>Subtotal</span><span className="tabular-nums">{fmt(items.reduce((s, it) => s + lineTotal(it), 0))}</span></div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold text-foreground"><span>Total</span><span className="tabular-nums">{fmt(items.reduce((s, it) => s + lineTotal(it), 0))}</span></div>
          </div>
        </div>

        {/* approvers */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Approvers</div>
          {approvers.map((a, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[2fr_2fr_auto]">
              <Field label="Approver name" htmlFor={`appr-name-${i}`}>
                <Input id={`appr-name-${i}`} value={a.approverName} onChange={(e) => setApprover(i, "approverName", e.target.value)} /></Field>
              <Field label="Approver email" htmlFor={`appr-email-${i}`}>
                <Input id={`appr-email-${i}`} type="email" value={a.approverEmail} onChange={(e) => setApprover(i, "approverEmail", e.target.value)} /></Field>
              <Button type="button" variant="ghost" size="sm" className="self-end" aria-label={`Remove approver ${i + 1}`}
                onClick={() => setApprovers((prev) => prev.filter((_, idx) => idx !== i))}>✕</Button>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" className="self-start" onClick={() => setApprovers((p) => [...p, emptyApprover()])}>Add approver</Button>
        </div>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" disabled={submitting} onClick={() => submitWith("DRAFT")}>Save as Draft</Button>
          <Button type="button" variant="primary" disabled={submitting} onClick={() => submitWith("SENT")}>Save and Send</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    );
  },
);
QuotationForm.displayName = "QuotationForm";
```

Note: item-name state key stays `category` for back-compat with types/totals; its label/placeholder read "Item details".

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-form`
Expected: PASS (all). If `Select` needs a portal for jsdom, the `aria-label="Terms"` on `SelectTrigger` is still queryable; no test opens the listbox.

- [ ] **Step 5: Typecheck**

Run: `pnpm -w typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation-form.tsx packages/blocks/src/components/quotation/quotation-form.test.tsx
git commit -m "feat(blocks): Zoho-style quotation form with terms, notes, amount column, draft/send"
```

---

### Task 4: Approval timeline — Craftly activity rows

**Files:**
- Modify: `packages/blocks/src/components/quotation/approval-timeline.tsx`
- Test: `packages/blocks/src/components/quotation/approval-timeline.test.tsx` (extend)

**Interfaces:**
- Consumes: `Badge`, `cn`; `ApprovalDecision`, `ApprovalStep`.
- Produces: `ApprovalTimeline` — unchanged props `{ steps: ApprovalStep[] }`. Each row renders a leading state-colored icon tile + name/email + decision label; hairline dividers, no per-row card.

- [ ] **Step 1: Add the failing test**

Append to `approval-timeline.test.tsx`:

```tsx
it("renders a state-colored tile per decision", () => {
  render(<ApprovalTimeline steps={[
    { approverId: "a", approverName: "Ada", approverEmail: "ada@x.com", decision: "APPROVED" },
    { approverId: "b", approverName: "Ben", approverEmail: "ben@x.com", decision: "PENDING" },
  ]} />);
  expect(screen.getByTestId("tl-tile-a")).toHaveAttribute("data-decision", "APPROVED");
  expect(screen.getByTestId("tl-tile-b")).toHaveAttribute("data-decision", "PENDING");
});
```

Ensure the file imports `render, screen` from `@testing-library/react` (add if missing).

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test -- approval-timeline`
Expected: FAIL — no `tl-tile-*` testid.

- [ ] **Step 3: Rewrite `approval-timeline.tsx`**

```tsx
import * as React from "react";
import { Badge, cn } from "@manpowerhub/ui";
import type { ApprovalDecision, ApprovalStep } from "./quotation.types";

const DECISION: Record<ApprovalDecision, { variant: "success" | "warning" | "danger"; label: string; tile: string; glyph: string }> = {
  APPROVED: { variant: "success", label: "Approved", tile: "bg-success/15 text-success", glyph: "✓" },
  PENDING:  { variant: "warning", label: "Pending",  tile: "bg-warning/15 text-warning", glyph: "…" },
  REJECTED: { variant: "danger",  label: "Rejected", tile: "bg-destructive/15 text-destructive", glyph: "✕" },
};

export interface ApprovalTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: ApprovalStep[];
}

export const ApprovalTimeline = React.forwardRef<HTMLDivElement, ApprovalTimelineProps>(
  ({ className, steps, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col", className)} {...props}>
      {steps.length === 0 ? (
        <p className="text-sm text-muted-foreground">No approvers assigned.</p>
      ) : (
        <ul className="flex flex-col">
          {steps.map((s) => {
            const d = DECISION[s.decision];
            return (
              <li key={s.approverId} className="flex items-start gap-3 border-t border-border/60 py-3 first:border-t-0">
                <span data-testid={`tl-tile-${s.approverId}`} data-decision={s.decision}
                  className={cn("grid h-8 w-8 flex-none place-items-center rounded-md text-sm", d.tile)}>{d.glyph}</span>
                <div className="flex flex-1 items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{s.approverName}</div>
                    <div className="text-xs text-muted-foreground">{s.approverEmail}</div>
                    {s.comment && <div className="mt-1 text-xs text-fg-2">{s.comment}</div>}
                  </div>
                  <Badge variant={d.variant}>{d.label}</Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  ),
);
ApprovalTimeline.displayName = "ApprovalTimeline";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test -- approval-timeline`
Expected: PASS. If `bg-success`/`bg-warning` are not token utilities, fall back to `bg-accent text-success` — verify the color tokens exist (`grep -n "success\|warning" packages/tokens/src/preset.ts`); if absent, use `text-*` only and keep `bg-accent`.

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotation/approval-timeline.tsx packages/blocks/src/components/quotation/approval-timeline.test.tsx
git commit -m "feat(blocks): restyle approval timeline as Craftly activity rows"
```

---

### Task 5: Detail — Craftly two-column layout

**Files:**
- Modify: `packages/blocks/src/components/quotation/quotation-detail.tsx`
- Test: `packages/blocks/src/components/quotation/quotation-detail.test.tsx` (extend)

**Interfaces:**
- Consumes: `Button`, `Card`, `CardBody`, `CardHeader`, `CardTitle`, `Dialog*`, `Badge`, `cn`; `QuotationStatusPill`; `ApprovalTimeline`; `subtotal`, `otGrandTotal`, `lineTotal`; `PersistedQuotation`, `ApprovalStep`, `QuotationTerms`.
- Produces: `QuotationDetail` — unchanged props (`quotation`, `onEdit`, `onSubmitForApproval`, `onDecide`, `onPrint`, `onBack?`, `onFullView?`, `onDelete?`, `busy?`). Two-column body: left = items table + timeline; right = financial summary + details (date, due date, terms label, notes).

- [ ] **Step 1: Add the failing test**

Append to `quotation-detail.test.tsx`:

```tsx
it("shows financial summary and details sidebar", () => {
  render(<QuotationDetail
    quotation={{
      id: "1", quotationNumber: "QUO-1", quotationDate: "2026-07-10", status: "DRAFT",
      terms: "NET_15", dueDate: "2026-07-25", customerNotes: "Thanks",
      customer: { name: "Nova", address: "Dubai", phoneNumber: "1", emailId: "n@x.com" },
      items: [{ category: "Mason", quantity: "2", rate: "100", otRate: "10" }],
      approvers: [], createdAt: "", updatedAt: "", createdBy: "system",
    }}
    onEdit={vi.fn()} onSubmitForApproval={vi.fn()} onDecide={vi.fn()} onPrint={vi.fn()} />);
  expect(screen.getByText(/financial summary/i)).toBeInTheDocument();
  expect(screen.getByTestId("detail-total")).toHaveTextContent("220.00");
  expect(screen.getByText(/net 15/i)).toBeInTheDocument();
  expect(screen.getByText(/thanks/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-detail`
Expected: FAIL — no "Financial summary" / `detail-total`.

- [ ] **Step 3: Rewrite `quotation-detail.tsx`**

```tsx
import * as React from "react";
import {
  Button, Card, CardBody, CardHeader, CardTitle,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
  cn,
} from "@manpowerhub/ui";
import { QuotationStatusPill } from "./quotation-status-pill";
import { ApprovalTimeline } from "./approval-timeline";
import { subtotal, otGrandTotal, lineTotal } from "./quotation.totals";
import type { ApprovalStep, PersistedQuotation, QuotationTerms } from "./quotation.types";

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TERMS_LABEL: Record<QuotationTerms, string> = {
  DUE_ON_RECEIPT: "Due on Receipt", NET_15: "Net 15", NET_30: "Net 30", NET_45: "Net 45", CUSTOM: "Custom",
};

export interface QuotationDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  quotation: PersistedQuotation;
  onEdit: () => void;
  onSubmitForApproval: () => void;
  onDecide: (approverId: string, decision: "APPROVED" | "REJECTED", comment?: string) => void;
  onPrint: () => void;
  onBack?: () => void;
  onFullView?: () => void;
  onDelete?: () => void;
  busy?: boolean;
}

export const QuotationDetail = React.forwardRef<HTMLDivElement, QuotationDetailProps>(
  ({ className, quotation, onEdit, onSubmitForApproval, onDecide, onPrint, onBack, onFullView, onDelete, busy = false, ...props }, ref) => {
    const q = quotation;
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const nextApprover: ApprovalStep | undefined = q.approvers.find((a) => a.decision === "PENDING");
    const total = subtotal(q.items) + otGrandTotal(q.items);
    return (
      <div ref={ref} className={cn("flex flex-col gap-6", className)} {...props}>
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {onBack && <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>}
              <span className="font-display text-2xl font-semibold text-foreground">{q.quotationNumber}</span>
              <QuotationStatusPill status={q.status} />
            </div>
            <div className="font-display text-lg font-semibold text-foreground">{q.customer.name}</div>
            <div className="text-sm text-muted-foreground">{q.customer.address}</div>
            <div className="text-sm text-muted-foreground">{q.customer.emailId} · {q.customer.phoneNumber}</div>
          </div>
          <div className="flex gap-2">
            {onFullView && <Button variant="secondary" size="sm" onClick={onFullView}>Full view</Button>}
            <Button variant="secondary" size="sm" onClick={onPrint}>Print</Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
            {onDelete && <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>Delete</Button>}
          </div>
        </div>

        {/* two-column body */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader><CardTitle>Items</CardTitle></CardHeader>
              <CardBody>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      <th className="py-2 text-left font-semibold">Item Details</th>
                      <th className="py-2 text-right font-semibold">Qty</th>
                      <th className="py-2 text-right font-semibold">Rate</th>
                      <th className="py-2 text-right font-semibold">OT Rate</th>
                      <th className="py-2 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.items.map((it, i) => (
                      <tr key={i} className="border-t border-border/60">
                        <td className="py-2">{it.category}{it.description && <div className="text-xs text-muted-foreground">{it.description}</div>}</td>
                        <td className="py-2 text-right tabular-nums">{it.quantity}</td>
                        <td className="py-2 text-right tabular-nums">{fmt(Number(it.rate) || 0)}</td>
                        <td className="py-2 text-right tabular-nums">{fmt(Number(it.otRate) || 0)}</td>
                        <td className="py-2 text-right tabular-nums">{fmt(lineTotal(it))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
            <Card>
              <CardHeader><CardTitle>Approval timeline</CardTitle></CardHeader>
              <CardBody><ApprovalTimeline steps={q.approvers} /></CardBody>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card>
              <CardBody>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Financial summary</div>
                <div className="mt-2 font-display text-2xl font-semibold text-foreground" data-testid="detail-total">AED {fmt(total)}</div>
                <div className="mt-3 flex flex-col text-sm">
                  <div className="flex justify-between border-t border-border/60 py-1.5"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">{fmt(subtotal(q.items))}</span></div>
                  <div className="flex justify-between border-t border-border/60 py-1.5"><span className="text-muted-foreground">OT total</span><span className="tabular-nums">{fmt(otGrandTotal(q.items))}</span></div>
                  <div className="flex justify-between border-t border-border/60 py-1.5 font-semibold"><span>Total</span><span className="tabular-nums">{fmt(total)}</span></div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Details</div>
                <div className="mt-2 flex flex-col text-sm">
                  <div className="flex justify-between border-t border-border/60 py-1.5"><span className="text-muted-foreground">Quotation date</span><span>{q.quotationDate}</span></div>
                  {q.dueDate && <div className="flex justify-between border-t border-border/60 py-1.5"><span className="text-muted-foreground">Due date</span><span>{q.dueDate}</span></div>}
                  {q.terms && <div className="flex justify-between border-t border-border/60 py-1.5"><span className="text-muted-foreground">Terms</span><span>{TERMS_LABEL[q.terms]}</span></div>}
                </div>
                {q.customerNotes && (
                  <>
                    <div className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Customer notes</div>
                    <p className="mt-1 text-sm text-muted-foreground">{q.customerNotes}</p>
                  </>
                )}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* action bar */}
        <div className="flex justify-end gap-2">
          {q.status === "DRAFT" && (
            <Button variant="primary" size="sm" disabled={busy} onClick={onSubmitForApproval}>Submit for approval</Button>
          )}
          {q.status === "PENDING_APPROVAL" && nextApprover && (
            <>
              <Button variant="danger" size="sm" disabled={busy} onClick={() => onDecide(nextApprover.approverId, "REJECTED", undefined)}>Reject</Button>
              <Button variant="primary" size="sm" disabled={busy} onClick={() => onDecide(nextApprover.approverId, "APPROVED", undefined)}>Approve</Button>
            </>
          )}
        </div>

        {onDelete && (
          <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete {q.quotationNumber}?</DialogTitle>
                <DialogDescription>This can&rsquo;t be undone.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
                <Button variant="danger" onClick={() => { onDelete(); setConfirmDelete(false); }}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  },
);
QuotationDetail.displayName = "QuotationDetail";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-detail`
Expected: PASS (new + existing detail tests). If an existing test asserted old markup (e.g. "Subtotal:" inline), update it to the new labels.

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation-detail.tsx packages/blocks/src/components/quotation/quotation-detail.test.tsx
git commit -m "feat(blocks): Craftly-style two-column quotation detail"
```

---

### Task 6: List pane — flat Craftly rows

**Files:**
- Modify: `packages/blocks/src/components/quotation/quotation-list-pane.tsx`
- Test: `packages/blocks/src/components/quotation/quotation-list-pane.test.tsx` (extend)

**Interfaces:**
- Consumes: `Button`, `Input`, `cn`; `QuotationStatusPill` (kept for status label text) OR inline dot; `subtotal`; `PersistedQuotation`.
- Produces: `QuotationListPane` — unchanged props (`quotations`, `selectedId?`, `currency?`, `isLoading?`, `onOpen`, `onNew`). Rows are flat (top hairline divider, no gap, no per-row radius), leading `QUO` chip, bold number + amount, status dot + label second line, active row has a left accent bar.

- [ ] **Step 1: Add the failing test**

Append to `quotation-list-pane.test.tsx`:

```tsx
it("renders a flat QUO chip row with amount and status", () => {
  render(<QuotationListPane
    quotations={[{
      id: "1", quotationNumber: "QUO-1", quotationDate: "2026-07-10", status: "DRAFT",
      customer: { name: "Nova", address: "", phoneNumber: "", emailId: "n@x.com" },
      items: [{ category: "Mason", quantity: "2", rate: "100", otRate: "10" }],
      approvers: [], createdAt: "", updatedAt: "", createdBy: "system",
    }]}
    onOpen={vi.fn()} onNew={vi.fn()} />);
  const row = screen.getByRole("button", { name: /open quo-1/i });
  expect(within(row).getByText("QUO")).toBeInTheDocument();
  expect(within(row).getByText(/AED 200/)).toBeInTheDocument();
  expect(within(row).getByText(/draft/i)).toBeInTheDocument();
});
```

Ensure `within` is imported from `@testing-library/react`.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-list-pane`
Expected: FAIL — no "QUO" chip text.

- [ ] **Step 3: Rewrite the list body of `quotation-list-pane.tsx`**

Replace the `<ul>...</ul>` block (and keep everything else — search, loading/empty states, header). New list:

```tsx
const STATUS_DOT: Record<string, { cls: string; label: string }> = {
  DRAFT: { cls: "bg-muted-foreground", label: "Draft" },
  PENDING_APPROVAL: { cls: "bg-warning", label: "Pending approval" },
  APPROVED: { cls: "bg-success", label: "Approved" },
  SENT: { cls: "bg-primary", label: "Sent" },
  REJECTED: { cls: "bg-destructive", label: "Rejected" },
};
```

(put this const above the component), then the list:

```tsx
          <ul className="flex flex-col">
            {visible.map((q) => {
              const active = q.id === selectedId;
              const s = STATUS_DOT[q.status] ?? STATUS_DOT.DRAFT;
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    aria-current={active ? "true" : undefined}
                    aria-label={`Open ${q.quotationNumber}`}
                    onClick={() => onOpen(q.id)}
                    className={cn(
                      "relative flex w-full gap-3 border-t border-border/60 px-1 py-3.5 text-left transition-colors first:border-t-0",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                      active ? "bg-accent" : "hover:bg-accent/60",
                    )}
                  >
                    {active && <span aria-hidden className="absolute -left-4 top-0 bottom-0 w-[3px] bg-primary" />}
                    <span className="h-fit flex-none rounded-sm border border-border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground">QUO</span>
                    <span className="flex min-w-0 flex-1 flex-col gap-2">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate font-mono text-sm text-foreground">{q.quotationNumber}</span>
                        <span className="tabular-nums text-xs font-semibold text-foreground">{currency} {fmt(subtotal(q.items))}</span>
                      </span>
                      <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                        <span className={cn("h-1.5 w-1.5 rounded-full", s.cls)} aria-hidden />
                        {s.label}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
```

Note: the accent bar uses `-left-4` to reach the pane's default `px-4` edge; if the consumer pane has different padding it still reads fine. If `bg-warning`/`bg-success`/`bg-primary` are not utilities, verify via `grep -n "warning\|success" packages/tokens/src/preset.ts` and fall back to `bg-muted-foreground` for all dots (label still distinguishes status).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-list-pane`
Expected: PASS. Keep the existing search/empty/loading tests green (unchanged behavior).

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation-list-pane.tsx packages/blocks/src/components/quotation/quotation-list-pane.test.tsx
git commit -m "feat(blocks): flat Craftly-style quotation list rows"
```

---

### Task 7: Stories refresh + full block verification

**Files:**
- Modify: `packages/blocks/src/components/quotation/quotation.stories.tsx` (ensure new fields visible; add a "Customization" story if missing)
- Verify: `packages/blocks/src/components/quotation/quotation.tsx` (container) — confirm form onSubmit still creates on new / updates on edit; the form now carries `status`, but the mock `create()` forces `DRAFT` and `update()` merges the patch (so `status: "SENT"` from Save and Send is persisted on edit). No code change required unless a test proves otherwise.

**Interfaces:**
- Consumes: everything above.
- Produces: green Storybook build + full blocks test suite green.

- [ ] **Step 1: Update stories**

Open `quotation.stories.tsx`. Ensure the seeded/demo quotation passed to detail/list stories includes `terms`, `dueDate`, `customerNotes`, and an item `description` so the new UI is exercised. If a `Customization` story is absent for the quotation stories, add one that passes a custom `className` to `Quotation` demonstrating token/class override (per contract).

- [ ] **Step 2: Run the full quotation suite**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation`
Expected: PASS across form, detail, list-pane, timeline, mock, totals.

- [ ] **Step 3: Typecheck + lint + build Storybook**

Run: `pnpm -w typecheck && pnpm --filter @manpowerhub/blocks lint && pnpm --filter @manpowerhub/blocks build-storybook`
Expected: all succeed.

- [ ] **Step 4: Visual pass (manual)**

Run the blocks Storybook, open the Quotation stories, and click through form → list → detail. Confirm: Zoho-style form, flat list rows with `QUO` chip + accent bar, two-column Craftly detail, tighter radius everywhere.

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation.stories.tsx
git commit -m "test(blocks): exercise quotation v2 fields in stories"
```

---

## Self-Review

- **Spec coverage:** §1 data model → Task 1. §2 form → Task 3. §3 detail → Task 5. §4 timeline → Task 4. §5 list pane → Task 6. §6 radius → Task 2. Testing/acceptance → each task's steps + Task 7.
- **Placeholder scan:** none — all steps contain concrete code/commands.
- **Type consistency:** `QuotationTerms`, item `category` state key (label "Item details"), `lineTotal`, `subtotal`, `otGrandTotal`, `TERMS_LABEL` used consistently across Tasks 1/3/5/6. Form onSubmit signature unchanged; status conveyed via `data.status`.
- **Risk noted:** color utility names (`bg-warning`/`bg-success`/`bg-primary`) verified-or-fallback inline in Tasks 4 & 6.
