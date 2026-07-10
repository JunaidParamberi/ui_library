import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { QuotationsOverview } from "./quotations-overview";
import { seedQuotations } from "../quotation";

const rows = seedQuotations();
const noop = () => {};
const baseProps = {
  quotations: rows,
  onNew: noop,
  onOpen: noop,
  onEdit: noop,
  onDelete: noop,
};

describe("QuotationsOverview", () => {
  it("shows total quotations and per-status counts in the stat row", () => {
    render(<QuotationsOverview {...baseProps} />);
    const totalLabel = screen.getByText("Total Quotations");
    // scope to the stat card (its parent Card element) so this doesn't
    // collide with the "All" tab count
    const statCard = totalLabel.parentElement;
    expect(statCard).not.toBeNull();
    // 5 seeded rows
    expect(within(statCard as HTMLElement).getByText("5")).toBeInTheDocument();
    expect(screen.getByText("awaiting submission")).toBeInTheDocument();
    expect(screen.getByText("in review")).toBeInTheDocument();
    expect(screen.getByText("ready to send")).toBeInTheDocument();
  });

  it("shows a count badge on the All tab reflecting the full list", () => {
    render(<QuotationsOverview {...baseProps} />);
    const allTab = screen.getByRole("tab", { name: /^All/ });
    expect(within(allTab).getByText("5")).toBeInTheDocument();
  });

  it("formats total value with the currency prefix", () => {
    render(<QuotationsOverview {...baseProps} currency="AED" />);
    expect(screen.getByText("Total Value")).toBeInTheDocument();
    // subtotal sums: 4800 + 2000 + 5100 + 3500 + 2400 = 17800
    expect(screen.getByText("AED 17,800")).toBeInTheDocument();
  });

  it("filters rows to the selected status tab", async () => {
    render(<QuotationsOverview {...baseProps} />);
    await userEvent.click(screen.getByRole("tab", { name: /^Draft/ }));
    expect(screen.getByText("Q-1001")).toBeInTheDocument();
    expect(screen.queryByText("Q-1003")).not.toBeInTheDocument();
  });

  it("filters rows by search across number, name, and email", async () => {
    render(<QuotationsOverview {...baseProps} />);
    await userEvent.type(screen.getByRole("searchbox"), "emaar");
    expect(screen.getByText("Q-1003")).toBeInTheDocument();
    expect(screen.queryByText("Q-1001")).not.toBeInTheDocument();
  });

  it("shows a distinct message when filters exclude everything", async () => {
    render(<QuotationsOverview {...baseProps} />);
    await userEvent.type(screen.getByRole("searchbox"), "zzzznomatch");
    expect(screen.getByText(/no quotations match/i)).toBeInTheDocument();
  });

  it("opens the row via the Number control, including via keyboard", async () => {
    const onOpen = vi.fn();
    render(<QuotationsOverview {...baseProps} onOpen={onOpen} />);
    const openButton = screen.getByRole("button", { name: /open Q-1001/i });
    openButton.focus();
    expect(openButton).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onOpen).toHaveBeenCalledWith(rows[0]!.id);

    onOpen.mockClear();
    await userEvent.click(openButton);
    expect(onOpen).toHaveBeenCalledWith(rows[0]!.id);
  });

  it("fires onEdit without opening the row", async () => {
    const onEdit = vi.fn();
    const onOpen = vi.fn();
    render(<QuotationsOverview {...baseProps} onEdit={onEdit} onOpen={onOpen} />);
    await userEvent.click(screen.getByRole("button", { name: /edit Q-1001/i }));
    expect(onEdit).toHaveBeenCalledWith(rows[0]!.id);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("confirms before firing onDelete and does nothing on cancel", async () => {
    const onDelete = vi.fn();
    render(<QuotationsOverview {...baseProps} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: /delete Q-1001/i }));
    const dialog = screen.getByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: /cancel/i }));
    expect(onDelete).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole("button", { name: /delete Q-1001/i }));
    const dialog2 = screen.getByRole("dialog");
    await userEvent.click(within(dialog2).getByRole("button", { name: /^delete$/i }));
    expect(onDelete).toHaveBeenCalledWith(rows[0]!.id);
  });

  it("renders loading skeletons instead of rows", () => {
    render(<QuotationsOverview {...baseProps} isLoading />);
    expect(screen.getAllByTestId("stat-skeleton").length).toBe(5);
    expect(screen.queryByText("Q-1001")).not.toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(<QuotationsOverview {...baseProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<QuotationsOverview ref={ref} className="gx" {...baseProps} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("gx");
  });
});
