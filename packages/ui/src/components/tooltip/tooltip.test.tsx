import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../../index";

function Fixture() {
  return (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Helpful text</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe("Tooltip", () => {
  it("renders trigger", () => {
    render(<Fixture />);
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("shows content when open", () => {
    render(<Fixture />);
    expect(screen.getAllByText("Helpful text")[0]).toBeInTheDocument();
  });

  it("merges consumer className on content", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent className="custom-class">Text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getAllByText("Text")[0]).toHaveClass("custom-class");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Fixture />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
