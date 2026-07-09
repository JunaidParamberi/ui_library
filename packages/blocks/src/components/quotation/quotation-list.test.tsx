import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { QuotationList } from "./quotation-list";
import { seedQuotations } from "./quotation.mock";

const data = seedQuotations();

describe("QuotationList", () => {
  it("renders a row per quotation with number, customer and status", () => {
    render(<QuotationList quotations={data} onOpen={vi.fn()} onNew={vi.fn()} />);
    expect(screen.getByText("Q-1001")).toBeInTheDocument();
    expect(screen.getByText("Northwind Labs")).toBeInTheDocument();
    expect(screen.getByText("Pending approval")).toBeInTheDocument();
  });
  it("fires onOpen with the id when a row is clicked", async () => {
    const onOpen = vi.fn();
    render(<QuotationList quotations={data} onOpen={onOpen} onNew={vi.fn()} />);
    await userEvent.click(screen.getByText("Q-1001"));
    expect(onOpen).toHaveBeenCalledWith(data[0]!.id);
  });
  it("fires onOpen when Enter is pressed on a focused row", async () => {
    const onOpen = vi.fn();
    render(<QuotationList quotations={data} onOpen={onOpen} onNew={vi.fn()} />);
    const row = screen.getByRole("button", { name: /open q-1001/i });
    row.focus();
    await userEvent.keyboard("{Enter}");
    expect(onOpen).toHaveBeenCalledWith(data[0]!.id);
  });
  it("ignores non-Enter keys on a focused row", async () => {
    const onOpen = vi.fn();
    render(<QuotationList quotations={data} onOpen={onOpen} onNew={vi.fn()} />);
    const row = screen.getByRole("button", { name: /open q-1001/i });
    row.focus();
    await userEvent.keyboard("{Space}");
    expect(onOpen).not.toHaveBeenCalled();
  });
  it("fires onNew", async () => {
    const onNew = vi.fn();
    render(<QuotationList quotations={data} onOpen={vi.fn()} onNew={onNew} />);
    await userEvent.click(screen.getByRole("button", { name: /new quotation/i }));
    expect(onNew).toHaveBeenCalledOnce();
  });
  it("shows loading and empty states", () => {
    const { rerender } = render(<QuotationList quotations={[]} onOpen={vi.fn()} onNew={vi.fn()} isLoading />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    rerender(<QuotationList quotations={[]} onOpen={vi.fn()} onNew={vi.fn()} />);
    expect(screen.getByText(/no quotations/i)).toBeInTheDocument();
  });
  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<QuotationList ref={ref} className="px" quotations={data} onOpen={vi.fn()} onNew={vi.fn()} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<QuotationList quotations={data} onOpen={vi.fn()} onNew={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
