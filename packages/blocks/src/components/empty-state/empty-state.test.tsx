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

  it("applies the dashed variant class", () => {
    const { container } = render(<EmptyState variant="dashed" title="Empty" />);
    expect(container.firstChild).toHaveClass("border-dashed");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <EmptyState title="No data" description="Nothing yet" action={{ label: "Add", onClick: () => {} }} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
