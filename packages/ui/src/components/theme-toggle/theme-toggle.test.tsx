import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "../../index";

describe("ThemeToggle", () => {
  it("shows a moon icon when theme is light (switch to dark)", () => {
    render(<ThemeToggle theme="light" onThemeChange={() => {}} />);
    expect(screen.getByRole("button", { name: /switch to dark theme/i })).toBeInTheDocument();
  });

  it("shows a sun icon when theme is dark (switch to light)", () => {
    render(<ThemeToggle theme="dark" onThemeChange={() => {}} />);
    expect(screen.getByRole("button", { name: /switch to light theme/i })).toBeInTheDocument();
  });

  it("calls onThemeChange with the opposite theme on click", async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();
    render(<ThemeToggle theme="light" onThemeChange={onThemeChange} />);
    await user.click(screen.getByRole("button"));
    expect(onThemeChange).toHaveBeenCalledWith("dark");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<ThemeToggle theme="light" onThemeChange={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
