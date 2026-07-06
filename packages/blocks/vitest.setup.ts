import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import type { Assertion } from "vitest";
import { axe } from "vitest-axe";

// Radix UI uses ResizeObserver internally; jsdom does not implement it.
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

expect.extend({
  async toHaveNoViolations(received: any) {
    const violations = received.violations ?? [];
    const pass = violations.length === 0;
    return {
      pass,
      message: () =>
        pass
          ? "Expected accessibility violations but found none."
          : `Expected no accessibility violations but found ${violations.length}:\n` +
            violations
              .map(
                (v: { id: string; help: string; nodes: { html: string }[] }) =>
                  `  [${v.id}] ${v.help}\n` +
                  v.nodes.map((n) => `    ${n.html}`).join("\n"),
              )
              .join("\n"),
    };
  },
});

declare module "vitest" {
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
}

export {};
