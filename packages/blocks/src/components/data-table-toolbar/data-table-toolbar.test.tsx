import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { DataTableToolbar } from "./data-table-toolbar";

describe("DataTableToolbar", () => {
  it("renders a search box and forwards typed input", async () => {
    const onChange = vi.fn();
    render(<DataTableToolbar search={{ value: "", onChange, placeholder: "Search…" }} />);
    await userEvent.type(screen.getByPlaceholderText("Search…"), "x");
    expect(onChange).toHaveBeenCalledWith("x");
  });

  it("renders provided actions", () => {
    render(
      <DataTableToolbar search={{ value: "", onChange: () => {} }} actions={<button>New</button>} />,
    );
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
  });

  it("shows the selected-count badge and bulk actions when count > 0", () => {
    render(
      <DataTableToolbar
        search={{ value: "", onChange: () => {} }}
        selectedCount={3}
        bulkActions={<button>Delete</button>}
      />,
    );
    expect(screen.getByText(/3 selected/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("hides the selected-count badge when count is 0", () => {
    render(<DataTableToolbar search={{ value: "", onChange: () => {} }} selectedCount={0} />);
    expect(screen.queryByText(/selected/i)).not.toBeInTheDocument();
  });

  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <DataTableToolbar ref={ref} className="tx" search={{ value: "", onChange: () => {} }} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("tx");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <DataTableToolbar search={{ value: "", onChange: () => {}, placeholder: "Search" }} actions={<button>New</button>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
