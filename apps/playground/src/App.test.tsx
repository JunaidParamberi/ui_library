import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { routes } from "./router";
import { StateToggleProvider } from "./data/state-toggle";
import { Dashboard } from "./screens/Dashboard";

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
}

describe("Playground app frame", () => {
  it("renders the shell and Dashboard at /", () => {
    renderAt("/");
    expect(screen.getByText("ManpowerHub")).toBeInTheDocument();
    expect(
      screen.getByText("Overview of your workforce and quotations."),
    ).toBeInTheDocument();
  });

  it("renders the quotations list route", () => {
    renderAt("/quotations");
    expect(
      screen.getByText("Create, review, and approve quotations."),
    ).toBeInTheDocument();
  });

  it("renders a quotation detail route", async () => {
    renderAt("/quotations/abc");
    expect(await screen.findByText("Select a quotation")).toBeInTheDocument();
  });
});

describe("Quotation detail route", () => {
  it("shows the select-a-quotation placeholder for an unknown id", async () => {
    renderAt("/quotations/does-not-exist");
    expect(await screen.findByText("Select a quotation")).toBeInTheDocument();
  });
});

describe("Dashboard states", () => {
  it("shows the empty state when forced empty", () => {
    render(
      <StateToggleProvider initial="empty">
        <Dashboard />
      </StateToggleProvider>,
    );
    expect(screen.getByText("Nothing to show yet")).toBeInTheDocument();
  });

  it("shows retry when forced error", () => {
    render(
      <StateToggleProvider initial="error">
        <Dashboard />
      </StateToggleProvider>,
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("renders KPIs when forced loaded", () => {
    render(
      <StateToggleProvider initial="loaded">
        <Dashboard />
      </StateToggleProvider>,
    );
    expect(screen.getByText("Active workers")).toBeInTheDocument();
  });
});

describe("Quotation form route", () => {
  it("mounts the new-quotation form", () => {
    renderAt("/quotations/new");
    // The form renders synchronously in create mode (ready = true).
    // Assert a stable form control label from the QuotationForm block.
    expect(document.querySelector("form")).toBeTruthy();
  });
});
