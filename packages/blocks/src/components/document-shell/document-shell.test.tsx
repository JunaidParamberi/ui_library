import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, it, expect } from "vitest";
import { DocumentShell, ItemsTable, Totals, StatusPill } from "./document-shell";

const base = {
  type: "Quotation",
  id: "Q-1001",
  brand: { name: "Studio Marchetti", contact: ["lena@studio.com"] },
  parties: [
    { label: "Prepared for", name: "Northwind Labs", lines: "Mumbai" },
    { label: "Details", name: "Q-1001", lines: "2026-07-01" },
  ],
  status: <StatusPill variant="warn">Pending</StatusPill>,
};

describe("DocumentShell", () => {
  it("renders type, id, brand, parties and children", () => {
    render(<DocumentShell {...base}><p>body</p></DocumentShell>);
    expect(screen.getByText("Quotation")).toBeInTheDocument();
    expect(screen.getByText("Studio Marchetti")).toBeInTheDocument();
    expect(screen.getByText("Prepared for")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });
  it("renders a default brandmark from the first letter", () => {
    render(<DocumentShell {...base}><p>x</p></DocumentShell>);
    expect(screen.getByText("S")).toBeInTheDocument();
  });
  it("forwards className and ref to the sheet", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<DocumentShell ref={ref} className="px" {...base}><p>x</p></DocumentShell>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("px");
  });
  it("ItemsTable renders columns and rows", () => {
    render(
      <ItemsTable
        columns={[{ key: "a", header: "Scope" }, { key: "b", header: "Qty", align: "right" }]}
        rows={[{ a: "Design", b: "1" }]}
      />,
    );
    expect(screen.getByText("Scope")).toBeInTheDocument();
    expect(screen.getByText("Design")).toBeInTheDocument();
  });
  it("Totals renders labelled rows", () => {
    render(<Totals rows={[{ label: "Subtotal", value: "400.00" }, { label: "Total", value: "400.00", strong: true }]} />);
    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getAllByText("400.00").length).toBe(2);
  });
  it("has no a11y violations", async () => {
    const { container } = render(<DocumentShell {...base}><p>x</p></DocumentShell>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
