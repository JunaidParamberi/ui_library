import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { QuotationForm } from "./quotation-form";

const fill = async () => {
  await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
  await userEvent.type(screen.getByLabelText(/^email/i), "a@acme.com");
  await userEvent.type(screen.getByLabelText(/item details/i), "Mason");
  await userEvent.type(screen.getByLabelText(/^quantity/i), "2");
  await userEvent.type(screen.getByLabelText(/^rate/i), "100");
};

describe("QuotationForm", () => {
  it("submits DRAFT status from Save as Draft", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit.mock.calls[0]![0].status).toBe("DRAFT");
    expect(onSubmit.mock.calls[0]![0].items[0].category).toBe("Mason");
  });

  it("submits SENT status from Save and Send", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /save and send/i }));
    expect(onSubmit.mock.calls[0]![0].status).toBe("SENT");
  });

  it("preserves existing status when editing (does not downgrade to DRAFT)", async () => {
    const onSubmit = vi.fn();
    render(
      <QuotationForm onSubmit={onSubmit} onCancel={vi.fn()}
        initial={{ quotationNumber: "Q-1", quotationDate: "2026-07-09", status: "APPROVED",
          customer: { name: "Existing", address: "", phoneNumber: "", emailId: "e@e.com" },
          items: [{ category: "Helper", quantity: "1", rate: "50", otRate: "5" }],
          approvers: [], terms: "NET_30" }} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit.mock.calls[0]![0].status).toBe("APPROVED");
  });

  it("computes the amount cell from qty * rate", async () => {
    render(<QuotationForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/item details/i), "Mason");
    await userEvent.type(screen.getByLabelText(/^quantity/i), "3");
    await userEvent.type(screen.getByLabelText(/^rate/i), "50");
    expect(screen.getByTestId("row-amount-0")).toHaveTextContent("150.00");
  });

  it("captures terms, due date, notes and item description", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await fill();
    await userEvent.type(screen.getByLabelText(/due date/i), "2026-07-20");
    await userEvent.type(screen.getByLabelText(/customer notes/i), "Cheers");
    await userEvent.type(screen.getByLabelText(/terms & conditions/i), "Net terms");
    await userEvent.type(screen.getByLabelText(/description/i), "Grade A");
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    const data = onSubmit.mock.calls[0]![0];
    expect(data.dueDate).toBe("2026-07-20");
    expect(data.customerNotes).toBe("Cheers");
    expect(data.termsAndConditions).toBe("Net terms");
    expect(data.items[0].description).toBe("Grade A");
  });

  it("blocks submit when required fields are missing", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/customer name is required/i)).toBeInTheDocument();
  });

  it("blocks submit when the customer email is invalid", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/^email/i), "foo@bar");
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/valid customer email is required/i)).toBeInTheDocument();
  });

  it("blocks submit when no item has details", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/^email/i), "a@acme.com");
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    expect(screen.getByText(/at least one item is required/i)).toBeInTheDocument();
  });

  it("adds and removes item rows", async () => {
    render(<QuotationForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /add new row/i }));
    expect(screen.getAllByLabelText(/item details/i).length).toBe(2);
    await userEvent.click(screen.getAllByRole("button", { name: /remove item/i })[0]!);
    expect(screen.getAllByLabelText(/item details/i).length).toBe(1);
  });

  it("adds an approver and includes it in the payload", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /add approver/i }));
    await userEvent.type(screen.getByLabelText(/approver name/i), "Boss");
    await userEvent.type(screen.getByLabelText(/approver email/i), "boss@acme.com");
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    const data = onSubmit.mock.calls[0]![0];
    expect(data.approvers).toHaveLength(1);
    expect(data.approvers[0].decision).toBe("PENDING");
  });

  it("blocks submit when an approver email is invalid", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await fill();
    await userEvent.click(screen.getByRole("button", { name: /add approver/i }));
    await userEvent.type(screen.getByLabelText(/approver name/i), "Boss");
    await userEvent.type(screen.getByLabelText(/approver email/i), "boss@bar");
    await userEvent.click(screen.getByRole("button", { name: /save as draft/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/valid email is required for each approver/i)).toBeInTheDocument();
  });

  it("includes OT total in the totals card", async () => {
    render(<QuotationForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/item details/i), "Mason");
    await userEvent.type(screen.getByLabelText(/^quantity/i), "2");
    await userEvent.type(screen.getByLabelText(/^rate/i), "100");
    await userEvent.type(screen.getByLabelText(/^ot rate/i), "10");
    expect(screen.getByTestId("form-subtotal")).toHaveTextContent("200.00");
    expect(screen.getByTestId("form-ottotal")).toHaveTextContent("20.00");
    expect(screen.getByTestId("form-total")).toHaveTextContent("220.00");
  });

  it("prefills from initial", () => {
    render(
      <QuotationForm onSubmit={vi.fn()} onCancel={vi.fn()}
        initial={{ quotationNumber: "Q-1", quotationDate: "2026-07-09", status: "DRAFT",
          customer: { name: "Existing", address: "", phoneNumber: "", emailId: "e@e.com" },
          items: [{ category: "Helper", quantity: "1", rate: "50", otRate: "5" }],
          approvers: [], terms: "NET_30", dueDate: "2026-07-15", customerNotes: "Hi" }} />,
    );
    expect(screen.getByDisplayValue("Existing")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Helper")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Hi")).toBeInTheDocument();
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
