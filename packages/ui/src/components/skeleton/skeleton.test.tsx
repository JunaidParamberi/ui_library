import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Skeleton, Spinner } from "../../index";

describe("Skeleton", () => {
  it("renders with pulse animation class", () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveClass("animate-pulse");
  });

  it("merges consumer className", () => {
    render(<Skeleton data-testid="sk" className="h-4 w-32" />);
    expect(screen.getByTestId("sk")).toHaveClass("h-4", "w-32");
  });
});

describe("Spinner", () => {
  it("has role status for a11y", () => {
    render(<Spinner aria-label="Loading" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("applies the size variant", () => {
    render(<Spinner size="lg" aria-label="Loading" />);
    expect(screen.getByRole("status")).toHaveClass("size-6");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Spinner aria-label="Loading" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
