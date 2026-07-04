import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { PageHeader } from "./page-header";

describe("PageHeader", () => {
  it("renders the title as a heading and the description", () => {
    render(<PageHeader title="Team" description="Manage members" />);
    expect(screen.getByRole("heading", { name: "Team" })).toBeInTheDocument();
    expect(screen.getByText("Manage members")).toBeInTheDocument();
  });

  it("renders a badge and actions", () => {
    render(<PageHeader title="Team" badge={<span>Beta</span>} actions={<button>Invite</button>} />);
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument();
  });

  it("renders breadcrumbs as a nav landmark", () => {
    render(
      <PageHeader
        title="Settings"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }]}
      />,
    );
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  });

  it("forwards className and ref to the header element", () => {
    const ref = { current: null as HTMLElement | null };
    const { container } = render(<PageHeader ref={ref} className="hx" title="T" />);
    expect(ref.current?.tagName).toBe("HEADER");
    expect(container.firstChild).toHaveClass("hx");
  });

  it("applies the bordered variant class", () => {
    const { container } = render(<PageHeader bordered title="T" />);
    expect(container.firstChild).toHaveClass("border-b");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <PageHeader title="Team" description="Manage members" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Team" }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
