import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Button } from "../../index";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("merges consumer className (customization contract)", () => {
    render(<Button className="custom-class">X</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("is disabled and aria-busy when loading", () => {
    render(<Button loading>Save</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
  });

  it("is disabled when disabled prop set", () => {
    render(<Button disabled>X</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders all 5 variants without crash", () => {
    const { unmount } = render(
      <div>
        {(["primary","secondary","ghost","danger","outline"] as const).map(v => (
          <Button key={v} variant={v}>{v}</Button>
        ))}
      </div>
    );
    expect(screen.getAllByRole("button")).toHaveLength(5);
    unmount();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Button>Accessible</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
