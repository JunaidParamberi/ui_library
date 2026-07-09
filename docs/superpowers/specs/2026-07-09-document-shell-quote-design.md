# DocumentShell + Quotation block — design

**Date:** 2026-07-09
**Status:** approved, pre-implementation

## Goal

Add two registry entries to `@manpowerhub/blocks`:

1. **DocumentShell** — reusable printable-document shell (header → parties grid →
   content → footer → edge marker) all 7 doc types will share. Standalone entry.
2. **Quotation** — one combined block that does **CRUD** (list / form / detail)
   over a quotation record **and** renders the record as a **printable document**
   (built on DocumentShell). Ships with a **mock API** so it runs standalone.

Source of truth: `manpowerhub-ui-handoff/reference/docs/Quote.jsx`,
`doc-styles.css`, reference screens `quotation-list.jsx` / `quotation-form.jsx` /
`quotation-detail.jsx`, and `05-DOCUMENTS.md`.

## Contract override (explicit, user-directed)

CLAUDE.md says blocks carry "no API calls, no business logic." The user has
explicitly chosen to embed a mock API inside the Quotation block. We honor that
but **preserve the seam**:

- Mock lives in its own file `quotation.mock.ts`, not scattered through
  components.
- Presentational sub-components (`QuotationList`, `QuotationForm`,
  `QuotationDetail`, `QuotationDocument`) are pure: data in, callbacks out — no
  fetching.
- Only the top-level `Quotation` container touches the API, and it takes an `api`
  prop that **defaults to the mock**. A consumer swaps in a real API by passing
  their own implementation of the `QuotationApi` interface.

## Placement

- `packages/blocks/src/components/document-shell/`
- `packages/blocks/src/components/quotation/`
- Both re-exported from `packages/blocks/src/index.ts`.
- Docs registry generator (`apps/docs` `gen:registry`) picks them up.

## Styling

Port `doc-styles.css` atoms to **Tailwind + token utilities** (consumers reskin via
tokens). Token utilities confirmed present in `@manpowerhub/tokens` preset:
`text-foreground`, `text-muted-foreground`, `border-border`, `bg-card`,
`text-success`/`bg-success`, `text-warning`/`bg-warning` (use with opacity, e.g.
`bg-warning/10`), `text-accent`, `font-display`/`font-body`/`font-mono`,
`shadow-pop`, `rounded-lg`. UI primitives available: `Card`, `Button`, `Badge`,
`Table`, `Input`, `Select`, `Dialog`, `cn` from `@manpowerhub/ui`.

**Print-only exception:** small co-located `document-shell.css` holds ONLY
`@page`/`@media print`/A4 sheet geometry (800×1130 @ 96dpi). Colors/type stay
Tailwind+token. `sideEffects: ["*.css"]` already set.

## Component contract (per CLAUDE.md, non-negotiable)

Every component: forward `className` via `cn()`, forward `ref` (`forwardRef`),
spread `...props`, cva for visual variants, and ship `<name>.tsx` +
`.stories.tsx` + `.test.tsx` (Vitest + Testing Library + axe) + `index.ts`.

## Domain types (`quotation.types.ts`)

User schema, with two corrections: `Status` → `QuotationStatus`; numeric fields
kept as `string` per the schema (form inputs are strings; totals parse with
`Number()`).

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
  requestedAt?: string;   // ISO — serializable for mock store
  approvedAt?: string;    // ISO
}

export interface Customer {
  name: string; address: string; phoneNumber: string; emailId: string;
}

export interface QuotationItem {
  category: string; quantity: string; rate: string; otRate: string;
}

export interface QuotationPersistedMeta {
  createdAt: string; updatedAt: string; createdBy: string; // "system" allowed
}

export interface QuotationAggregateData {
  quotationNumber: string;
  quotationDate: string;         // ISO
  customer: Customer;
  status: QuotationStatus;
  approvers: ApprovalStep[];
  items: QuotationItem[];
}

export type PersistedQuotation =
  QuotationAggregateData & QuotationPersistedMeta & { id: string };
