import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../index";

function Fixture() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
          <TableCell>Engineer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  it("renders as a table with headers and cells", () => {
    render(<Fixture />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
  });

  it("merges consumer className on root", () => {
    render(<Table className="custom-class"><TableBody><TableRow><TableCell>x</TableCell></TableRow></TableBody></Table>);
    expect(screen.getByRole("table")).toHaveClass("custom-class");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Fixture />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
