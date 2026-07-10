import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { QuotationListPane } from "./quotation-list-pane";
import { seedQuotations } from "./quotation.mock";

const rows = seedQuotations();

describe("QuotationListPane", () => {
  it("renders a row per quotation", () => {
    render(<QuotationListPane quotations={rows} onOpen={() => {}} onNew={() => {}} />);
    expect(screen.getByText(rows[0]!.quotationNumber)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: new RegExp(`open ${rows[0]!.quotationNumber}`, "i") }),
    ).toBeInTheDocument();
  });

  it("filters by search", async () => {
    render(<QuotationListPane quotations={rows} onOpen={() => {}} onNew={() => {}} />);
    const box = screen.getByPlaceholderText(/search/i);
    await userEvent.type(box, rows[0]!.customer.name);
    expect(screen.getByText(rows[0]!.quotationNumber)).toBeInTheDocument();
    // a row whose customer differs is filtered out
    const other = rows.find((r) => r.customer.name !== rows[0]!.customer.name);
    if (other) expect(screen.queryByText(other.quotationNumber)).not.toBeInTheDocument();
  });

  it("marks the selected row with aria-current", () => {
    render(
      <QuotationListPane quotations={rows} selectedId={rows[0]!.id} onOpen={() => {}} onNew={() => {}} />,
    );
    expect(screen.getByRole("button", { name: new RegExp(rows[0]!.quotationNumber) })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("fires onOpen and onNew", async () => {
    const onOpen = vi.fn();
    const onNew = vi.fn();
    render(<QuotationListPane quotations={rows} onOpen={onOpen} onNew={onNew} />);
    await userEvent.click(screen.getByRole("button", { name: new RegExp(rows[0]!.quotationNumber) }));
    expect(onOpen).toHaveBeenCalledWith(rows[0]!.id);
    await userEvent.click(screen.getByRole("button", { name: /new quotation/i }));
    expect(onNew).toHaveBeenCalled();
  });

  it("shows loading and empty states", () => {
    const { rerender } = render(
      <QuotationListPane quotations={[]} isLoading onOpen={() => {}} onNew={() => {}} />,
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    rerender(<QuotationListPane quotations={[]} onOpen={() => {}} onNew={() => {}} />);
    expect(screen.getByText(/no quotations/i)).toBeInTheDocument();
  });

  it("forwards ref/className/props and is axe clean", async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <QuotationListPane ref={ref} className="cx" data-testid="pane" quotations={rows} onOpen={() => {}} onNew={() => {}} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("pane")).toHaveClass("cx");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders a flat QUO chip row with amount and status", () => {
    render(<QuotationListPane
      quotations={[{
        id: "1", quotationNumber: "QUO-1", quotationDate: "2026-07-10", status: "DRAFT",
        customer: { name: "Nova", address: "", phoneNumber: "", emailId: "n@x.com" },
        items: [{ category: "Mason", quantity: "2", rate: "100", otRate: "10" }],
        approvers: [], createdAt: "", updatedAt: "", createdBy: "system",
      }]}
      onOpen={vi.fn()} onNew={vi.fn()} />);
    const row = screen.getByRole("button", { name: /open quo-1/i });
    expect(within(row).getByText("QUO")).toBeInTheDocument();
    expect(within(row).getByText(/AED 200/)).toBeInTheDocument();
    expect(within(row).getByText(/draft/i)).toBeInTheDocument();
  });
});
