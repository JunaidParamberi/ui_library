import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarFallback } from "../../index";

describe("Avatar", () => {
  it("renders fallback initials when no image loads", () => {
    render(
      <Avatar>
        <AvatarFallback>JP</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("JP")).toBeInTheDocument();
  });

  it("merges consumer className on the root", () => {
    render(
      <Avatar className="custom-class" data-testid="avatar-root">
        <AvatarFallback>JP</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByTestId("avatar-root")).toHaveClass("custom-class");
  });

  it("applies the size variant class", () => {
    render(
      <Avatar size="lg" data-testid="avatar-root">
        <AvatarFallback>JP</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByTestId("avatar-root")).toHaveClass("size-12");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>JP</AvatarFallback>
      </Avatar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
