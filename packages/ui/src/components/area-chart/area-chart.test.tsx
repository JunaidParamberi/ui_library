import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AreaChart, MiniBars } from "../../index";

describe("AreaChart", () => {
  it("renders one path for the area fill", () => {
    const { container } = render(
      <AreaChart data={[{ x: 0, y: 10 }, { x: 1, y: 30 }, { x: 2, y: 20 }]} />,
    );
    expect(container.querySelectorAll("path")).toHaveLength(2);
  });

  it("renders nothing but an empty svg when data is empty", () => {
    const { container } = render(<AreaChart data={[]} />);
    expect(container.querySelectorAll("path")).toHaveLength(0);
  });

  it("forwards className to the svg", () => {
    const { container } = render(<AreaChart data={[{ x: 0, y: 1 }]} className="custom-class" />);
    expect(container.querySelector("svg")).toHaveClass("custom-class");
  });
});

describe("MiniBars", () => {
  it("renders one rect per data point", () => {
    const { container } = render(<MiniBars data={[3, 8, 5, 12]} />);
    expect(container.querySelectorAll("rect")).toHaveLength(4);
  });

  it("forwards className to the svg", () => {
    const { container } = render(<MiniBars data={[1, 2]} className="custom-class" />);
    expect(container.querySelector("svg")).toHaveClass("custom-class");
  });
});
