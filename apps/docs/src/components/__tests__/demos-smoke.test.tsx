/// <reference types="vite/client" />
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

type AxeResults = Awaited<ReturnType<typeof axe>>;

// `vitest-axe`'s own `extend-expect` entry point ships an empty JS file in
// the installed 0.1.0 package (a known upstream packaging bug — its .d.ts
// promises a matcher its .js never registers), so the matcher is defined
// locally instead of relying on that broken subpath export.
expect.extend({
  toHaveNoViolations(results: AxeResults) {
    const pass = results.violations.length === 0;
    return {
      pass,
      message: () =>
        pass
          ? "expected axe results to contain accessibility violations"
          : `expected no accessibility violations, found:\n${JSON.stringify(results.violations, null, 2)}`,
    };
  },
});

declare module "vitest" {
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
}

const modules = import.meta.glob("../demos/*.tsx", { eager: true });

describe("all demos", () => {
  for (const [file, mod] of Object.entries(modules)) {
    const entries = Object.entries(mod as Record<string, unknown>).filter(
      ([, v]) => typeof v === "function",
    );
    for (const [name, Comp] of entries) {
      it(`${file} › ${name} renders without crash and is axe-clean`, async () => {
        const Component = Comp as () => JSX.Element;
        const { container, unmount } = render(<Component />);
        expect(await axe(container)).toHaveNoViolations();
        unmount();
      });
    }
  }
});
