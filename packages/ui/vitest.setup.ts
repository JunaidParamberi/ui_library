import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import { axe } from "vitest-axe";

// Register toHaveNoViolations matcher compatible with vitest 2.x
expect.extend({
  async toHaveNoViolations(received) {
    const result = typeof received.then === "function" ? await received : received;
    const violations = result.violations ?? [];
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

export { axe };
