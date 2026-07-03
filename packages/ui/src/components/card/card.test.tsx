import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "../../index";

describe("Card", () => {
  it("renders children", () => {
    render(<Card><CardBody>Hello</CardBody></Card>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("merges consumer className", () => {
    render(<Card className="custom-card"><CardBody>X</CardBody></Card>);
    expect(document.querySelector(".custom-card")).toBeInTheDocument();
  });

  it("applies interactive class via cva", () => {
    const { container } = render(<Card interactive><CardBody>X</CardBody></Card>);
    expect(container.firstChild).toHaveClass("cursor-pointer");
  });

  it("applies dashed class via cva", () => {
    const { container } = render(<Card dashed><CardBody>X</CardBody></Card>);
    expect(container.firstChild).toHaveClass("border-dashed");
  });

  it("renders compound components", () => {
    render(
      <Card>
        <CardHeader><CardTitle>Title</CardTitle></CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Card><CardBody>Content</CardBody></Card>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
