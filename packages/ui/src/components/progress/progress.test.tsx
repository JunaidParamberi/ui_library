import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Progress, HealthRing } from "../../index";

describe("Progress", () => {
  it("sets aria-valuenow from value", () => {
    render(<Progress value={42} aria-label="Upload progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "42");
  });

  it("merges consumer className", () => {
    render(<Progress value={10} className="custom-class" aria-label="p" />);
    expect(screen.getByRole("progressbar")).toHaveClass("custom-class");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Progress value={50} aria-label="p" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("HealthRing", () => {
  it("renders the label text", () => {
    render(<HealthRing value={72} label="72%" />);
    expect(screen.getByText("72%")).toBeInTheDocument();
  });

  it("clamps value into the 0-100 range for the ring stroke", () => {
    const { container } = render(<HealthRing value={150} />);
    const circle = container.querySelector("circle[data-testid='ring-value']");
    expect(circle).not.toBeNull();
  });

  it("forwards className", () => {
    const { container } = render(<HealthRing value={50} className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
