import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { StatusPill } from "./status-pill";

describe("StatusPill", () => {
  it("renders its label", () => {
    render(<StatusPill variant="success">Approved</StatusPill>);
    expect(screen.getByText("Approved")).toBeInTheDocument();
  });
  it("forwards className and ref", () => {
    const ref = { current: null as HTMLSpanElement | null };
    const { container } = render(<StatusPill ref={ref} className="px">Draft</StatusPill>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<StatusPill variant="warn" dot>Pending</StatusPill>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
