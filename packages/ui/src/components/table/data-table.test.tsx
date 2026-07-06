import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DataTable } from "../../index";

interface Row { id: string; name: string; age: number }

const columns = [
  { key: "name", header: "Name" },
  { key: "age", header: "Age" },
];

const data: Row[] = [
  { id: "1", name: "Bea", age: 30 },
  { id: "2", name: "Ada", age: 25 },
];

describe("DataTable", () => {
  it("renders one row per data item", () => {
    render(<DataTable columns={columns} data={data} getRowId={(r) => r.id} />);
    expect(screen.getByText("Bea")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
  });

  it("sorts ascending then descending on header click", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={data} getRowId={(r) => r.id} />);
    await user.click(screen.getByText("Name"));
    let cells = screen.getAllByRole("cell").filter((_, i) => i % 2 === 0);
    expect(cells[0]).toHaveTextContent("Ada");
    await user.click(screen.getByText("Name"));
    cells = screen.getAllByRole("cell").filter((_, i) => i % 2 === 0);
    expect(cells[0]).toHaveTextContent("Bea");
  });

  it("renders custom cell content via render()", () => {
    render(
      <DataTable
        columns={[{ key: "name", header: "Name", render: (r: Row) => <strong>{r.name}!</strong> }]}
        data={data}
        getRowId={(r) => r.id}
      />,
    );
    expect(screen.getByText("Bea!")).toBeInTheDocument();
  });
});
