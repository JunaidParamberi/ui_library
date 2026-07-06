import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../index";

function Fixture() {
  return (
    <Dialog open>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("renders title and description when open", () => {
    render(<Fixture />);
    expect(screen.getByText("Confirm action")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("has role dialog", () => {
    render(<Fixture />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("merges consumer className on content", () => {
    render(
      <Dialog open>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="custom-class">
          <DialogTitle>T</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toHaveClass("custom-class");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Fixture />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
