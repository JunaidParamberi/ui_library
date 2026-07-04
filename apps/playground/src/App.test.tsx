import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("Playground App", () => {
  it("renders the nav and the kitchen-sink page with a Button", () => {
    render(<App />);
    expect(screen.getByText("Playground")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Primary" }),
    ).toBeInTheDocument();
  });
});
