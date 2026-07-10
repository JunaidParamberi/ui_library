import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { QuotationDetail } from "./quotation-detail";
import { seedQuotations } from "./quotation.mock";

const [draft, pending] = seedQuotations();

const handlers = () => ({
  onEdit: vi.fn(), onSubmitForApproval: vi.fn(), onDecide: vi.fn(),
  onPrint: vi.fn(), onBack: vi.fn(),
});

const renderDetail = (overrides: Partial<React.ComponentProps<typeof QuotationDetail>> = {}) =>
  render(<QuotationDetail quotation={draft!} {...handlers()} {...overrides} />);

describe("QuotationDetail", () => {
  it("shows submit action only for DRAFT", async () => {
    const h = handlers();
    render(<QuotationDetail quotation={draft!} {...h} />);
    await userEvent.click(screen.getByRole("button", { name: /submit for approval/i }));
    expect(h.onSubmitForApproval).toHaveBeenCalledOnce();
    expect(screen.queryByRole("button", { name: /^approve/i })).not.toBeInTheDocument();
  });
  it("shows approve/reject only for PENDING_APPROVAL and fires onDecide", async () => {
    const h = handlers();
    render(<QuotationDetail quotation={pending!} {...h} />);
    await userEvent.click(screen.getByRole("button", { name: /^approve/i }));
    expect(h.onDecide).toHaveBeenCalledWith(pending!.approvers[1]!.approverId, "APPROVED", undefined);
  });
  it("fires onDecide with REJECTED when reject is clicked", async () => {
    const h = handlers();
    render(<QuotationDetail quotation={pending!} {...h} />);
    await userEvent.click(screen.getByRole("button", { name: /^reject/i }));
    expect(h.onDecide).toHaveBeenCalledWith(pending!.approvers[1]!.approverId, "REJECTED", undefined);
  });
  it("fires onPrint and onBack", async () => {
    const h = handlers();
    render(<QuotationDetail quotation={draft!} {...h} />);
    await userEvent.click(screen.getByRole("button", { name: /print/i }));
    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(h.onPrint).toHaveBeenCalledOnce();
    expect(h.onBack).toHaveBeenCalledOnce();
  });
  it("shows an OT-inclusive grand total matching the document", () => {
    // Q-1001: subtotal = 2*1200 + 6*400 = 4,800; OT = 2*180 + 6*60 = 720; total = 5,520.
    render(<QuotationDetail quotation={draft!} {...handlers()} />);
    const total = screen.getByText(/^Total:/).closest("div")!;
    expect(total).toHaveTextContent("5,520.00");
    expect(screen.getByText("4,800.00")).toBeInTheDocument(); // subtotal breakdown
    expect(screen.getByText("720.00")).toBeInTheDocument(); // OT breakdown
  });
  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<QuotationDetail ref={ref} className="px" quotation={draft!} {...handlers()} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<QuotationDetail quotation={pending!} {...handlers()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
  it("renders Full view button and fires onFullView when provided", async () => {
    const onFullView = vi.fn();
    renderDetail({ onFullView });
    await userEvent.click(screen.getByRole("button", { name: /full view/i }));
    expect(onFullView).toHaveBeenCalledTimes(1);
  });
  it("omits Full view button when onFullView is not provided", () => {
    renderDetail({});
    expect(screen.queryByRole("button", { name: /full view/i })).not.toBeInTheDocument();
  });
});
