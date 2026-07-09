# DocumentShell + Quotation block — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two `@manpowerhub/blocks` registry entries — a reusable printable **DocumentShell** and a combined **Quotation** block (CRUD list/form/detail + printable document + in-memory mock API).

**Architecture:** Pure presentational sub-components (data in, callbacks out) composed by one API-touching `Quotation` container. The container takes an `api` prop defaulting to a mock (`createMockQuotationApi`). The printable `QuotationDocument` is built on `DocumentShell`. Styling is Tailwind + `@manpowerhub/tokens` utilities; only A4/print geometry lives in a co-located CSS file.

**Tech Stack:** React 18, TypeScript, Tailwind 3 + `@manpowerhub/tokens` preset, `@manpowerhub/ui` primitives (`Card`, `Button`, `Badge`, `Table*`, `Input`, `Field`, `Select*`, `cn`), `class-variance-authority`, Vitest + Testing Library + `vitest-axe`, Storybook 8, tsup.

## Global Constraints

- Component contract (CLAUDE.md): every component forwards `className` via `cn()`, forwards `ref` (`React.forwardRef`), spreads `...props` onto root, exposes visual variants via `cva`, sets `displayName`. Ships `<name>.tsx` + `<name>.stories.tsx` + `<name>.test.tsx` + `index.ts`.
- Stories states: default, dark (`globals: { theme: "dark" }`), relevant states, and a "Customization" story passing `className`.
- Tests use Vitest globals (`vitest.config.ts` `globals: true`) + `vitest-axe` — every component test includes a `has no a11y violations` case and a `forwards className and ref` case.
- Coverage thresholds: lines/functions/branches/statements ≥ 80 (`packages/blocks/vitest.config.ts`).
- Mock API isolation: no `fetch`/network; only `packages/blocks/src/components/quotation/quotation.mock.ts` and `quotation.tsx` know about the API type. Presentational components never fetch.
- Numeric quotation fields stay `string` (schema); parse with `Number()` at compute time, NaN → 0.
- Every block re-exported from `packages/blocks/src/index.ts`.
- Conventional Commits. One task = one commit. Work on branch `feat/document-shell-quote`.
- Token utilities to use (confirmed in preset): `text-foreground`, `text-muted-foreground`, `text-fg-2`, `border-border`, `bg-card`, `bg-success`/`text-success`, `bg-warning`/`text-warning` (with opacity e.g. `bg-warning/10`), `text-primary`, `font-display`/`font-body`/`font-mono`, `shadow-pop`, `rounded-lg`, `tabular-nums`.

---

## File Structure

```
packages/blocks/src/components/
  document-shell/
    document-shell.tsx        # Sheet, DocHeader, PartiesGrid, Party, ItemsTable, Totals, PageNum, DocumentShell
    status-pill.tsx           # StatusPill (wraps Badge)
    document-shell.css        # @page / print / A4 geometry ONLY
    document-shell.stories.tsx
    document-shell.test.tsx
    status-pill.test.tsx
    index.ts
  quotation/
    quotation.types.ts        # domain schema
    quotation.totals.ts       # lineTotal/otTotal/subtotal/otGrandTotal
    quotation.totals.test.ts
    quotation.mock.ts         # QuotationApi + createMockQuotationApi
    quotation.mock.test.ts
    quotation-status-pill.tsx
    quotation-status-pill.test.tsx
    approval-timeline.tsx
    approval-timeline.test.tsx
    quotation-list.tsx
    quotation-list.test.tsx
    quotation-form.tsx
    quotation-form.test.tsx
    quotation-document.tsx
    quotation-document.test.tsx
    quotation-detail.tsx
    quotation-detail.test.tsx
    quotation.tsx             # container (only API-touching piece)
    quotation.test.tsx
    quotation.stories.tsx     # covers list/form/detail/document flows
    index.ts
packages/blocks/src/index.ts  # + 2 exports
```

---

## Task 1: Domain types + totals helper

**Files:**
- Create: `packages/blocks/src/components/quotation/quotation.types.ts`
- Create: `packages/blocks/src/components/quotation/quotation.totals.ts`
- Test: `packages/blocks/src/components/quotation/quotation.totals.test.ts`

**Interfaces:**
- Produces: all domain types (below); `lineTotal(i)`, `otTotal(i)`, `subtotal(items)`, `otGrandTotal(items)` all returning `number`.

- [ ] **Step 1: Write the types file**

`quotation.types.ts`:
```ts
export type QuotationStatus =
  | "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "SENT" | "REJECTED";
export type ApprovalDecision = "PENDING" | "APPROVED" | "REJECTED";

export interface ApprovalStep {
  approverId: string;
  approverName: string;
  approverEmail: string;
  decision: ApprovalDecision;
  comment?: string;
  requestedAt?: string;
  approvedAt?: string;
}

export interface Customer {
  name: string;
  address: string;
  phoneNumber: string;
  emailId: string;
}

export interface QuotationItem {
  category: string;
  quantity: string;
  rate: string;
  otRate: string;
}

export interface QuotationPersistedMeta {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface QuotationAggregateData {
  quotationNumber: string;
  quotationDate: string;
  customer: Customer;
  status: QuotationStatus;
  approvers: ApprovalStep[];
  items: QuotationItem[];
}

export type PersistedQuotation =
  QuotationAggregateData & QuotationPersistedMeta & { id: string };
```

- [ ] **Step 2: Write the failing totals test**

`quotation.totals.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { lineTotal, otTotal, subtotal, otGrandTotal } from "./quotation.totals";
import type { QuotationItem } from "./quotation.types";

const items: QuotationItem[] = [
  { category: "Mason", quantity: "3", rate: "100", otRate: "20" },
  { category: "Helper", quantity: "2", rate: "50", otRate: "10" },
  { category: "Bad", quantity: "x", rate: "y", otRate: "z" },
];

describe("quotation totals", () => {
  it("computes line and OT totals per item", () => {
    expect(lineTotal(items[0]!)).toBe(300);
    expect(otTotal(items[0]!)).toBe(60);
  });
  it("treats unparseable numbers as 0", () => {
    expect(lineTotal(items[2]!)).toBe(0);
    expect(otTotal(items[2]!)).toBe(0);
  });
  it("sums subtotal and OT grand total", () => {
    expect(subtotal(items)).toBe(400);
    expect(otGrandTotal(items)).toBe(80);
  });
});
```

- [ ] **Step 3: Run test — expect FAIL**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation.totals`
Expected: FAIL — cannot find `./quotation.totals`.

- [ ] **Step 4: Write the totals implementation**

`quotation.totals.ts`:
```ts
import type { QuotationItem } from "./quotation.types";

const num = (v: string): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const lineTotal = (i: QuotationItem): number => num(i.quantity) * num(i.rate);
export const otTotal = (i: QuotationItem): number => num(i.quantity) * num(i.otRate);
export const subtotal = (items: QuotationItem[]): number =>
  items.reduce((s, i) => s + lineTotal(i), 0);
export const otGrandTotal = (items: QuotationItem[]): number =>
  items.reduce((s, i) => s + otTotal(i), 0);
```

- [ ] **Step 5: Run test — expect PASS**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation.totals`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation.types.ts \
        packages/blocks/src/components/quotation/quotation.totals.ts \
        packages/blocks/src/components/quotation/quotation.totals.test.ts
git commit -m "feat(blocks): quotation domain types + totals helper"
```

---

## Task 2: Mock API

**Files:**
- Create: `packages/blocks/src/components/quotation/quotation.mock.ts`
- Test: `packages/blocks/src/components/quotation/quotation.mock.test.ts`

**Interfaces:**
- Consumes: types from Task 1.
- Produces: `interface QuotationApi` with `list/get/create/update/remove/submitForApproval/decide`; `createMockQuotationApi(seed?): QuotationApi`; `seedQuotations(): PersistedQuotation[]` (exported fixture factory for stories/tests).

- [ ] **Step 1: Write the failing test**

`quotation.mock.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { createMockQuotationApi } from "./quotation.mock";
import type { QuotationAggregateData } from "./quotation.types";

