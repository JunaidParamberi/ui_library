import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../index";

function TestSelect() {
  return (
    <Select>
      <SelectTrigger aria-label="Pick fruit">
        <SelectValue placeholder="Select fruit…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("renders trigger with placeholder", () => {
    render(<TestSelect />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("has no a11y violations on trigger", async () => {
    const { container } = render(<TestSelect />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
