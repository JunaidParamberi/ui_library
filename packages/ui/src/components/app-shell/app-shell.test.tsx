import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { AppShell } from "../../index";

describe("AppShell", () => {
  it("renders sidebar, topbar, and children", () => {
    render(
      <AppShell sidebar={<nav>Sidebar content</nav>} topbar={<div>Topbar content</div>}>
        <p>Main content</p>
      </AppShell>,
    );
    expect(screen.getByText("Sidebar content")).toBeInTheDocument();
    expect(screen.getByText("Topbar content")).toBeInTheDocument();
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });

  it("hides the sidebar column when sidebarOpen is false", () => {
    render(
      <AppShell sidebar={<nav>Sidebar</nav>} topbar={<div>Top</div>} sidebarOpen={false}>
        <p>Content</p>
      </AppShell>,
    );
    expect(screen.queryByText("Sidebar")).not.toBeInTheDocument();
  });

  it("merges consumer className on root", () => {
    render(
      <AppShell
        className="custom-class"
        data-testid="shell"
        sidebar={<nav>S</nav>}
        topbar={<div>T</div>}
      >
        <p>C</p>
      </AppShell>,
    );
    expect(screen.getByTestId("shell")).toHaveClass("custom-class");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <AppShell sidebar={<nav>S</nav>} topbar={<div>T</div>}>
        <p>C</p>
      </AppShell>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
