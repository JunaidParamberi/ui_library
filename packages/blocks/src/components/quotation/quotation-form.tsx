import * as React from "react";
import { Button, Field, Input, cn } from "@manpowerhub/ui";
import type { ApprovalStep, Customer, QuotationAggregateData, QuotationItem } from "./quotation.types";

interface ApproverDraft {
  approverName: string;
  approverEmail: string;
}

const emptyItem = (): QuotationItem => ({ category: "", quantity: "", rate: "", otRate: "" });
const emptyCustomer = (): Customer => ({ name: "", address: "", phoneNumber: "", emailId: "" });
const emptyApprover = (): ApproverDraft => ({ approverName: "", approverEmail: "" });

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
    const [approvers, setApprovers] = React.useState<ApproverDraft[]>(
      initial?.approvers?.map((a) => ({ approverName: a.approverName, approverEmail: a.approverEmail })) ?? [],
    );
    const [error, setError] = React.useState<string | null>(null);

    const setItem = (i: number, key: keyof QuotationItem, v: string) =>
      setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)));

    const setApprover = (i: number, key: keyof ApproverDraft, v: string) =>
      setApprovers((prev) => prev.map((a, idx) => (idx === i ? { ...a, [key]: v } : a)));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!customer.name.trim()) return setError("Customer name is required.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.emailId)) return setError("A valid customer email is required.");
      if (!items.some((it) => it.category.trim())) return setError("At least one item is required.");
      const namedApprovers = approvers.filter((a) => a.approverName.trim());
      if (namedApprovers.some((a) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a.approverEmail)))
        return setError("A valid email is required for each approver.");
      setError(null);
      const approvalSteps: ApprovalStep[] = namedApprovers.map((a) => ({
        approverId: crypto.randomUUID(),
        approverName: a.approverName.trim(),
        approverEmail: a.approverEmail.trim(),
        decision: "PENDING",
      }));
      onSubmit({
        quotationNumber: initial?.quotationNumber ?? "",
        quotationDate: date,
        customer,
        status: initial?.status ?? "DRAFT",
        approvers: approvalSteps,
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

        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Approvers</div>
          {approvers.map((a, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[2fr_2fr_auto]">
              <Field label="Approver name" htmlFor={`appr-name-${i}`}>
                <Input id={`appr-name-${i}`} value={a.approverName} onChange={(e) => setApprover(i, "approverName", e.target.value)} /></Field>
              <Field label="Approver email" htmlFor={`appr-email-${i}`}>
                <Input id={`appr-email-${i}`} type="email" value={a.approverEmail} onChange={(e) => setApprover(i, "approverEmail", e.target.value)} /></Field>
              <Button type="button" variant="ghost" size="sm" className="self-end"
                aria-label={`Remove approver ${i + 1}`}
                onClick={() => setApprovers((prev) => prev.filter((_, idx) => idx !== i))}>✕</Button>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" className="self-start" onClick={() => setApprovers((p) => [...p, emptyApprover()])}>Add approver</Button>
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
