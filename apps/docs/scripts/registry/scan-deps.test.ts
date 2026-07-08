import { describe, it, expect } from "vitest";
import { scanNpmDeps } from "./scan-deps";

describe("scanNpmDeps", () => {
  it("collects npm specifiers, excluding react and aliases", () => {
    const src = [
      `import * as React from "react";`,
      `import { cva } from "class-variance-authority";`,
      `import { Check } from "lucide-react";`,
      `import { Slot } from "@radix-ui/react-slot";`,
      `import { cn } from "@/lib/utils";`,
    ].join("\n");
    expect(scanNpmDeps(src).sort()).toEqual(
      ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"],
    );
  });

  it("reduces deep import paths to package root", () => {
    const src = `import x from "date-fns/format";`;
    expect(scanNpmDeps(src)).toEqual(["date-fns"]);
  });
});
