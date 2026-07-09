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
