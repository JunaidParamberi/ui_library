import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { StatCardRow } from "./stat-card-row";
import type { KPI } from "@manpowerhub/ui";

const stats: KPI[] = [
  { label: "Revenue", value: "$12.4k", delta: "+8%", trend: "up" },
  { label: "Users", value: "1,204", delta: "-2%", trend: "down" },
  { label: "Churn", value: "1.1%" },
];

describe("StatCardRow", () => {
  it("renders one card per stat", () => {
    render(<StatCardRow stats={stats} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Churn")).toBeInTheDocument();
  });

  it("applies the columns grid class", () => {
    const { container } = render(<StatCardRow stats={stats} columns={4} />);
    expect(container.firstChild).toHaveClass("lg:grid-cols-4");
  });

  it("renders skeletons and no stat labels when loading", () => {
    render(<StatCardRow stats={stats} loading columns={3} />);
    expect(screen.queryByText("Revenue")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("stat-skeleton")).toHaveLength(3);
  });

  it("renders nothing but the grid when stats is empty", () => {
    const { container } = render(<StatCardRow stats={[]} />);
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });

  it("forwards className and ref", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<StatCardRow ref={ref} className="gx" stats={stats} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("gx");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<StatCardRow stats={stats} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
