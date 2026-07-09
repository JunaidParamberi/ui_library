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
