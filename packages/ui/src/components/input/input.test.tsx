import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Input, Textarea, Field } from "../../index";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("merges consumer className", () => {
    render(<Input className="custom" placeholder="x" />);
    expect(screen.getByPlaceholderText("x")).toHaveClass("custom");
  });

  it("applies invalid styles when invalid prop set", () => {
    render(<Input invalid placeholder="x" />);
    expect(screen.getByPlaceholderText("x")).toHaveClass("border-destructive");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Field label="Name" htmlFor="name"><Input id="name" /></Field>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Textarea", () => {
  it("renders a textarea", () => {
    render(<Textarea placeholder="Notes" />);
    expect(screen.getByPlaceholderText("Notes")).toBeInTheDocument();
  });
});

describe("Field", () => {
  it("renders label and hint", () => {
    render(<Field label="Email" hint="We won't spam" htmlFor="e"><Input id="e" /></Field>);
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("We won't spam")).toBeInTheDocument();
  });

  it("renders error text", () => {
    render(<Field label="Email" error="Invalid email" htmlFor="e"><Input id="e" /></Field>);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });
});
