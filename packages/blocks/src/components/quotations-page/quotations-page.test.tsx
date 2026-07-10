import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { QuotationsPage } from "./quotations-page";
import { createMockQuotationApi } from "../quotation";

describe("QuotationsPage", () => {
  it("loads and lists seeded quotations with the stat row", async () => {
    render(<QuotationsPage api={createMockQuotationApi()} />);
    expect(await screen.findByText("Q-1001")).toBeInTheDocument();
    expect(screen.getByText("Total Quotations")).toBeInTheDocument();
  });

  it("opens a quotation into detail view on row click", async () => {
    render(<QuotationsPage api={createMockQuotationApi()} />);
    await userEvent.click(await screen.findByText("Q-1001"));
    expect(await screen.findByRole("button", { name: /submit for approval/i })).toBeInTheDocument();
  });

  it("edit action jumps straight to the form", async () => {
    render(<QuotationsPage api={createMockQuotationApi()} />);
    await screen.findByText("Q-1001");
    await userEvent.click(screen.getByRole("button", { name: /edit Q-1001/i }));
    expect(await screen.findByLabelText(/customer name/i)).toBeInTheDocument();
  });

  it("new action opens an empty form", async () => {
    render(<QuotationsPage api={createMockQuotationApi()} />);
    await userEvent.click(await screen.findByRole("button", { name: /new quotation/i }));
    expect(await screen.findByLabelText(/customer name/i)).toBeInTheDocument();
  });

  it("deletes a quotation after confirmation", async () => {
    render(<QuotationsPage api={createMockQuotationApi()} />);
    await screen.findByText("Q-1005");
    await userEvent.click(screen.getByRole("button", { name: /delete Q-1005/i }));
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(within(dialog).getByRole("button", { name: /^delete$/i }));
    await waitFor(() => expect(screen.queryByText("Q-1005")).not.toBeInTheDocument());
  });

  it("has no axe violations on the landing view", async () => {
    const { container } = render(<QuotationsPage api={createMockQuotationApi()} />);
    await screen.findByText("Q-1001");
    expect(await axe(container)).toHaveNoViolations();
  });
});
