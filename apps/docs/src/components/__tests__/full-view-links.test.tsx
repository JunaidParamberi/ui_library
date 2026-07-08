import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FullViewLinks } from "../full-view-links";

describe("FullViewLinks", () => {
  it("links to storybook and playground for a known slug", () => {
    render(<FullViewLinks slug="button" />);
    const sb = screen.getByRole("link", { name: /storybook/i });
    expect(sb).toHaveAttribute("href", expect.stringContaining("core-button--primary"));
    const pg = screen.getByRole("link", { name: /playground/i });
    expect(pg).toHaveAttribute("href", expect.stringContaining("#button"));
  });
});
