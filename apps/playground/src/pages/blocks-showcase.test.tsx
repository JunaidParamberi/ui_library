import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlocksShowcase } from "./blocks-showcase";

describe("BlocksShowcase", () => {
  it("renders the page heading", () => {
    render(<BlocksShowcase />);
    expect(screen.getByText("Blocks showcase")).toBeInTheDocument();
  });

  it("renders EmptyState section", () => {
    render(<BlocksShowcase />);
    expect(screen.getByText("No projects yet")).toBeInTheDocument();
  });

  it("renders AuthForm section", () => {
    render(<BlocksShowcase />);
    // "Sign in" appears as both the form heading and the submit button label
    expect(screen.getAllByText("Sign in").length).toBeGreaterThan(0);
  });

  it("renders StatCardRow stats", () => {
    render(<BlocksShowcase />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
  });

  it("renders PricingTable tiers", () => {
    render(<BlocksShowcase />);
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it("fires the EmptyState action onClick", async () => {
    render(<BlocksShowcase />);
    await userEvent.click(screen.getByRole("button", { name: "New project" }));
  });

  it("fires the PricingTable CTA buttons onClick", async () => {
    render(<BlocksShowcase />);
    await userEvent.click(screen.getByRole("button", { name: "Start free" }));
    await userEvent.click(screen.getByRole("button", { name: "Choose Pro" }));
    await userEvent.click(screen.getByRole("button", { name: "Contact sales" }));
  });

  it("submits the AuthForm", async () => {
    render(<BlocksShowcase />);
    await userEvent.click(screen.getAllByRole("button", { name: "Sign in" })[0]!);
  });
});
