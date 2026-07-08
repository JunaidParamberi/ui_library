import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ComponentPreview } from "../component-preview";

describe("ComponentPreview", () => {
  it("renders preview only when no source", () => {
    render(
      <ComponentPreview>
        <span>demo</span>
      </ComponentPreview>,
    );
    expect(screen.getByText("demo")).toBeVisible();
    expect(screen.queryByRole("tab", { name: /code/i })).toBeNull();
  });

  it("shows Code tab and copies source", async () => {
    const writeText = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(
      <ComponentPreview source={"<Button>Hi</Button>"}>
        <span>demo</span>
      </ComponentPreview>,
    );
    await userEvent.click(screen.getByRole("tab", { name: /code/i }));
    expect(screen.getByText(/<Button>Hi<\/Button>/)).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: /copy/i }));
    expect(writeText).toHaveBeenCalledWith("<Button>Hi</Button>");
  });

  it("toggles dark class on the preview container", async () => {
    render(
      <ComponentPreview source={"<Button>Hi</Button>"}>
        <span>demo</span>
      </ComponentPreview>,
    );
    const container = screen.getByTestId("component-preview-container");
    expect(container).not.toHaveClass("dark");

    const toggle = screen.getByRole("button", { name: /toggle dark preview/i });
    await userEvent.click(toggle);
    expect(container).toHaveClass("dark");

    await userEvent.click(toggle);
    expect(container).not.toHaveClass("dark");
  });
});
