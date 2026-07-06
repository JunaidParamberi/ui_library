import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No projects" description="Create one to begin" />);
    expect(screen.getByText("No projects")).toBeInTheDocument();
    expect(screen.getByText("Create one to begin")).toBeInTheDocument();
  });

  it("renders an action button and fires onClick", async () => {
    const onClick = vi.fn();
    render(<EmptyState title="Empty" action={{ label: "Add item", onClick }} />);
    await userEvent.click(screen.getByRole("button", { name: "Add item" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("forwards className and ref to the root", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <EmptyState ref={ref} className="custom-x" title="Empty" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("custom-x");
  });

  it("renders a dashed border for the dashed variant (via Card's dashed prop)", () => {
    const { container } = render(<EmptyState variant="dashed" title="Empty" />);
    expect(container.firstChild).toHaveClass("border-dashed");
  });

  it("renders the plain variant without a Card wrapper", () => {
    const { container } = render(
      <EmptyState variant="plain" title="Plain empty" description="No border here" />,
    );
    expect(container.firstChild).not.toHaveClass("border-dashed");
    expect(screen.getByText("Plain empty")).toBeInTheDocument();
  });

  it("renders secondaryAction button and fires its onClick", async () => {
    const secondaryOnClick = vi.fn();
    render(
      <EmptyState
        title="Empty"
        action={{ label: "Primary", onClick: vi.fn() }}
        secondaryAction={{ label: "Secondary", onClick: secondaryOnClick }}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Secondary" }));
    expect(secondaryOnClick).toHaveBeenCalledOnce();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <EmptyState title="No data" description="Nothing yet" action={{ label: "Add", onClick: () => {} }} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
