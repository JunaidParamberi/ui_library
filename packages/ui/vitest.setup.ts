import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import type { Assertion } from "vitest";
import { axe } from "vitest-axe";

// jsdom has no ResizeObserver; cmdk (CommandMenu) observes element size on mount.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;

// jsdom has no scrollIntoView; cmdk scrolls the selected item into view.
Element.prototype.scrollIntoView ??= function scrollIntoView() {};

// Register toHaveNoViolations matcher compatible with vitest 2.x
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
