import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { MasterDetailShell } from "./master-detail-shell";

describe("MasterDetailShell", () => {
  it("shows placeholder when no selection", () => {
    render(
      <MasterDetailShell
        list={<div>LIST</div>}
        detail={<div>DETAIL</div>}
        detailPlaceholder={<div>PLACEHOLDER</div>}
        hasSelection={false}
      />,
    );
    expect(screen.getByText("LIST")).toBeInTheDocument();
    expect(screen.getByText("PLACEHOLDER")).toBeInTheDocument();
    expect(screen.queryByText("DETAIL")).not.toBeInTheDocument();
  });

  it("shows detail when hasSelection", () => {
    render(
      <MasterDetailShell
        list={<div>LIST</div>}
        detail={<div>DETAIL</div>}
        detailPlaceholder={<div>PLACEHOLDER</div>}
        hasSelection
      />,
    );
    expect(screen.getByText("DETAIL")).toBeInTheDocument();
    expect(screen.queryByText("PLACEHOLDER")).not.toBeInTheDocument();
  });

  it("swaps to full view and hides list on isFull", () => {
    render(
      <MasterDetailShell
        list={<div>LIST</div>}
        detail={<div>DETAIL</div>}
        full={<div>FULL</div>}
        hasSelection
        isFull
      />,
    );
    expect(screen.getByText("FULL")).toBeInTheDocument();
    expect(screen.queryByText("LIST")).not.toBeInTheDocument();
    expect(screen.queryByText("DETAIL")).not.toBeInTheDocument();
  });

  it("fires onBack from the back control", async () => {
    const onBack = vi.fn();
    render(
      <MasterDetailShell list={<div>LIST</div>} full={<div>FULL</div>} isFull hasSelection onBack={onBack} />,
    );
    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("merges consumer style without dropping the list-width var", () => {
    render(
      <MasterDetailShell
        data-testid="shell"
        list={<div>LIST</div>}
        listWidth="30rem"
        style={{ marginTop: "8px" }}
      />,
    );
    const el = screen.getByTestId("shell");
    expect(el.style.getPropertyValue("--md-list-w")).toBe("30rem");
    expect(el.style.marginTop).toBe("8px");
  });

  it("forwards ref, className, and props; axe clean", async () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(
      <MasterDetailShell ref={ref} className="custom-x" data-testid="shell" list={<div>LIST</div>} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId("shell")).toHaveClass("custom-x");
    expect(await axe(container)).toHaveNoViolations();
  });
});
