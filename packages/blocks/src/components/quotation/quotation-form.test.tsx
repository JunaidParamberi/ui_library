import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { QuotationForm } from "./quotation-form";

describe("QuotationForm", () => {
  it("submits entered customer + item data", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/email/i), "a@acme.com");
    await userEvent.type(screen.getByLabelText(/category/i), "Mason");
    await userEvent.type(screen.getByLabelText(/^quantity/i), "2");
    await userEvent.type(screen.getByLabelText(/^rate/i), "100");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
    const data = onSubmit.mock.calls[0]![0];
    expect(data.customer.name).toBe("Acme");
    expect(data.items[0].category).toBe("Mason");
  });
  it("blocks submit when required fields are missing", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/customer name is required/i)).toBeInTheDocument();
  });
  it("adds and removes item rows", async () => {
    render(<QuotationForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /add item/i }));
    expect(screen.getAllByLabelText(/category/i).length).toBe(2);
  });
  it("prefills from initial", () => {
    render(
      <QuotationForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        initial={{
          quotationNumber: "Q-1", quotationDate: "2026-07-09", status: "DRAFT",
          customer: { name: "Existing", address: "", phoneNumber: "", emailId: "e@e.com" },
          items: [{ category: "Helper", quantity: "1", rate: "50", otRate: "5" }],
          approvers: [],
        }}
      />,
    );
    expect(screen.getByDisplayValue("Existing")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Helper")).toBeInTheDocument();
  });
  it("fires onCancel", async () => {
    const onCancel = vi.fn();
    render(<QuotationForm onSubmit={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
  it("forwards className and ref", () => {
    const ref = { current: null as HTMLFormElement | null };
    const { container } = render(<QuotationForm ref={ref} className="px" onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(ref.current).toBeInstanceOf(HTMLFormElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<QuotationForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
