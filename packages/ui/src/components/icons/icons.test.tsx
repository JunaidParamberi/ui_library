import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icons } from "../../index";

describe("Icons", () => {
  it("exposes ArrowUp, ArrowDown, Search, Check as components", () => {
    const { container: c1 } = render(<Icons.ArrowUp data-testid="i" />);
    const { container: c2 } = render(<Icons.Search data-testid="i" />);
    expect(c1.querySelector("svg")).not.toBeNull();
    expect(c2.querySelector("svg")).not.toBeNull();
  });

  it("forwards props like className to the underlying icon", () => {
    const { container } = render(<Icons.Check className="custom-class" />);
    expect(container.querySelector("svg")).toHaveClass("custom-class");
  });
});
