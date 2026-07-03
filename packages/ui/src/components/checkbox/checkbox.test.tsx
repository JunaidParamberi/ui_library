import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Checkbox, Switch, RadioGroup, RadioGroupItem } from "../../index";

describe("Checkbox", () => {
  it("renders with label", () => {
    render(<Checkbox label="Accept terms" id="cb" />);
    expect(screen.getByLabelText("Accept terms")).toBeInTheDocument();
  });

  it("merges consumer className", () => {
    render(<Checkbox className="custom" id="cb2" />);
    expect(document.querySelector("#cb2")).toHaveClass("custom");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Checkbox label="Accept terms" id="cb3" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Switch", () => {
  it("renders with label", () => {
    render(<Switch label="Dark mode" id="sw" />);
    expect(screen.getByLabelText("Dark mode")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Switch label="Notifications" id="sw2" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("RadioGroup", () => {
  it("renders radio items", () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" id="r1" aria-label="Option A" />
        <RadioGroupItem value="b" id="r2" aria-label="Option B" />
      </RadioGroup>
    );
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });
});
