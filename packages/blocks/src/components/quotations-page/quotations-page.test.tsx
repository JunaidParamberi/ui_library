import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { QuotationsPage } from "./quotations-page";

const findFirstRowButton = async () => {
  // list pane rows are buttons labelled "Open <number>"
  const btns = await screen.findAllByRole("button", { name: /open q/i });
  return btns[0];
};

describe("QuotationsPage (master-detail)", () => {
  it("shows placeholder until a row is opened, then detail", async () => {
    render(<QuotationsPage />);
    expect(await screen.findByText(/select a quotation/i)).toBeInTheDocument();
    await userEvent.click(await findFirstRowButton());
    // detail header shows Full view + Edit
    expect(await screen.findByRole("button", { name: /full view/i })).toBeInTheDocument();
  });

  it("Full view swaps to the document, back returns to split", async () => {
    render(<QuotationsPage />);
    await userEvent.click(await findFirstRowButton());
    await userEvent.click(await screen.findByRole("button", { name: /full view/i }));
    expect(await screen.findByRole("button", { name: /back/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(await screen.findByRole("button", { name: /full view/i })).toBeInTheDocument();
  });

  it("Edit opens the form and returns to detail on cancel", async () => {
    render(<QuotationsPage />);
    await userEvent.click(await findFirstRowButton());
    await userEvent.click(await screen.findByRole("button", { name: /^edit$/i }));
    const cancel = await screen.findByRole("button", { name: /cancel/i });
    await userEvent.click(cancel);
    expect(await screen.findByRole("button", { name: /full view/i })).toBeInTheDocument();
  });

  it("is axe clean on the split view", async () => {
    const { container } = render(<QuotationsPage />);
    await findFirstRowButton();
    expect(await axe(container)).toHaveNoViolations();
  });
});