const draft = (): QuotationAggregateData => ({
  quotationNumber: "",
  quotationDate: "2026-07-09",
  customer: { name: "Acme", address: "Dubai", phoneNumber: "+971", emailId: "a@acme.com" },
  status: "DRAFT",
  items: [{ category: "Mason", quantity: "2", rate: "100", otRate: "20" }],
  approvers: [
    { approverId: "u1", approverName: "Lead", approverEmail: "l@x.com", decision: "PENDING" },
    { approverId: "u2", approverName: "Mgr", approverEmail: "m@x.com", decision: "PENDING" },
  ],
});

describe("createMockQuotationApi", () => {
  it("seeds and lists quotations", async () => {
    const api = createMockQuotationApi();
    expect((await api.list()).length).toBeGreaterThan(0);
  });
  it("creates with id, number, DRAFT status and meta", async () => {
    const api = createMockQuotationApi([]);
    const q = await api.create(draft());
    expect(q.id).toBeTruthy();
    expect(q.quotationNumber).toMatch(/^Q-\d{4}$/);
    expect(q.status).toBe("DRAFT");
    expect(q.createdAt).toBeTruthy();
  });
  it("submitForApproval flips DRAFT to PENDING_APPROVAL and stamps approvers", async () => {
    const api = createMockQuotationApi([]);
    const q = await api.create(draft());
    const s = await api.submitForApproval(q.id);
    expect(s.status).toBe("PENDING_APPROVAL");
    expect(s.approvers[0]!.requestedAt).toBeTruthy();
  });
  it("APPROVED only after all approvers approve", async () => {
    const api = createMockQuotationApi([]);
    const q = await api.submitForApproval((await api.create(draft())).id);
    const one = await api.decide(q.id, "u1", "APPROVED");
    expect(one.status).toBe("PENDING_APPROVAL");
    const all = await api.decide(q.id, "u2", "APPROVED");
    expect(all.status).toBe("APPROVED");
  });
  it("any rejection sets REJECTED", async () => {
    const api = createMockQuotationApi([]);
    const q = await api.submitForApproval((await api.create(draft())).id);
    const r = await api.decide(q.id, "u1", "REJECTED", "too high");
    expect(r.status).toBe("REJECTED");
    expect(r.approvers[0]!.comment).toBe("too high");
  });
  it("update patches and remove deletes", async () => {
    const api = createMockQuotationApi([]);
    const q = await api.create(draft());
    const u = await api.update(q.id, { customer: { ...q.customer, name: "New" } });
    expect(u.customer.name).toBe("New");
    await api.remove(q.id);
    expect(await api.get(q.id)).toBeUndefined();
  });
  it("throws on missing id", async () => {
    const api = createMockQuotationApi([]);
    await expect(api.update("nope", {})).rejects.toThrow();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation.mock`
Expected: FAIL — cannot find `./quotation.mock`.

- [ ] **Step 3: Write the mock implementation**

`quotation.mock.ts`:
```ts
import type {
  ApprovalDecision,
  PersistedQuotation,
  QuotationAggregateData,
} from "./quotation.types";

export interface QuotationApi {
  list(): Promise<PersistedQuotation[]>;
  get(id: string): Promise<PersistedQuotation | undefined>;
  create(data: QuotationAggregateData): Promise<PersistedQuotation>;
  update(id: string, patch: Partial<QuotationAggregateData>): Promise<PersistedQuotation>;
  remove(id: string): Promise<void>;
  submitForApproval(id: string): Promise<PersistedQuotation>;
  decide(
    id: string,
    approverId: string,
    decision: "APPROVED" | "REJECTED",
    comment?: string,
  ): Promise<PersistedQuotation>;
}

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));
const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function seedQuotations(): PersistedQuotation[] {
  const now = new Date().toISOString();
  return [
    {
      id: uid(),
      quotationNumber: "Q-1001",
      quotationDate: "2026-07-01",
      status: "DRAFT",
      customer: { name: "Northwind Labs", address: "Mumbai 400013, India", phoneNumber: "+91 22 555 0100", emailId: "priya@northwind.io" },
      items: [
        { category: "Site Engineer", quantity: "2", rate: "1200", otRate: "180" },
        { category: "Mason", quantity: "6", rate: "400", otRate: "60" },
      ],
      approvers: [
        { approverId: "u1", approverName: "Lena Marchetti", approverEmail: "lena@studio.com", decision: "PENDING" },
      ],
      createdAt: now, updatedAt: now, createdBy: "system",
    },
    {
      id: uid(),
      quotationNumber: "Q-1002",
      quotationDate: "2026-07-03",
      status: "PENDING_APPROVAL",
      customer: { name: "Phoenix Mills", address: "Lower Parel, Mumbai", phoneNumber: "+91 22 555 0200", emailId: "ops@phoenix.io" },
      items: [{ category: "Scaffolder", quantity: "4", rate: "500", otRate: "75" }],
      approvers: [
        { approverId: "u1", approverName: "Lena Marchetti", approverEmail: "lena@studio.com", decision: "APPROVED", requestedAt: now, approvedAt: now },
        { approverId: "u2", approverName: "Sam Ali", approverEmail: "sam@studio.com", decision: "PENDING", requestedAt: now },
      ],
      createdAt: now, updatedAt: now, createdBy: "system",
    },
  ];
}

export function createMockQuotationApi(seed: PersistedQuotation[] = seedQuotations()): QuotationApi {
  const store = new Map<string, PersistedQuotation>(seed.map((q) => [q.id, q]));
  let counter = 1002 + seed.length;

  const require_ = (id: string): PersistedQuotation => {
    const q = store.get(id);
    if (!q) throw new Error(`Quotation not found: ${id}`);
    return q;
  };
  const touch = (q: PersistedQuotation): PersistedQuotation => {
    const next = { ...q, updatedAt: new Date().toISOString() };
    store.set(q.id, next);
    return next;
  };

  return {
    async list() { await delay(); return [...store.values()]; },
    async get(id) { await delay(); return store.get(id); },
    async create(data) {
      await delay();
      const now = new Date().toISOString();
      counter += 1;
      const q: PersistedQuotation = {
        ...data,
        id: uid(),
        quotationNumber: data.quotationNumber || `Q-${counter}`,
        status: "DRAFT",
        createdAt: now, updatedAt: now, createdBy: "system",
      };
      store.set(q.id, q);
      return q;
    },
    async update(id, patch) {
      await delay();
      return touch({ ...require_(id), ...patch });
    },
    async remove(id) { await delay(); require_(id); store.delete(id); },
    async submitForApproval(id) {
      await delay();
      const q = require_(id);
      const now = new Date().toISOString();
      return touch({
        ...q,
        status: "PENDING_APPROVAL",
        approvers: q.approvers.map((a) => ({ ...a, decision: "PENDING" as ApprovalDecision, requestedAt: now })),
      });
    },
    async decide(id, approverId, decision, comment) {
      await delay();
      const q = require_(id);
      const now = new Date().toISOString();
      const approvers = q.approvers.map((a) =>
        a.approverId === approverId
          ? { ...a, decision, comment, approvedAt: now }
          : a,
      );
      const status = approvers.some((a) => a.decision === "REJECTED")
        ? "REJECTED"
        : approvers.every((a) => a.decision === "APPROVED")
          ? "APPROVED"
          : "PENDING_APPROVAL";
      return touch({ ...q, approvers, status });
    },
  };
}
```

- [ ] **Step 4: Run test — expect PASS**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation.mock`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation.mock.ts \
        packages/blocks/src/components/quotation/quotation.mock.test.ts
git commit -m "feat(blocks): in-memory mock quotation API with approval workflow"
```

---

## Task 3: DocumentShell + StatusPill + print CSS

**Files:**
- Create: `packages/blocks/src/components/document-shell/document-shell.tsx`
- Create: `packages/blocks/src/components/document-shell/status-pill.tsx`
- Create: `packages/blocks/src/components/document-shell/document-shell.css`
- Create: `packages/blocks/src/components/document-shell/index.ts`
- Test: `packages/blocks/src/components/document-shell/document-shell.test.tsx`
- Test: `packages/blocks/src/components/document-shell/status-pill.test.tsx`
- Create: `packages/blocks/src/components/document-shell/document-shell.stories.tsx`

**Interfaces:**
- Consumes: `Badge`, `cn` from `@manpowerhub/ui`.
- Produces:
  - `StatusPill` props `{ variant?: "default"|"accent"|"success"|"warn"|"outline"; dot?: boolean } & span props`.
  - `Party` type `{ label: string; name: React.ReactNode; lines?: React.ReactNode }`.
  - `DocumentShell` props (see code). Named exports: `Sheet`, `DocHeader`, `PartiesGrid`, `Party` (component), `ItemsTable`, `ItemsTableProps`, `Totals`, `PageNum`, `StatusPill`, `DocumentShell`, `sheetVariants`.

- [ ] **Step 1: Write the failing StatusPill test**

`status-pill.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { StatusPill } from "./status-pill";

describe("StatusPill", () => {
  it("renders its label", () => {
    render(<StatusPill variant="success">Approved</StatusPill>);
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });
  it("forwards className and ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    const { container } = render(<StatusPill ref={ref} className="px">Draft</StatusPill>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<StatusPill variant="warn" dot>Pending</StatusPill>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `pnpm --filter @manpowerhub/blocks test -- status-pill`
Expected: FAIL — cannot find `./status-pill`.

- [ ] **Step 3: Write StatusPill**

`status-pill.tsx`:
```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge, cn } from "@manpowerhub/ui";

// Maps document status semantics onto the primitive Badge variants.
const pillVariants = cva("", {
  variants: {
    variant: {
      default: "outline",
      accent: "accent",
      success: "success",
      warn: "warning",
      outline: "outline",
    },
  },
  defaultVariants: { variant: "default" },
});

type BadgeVariant = "outline" | "accent" | "success" | "warning";
const toBadge: Record<string, BadgeVariant> = {
  default: "outline", accent: "accent", success: "success", warn: "warning", outline: "outline",
};

export interface StatusPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {
  dot?: boolean;
}

export const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ className, variant, dot = false, children, ...props }, ref) => (
    <Badge
      ref={ref}
      variant={toBadge[variant ?? "default"]}
      dot={dot}
      className={cn("font-mono text-[10px] uppercase tracking-wide", className)}
      {...props}
    >
      {children}
    </Badge>
  ),
);
StatusPill.displayName = "StatusPill";
```

- [ ] **Step 4: Run test — expect PASS**

Run: `pnpm --filter @manpowerhub/blocks test -- status-pill`
Expected: PASS.

- [ ] **Step 5: Write the print CSS**

`document-shell.css`:
```css
/* Print/A4 geometry only. Colors/type come from Tailwind + tokens. */
.mph-sheet {
  width: 800px;
  min-height: 1130px;
}
@media print {
  body { background: #fff; }
  .mph-sheet { box-shadow: none !important; page-break-after: always; }
  .mph-sheet:last-child { page-break-after: auto; }
}
@page { size: A4; margin: 0; }
```

- [ ] **Step 6: Write the failing DocumentShell test**

`document-shell.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { DocumentShell, ItemsTable, Totals, StatusPill } from "./document-shell";

const base = {
  type: "Quotation",
  id: "Q-1001",
  brand: { name: "Studio Marchetti", contact: ["lena@studio.com"] },
  parties: [
    { label: "Prepared for", name: "Northwind Labs", lines: "Mumbai" },
    { label: "Details", name: "Q-1001", lines: "2026-07-01" },
  ],
  status: <StatusPill variant="warn">Pending</StatusPill>,
};

describe("DocumentShell", () => {
  it("renders type, id, brand, parties and children", () => {
    render(<DocumentShell {...base}><p>body</p></DocumentShell>);
    expect(screen.getByText("Quotation")).toBeInTheDocument();
    expect(screen.getByText("Studio Marchetti")).toBeInTheDocument();
    expect(screen.getByText("Prepared for")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });
  it("renders a default brandmark from the first letter", () => {
    render(<DocumentShell {...base}><p>x</p></DocumentShell>);
    expect(screen.getByText("S")).toBeInTheDocument();
  });
  it("forwards className and ref to the sheet", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<DocumentShell ref={ref} className="px" {...base}><p>x</p></DocumentShell>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("ItemsTable renders columns and rows", () => {
    render(
      <ItemsTable
        columns={[{ key: "a", header: "Scope" }, { key: "b", header: "Qty", align: "right" }]}
        rows={[{ a: "Design", b: "1" }]}
      />,
    );
    expect(screen.getByText("Scope")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
  });
  it("Totals renders labelled rows", () => {
    render(<Totals rows={[{ label: "Subtotal", value: "400.00" }, { label: "Total", value: "400.00", strong: true }]} />);
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getAllByText("400.00").length).toBe(2);
  });
  it("has no a11y violations", async () => {
    const { container } = render(<DocumentShell {...base}><p>x</p></DocumentShell>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 7: Run test — expect FAIL**

Run: `pnpm --filter @manpowerhub/blocks test -- document-shell`
Expected: FAIL — cannot find `./document-shell`.

- [ ] **Step 8: Write DocumentShell**

`document-shell.tsx`:
```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@manpowerhub/ui";
import "./document-shell.css";

export { StatusPill } from "./status-pill";
export type { StatusPillProps } from "./status-pill";

export const sheetVariants = cva(
  "mph-sheet relative mx-auto bg-card px-16 pb-20 pt-14 font-body text-foreground shadow-pop",
  {
    variants: {
      brandStyle: {
        default: "",
        mono: "",     // styled with Invoice
        branded: "",
        serif: "",
      },
    },
    defaultVariants: { brandStyle: "default" },
  },
);

export const Sheet = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof sheetVariants>
>(({ className, brandStyle, ...props }, ref) => (
  <div ref={ref} className={cn(sheetVariants({ brandStyle }), className)} {...props} />
));
Sheet.displayName = "Sheet";

export interface Party {
  label: string;
  name: React.ReactNode;
  lines?: React.ReactNode;
}

export interface BrandBlock {
  name: string;
  mark?: React.ReactNode;
  trn?: string;
  contact?: string[];
  preparedBy?: string;
}

export const DocHeader = ({
  type, id, idSuffix, status, brand,
}: { type: string; id: string; idSuffix?: string; status?: React.ReactNode; brand: BrandBlock }) => (
  <header className="mb-8 flex items-start justify-between gap-6">
    <div className="flex items-start gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-foreground font-display text-lg font-bold text-background">
        {brand.mark ?? brand.name.charAt(0)}
      </div>
      <div>
        <div className="font-display font-semibold text-foreground">{brand.name}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {brand.preparedBy && <div>{brand.preparedBy}</div>}
          {brand.contact?.map((c) => <div key={c}>{c}</div>)}
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-display text-3xl font-semibold tracking-tight text-foreground">{type}</div>
      <div className="font-mono text-xs text-muted-foreground">
        {id}{idSuffix ? ` ${idSuffix}` : ""}
      </div>
      {status && <div className="mt-3 flex justify-end">{status}</div>}
    </div>
  </header>
);

export const Party = ({ label, name, lines }: Party) => (
  <div>
    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="mt-1 font-medium text-foreground">{name}</div>
    {lines && <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{lines}</div>}
  </div>
);

export const PartiesGrid = ({ parties }: { parties: Party[] }) => (
  <div
    className="mb-8 grid gap-8 border-t border-border pt-6"
    style={{ gridTemplateColumns: `repeat(${Math.min(parties.length, 3)}, minmax(0, 1fr))` }}
  >
    {parties.map((p) => <Party key={p.label} {...p} />)}
  </div>
);

export interface ItemColumn {
  key: string;
  header: string;
  align?: "left" | "right";
}
export interface ItemsTableProps extends React.HTMLAttributes<HTMLTableElement> {
  columns: ItemColumn[];
  rows: Array<Record<string, React.ReactNode>>;
}
export const ItemsTable = React.forwardRef<HTMLTableElement, ItemsTableProps>(
  ({ className, columns, rows, ...props }, ref) => (
    <table ref={ref} className={cn("mb-6 w-full border-collapse text-sm", className)} {...props}>
      <thead>
        <tr className="border-b border-border">
          {columns.map((c) => (
            <th key={c.key} className={cn("py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", c.align === "right" ? "text-right" : "text-left")}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-border/60">
            {columns.map((c) => (
              <td key={c.key} className={cn("py-3 align-top text-foreground", c.align === "right" ? "text-right tabular-nums" : "text-left")}>
                {row[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
);
ItemsTable.displayName = "ItemsTable";

export interface TotalsRow { label: string; value: React.ReactNode; strong?: boolean }
export const Totals = ({ rows, className }: { rows: TotalsRow[]; className?: string }) => (
  <div className={cn("ml-auto w-72", className)}>
    {rows.map((r) => (
      <div
        key={r.label}
        className={cn(
          "flex justify-between py-1 text-sm",
          r.strong ? "mt-1 border-t border-border pt-2 font-semibold text-foreground" : "text-muted-foreground",
        )}
      >
        <span>{r.label}</span>
        <span className="tabular-nums">{r.value}</span>
      </div>
    ))}
  </div>
);

export const PageNum = ({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) => (
  <div className="absolute inset-x-16 bottom-8 flex justify-between text-[10px] text-muted-foreground">
    <span>{left}</span>
    <span>{right}</span>
  </div>
);

export interface DocumentShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {
  type: string;
  id: string;
  idSuffix?: string;
  status?: React.ReactNode;
  brand: BrandBlock;
  parties: Party[];
  footer?: React.ReactNode;
  pageLabel?: string;
}

export const DocumentShell = React.forwardRef<HTMLDivElement, DocumentShellProps>(
  ({ className, brandStyle, type, id, idSuffix, status, brand, parties, footer, pageLabel = "Page 1 of 1", children, ...props }, ref) => (
    <Sheet ref={ref} brandStyle={brandStyle} className={className} {...props}>
      <DocHeader type={type} id={id} idSuffix={idSuffix} status={status} brand={brand} />
      <PartiesGrid parties={parties} />
      {children}
      {footer && <div className="mt-8 border-t border-border pt-6">{footer}</div>}
      <PageNum
        left={[brand.name, brand.trn].filter(Boolean).join(" · ")}
        right={pageLabel}
      />
    </Sheet>
  ),
);
DocumentShell.displayName = "DocumentShell";
```

- [ ] **Step 9: Run test — expect PASS**

Run: `pnpm --filter @manpowerhub/blocks test -- document-shell`
Expected: PASS (6 tests).

- [ ] **Step 10: Write index + stories**

`index.ts`:
```ts
export * from "./document-shell";
export * from "./status-pill";
```

`document-shell.stories.tsx`:
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { DocumentShell, ItemsTable, Totals, StatusPill } from "./document-shell";

const args = {
  type: "Quotation",
  id: "Q-1001",
  brand: { name: "Studio Marchetti", contact: ["lena@studio.com", "+971 50 482 9311"], trn: "100000000000003" },
  status: <StatusPill variant="warn" dot>Pending approval</StatusPill>,
  parties: [
    { label: "Prepared for", name: "Northwind Labs", lines: "Mumbai 400013, India" },
    { label: "Project", name: "Landing v3", lines: "Start 02 Jun 2026" },
    { label: "Details", name: "Q-1001", lines: "Issued 01 Jul 2026" },
  ],
  children: (
    <>
      <ItemsTable
        columns={[
          { key: "scope", header: "Scope" },
          { key: "qty", header: "Qty", align: "right" },
          { key: "amt", header: "Amount", align: "right" },
        ]}
        rows={[{ scope: "Discovery workshop", qty: "1", amt: "1,400.00" }]}
      />
      <Totals rows={[{ label: "Subtotal", value: "1,400.00" }, { label: "Total AED", value: "1,400.00", strong: true }]} />
    </>
  ),
};

const meta: Meta<typeof DocumentShell> = { title: "Blocks/DocumentShell", component: DocumentShell };
export default meta;
type Story = StoryObj<typeof DocumentShell>;

export const Default: Story = { args };
export const Dark: Story = { args, globals: { theme: "dark" } };
export const Customization: Story = { args: { ...args, className: "shadow-none" } };
```

- [ ] **Step 11: Run full block test + typecheck**

Run: `pnpm --filter @manpowerhub/blocks test && pnpm --filter @manpowerhub/blocks exec tsc --noEmit`
Expected: PASS, no type errors.

- [ ] **Step 12: Commit**

```bash
git add packages/blocks/src/components/document-shell/
git commit -m "feat(blocks): DocumentShell printable shell + StatusPill"
```

---

## Task 4: QuotationStatusPill + ApprovalTimeline

**Files:**
- Create: `packages/blocks/src/components/quotation/quotation-status-pill.tsx`
- Test: `packages/blocks/src/components/quotation/quotation-status-pill.test.tsx`
- Create: `packages/blocks/src/components/quotation/approval-timeline.tsx`
- Test: `packages/blocks/src/components/quotation/approval-timeline.test.tsx`

**Interfaces:**
- Consumes: `StatusPill` from `../document-shell`; types from Task 1.
- Produces: `QuotationStatusPill` props `{ status: QuotationStatus } & span props`; `ApprovalTimeline` props `{ steps: ApprovalStep[] } & div props`.

- [ ] **Step 1: Write the failing QuotationStatusPill test**

`quotation-status-pill.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { QuotationStatusPill } from "./quotation-status-pill";

describe("QuotationStatusPill", () => {
  it("labels each status", () => {
    const { rerender } = render(<QuotationStatusPill status="DRAFT" />);
    expect(screen.getByText("Draft")).toBeInTheDocument();
    rerender(<QuotationStatusPill status="PENDING_APPROVAL" />);
    expect(screen.getByText("Pending approval")).toBeInTheDocument();
    rerender(<QuotationStatusPill status="APPROVED" />);
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });
  it("forwards className and ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    const { container } = render(<QuotationStatusPill ref={ref} className="px" status="SENT" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<QuotationStatusPill status="REJECTED" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-status-pill`
Expected: FAIL.

- [ ] **Step 3: Write QuotationStatusPill**

`quotation-status-pill.tsx`:
```tsx
import * as React from "react";
import { StatusPill, type StatusPillProps } from "../document-shell";
import type { QuotationStatus } from "./quotation.types";

const MAP: Record<QuotationStatus, { variant: StatusPillProps["variant"]; label: string; dot?: boolean }> = {
  DRAFT: { variant: "default", label: "Draft" },
  PENDING_APPROVAL: { variant: "warn", label: "Pending approval", dot: true },
  APPROVED: { variant: "success", label: "Approved" },
  SENT: { variant: "accent", label: "Sent" },
  REJECTED: { variant: "outline", label: "Rejected" },
};

export interface QuotationStatusPillProps extends Omit<StatusPillProps, "variant" | "children"> {
  status: QuotationStatus;
}

export const QuotationStatusPill = React.forwardRef<HTMLSpanElement, QuotationStatusPillProps>(
  ({ status, ...props }, ref) => {
    const m = MAP[status];
    return <StatusPill ref={ref} variant={m.variant} dot={m.dot} {...props}>{m.label}</StatusPill>;
  },
);
QuotationStatusPill.displayName = "QuotationStatusPill";
```

- [ ] **Step 4: Run test — expect PASS**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-status-pill`
Expected: PASS.

- [ ] **Step 5: Write the failing ApprovalTimeline test**

`approval-timeline.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { ApprovalTimeline } from "./approval-timeline";
import type { ApprovalStep } from "./quotation.types";

const steps: ApprovalStep[] = [
  { approverId: "u1", approverName: "Lena", approverEmail: "l@x.com", decision: "APPROVED", comment: "ok" },
  { approverId: "u2", approverName: "Sam", approverEmail: "s@x.com", decision: "PENDING" },
];

describe("ApprovalTimeline", () => {
  it("renders each approver and decision", () => {
    render(<ApprovalTimeline steps={steps} />);
    expect(screen.getByText("Lena")).toBeInTheDocument();
    expect(screen.getByText("ok")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
  it("renders an empty state when no approvers", () => {
    render(<ApprovalTimeline steps={[]} />);
    expect(screen.getByText(/no approvers/i)).toBeInTheDocument();
  });
  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<ApprovalTimeline ref={ref} className="px" steps={steps} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<ApprovalTimeline steps={steps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 6: Run test — expect FAIL**

Run: `pnpm --filter @manpowerhub/blocks test -- approval-timeline`
Expected: FAIL.

- [ ] **Step 7: Write ApprovalTimeline**

`approval-timeline.tsx`:
```tsx
import * as React from "react";
import { Badge, cn } from "@manpowerhub/ui";
import type { ApprovalDecision, ApprovalStep } from "./quotation.types";

const DECISION: Record<ApprovalDecision, { variant: "success" | "warning" | "danger"; label: string }> = {
  APPROVED: { variant: "success", label: "Approved" },
  PENDING: { variant: "warning", label: "Pending" },
  REJECTED: { variant: "danger", label: "Rejected" },
};

export interface ApprovalTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: ApprovalStep[];
}

export const ApprovalTimeline = React.forwardRef<HTMLDivElement, ApprovalTimelineProps>(
  ({ className, steps, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-3", className)} {...props}>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Approvals</div>
      {steps.length === 0 ? (
        <p className="text-sm text-muted-foreground">No approvers assigned.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {steps.map((s) => {
            const d = DECISION[s.decision];
            return (
              <li key={s.approverId} className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0">
                <div>
                  <div className="text-sm font-medium text-foreground">{s.approverName}</div>
                  <div className="text-xs text-muted-foreground">{s.approverEmail}</div>
                  {s.comment && <div className="mt-1 text-xs text-fg-2">{s.comment}</div>}
                </div>
                <Badge variant={d.variant}>{d.label}</Badge>
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

- [ ] **Step 8: Run test — expect PASS**

Run: `pnpm --filter @manpowerhub/blocks test -- approval-timeline`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation-status-pill.tsx \
        packages/blocks/src/components/quotation/quotation-status-pill.test.tsx \
        packages/blocks/src/components/quotation/approval-timeline.tsx \
        packages/blocks/src/components/quotation/approval-timeline.test.tsx
git commit -m "feat(blocks): QuotationStatusPill + ApprovalTimeline"
```

---

## Task 5: QuotationList

**Files:**
- Create: `packages/blocks/src/components/quotation/quotation-list.tsx`
- Test: `packages/blocks/src/components/quotation/quotation-list.test.tsx`

**Interfaces:**
- Consumes: `Table*`, `Button`, `cn` from `@manpowerhub/ui`; `QuotationStatusPill`; `seedQuotations` (test fixtures); types.
- Produces: `QuotationList` props `{ quotations: PersistedQuotation[]; onOpen(id: string): void; onNew(): void; isLoading?: boolean } & div props`.

- [ ] **Step 1: Write the failing test**

`quotation-list.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { QuotationList } from "./quotation-list";
import { seedQuotations } from "./quotation.mock";

const data = seedQuotations();

describe("QuotationList", () => {
  it("renders a row per quotation with number, customer and status", () => {
    render(<QuotationList quotations={data} onOpen={vi.fn()} onNew={vi.fn()} />);
    expect(screen.getByText("Q-1001")).toBeInTheDocument();
    expect(screen.getByText("Northwind Labs")).toBeInTheDocument();
    expect(screen.getByText("Pending approval")).toBeInTheDocument();
  });
  it("fires onOpen with the id when a row is clicked", async () => {
    const onOpen = vi.fn();
    render(<QuotationList quotations={data} onOpen={onOpen} onNew={vi.fn()} />);
    await userEvent.click(screen.getByText("Q-1001"));
    expect(onOpen).toHaveBeenCalledWith(data[0]!.id);
  });
  it("fires onNew", async () => {
    const onNew = vi.fn();
    render(<QuotationList quotations={data} onOpen={vi.fn()} onNew={onNew} />);
    await userEvent.click(screen.getByRole("button", { name: /new quotation/i }));
    expect(onNew).toHaveBeenCalledOnce();
  });
  it("shows loading and empty states", () => {
    const { rerender } = render(<QuotationList quotations={[]} onOpen={vi.fn()} onNew={vi.fn()} isLoading />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    rerender(<QuotationList quotations={[]} onOpen={vi.fn()} onNew={vi.fn()} />);
    expect(screen.getByText(/no quotations/i)).toBeInTheDocument();
  });
  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<QuotationList ref={ref} className="px" quotations={data} onOpen={vi.fn()} onNew={vi.fn()} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<QuotationList quotations={data} onOpen={vi.fn()} onNew={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-list`
Expected: FAIL.

- [ ] **Step 3: Write QuotationList**

`quotation-list.tsx`:
```tsx
import * as React from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, cn } from "@manpowerhub/ui";
import { QuotationStatusPill } from "./quotation-status-pill";
import type { PersistedQuotation } from "./quotation.types";

export interface QuotationListProps extends React.HTMLAttributes<HTMLDivElement> {
  quotations: PersistedQuotation[];
  onOpen: (id: string) => void;
  onNew: () => void;
  isLoading?: boolean;
}

export const QuotationList = React.forwardRef<HTMLDivElement, QuotationListProps>(
  ({ className, quotations, onOpen, onNew, isLoading = false, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-foreground">Quotations</h2>
        <Button variant="primary" size="sm" onClick={onNew}>New quotation</Button>
      </div>
      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
      ) : quotations.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No quotations yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotations.map((q) => (
              <TableRow
                key={q.id}
                className="cursor-pointer"
                onClick={() => onOpen(q.id)}
                tabIndex={0}
                role="button"
                aria-label={`Open ${q.quotationNumber}`}
                onKeyDown={(e) => { if (e.key === "Enter") onOpen(q.id); }}
              >
                <TableCell className="font-mono">{q.quotationNumber}</TableCell>
                <TableCell>{q.customer.name}</TableCell>
                <TableCell className="tabular-nums">{q.quotationDate}</TableCell>
                <TableCell className="tabular-nums">{q.items.length}</TableCell>
                <TableCell><QuotationStatusPill status={q.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  ),
);
QuotationList.displayName = "QuotationList";
```

- [ ] **Step 4: Run test — expect PASS**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-list`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation-list.tsx \
        packages/blocks/src/components/quotation/quotation-list.test.tsx
git commit -m "feat(blocks): QuotationList table view"
```

---

## Task 6: QuotationForm

**Files:**
- Create: `packages/blocks/src/components/quotation/quotation-form.tsx`
- Test: `packages/blocks/src/components/quotation/quotation-form.test.tsx`

**Interfaces:**
- Consumes: `Input`, `Field`, `Button`, `cn` from `@manpowerhub/ui`; types.
- Produces: `QuotationForm` props `{ initial?: QuotationAggregateData; onSubmit(data: QuotationAggregateData): void; onCancel(): void; submitting?: boolean } & Omit<form props,"onSubmit">`.

- [ ] **Step 1: Write the failing test**

`quotation-form.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { QuotationForm } from "./quotation-form";

describe("QuotationForm", () => {
  it("submits entered customer + item data", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/email/i), "a@acme.com");
    await userEvent.type(screen.getByLabelText(/category/i), "Mason");
    await userEvent.type(screen.getByLabelText(/^quantity/i), "2");
    await userEvent.type(screen.getByLabelText(/^rate/i), "100");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
    const data = onSubmit.mock.calls[0]![0];
    expect(data.customer.name).toBe("Acme");
    expect(data.items[0].category).toBe("Mason");
  });
  it("blocks submit when required fields are missing", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/customer name is required/i)).toBeInTheDocument();
  });
  it("adds and removes item rows", async () => {
    render(<QuotationForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /add item/i }));
    expect(screen.getAllByLabelText(/category/i).length).toBe(2);
  });
  it("prefills from initial", () => {
    render(
      <QuotationForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        initial={{
          quotationNumber: "Q-1", quotationDate: "2026-07-09", status: "DRAFT",
          customer: { name: "Existing", address: "", phoneNumber: "", emailId: "e@e.com" },
          items: [{ category: "Helper", quantity: "1", rate: "50", otRate: "5" }],
          approvers: [],
        }}
      />,
    );
    expect(screen.getByDisplayValue("Existing")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Helper")).toBeInTheDocument();
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

- [ ] **Step 2: Run test — expect FAIL**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-form`
Expected: FAIL.

- [ ] **Step 3: Write QuotationForm**

`quotation-form.tsx`:
```tsx
import * as React from "react";
import { Button, Field, Input, cn } from "@manpowerhub/ui";
import type { Customer, QuotationAggregateData, QuotationItem } from "./quotation.types";

const emptyItem = (): QuotationItem => ({ category: "", quantity: "", rate: "", otRate: "" });
const emptyCustomer = (): Customer => ({ name: "", address: "", phoneNumber: "", emailId: "" });

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
    const [error, setError] = React.useState<string | null>(null);

    const setItem = (i: number, key: keyof QuotationItem, v: string) =>
      setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!customer.name.trim()) return setError("Customer name is required.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.emailId)) return setError("A valid customer email is required.");
      if (!items.some((it) => it.category.trim())) return setError("At least one item is required.");
      setError(null);
      onSubmit({
        quotationNumber: initial?.quotationNumber ?? "",
        quotationDate: date,
        customer,
        status: initial?.status ?? "DRAFT",
        approvers: initial?.approvers ?? [],
        items: items.filter((it) => it.category.trim()),
      });
    };

    return (
      <form ref={ref} className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <Field label="Customer name" htmlFor="cust-name">
            <Input id="cust-name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} /></Field>
          <Field label="Email" htmlFor="cust-email">
            <Input id="cust-email" type="email" value={customer.emailId} onChange={(e) => setCustomer({ ...customer, emailId: e.target.value })} /></Field>
          <Field label="Phone number" htmlFor="cust-phone">
            <Input id="cust-phone" value={customer.phoneNumber} onChange={(e) => setCustomer({ ...customer, phoneNumber: e.target.value })} /></Field>
          <Field label="Address" htmlFor="cust-addr">
            <Input id="cust-addr" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} /></Field>
          <Field label="Quotation date" htmlFor="q-date">
            <Input id="q-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        </fieldset>

        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Items</div>
          {items.map((it, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]">
              <Field label="Category" htmlFor={`cat-${i}`}>
                <Input id={`cat-${i}`} value={it.category} onChange={(e) => setItem(i, "category", e.target.value)} /></Field>
              <Field label="Quantity" htmlFor={`qty-${i}`}>
                <Input id={`qty-${i}`} inputMode="numeric" value={it.quantity} onChange={(e) => setItem(i, "quantity", e.target.value)} /></Field>
              <Field label="Rate" htmlFor={`rate-${i}`}>
                <Input id={`rate-${i}`} inputMode="numeric" value={it.rate} onChange={(e) => setItem(i, "rate", e.target.value)} /></Field>
              <Field label="OT rate" htmlFor={`ot-${i}`}>
                <Input id={`ot-${i}`} inputMode="numeric" value={it.otRate} onChange={(e) => setItem(i, "otRate", e.target.value)} /></Field>
              <Button type="button" variant="ghost" size="sm" className="self-end"
                aria-label={`Remove item ${i + 1}`}
                onClick={() => setItems((prev) => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev)}>✕</Button>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" className="self-start" onClick={() => setItems((p) => [...p, emptyItem()])}>Add item</Button>
        </div>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={submitting}>{submitting ? "Saving…" : "Save quotation"}</Button>
        </div>
      </form>
    );
  },
);
QuotationForm.displayName = "QuotationForm";
```

- [ ] **Step 4: Run test — expect PASS**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-form`
Expected: PASS (7 tests). If `Field` does not render its child `<label>` htmlFor association, adjust labels to wrap inputs; verify `Field` API in `packages/ui/src/components/input/input.tsx` first.

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation-form.tsx \
        packages/blocks/src/components/quotation/quotation-form.test.tsx
git commit -m "feat(blocks): QuotationForm create/edit form"
```

---

## Task 7: QuotationDocument

**Files:**
- Create: `packages/blocks/src/components/quotation/quotation-document.tsx`
- Test: `packages/blocks/src/components/quotation/quotation-document.test.tsx`

**Interfaces:**
- Consumes: `DocumentShell`, `ItemsTable`, `Totals` from `../document-shell`; `QuotationStatusPill`, `ApprovalTimeline`; `lineTotal`, `subtotal`, `otGrandTotal`; types.
- Produces: `QuotationDocument` props `{ quotation: PersistedQuotation; brand?: BrandBlock } & div props`.

- [ ] **Step 1: Write the failing test**

`quotation-document.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { QuotationDocument } from "./quotation-document";
import { seedQuotations } from "./quotation.mock";

const q = seedQuotations()[0]!;

describe("QuotationDocument", () => {
  it("renders as a Quotation document with the customer and items", () => {
    render(<QuotationDocument quotation={q} />);
    expect(screen.getByText("Quotation")).toBeInTheDocument();
    expect(screen.getByText(q.quotationNumber)).toBeInTheDocument();
    expect(screen.getByText("Northwind Labs")).toBeInTheDocument();
    expect(screen.getByText("Site Engineer")).toBeInTheDocument();
  });
  it("shows the computed subtotal (2*1200 + 6*400 = 4800)", () => {
    render(<QuotationDocument quotation={q} />);
    expect(screen.getByText("4,800.00")).toBeInTheDocument();
  });
  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<QuotationDocument ref={ref} className="px" quotation={q} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<QuotationDocument quotation={q} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-document`
Expected: FAIL.

- [ ] **Step 3: Write QuotationDocument**

`quotation-document.tsx`:
```tsx
import * as React from "react";
import { DocumentShell, ItemsTable, Totals, type BrandBlock } from "../document-shell";
import { QuotationStatusPill } from "./quotation-status-pill";
import { ApprovalTimeline } from "./approval-timeline";
import { lineTotal, subtotal, otGrandTotal } from "./quotation.totals";
import type { PersistedQuotation } from "./quotation.types";

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const DEFAULT_BRAND: BrandBlock = {
  name: "Studio Marchetti",
  contact: ["lena@studiomarchetti.com", "+971 50 482 9311"],
  trn: "100000000000003",
};

export interface QuotationDocumentProps extends React.HTMLAttributes<HTMLDivElement> {
  quotation: PersistedQuotation;
  brand?: BrandBlock;
}

export const QuotationDocument = React.forwardRef<HTMLDivElement, QuotationDocumentProps>(
  ({ quotation, brand = DEFAULT_BRAND, ...props }, ref) => {
    const { customer, items } = quotation;
    return (
      <DocumentShell
        ref={ref}
        type="Quotation"
        id={quotation.quotationNumber}
        brand={brand}
        status={<QuotationStatusPill status={quotation.status} />}
        parties={[
          { label: "Prepared for", name: customer.name, lines: <>{customer.address}<br />{customer.emailId}<br />{customer.phoneNumber}</> },
          { label: "Details", name: quotation.quotationNumber, lines: <>Issued {quotation.quotationDate}</> },
        ]}
        footer={<ApprovalTimeline steps={quotation.approvers} />}
        {...props}
      >
        <ItemsTable
          columns={[
            { key: "category", header: "Category" },
            { key: "qty", header: "Qty", align: "right" },
            { key: "rate", header: "Rate", align: "right" },
            { key: "ot", header: "OT Rate", align: "right" },
            { key: "total", header: "Line total", align: "right" },
          ]}
          rows={items.map((it) => ({
            category: it.category,
            qty: it.quantity,
            rate: fmt(Number(it.rate) || 0),
            ot: fmt(Number(it.otRate) || 0),
            total: fmt(lineTotal(it)),
          }))}
        />
        <Totals
          rows={[
            { label: "Subtotal", value: fmt(subtotal(items)) },
            { label: "OT total", value: fmt(otGrandTotal(items)) },
            { label: "Total", value: fmt(subtotal(items)), strong: true },
          ]}
        />
      </DocumentShell>
    );
  },
);
QuotationDocument.displayName = "QuotationDocument";
```

- [ ] **Step 4: Run test — expect PASS**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-document`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation-document.tsx \
        packages/blocks/src/components/quotation/quotation-document.test.tsx
git commit -m "feat(blocks): QuotationDocument printable view on DocumentShell"
```

---

## Task 8: QuotationDetail

**Files:**
- Create: `packages/blocks/src/components/quotation/quotation-detail.tsx`
- Test: `packages/blocks/src/components/quotation/quotation-detail.test.tsx`

**Interfaces:**
- Consumes: `Card`, `CardBody`, `CardHeader`, `CardTitle`, `Button`, `cn` from `@manpowerhub/ui`; `QuotationStatusPill`, `ApprovalTimeline`; types.
- Produces: `QuotationDetail` props `{ quotation; onEdit(); onSubmitForApproval(); onDecide(approverId,decision,comment?); onPrint(); onBack(); busy? } & div props`.

- [ ] **Step 1: Write the failing test**

`quotation-detail.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { QuotationDetail } from "./quotation-detail";
import { seedQuotations } from "./quotation.mock";

const [draft, pending] = seedQuotations();

const handlers = () => ({
  onEdit: vi.fn(), onSubmitForApproval: vi.fn(), onDecide: vi.fn(),
  onPrint: vi.fn(), onBack: vi.fn(),
});

describe("QuotationDetail", () => {
  it("shows submit action only for DRAFT", async () => {
    const h = handlers();
    render(<QuotationDetail quotation={draft!} {...h} />);
    await userEvent.click(screen.getByRole("button", { name: /submit for approval/i }));
    expect(h.onSubmitForApproval).toHaveBeenCalledOnce();
    expect(screen.queryByRole("button", { name: /^approve/i })).not.toBeInTheDocument();
  });
  it("shows approve/reject only for PENDING_APPROVAL and fires onDecide", async () => {
    const h = handlers();
    render(<QuotationDetail quotation={pending!} {...h} />);
    await userEvent.click(screen.getByRole("button", { name: /^approve/i }));
    expect(h.onDecide).toHaveBeenCalledWith(pending!.approvers[1]!.approverId, "APPROVED", undefined);
  });
  it("fires onPrint and onBack", async () => {
    const h = handlers();
    render(<QuotationDetail quotation={draft!} {...h} />);
    await userEvent.click(screen.getByRole("button", { name: /print/i }));
    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(h.onPrint).toHaveBeenCalledOnce();
    expect(h.onBack).toHaveBeenCalledOnce();
  });
  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<QuotationDetail ref={ref} className="px" quotation={draft!} {...handlers()} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<QuotationDetail quotation={pending!} {...handlers()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-detail`
Expected: FAIL.

- [ ] **Step 3: Write QuotationDetail**

`quotation-detail.tsx`:
```tsx
import * as React from "react";
import { Button, Card, CardBody, CardHeader, CardTitle, cn } from "@manpowerhub/ui";
import { QuotationStatusPill } from "./quotation-status-pill";
import { ApprovalTimeline } from "./approval-timeline";
import { subtotal } from "./quotation.totals";
import type { ApprovalStep, PersistedQuotation } from "./quotation.types";

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export interface QuotationDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  quotation: PersistedQuotation;
  onEdit: () => void;
  onSubmitForApproval: () => void;
  onDecide: (approverId: string, decision: "APPROVED" | "REJECTED", comment?: string) => void;
  onPrint: () => void;
  onBack: () => void;
  busy?: boolean;
}

export const QuotationDetail = React.forwardRef<HTMLDivElement, QuotationDetailProps>(
  ({ className, quotation, onEdit, onSubmitForApproval, onDecide, onPrint, onBack, busy = false, ...props }, ref) => {
    const q = quotation;
    // First still-pending approver acts as the current actor for the demo.
    const nextApprover: ApprovalStep | undefined = q.approvers.find((a) => a.decision === "PENDING");
    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>
            <h2 className="font-display text-lg font-semibold text-foreground">{q.quotationNumber}</h2>
            <QuotationStatusPill status={q.status} />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onPrint}>Print</Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle>{q.customer.name}</CardTitle></CardHeader>
          <CardBody>
            <div className="text-sm text-muted-foreground">{q.customer.address}</div>
            <div className="text-sm text-muted-foreground">{q.customer.emailId} · {q.customer.phoneNumber}</div>
            <div className="mt-4 text-sm text-foreground">Total: <span className="font-semibold tabular-nums">{fmt(subtotal(q.items))}</span></div>
          </CardBody>
        </Card>

        <ApprovalTimeline steps={q.approvers} />

        <div className="flex justify-end gap-2">
          {q.status === "DRAFT" && (
            <Button variant="primary" size="sm" disabled={busy} onClick={onSubmitForApproval}>Submit for approval</Button>
          )}
          {q.status === "PENDING_APPROVAL" && nextApprover && (
            <>
              <Button variant="destructive" size="sm" disabled={busy} onClick={() => onDecide(nextApprover.approverId, "REJECTED", undefined)}>Reject</Button>
              <Button variant="primary" size="sm" disabled={busy} onClick={() => onDecide(nextApprover.approverId, "APPROVED", undefined)}>Approve</Button>
            </>
          )}
        </div>
      </div>
    );
  },
);
QuotationDetail.displayName = "QuotationDetail";
```

- [ ] **Step 4: Run test — expect PASS**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation-detail`
Expected: PASS (5 tests). Note: for `pending`, `nextApprover` is `u2` (u1 already APPROVED in seed) — matches the test's `approvers[1]`.

- [ ] **Step 5: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation-detail.tsx \
        packages/blocks/src/components/quotation/quotation-detail.test.tsx
git commit -m "feat(blocks): QuotationDetail read view + status-gated actions"
```

---

## Task 9: Quotation container + block index + stories

**Files:**
- Create: `packages/blocks/src/components/quotation/quotation.tsx`
- Test: `packages/blocks/src/components/quotation/quotation.test.tsx`
- Create: `packages/blocks/src/components/quotation/quotation.stories.tsx`
- Create: `packages/blocks/src/components/quotation/index.ts`

**Interfaces:**
- Consumes: everything above; `QuotationApi`, `createMockQuotationApi`.
- Produces: `Quotation` props `{ api?: QuotationApi } & div props`; `index.ts` re-exports all quotation pieces + types.

- [ ] **Step 1: Write the failing test**

`quotation.test.tsx`:
```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { Quotation } from "./quotation";
import { createMockQuotationApi, seedQuotations } from "./quotation.mock";

describe("Quotation", () => {
  it("loads and lists seeded quotations", async () => {
    render(<Quotation api={createMockQuotationApi()} />);
    expect(await screen.findByText("Q-1001")).toBeInTheDocument();
  });
  it("opens a quotation into detail view", async () => {
    render(<Quotation api={createMockQuotationApi()} />);
    await userEvent.click(await screen.findByText("Q-1001"));
    expect(await screen.findByRole("button", { name: /submit for approval/i })).toBeInTheDocument();
  });
  it("creates a new quotation through the form", async () => {
    render(<Quotation api={createMockQuotationApi([])} />);
    await userEvent.click(await screen.findByRole("button", { name: /new quotation/i }));
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/email/i), "a@acme.com");
    await userEvent.type(screen.getByLabelText(/category/i), "Mason");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findByText("Acme")).toBeInTheDocument();
  });
  it("submitForApproval moves a draft to pending", async () => {
    render(<Quotation api={createMockQuotationApi()} />);
    await userEvent.click(await screen.findByText("Q-1001"));
    await userEvent.click(await screen.findByRole("button", { name: /submit for approval/i }));
    await waitFor(() => expect(screen.getByText("Pending approval")).toBeInTheDocument());
  });
  it("forwards className and ref", async () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<Quotation ref={ref} className="px" api={createMockQuotationApi([])} />);
    await screen.findByRole("button", { name: /new quotation/i });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<Quotation api={createMockQuotationApi()} />);
    await screen.findByText("Q-1001");
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation.test`
Expected: FAIL — cannot find `./quotation`.

- [ ] **Step 3: Write the container**

`quotation.tsx`:
```tsx
import * as React from "react";
import { cn } from "@manpowerhub/ui";
import { QuotationList } from "./quotation-list";
import { QuotationForm } from "./quotation-form";
import { QuotationDetail } from "./quotation-detail";
import { QuotationDocument } from "./quotation-document";
import { createMockQuotationApi, type QuotationApi } from "./quotation.mock";
import type { PersistedQuotation, QuotationAggregateData } from "./quotation.types";

type View =
  | { name: "list" }
  | { name: "form"; id?: string }
  | { name: "detail"; id: string }
  | { name: "document"; id: string };

export interface QuotationProps extends React.HTMLAttributes<HTMLDivElement> {
  api?: QuotationApi;
}

export const Quotation = React.forwardRef<HTMLDivElement, QuotationProps>(
  ({ className, api, ...props }, ref) => {
    const apiRef = React.useRef<QuotationApi>(api ?? createMockQuotationApi());
    const [items, setItems] = React.useState<PersistedQuotation[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [busy, setBusy] = React.useState(false);
    const [view, setView] = React.useState<View>({ name: "list" });
    const [error, setError] = React.useState<string | null>(null);

    const refetch = React.useCallback(async () => {
      setLoading(true);
      try { setItems(await apiRef.current.list()); }
      catch (e) { setError((e as Error).message); }
      finally { setLoading(false); }
    }, []);

    React.useEffect(() => { void refetch(); }, [refetch]);

    const current = "id" in view && view.id ? items.find((q) => q.id === view.id) : undefined;

    const run = async (fn: () => Promise<void>) => {
      setBusy(true); setError(null);
      try { await fn(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
    };

    const handleCreate = (data: QuotationAggregateData) =>
      run(async () => { await apiRef.current.create(data); await refetch(); setView({ name: "list" }); });
    const handleUpdate = (id: string, data: QuotationAggregateData) =>
      run(async () => { await apiRef.current.update(id, data); await refetch(); setView({ name: "detail", id }); });
    const handleSubmit = (id: string) =>
      run(async () => { await apiRef.current.submitForApproval(id); await refetch(); });
    const handleDecide = (id: string, approverId: string, decision: "APPROVED" | "REJECTED", comment?: string) =>
      run(async () => { await apiRef.current.decide(id, approverId, decision, comment); await refetch(); });

    return (
      <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        {view.name === "list" && (
          <QuotationList
            quotations={items}
            isLoading={loading}
            onNew={() => setView({ name: "form" })}
            onOpen={(id) => setView({ name: "detail", id })}
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
            onDecide={(approverId, decision, comment) => handleDecide(current.id, approverId, decision, comment)}
          />
        )}

        {view.name === "document" && current && (
          <div className="flex flex-col items-center gap-4">
            <button className="self-start text-sm text-muted-foreground underline" onClick={() => setView({ name: "detail", id: current.id })}>← Back to detail</button>
            <QuotationDocument quotation={current} />
          </div>
        )}
      </div>
    );
  },
);
Quotation.displayName = "Quotation";
```

- [ ] **Step 4: Run test — expect PASS**

Run: `pnpm --filter @manpowerhub/blocks test -- quotation.test`
Expected: PASS (6 tests).

- [ ] **Step 5: Write index + stories**

`index.ts`:
```ts
export * from "./quotation";
export * from "./quotation-list";
export * from "./quotation-form";
export * from "./quotation-detail";
export * from "./quotation-document";
export * from "./quotation-status-pill";
export * from "./approval-timeline";
export * from "./quotation.types";
export * from "./quotation.totals";
export { createMockQuotationApi, seedQuotations, type QuotationApi } from "./quotation.mock";
```

`quotation.stories.tsx`:
```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Quotation } from "./quotation";
import { createMockQuotationApi } from "./quotation.mock";

const meta: Meta<typeof Quotation> = { title: "Blocks/Quotation", component: Quotation };
export default meta;
type Story = StoryObj<typeof Quotation>;

export const Default: Story = { render: () => <Quotation api={createMockQuotationApi()} /> };
export const Empty: Story = { render: () => <Quotation api={createMockQuotationApi([])} /> };
export const Dark: Story = { render: () => <Quotation api={createMockQuotationApi()} />, globals: { theme: "dark" } };
export const Customization: Story = { render: () => <Quotation className="rounded-lg border border-border p-6" api={createMockQuotationApi()} /> };
```

- [ ] **Step 6: Commit**

```bash
git add packages/blocks/src/components/quotation/quotation.tsx \
        packages/blocks/src/components/quotation/quotation.test.tsx \
        packages/blocks/src/components/quotation/quotation.stories.tsx \
        packages/blocks/src/components/quotation/index.ts
git commit -m "feat(blocks): Quotation container wiring CRUD + mock API"
```

---

## Task 10: Wire exports, registry, and full verification

**Files:**
- Modify: `packages/blocks/src/index.ts`

**Interfaces:**
- Consumes: `document-shell/index.ts`, `quotation/index.ts`.
- Produces: package-level exports of both blocks.

- [ ] **Step 1: Add block exports**

Append to `packages/blocks/src/index.ts`:
```ts
export * from "./components/document-shell";
export * from "./components/quotation";
```

- [ ] **Step 2: Run the whole block test suite with coverage**

Run: `pnpm --filter @manpowerhub/blocks coverage`
Expected: PASS; coverage lines/functions/branches/statements ≥ 80. If a branch is under, add a targeted test (e.g. QuotationForm email-invalid path, mock `remove` missing-id throw) — do not lower thresholds.

- [ ] **Step 3: Typecheck + lint the package**

Run: `pnpm --filter @manpowerhub/blocks exec tsc --noEmit && pnpm -w lint`
Expected: no type errors, lint clean. Fix any `no-explicit-any`/unused-import issues surfaced.

- [ ] **Step 4: Build the package**

Run: `pnpm --filter @manpowerhub/blocks build`
Expected: tsup emits `dist/` with no errors (confirms `document-shell.css` import + external `@manpowerhub/ui` resolve).

- [ ] **Step 5: Regenerate + verify the docs registry**

Run: `pnpm --filter @manpowerhub/docs run gen:registry`
Then confirm `document-shell` and `quotation` appear in the generated registry output (grep the generated `public/r/*.json` or registry index).
Expected: both entries present. If the generator globs `packages/blocks/src/components/*`, the new dirs are picked up automatically; if it reads an explicit manifest, add both entries there.

- [ ] **Step 6: Commit**

```bash
git add packages/blocks/src/index.ts
git commit -m "feat(blocks): export DocumentShell + Quotation from package root"
```

- [ ] **Step 7: Push branch + open PR**

```bash
git push -u origin feat/document-shell-quote
gh pr create --fill --base main
```
CI must be green + one approving review before squash-merge (CLAUDE.md git workflow). Delete branch after merge.

---

## Self-Review Notes

- **Spec coverage:** types (T1) · totals (T1) · mock API + approval workflow (T2) · DocumentShell + StatusPill + print CSS (T3) · QuotationStatusPill + ApprovalTimeline (T4) · List (T5) · Form (T6) · Document on shell (T7) · Detail with gated actions (T8) · container + mock injection + index + stories (T9) · exports + registry + verify (T10). All spec sections mapped.
- **Contract override honored with seam:** mock isolated to `quotation.mock.ts`; only `Quotation` touches it; `api` prop swappable. Documented in Task 9.
- **Type consistency:** `QuotationItem` (singular) used everywhere; `PersistedQuotation`, `QuotationApi`, `BrandBlock`, `Party`, `StatusPillProps` names consistent across tasks. Seed `Q-1001` DRAFT / `Q-1002` PENDING_APPROVAL used consistently in tests. `nextApprover` = first PENDING = `u2` for the pending seed, matching the Detail test.
- **Known verify-time checks flagged inline:** `Field`/`<label>` association (T6 step 4); registry generator discovery mechanism (T10 step 5).
```
