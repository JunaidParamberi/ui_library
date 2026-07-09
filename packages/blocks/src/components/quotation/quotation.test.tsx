import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { Quotation } from "./quotation";
import { createMockQuotationApi, seedQuotations } from "./quotation.mock";

describe("Quotation", () => {
  it("loads and lists seeded quotations", async () => {
    render(<Quotation api={createMockQuotationApi()} />);
    expect(await screen.findByText("Q-1001")).toBeInTheDocument();
  });
  it("opens a quotation into detail view", async () => {
    render(<Quotation api={createMockQuotationApi()} />);
    await userEvent.click(await screen.findByText("Q-1001"));
    expect(await screen.findByRole("button", { name: /submit for approval/i })).toBeInTheDocument();
  });
  it("creates a new quotation through the form", async () => {
    render(<Quotation api={createMockQuotationApi([])} />);
    await userEvent.click(await screen.findByRole("button", { name: /new quotation/i }));
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/email/i), "a@acme.com");
    await userEvent.type(screen.getByLabelText(/category/i), "Mason");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(await screen.findByText("Acme")).toBeInTheDocument();
  });
  it("submitForApproval moves a draft to pending", async () => {
    render(<Quotation api={createMockQuotationApi()} />);
    await userEvent.click(await screen.findByText("Q-1001"));
    await userEvent.click(await screen.findByRole("button", { name: /submit for approval/i }));
    await waitFor(() => expect(screen.getByText("Pending approval")).toBeInTheDocument());
  });
  it("forwards className and ref", async () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<Quotation ref={ref} className="px" api={createMockQuotationApi([])} />);
    await screen.findByRole("button", { name: /new quotation/i });
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<Quotation api={createMockQuotationApi()} />);
    await screen.findByText("Q-1001");
    expect(await axe(container)).toHaveNoViolations();
  });
});
