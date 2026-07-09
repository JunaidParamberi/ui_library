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
