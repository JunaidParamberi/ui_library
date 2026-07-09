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
