import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { PricingTable, type PricingTier } from "./pricing-table";

const tiers: PricingTier[] = [
  { name: "Starter", price: "$0", period: "/mo", features: ["1 seat", "Community support"], cta: { label: "Start free", onClick: vi.fn() } },
  { name: "Pro", price: "$29", period: "/mo", features: ["5 seats", "Priority support"], cta: { label: "Choose Pro", onClick: vi.fn() }, highlighted: true, badge: "Popular" },
];

describe("PricingTable", () => {
  it("renders each tier name, price, and features", () => {
    render(<PricingTable tiers={tiers} />);
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("$29")).toBeInTheDocument();
    expect(screen.getByText("Priority support")).toBeInTheDocument();
  });

  it("fires the tier CTA onClick", async () => {
    render(<PricingTable tiers={tiers} />);
    await userEvent.click(screen.getByRole("button", { name: "Choose Pro" }));
    expect(tiers[1]!.cta.onClick).toHaveBeenCalledOnce();
  });

  it("marks the highlighted tier with its badge", () => {
    render(<PricingTable tiers={tiers} />);
    expect(screen.getByText("Popular")).toBeInTheDocument();
  });

  it("renders a billing-period toggle and fires onChange", async () => {
    const onChange = vi.fn();
    render(<PricingTable tiers={tiers} billingPeriod={{ value: "monthly", onChange }} />);
    await userEvent.click(screen.getByRole("button", { name: /annual/i }));
    expect(onChange).toHaveBeenCalledWith("annual");
  });

  it("applies the columns grid class", () => {
    const { container } = render(<PricingTable tiers={tiers} columns={2} />);
    expect(container.querySelector(".sm\\:grid-cols-2")).toBeInTheDocument();
  });

  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<PricingTable ref={ref} className="px" tiers={tiers} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<PricingTable tiers={tiers} billingPeriod={{ value: "monthly", onChange: () => {} }} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
