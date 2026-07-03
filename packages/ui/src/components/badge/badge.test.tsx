import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Badge, StatusBadge } from "../../index";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("merges consumer className", () => {
    render(<Badge className="custom">X</Badge>);
    expect(screen.getByText("X")).toHaveClass("custom");
  });

  it("renders dot when dot=true", () => {
    const { container } = render(<Badge dot>Paid</Badge>);
    expect(container.querySelectorAll('[aria-hidden]')).toHaveLength(1);
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Badge variant="success">Paid</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("StatusBadge", () => {
  it("renders correct label for status", () => {
    render(<StatusBadge status="paid" />);
    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders all 17 statuses without crash", () => {
    const statuses = ["paid","sent","draft","overdue","partially_paid","written_off",
      "active","planning","on hold","done","todo","in_progress","cancelled",
      "high","med","low","approved"] as const;
    const { unmount } = render(<div>{statuses.map(s => <StatusBadge key={s} status={s} />)}</div>);
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Written off")).toBeInTheDocument();
    unmount();
  });

  it("forwards className via forwardRef", () => {
    render(<StatusBadge status="draft" className="custom-status" />);
    expect(document.querySelector(".custom-status")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<StatusBadge status="active" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
