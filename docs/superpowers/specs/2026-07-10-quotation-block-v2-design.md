# Quotation block v2 — design

Date: 2026-07-10
Status: approved for planning

## Goal

Refine the quotation block UI to match two references the user likes: a Zoho-style
New Quotation form and Craftly's clean documents/clients layout. Keep all current
domain features (OT rate, approvers + approval timeline, status pills). Additionally,
tighten the global corner-radius scale in `@manpowerhub/tokens` so every component
reads crisper.

Non-goals: no API/business logic, no new totals math, no npm publish changes, no
unrelated refactors.

## Scope of change

Files in `packages/blocks/src/components/quotation/`:
- `quotation.types.ts` — add fields
- `quotation-form.tsx` — Zoho-style layout
- `quotation-detail.tsx` — Craftly-style two-column detail
- `quotation-list-pane.tsx` — flat Craftly-style rows
- `approval-timeline.tsx` — restyle to timeline rows
- `quotation.mock.ts` — populate new fields
- matching `*.test.tsx` and `*.stories.tsx` for each changed component

Files in `packages/tokens/src/`:
- `preset.ts` — reduce `borderRadius` scale
- `tokens.ts` — reduce `radius` object (keep in sync with preset)
- `globals.css` — reduce `--radius`

## 1. Data model (`quotation.types.ts`)

Add to `QuotationAggregateData` (all optional so existing data stays valid):

```ts
export type QuotationTerms =
  | "DUE_ON_RECEIPT" | "NET_15" | "NET_30" | "NET_45" | "CUSTOM";

// new optional fields on QuotationAggregateData:
terms?: QuotationTerms;
dueDate?: string;            // ISO date
customerNotes?: string;
termsAndConditions?: string;
```

Add to `QuotationItem`:

```ts
description?: string;        // Zoho "item details" sub-line; otRate stays
```

`Amount` per line is computed (`quantity * rate`), never stored. Totals logic in
`quotation.totals.ts` is unchanged: `subtotal + otGrandTotal`.

## 2. Form (`quotation-form.tsx`) — Zoho layout, our tokens

- Panel with header row: title + close (✕). Not inline.
- Label-left / input-right rows, grid `[minmax(150px,180px)_1fr]`, generous rhythm.
  Replaces the cramped stacked `Field` grid.
- Rows: Customer Name (required), Quotation # (required), then a single line with
  Quotation Date + Terms `<select>` + Due Date, then approvers.
- Required fields keep the existing `Field` required styling (asterisk).
- Item table = real `<table>`: columns `ITEM DETAILS | QTY | RATE | OT RATE | AMOUNT | ⌫`.
  - Item details cell = borderless name input + optional muted description line.
  - Numeric cells right-aligned, tabular-nums, borderless-until-focus.
  - Amount cell auto-computes `qty × rate`, read-only.
  - Footer link actions: "Add New Row" (wired), "Add Items in Bulk" (visual only,
    no bulk modal in this pass — YAGNI).
- Below the table, two columns: left = Customer Notes textarea (+ "Will be displayed
  on the quotation" hint) and Terms & Conditions textarea; right = totals card
  (Subtotal, OT total, Total bold).
- Approvers section kept, restyled to match (name + email rows, add/remove).
- Footer: Save as Draft (secondary) · Save and Send (primary) · Cancel (ghost).
  Both save actions call `onSubmit`; the intended status is passed through
  (`DRAFT` for draft, `SENT`/existing for send) — form owns the status choice.

All built from `@manpowerhub/ui` primitives (`Field`, `Input`, `Button`, `cn`) and
tokens. No raw hex; use semantic classes.

## 3. Detail (`quotation-detail.tsx`) — Craftly-style

- Header: large quotation number + status pill inline; right-side action buttons
  (Full view · Print · Edit · Delete) as today, lighter weight.
- Customer identity block under header: name prominent; address and
  `email · phone` as muted meta lines; date chips (Quotation date, Due date).
- Two-column body:
  - Left (main): Items summary card (read-only table, same columns as form) then
    Approval timeline card (restyled `ApprovalTimeline`).
  - Right sidebar (~320–340px): Financial summary card (Subtotal / OT total /
    Total, AED, bold total) then Details card (Quotation date, Due date, Terms,
    Customer notes).
- Action bar bottom kept: Submit for approval (DRAFT); Approve · Reject
  (PENDING_APPROVAL, first pending approver is the actor).
- Delete confirmation Dialog kept.

## 4. Approval timeline (`approval-timeline.tsx`)

Restyle to Craftly activity-timeline rows: leading rounded icon tile (state-colored:
approved = success, pending = warning, rejected = danger), title + sub line, right
date. Hairline divider between rows, no gap/card-per-row. Same props/data.

## 5. List pane (`quotation-list-pane.tsx`) — flat Craftly rows

- Header: "Quotations" + count chip; New button; search below.
- Rows: **flat**, separated by top hairline border, no gap, no per-row radius.
  - Leading small `QUO` chip (bordered, muted, `rounded-sm`).
  - Bold quotation number + amount on the right of the first line.
  - Status shown as colored dot + label, right-aligned second line.
  - Active row: left 3px accent bar (flush to pane edge) + subtle `bg-accent`.
  - Hover: `bg-accent`.
- Keep existing search filter behavior and empty/loading states.

## 6. Global radius reduction (`@manpowerhub/tokens`)

Reduce the radius scale so all components using `rounded-*` read crisper. The scale
is hardcoded in `preset.ts` (not derived from `--radius`), so all three sources are
updated together and kept in sync.

`preset.ts` `borderRadius`:

| token | now | new |
|---|---|---|
| xs | 5px | 3px |
| sm | 7px | 4px |
| DEFAULT / md | 9px | 6px |
| lg | 13px | 8px |
| xl | 18px | 12px |
| 2xl | 24px | 16px |

`tokens.ts` `radius` object updated to the same px numbers (xs3, sm4, md6, lg8,
xl12, 2xl16, full 9999).

`globals.css` `--radius: 0.5625rem` → `0.375rem` (9px → 6px).

Risk: this is global — every block/component picks up the tighter radius. That is the
intent. Verify visually across existing Storybook stories after the change.

## Testing

Per component: Vitest + Testing Library + axe, per the CLAUDE.md component contract.
- Form: renders new fields, Amount auto-computes, Add/remove row + approver, submit
  passes new fields + correct status for Draft vs Send, validation unchanged.
- Detail: renders financial summary + details + timeline; action bar per status.
- List pane: flat rows render, active state, status dot per status, search filter.
- Timeline: state-colored tiles per decision.
- Tokens: no unit test needed; verify via typecheck + Storybook visual pass.

Stories per component: default, dark, loading, empty, error (where applicable),
Customization. Update snapshots/stories to new layout.

## Acceptance

- Form, detail, list, timeline match the approved mockup, built from our tokens.
- New optional fields flow through types → form → detail → mock, no totals change.
- Global radius scale reduced in all three token sources, in sync.
- All quotation + tokens tests green; typecheck + lint clean; Storybook renders.
