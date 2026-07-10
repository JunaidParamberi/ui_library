import * as React from "react";
import {
  Button, Field, Input, Textarea,
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem, cn,
} from "@manpowerhub/ui";
import { lineTotal, subtotal, otGrandTotal } from "./quotation.totals";
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
        status: initial ? (initial.status ?? "DRAFT") : status,
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
                <th className="w-8"><span className="sr-only">Actions</span></th>
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
            <div className="flex justify-between py-1 text-muted-foreground"><span>Subtotal</span><span className="tabular-nums" data-testid="form-subtotal">{fmt(subtotal(items))}</span></div>
            <div className="flex justify-between py-1 text-muted-foreground"><span>OT total</span><span className="tabular-nums" data-testid="form-ottotal">{fmt(otGrandTotal(items))}</span></div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold text-foreground"><span>Total</span><span className="tabular-nums" data-testid="form-total">{fmt(subtotal(items) + otGrandTotal(items))}</span></div>
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
