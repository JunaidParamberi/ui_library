# 05 — Document templates & emails

Printable business documents (PDF/print) and transactional emails. These are
**compositions**, not primitives — build them in the library as
`@manpowerhub/ui/documents` and `@manpowerhub/ui/emails`, or in the app. They
share one shell and reuse the tokens.

**Reference:** `reference/docs/*.jsx` + `reference/docs/doc-styles.css` (documents);
`reference/emails/*.jsx` + `reference/emails/email-styles.css` (emails). The
reference is exact — match it.

---

## Shared document shell

Every document = **header → parties grid → content → totals/footer → edge marker**.

```
┌───────────────────────────────────────────┐
│ [brandmark]            [DOC TYPE — wordmark]│  header
│ Company name           DOC-ID  [status pill]│
├───────────────────────────────────────────┤
│ [Billed to]  [Project]   [Details]          │  parties grid (2–3 col)
├───────────────────────────────────────────┤
│ ⟨ document-specific content ⟩               │
├───────────────────────────────────────────┤
│ [Payment instructions]   [Notes/signature]  │  footer
└───────────────────────────────────────────┘
  Company · TRN …                Page 1 of 1     edge marker
```

Reusable atoms (in `doc-styles.css`): `.sheet`, `.brandmark`, `.doc-type` /
`.doc-type-sub`, `.parties` + `.party__label/__name/__line`, `.details-grid`
`.row`, `.items` (line-items table), `.totals` / `.totals__inner`, `.doc-footer`
`.pay-line`, `.page-num`, `.pill` (`--success/--warn/--accent/--dot`).

**Library shape:**
```ts
interface DocumentShellProps {
  type: string; id: string; status?: DocStatus;
  brand: { name: string; mark?: React.ReactNode; trn?: string; contact?: string[] };
  parties: PartyBlock[];        // 2–3 columns
  children: React.ReactNode;    // content
  footer?: React.ReactNode;
  brandStyle?: "default" | "mono" | "branded" | "serif";  // per-workspace
}
```

## The 7 types (build each on the shell)

1. **Invoice** (`Invoice.jsx`, `InvoiceVariants.jsx`) — bill for delivered work. 3-col parties, line items (Description/Qty/Rate/Amount), totals with Subtotal/Discount?/VAT?/Grand Total. Status pills drive header. Hide Discount when 0, hide VAT when exempt. 3 brand styles: **mono** (B/W hairlines), **branded** (accent band + accent total), **serif** (cream editorial). Brand style is a per-workspace setting, not per-doc.
2. **Quote** (`Quote.jsx`) — pricing for future work. Amber "Valid until" banner, "Scope" items, **optional items** (accent tag, excluded from Grand Total, shown as "With optionals: +X"), Accept CTA + signature strip. Accepted → green confirmation + stamped signature; Expired → greyed CTA.
3. **Proposal** (`Proposal.jsx`) — 2-page pitch. Page 1 full-bleed cover (eyebrow, big display headline with optional italic accent run, meta row, prepared-by). Page 2 numbered sections: opportunity, deliverables grid, timeline mini-Gantt, investment table, next step.
4. **Payment Voucher** (`PaymentVoucher.jsx`) — receipt. Dark band header, rotated **PAID stamp**, big amount card with amount-in-words, allocations table (applied in success color), ledger footer, signatures. Refund → red band, no stamp.
5. **Statement of Account** (`Statement.jsx`) — period summary. 4-card KPI grid (Opening/Invoiced/Received/Closing), 10px **aging bar** (Current/1–30/31–60/60+), transactions table (Charge/Credit/Balance), closing-balance row.
6. **Credit Note** (`CreditNote.jsx`) — refund/correct an invoice. Rose band, refund summary (original → credited, arrow), negative totals in destructive, references original `INV-…`.
7. **Delivery Note** (`DeliveryNote.jsx`) — handover confirmation, **no pricing**. Items with Status ("Delivered"), acceptance checklist (16px checkboxes), QR placeholder, signatures.

### Status pill matrix
draft→default "Draft" · sent→accent "Sent · awaiting {action}" · viewed→accent
"Viewed — N times" · paid→success "Paid" (+PAID stamp on invoice) · partial→warn
"Partially paid" · overdue→warn "Overdue · N days" · accepted→success "Accepted" ·
declined→outline "Declined" · expired→outline "Expired".

### ID formats
`INV-NNNN` · `Q-NNNN` (`· v2` when revised) · `P-NNNN` · `PV-NNNN` · `SOA-NNNN` ·
`CN-NNNN` (`against INV-NNNN`) · `DN-NNNN` (`for INV-NNNN`). Mono font, tabular.

## Print & PDF

```css
@page { size: A4; margin: 0; }
@media print {
  body { background: #fff; }
  .sheet { box-shadow: none; page-break-after: always; }
  .sheet:last-child { page-break-after: auto; }
  .sheet--cover { page-break-after: always; } /* proposal */
}
```
- Recommended PDF: server-side headless Chrome with the same stylesheet; embed WOFF2 fonts.
- Numbers `tabular-nums`; honor `.page-num` absolute marker; never truncate line items — wrap and paginate (repeat header on page 2+).

## Emails

**Reference:** `reference/emails/EmailsTransactional.jsx`,
`EmailsNotifications.jsx`, `email-styles.css`. Two families:
- **Transactional** — invoice sent, payment received, quote accepted, statement ready. Header brandmark, single primary CTA button, document summary card, plain-text fallback.
- **Notifications** — task assigned, timesheet reminder, worker/site updates. Compact, one action.

Build with table-based email HTML (inline styles / MJML or react-email) — token
**values** inline (email clients don't support CSS vars). Keep the color/type
system identical to the app so brand reads consistently.

**Stories:** render each email in a Storybook "email" section at 600px width, light background only (email standard).