```

Totals helper (`quotation.totals.ts`): `lineTotal(i) = Number(i.quantity) *
Number(i.rate)`; `otTotal(i) = Number(i.quantity) * Number(i.otRate)`;
`subtotal = Σ lineTotal`; `otGrandTotal = Σ otTotal`. NaN-safe (treat unparseable
as 0).

## Mock API (`quotation.mock.ts`)

```ts
export interface QuotationApi {
  list(): Promise<PersistedQuotation[]>;
  get(id: string): Promise<PersistedQuotation | undefined>;
  create(data: QuotationAggregateData): Promise<PersistedQuotation>;
  update(id: string, patch: Partial<QuotationAggregateData>): Promise<PersistedQuotation>;
  remove(id: string): Promise<void>;
  submitForApproval(id: string): Promise<PersistedQuotation>;   // DRAFT → PENDING_APPROVAL
  decide(id: string, approverId: string, decision: "APPROVED" | "REJECTED", comment?: string): Promise<PersistedQuotation>;
}
export function createMockQuotationApi(seed?: PersistedQuotation[]): QuotationApi;
```

- In-memory `Map<string, PersistedQuotation>`, seeded with 2–3 fixtures (one DRAFT,
  one PENDING_APPROVAL, one APPROVED).
- Each method wrapped in a small `await delay(120)` to mimic async; throws
  `Error("not found")` on missing id.
- `create` assigns `id` (crypto.randomUUID), `quotationNumber` (`Q-NNNN`
  sequential), meta timestamps, `status: "DRAFT"`.
- `submitForApproval` sets status `PENDING_APPROVAL`, stamps each approver
  `requestedAt`, decision `PENDING`.
- `decide` records one approver's decision/comment/`approvedAt`; when all
  approvers `APPROVED` → status `APPROVED`; any `REJECTED` → status `REJECTED`.

## Components

### §1 DocumentShell (standalone entry)
Props: `type`, `id`, `idSuffix?`, `status?`, `brand{name,mark?,trn?,contact?,preparedBy?}`,
`parties: Party[]` (2–3 col), `children`, `footer?`, `brandStyle?: "default"`,
`pageLabel?`. Renders Sheet → DocHeader → PartiesGrid → children → footer →
PageNum. Exported sub-atoms: `Sheet`, `DocHeader`, `PartiesGrid`, `Party`,
`ItemsTable`, `Totals`, `StatusPill`, `PageNum`. `brandStyle` cva declares
`default | mono | branded | serif`; only `default` styled now (rest arrive with
Invoice). Print CSS co-located.

### §2 StatusPill (exported from DocumentShell)
cva `variant`: `default | accent | success | warn | outline`, bool `dot`.

### §3 QuotationStatusPill (in quotation block)
Thin wrapper mapping `QuotationStatus` → StatusPill variant + label:
DRAFT→default "Draft", PENDING_APPROVAL→warn+dot "Pending approval",
APPROVED→success "Approved", SENT→accent "Sent", REJECTED→outline "Rejected".

### §4 ApprovalTimeline
Props: `steps: ApprovalStep[]`. Vertical list; each row = approver name/email,
decision pill (PENDING→warn, APPROVED→success, REJECTED→destructive), comment,
timestamps. Pure.

### §5 QuotationList (pure)
Props: `quotations: PersistedQuotation[]`, `onOpen(id)`, `onNew()`,
`isLoading?`. `Table` of number / customer / date / status pill / item count;
"New quotation" button; empty + loading states.

### §6 QuotationForm (pure, create+edit)
Props: `initial?: QuotationAggregateData`, `onSubmit(data)`, `onCancel()`,
`submitting?`. Fields: customer (name/address/phone/email), dynamic item rows
(category/qty/rate/otRate add+remove), approvers (name/email add+remove),
quotationDate. Client validation: ≥1 item, customer name+email required, email
format. Emits `QuotationAggregateData` (status defaulted DRAFT by api on create).

### §7 QuotationDocument (pure, printable, built on DocumentShell)
Props: `quotation: PersistedQuotation`. Maps record → DocumentShell:
`type="Quotation"`, `id=quotationNumber`, status pill, brand (static demo brand),
parties = [customer "Prepared for", meta "Details"]. Content = ItemsTable
(Category / Qty / Rate / OT Rate / Line total) + Totals (subtotal, OT total).
Footer = ApprovalTimeline + signature strip. Print-ready via DocumentShell CSS.

### §8 Quotation (container — the only API-touching piece)
Props: `api?: QuotationApi` (default `createMockQuotationApi()`),
`className`, `...props`. Internal view state: `"list" | "form" | "detail"` +
selected id. Wires:
- mount → `api.list()` into state; loading flag.
- list `onNew` → form (empty); `onOpen` → detail.
- form `onSubmit` → `api.create`/`api.update` → back to list, refetch.
- detail: shows QuotationDetail with actions submit/approve/reject/print +
  toggle to QuotationDocument view.
Errors surfaced inline (simple message), not thrown.

### §9 QuotationDetail (pure)
Props: `quotation`, `onEdit()`, `onSubmitForApproval()`,
`onDecide(approverId, decision, comment?)`, `onPrint()`, `onBack()`, `busy?`.
Header (number, status pill), customer card, items table, ApprovalTimeline,
action buttons gated by status (submit only when DRAFT; approve/reject only when
PENDING_APPROVAL).

## Deliverables per component

For DocumentShell, StatusPill, QuotationStatusPill, ApprovalTimeline,
QuotationList, QuotationForm, QuotationDocument, QuotationDetail, Quotation:
`<name>.tsx` + `.stories.tsx` (default, dark, relevant states, customization) +
`.test.tsx` (Vitest+TL+axe; className+ref forwarding; behavior) + `index.ts`.
Plus non-component units with their own tests: `quotation.types.ts`,
`quotation.totals.ts` (+`.test.ts`), `quotation.mock.ts` (+`.test.ts`),
`document-shell.css`. Re-export both blocks from `packages/blocks/src/index.ts`.

## Out of scope (YAGNI)

- Other 6 doc types; `brandStyle` mono/branded/serif skins (declared only).
- Real persistence / network; emails; server PDF pipeline (print CSS only).
- Auth / per-approver identity gating beyond the passed `approverId`.
