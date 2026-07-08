import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../generated/props.generated.json", () => ({
  default: {
    Button: [
      { name: "variant", type: '"primary" | "secondary"', defaultValue: "secondary", required: false, description: "Style" },
    ],
  },
}));

import { PropsTable } from "../props-table";

describe("PropsTable", () => {
  it("renders rows for a known component", () => {
    render(<PropsTable of="Button" />);
    expect(screen.getByText("variant")).toBeInTheDocument();
    expect(screen.getByText("secondary")).toBeInTheDocument();
  });

  it("renders fallback for unknown component", () => {
    render(<PropsTable of="Nope" />);
    expect(screen.getByText(/no documented props/i)).toBeInTheDocument();
  });
});
