# DocumentShell + Quote blocks — design

**Date:** 2026-07-09
**Status:** approved, pre-implementation

## Goal

Add the first two document blocks to `@manpowerhub/blocks`:

1. **DocumentShell** — the reusable shell all 7 printable doc types share (header →
   parties grid → content → footer → edge marker). Standalone registry entry.
2. **Quote** — pricing-for-future-work document built on DocumentShell. Standalone
   registry entry.

Each is a separate shadcn registry entry, pullable via `npx shadcn add <url>`.
Quote imports DocumentShell.

Source of truth: `manpowerhub-ui-handoff/reference/docs/Quote.jsx`,
`doc-styles.css`, and `05-DOCUMENTS.md §Quote` + shared-shell section. Match the
reference layout exactly; only the styling mechanism differs (see below).

## Placement

- `packages/blocks/src/components/document-shell/`
- `packages/blocks/src/components/quote/`
- Both re-exported from `packages/blocks/src/index.ts`.
- Docs registry generator (`apps/docs` `gen:registry`) picks them up automatically.

Rationale: documents are compositions, so they live with the other blocks
(pricing-table, auth-form…), not in `@manpowerhub/ui` core primitives.

## Styling

Port `doc-styles.css` atoms to **Tailwind classes referencing token CSS-vars** so
consumers reskin globally via tokens (customization contract rule 1). No hardcoded
Craftly hex in components.

Color / type mapping:

| Craftly reference | Token |
|---|---|
| `#14161A` foreground | `text-foreground` |
| `#54585F` muted text | `text-muted-foreground` |
| `#898E96` dim text | `text-muted-foreground/70` |
| `#ECECE7` hairline | `border-border` |
| amber `#7A4A0C` / `#9A6A2E` / soft bg | `--mph-warning` / `--mph-warning-soft` |
| accent / optional tag | `--accent` / `--mph-accent-soft` |
| accepted green | `--mph-success` / `--mph-success-soft` |
| Inter Tight / Inter / JetBrains Mono | `--font-display` / `--font-body` / `--font-mono` |
| sheet shadow | `--shadow-pop` |
| corner radius | `--radius` |

**Print-only exception:** a small co-located `document-shell.css` holds ONLY what
Tailwind handles poorly — `@page { size: A4; margin: 0 }`, `@media print`
page-break rules, and A4 sheet geometry (800×1130 @ 96dpi). Colors/type stay
Tailwind+token. `sideEffects: ["*.css"]` is already set in the blocks package, so
the import is tree-shake-safe.

## Component contract (per CLAUDE.md, non-negotiable)

Every component below: forward `className` via `cn()`, forward `ref`
(`forwardRef`), spread `...props` onto root, expose visual variants via `cva`, and
ship `<name>.tsx` + `<name>.stories.tsx` + `<name>.test.tsx` (Vitest + Testing
Library + axe) + `index.ts`.

## §1 DocumentShell

```ts
interface Party { label: string; name: string; lines?: React.ReactNode }

interface DocumentShellProps extends React.HTMLAttributes<HTMLDivElement> {
  type: string;                 // "Quote", "Invoice"…
  id: string;                   // "Q-0418"
  idSuffix?: string;            // "· v2"
  status?: React.ReactNode;     // usually a <StatusPill>
  brand: {
    name: string;
    mark?: React.ReactNode;     // defaults to first letter
    trn?: string;
    contact?: string[];
    preparedBy?: string;
  };
  parties: Party[];             // 2–3 columns
  children: React.ReactNode;    // document-specific content
  footer?: React.ReactNode;
  brandStyle?: "default";       // mono | branded | serif deferred (see below)
  pageLabel?: string;           // "Page 1 of 1"
}
```

Renders, in order:
1. **Sheet** root — `.sheet` geometry, `--shadow-pop`, `forwardRef` target.
2. **DocHeader** — left: brandmark + org name + prepared-by/contact meta; right:
   doc-type wordmark + id (+ idSuffix) + `status`.
3. **PartiesGrid** — 2–3 `Party` columns (`label` eyebrow, `name`, `lines`).
4. `children`.
5. `footer` (optional).
6. **PageNum** — absolute edge marker (`brand.name · trn` left, `pageLabel` right).

Exported sub-atoms (each own contract-compliant, reused by future doc types):
`Sheet`, `DocHeader`, `PartiesGrid`, `Party`, `ItemsTable`, `Totals`,
`StatusPill`, `PageNum`.

`brandStyle` is a cva variant on `Sheet`. **Only `default` implemented now**;
`mono` / `branded` / `serif` are declared in the cva type but not styled yet —
they arrive with Invoice (the type that first needs them per §05). This keeps the
prop stable without building unused skins (YAGNI).

## §2 StatusPill

cva: `variant` = `default | accent | success | warn | outline`; boolean `dot`.
Drives the §05 status matrix (draft→default, sent/viewed→accent, paid/accepted→
success, partial/overdue→warn, declined/expired→outline). Standalone, exported
from DocumentShell entry.

## §3 Quote

```ts
interface QuoteItem {
  scope: string;
  sub?: string;                 // description line
  qty: number;
  rate: number;
  optional?: boolean;           // excluded from grand total, accent tag
}

interface QuoteProps extends React.HTMLAttributes<HTMLDivElement> {
  brand: DocumentShellProps["brand"];
  client: Party;
  project: Party;
  id: string;                   // "Q-0418"
  version?: number;             // → "· v{n}"
  validUntil: string;           // display date
  validityNote?: string;        // "14 days · pricing locked at acceptance"
  items: QuoteItem[];
  currency?: string;            // default "AED"
  vatRate?: number;             // e.g. 0.05; omit → no VAT row
  terms?: string[];
  acceptUrl?: string;
  state?: "open" | "accepted" | "expired";  // default "open"
}
```

Behavior:
- **Computes** core subtotal (non-optional items), VAT (`vatRate`), grand total,
  and optionals sum. Optionals render with accent "Optional" tag, greyed
  `+amount`, excluded from grand total, surfaced as "With optionals: +X".
- **Amber "Valid until" banner** — `--mph-warning-soft` bg, clock icon,
  `validUntil` + `validityNote`, id on the right.
- Content = `ItemsTable` (Scope / Qty / Rate / Subtotal) then a terms + `Totals`
  two-column row.
- Footer = Accept CTA (`acceptUrl`) + signature strip.
- `state` cva variant:
  - `open` — amber banner active, primary "Accept quote" CTA + ghost "Request
    changes", empty signature line.
  - `accepted` — green confirmation replaces CTA, signature stamped, banner
    de-emphasized.
  - `expired` — CTA greyed/disabled, banner muted.

## §4 Deliverables per component

For **DocumentShell** and **Quote** each:
- `<name>.tsx`
- `<name>.stories.tsx` — states: default, dark, accepted, expired (Quote),
  customization.
- `<name>.test.tsx` — Vitest + Testing Library + axe; assert className forwarding,
  ref forwarding, totals math (Quote: optionals excluded, VAT applied), state
  variants render.
- `index.ts`
- re-export from `packages/blocks/src/index.ts`.
- co-located `document-shell.css` (print/A4 only), imported by Sheet.

## Out of scope (YAGNI)

- The other 6 doc types (Invoice, Proposal, PaymentVoucher, Statement, CreditNote,
  DeliveryNote) — DocumentShell is built to serve them, but none built here.
- `brandStyle` mono/branded/serif skins — declared, not implemented.
- Emails (§05 second half).
- Server-side PDF rendering pipeline — print CSS shipped, generator not.
