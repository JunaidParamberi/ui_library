import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { routes } from "./router";

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
}

describe("Playground app frame", () => {
  it("renders the shell and Dashboard at /", () => {
    renderAt("/");
    expect(screen.getByText("ManpowerHub")).toBeInTheDocument();
    expect(screen.getByText(/Dashboard — coming in a later task/)).toBeInTheDocument();
  });

  it("renders the quotations list route", () => {
    renderAt("/quotations");
    expect(screen.getByText(/Quotations list/)).toBeInTheDocument();
  });

  it("renders a quotation detail route", () => {
    renderAt("/quotations/abc");
    expect(screen.getByText(/Quotation detail/)).toBeInTheDocument();
  });
});
