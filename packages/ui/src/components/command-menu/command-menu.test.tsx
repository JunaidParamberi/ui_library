import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CommandMenu } from "../../index";

const items = [
  { id: "new", label: "New project", onSelect: vi.fn(), group: "Actions" },
  { id: "settings", label: "Open settings", onSelect: vi.fn(), group: "Actions" },
];

describe("CommandMenu", () => {
  it("renders items when open", () => {
    render(<CommandMenu open onOpenChange={() => {}} items={items} />);
    expect(screen.getByText("New project")).toBeInTheDocument();
    expect(screen.getByText("Open settings")).toBeInTheDocument();
  });

  it("filters items by typed query", async () => {
    const user = userEvent.setup();
    render(<CommandMenu open onOpenChange={() => {}} items={items} />);
    await user.type(screen.getByPlaceholderText(/type a command/i), "settings");
    expect(screen.queryByText("New project")).not.toBeInTheDocument();
    expect(screen.getByText("Open settings")).toBeInTheDocument();
  });

  it("calls the item's onSelect when chosen", async () => {
    const user = userEvent.setup();
    render(<CommandMenu open onOpenChange={() => {}} items={items} />);
    await user.click(screen.getByText("New project"));
    expect(items[0]!.onSelect).toHaveBeenCalled();
  });
});
