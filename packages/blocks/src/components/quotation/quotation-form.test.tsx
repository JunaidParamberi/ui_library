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
  it("blocks submit when the customer email is invalid", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/email/i), "foo@bar");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/valid customer email is required/i)).toBeInTheDocument();
  });
  it("blocks submit when no item has a category", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/email/i), "a@acme.com");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/at least one item is required/i)).toBeInTheDocument();
  });
  it("adds and removes item rows", async () => {
    render(<QuotationForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /add item/i }));
    expect(screen.getAllByLabelText(/category/i).length).toBe(2);
    await userEvent.click(screen.getAllByRole("button", { name: /remove item/i })[0]!);
    expect(screen.getAllByLabelText(/category/i).length).toBe(1);
  });
  it("edits phone, address, date and OT rate fields", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/email/i), "a@acme.com");
    await userEvent.type(screen.getByLabelText(/phone number/i), "12345");
    await userEvent.type(screen.getByLabelText(/address/i), "Somewhere");
    await userEvent.clear(screen.getByLabelText(/quotation date/i));
    await userEvent.type(screen.getByLabelText(/quotation date/i), "2026-07-09");
    await userEvent.type(screen.getByLabelText(/category/i), "Mason");
    await userEvent.type(screen.getByLabelText(/^ot rate/i), "10");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    const data = onSubmit.mock.calls[0]![0];
    expect(data.customer.phoneNumber).toBe("12345");
    expect(data.customer.address).toBe("Somewhere");
    expect(data.items[0].otRate).toBe("10");
  });
  it("adds an approver and includes it in the submitted payload", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/^email/i), "a@acme.com");
    await userEvent.type(screen.getByLabelText(/category/i), "Mason");
    await userEvent.click(screen.getByRole("button", { name: /add approver/i }));
    await userEvent.type(screen.getByLabelText(/approver name/i), "Boss");
    await userEvent.type(screen.getByLabelText(/approver email/i), "boss@acme.com");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSubmit).toHaveBeenCalledOnce();
    const data = onSubmit.mock.calls[0]![0];
    expect(data.approvers).toHaveLength(1);
    expect(data.approvers[0].approverName).toBe("Boss");
    expect(data.approvers[0].approverEmail).toBe("boss@acme.com");
    expect(data.approvers[0].decision).toBe("PENDING");
    expect(data.approvers[0].approverId).toBeTruthy();
  });
  it("blocks submit when an approver has an invalid email", async () => {
    const onSubmit = vi.fn();
    render(<QuotationForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/customer name/i), "Acme");
    await userEvent.type(screen.getByLabelText(/^email/i), "a@acme.com");
    await userEvent.type(screen.getByLabelText(/category/i), "Mason");
    await userEvent.click(screen.getByRole("button", { name: /add approver/i }));
    await userEvent.type(screen.getByLabelText(/approver name/i), "Boss");
    await userEvent.type(screen.getByLabelText(/approver email/i), "boss@bar");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/valid email is required for each approver/i)).toBeInTheDocument();
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
