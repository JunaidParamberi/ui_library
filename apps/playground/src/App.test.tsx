import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";

describe("Playground App", () => {
  it("renders the nav and the kitchen-sink page with a Button", () => {
    render(<App />);
    expect(screen.getByText("Playground")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Primary" }),
    ).toBeInTheDocument();
  });

  it("navigates to the Blocks page when clicking the nav link", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("button", { name: "Blocks" }));
    expect(screen.getByText("Blocks showcase")).toBeInTheDocument();
  });
});
