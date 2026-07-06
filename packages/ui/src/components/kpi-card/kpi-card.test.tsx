import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { KPICard } from "./kpi-card";

describe("KPICard", () => {
  it("renders the label and value", () => {
    render(<KPICard kpi={{ label: "Revenue", value: "$48.2k" }} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$48.2k")).toBeInTheDocument();
  });

  it("renders delta badge with up arrow for up trend", () => {
    render(
      <KPICard kpi={{ label: "Revenue", value: "$48.2k", delta: "+12%", trend: "up" }} />
    );
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("renders delta badge for down trend", () => {
    render(
      <KPICard kpi={{ label: "Churn", value: "1.4%", delta: "-0.2%", trend: "down" }} />
    );
    expect(screen.getByText("-0.2%")).toBeInTheDocument();
  });

  it("renders sub text when provided", () => {
    render(
      <KPICard kpi={{ label: "Revenue", value: "$48.2k", sub: "vs last month" }} />
    );
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });

  it("applies animation delay via delay prop", () => {
    const { container } = render(
      <KPICard kpi={{ label: "Revenue", value: "$48.2k" }} delay={2} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle("animation-delay: 120ms");
  });
});
