import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, it, expect, vi } from "vitest";
import { AuthForm } from "./auth-form";

function setup(overrides = {}) {
  const props = {
    email: { value: "", onChange: vi.fn() },
    password: { value: "", onChange: vi.fn() },
    onSubmit: vi.fn((e) => e.preventDefault()),
    ...overrides,
  };
  render(<AuthForm {...props} />);
  return props;
}

describe("AuthForm", () => {
  it("renders email and password inputs", () => {
    setup();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("calls email.onChange with the typed value", async () => {
    const props = setup();
    await userEvent.type(screen.getByLabelText(/email/i), "a");
    expect(props.email.onChange).toHaveBeenCalledWith("a");
  });

  it("submits the form via the submit button", async () => {
    const props = setup();
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(props.onSubmit).toHaveBeenCalledOnce();
  });

  it("shows a signup CTA when mode is signup", () => {
    setup({ mode: "signup" });
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("renders the error in an alert region", () => {
    setup({ error: "Invalid credentials" });
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
  });

  it("disables the submit button when loading", () => {
    setup({ loading: true });
    expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
  });

  it("forwards className and ref to the form", () => {
    const ref = { current: null as HTMLFormElement | null };
    setup({ ref, className: "fx" } as any);
    expect(ref.current?.tagName).toBe("FORM");
    expect(ref.current).toHaveClass("fx");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <AuthForm
        email={{ value: "a@b.com", onChange: () => {} }}
        password={{ value: "secret", onChange: () => {} }}
        onSubmit={(e) => e.preventDefault()}
        error="Invalid credentials"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
