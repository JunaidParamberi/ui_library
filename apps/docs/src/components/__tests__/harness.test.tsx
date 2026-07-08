import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("test harness", () => {
  it("renders JSX in jsdom", () => {
    render(<button>ok</button>);
    expect(screen.getByRole("button", { name: "ok" })).toBeInTheDocument();
  });
});
