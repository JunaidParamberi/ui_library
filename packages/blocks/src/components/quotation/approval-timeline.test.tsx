import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { ApprovalTimeline } from "./approval-timeline";
import type { ApprovalStep } from "./quotation.types";

const steps: ApprovalStep[] = [
  { approverId: "u1", approverName: "Lena", approverEmail: "l@x.com", decision: "APPROVED", comment: "ok" },
  { approverId: "u2", approverName: "Sam", approverEmail: "s@x.com", decision: "PENDING" },
];

describe("ApprovalTimeline", () => {
  it("renders each approver and decision", () => {
    render(<ApprovalTimeline steps={steps} />);
    expect(screen.getByText("Lena")).toBeInTheDocument();
    expect(screen.getByText("ok")).toBeInTheDocument();
    expect(screen.getByText("Approved")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
  it("renders an empty state when no approvers", () => {
    render(<ApprovalTimeline steps={[]} />);
    expect(screen.getByText(/no approvers/i)).toBeInTheDocument();
  });
  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<ApprovalTimeline ref={ref} className="px" steps={steps} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<ApprovalTimeline steps={steps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
  it("renders a state-colored tile per decision", () => {
    render(<ApprovalTimeline steps={[
      { approverId: "a", approverName: "Ada", approverEmail: "ada@x.com", decision: "APPROVED" },
      { approverId: "b", approverName: "Ben", approverEmail: "ben@x.com", decision: "PENDING" },
    ]} />);
    expect(screen.getByTestId("tl-tile-a")).toHaveAttribute("data-decision", "APPROVED");
    expect(screen.getByTestId("tl-tile-b")).toHaveAttribute("data-decision", "PENDING");
  });
});
