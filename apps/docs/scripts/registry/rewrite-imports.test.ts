import { describe, it, expect } from "vitest";
import { rewriteImports } from "./rewrite-imports";

const map = new Map([
  ["Card", { item: "card", file: "card" }],
  ["CardBody", { item: "card", file: "card" }],
  ["Button", { item: "button", file: "button" }],
  ["Badge", { item: "badge", file: "badge" }],
  ["cn", { item: "utils", file: "utils" }],
]);

describe("rewriteImports", () => {
  it("splits a barrel import into per-module alias imports", () => {
    const src = `import { Card, CardBody, Button, Badge, cn } from "@manpowerhub/ui";\n`;
    const { code, registryDeps } = rewriteImports(src, map);
    expect(code).toContain(`from "@/components/ui/card"`);
    expect(code).toContain(`from "@/components/ui/button"`);
    expect(code).toContain(`from "@/components/ui/badge"`);
    expect(code).toContain(`from "@/lib/utils"`);
    expect(code).not.toContain("@manpowerhub");
    expect(registryDeps).toEqual(new Set(["card", "button", "badge", "utils"]));
  });

  it("groups multiple symbols from the same module into one import", () => {
    const src = `import { Card, CardBody } from "@manpowerhub/ui";\n`;
    const { code } = rewriteImports(src, map);
    const cardImports = code.match(/from "@\/components\/ui\/card"/g) ?? [];
    expect(cardImports).toHaveLength(1);
    expect(code).toMatch(/import \{ Card, CardBody \} from "@\/components\/ui\/card"/);
  });

  it("leaves type-only imports intact", () => {
    const src = `import { KPICard, type KPI } from "@manpowerhub/ui";\n`;
    const m = new Map([
      ["KPICard", { item: "kpi-card", file: "kpi-card" }],
      ["KPI", { item: "kpi-card", file: "kpi-card" }],
    ]);
    const { code } = rewriteImports(src, m);
    expect(code).toMatch(/import \{ KPICard, type KPI \} from "@\/components\/ui\/kpi-card"/);
  });

  it("rewrites a barrel import of a non-eponymous multi-file symbol to its own file alias", () => {
    const src = `import { StatusBadge } from "@manpowerhub/ui";\n`;
    const m = new Map([["StatusBadge", { item: "badge", file: "status-badge" }]]);
    const { code, registryDeps } = rewriteImports(src, m);
    expect(code).toContain(`from "@/components/ui/status-badge"`);
    expect(registryDeps).toEqual(new Set(["badge"]));
  });

  it("rewrites a relative import of lib/utils to the @/lib/utils alias", () => {
    const src = `import { cn } from "../../lib/utils";\n`;
    const { code, registryDeps } = rewriteImports(src, map);
    expect(code).toContain(`from "@/lib/utils"`);
    expect(code).not.toContain("../");
    expect(registryDeps.has("utils")).toBe(true);
  });

  it("rewrites a relative sibling component import to the @/components/ui alias", () => {
    const src = `import { Card } from "../card";\n`;
    const { code, registryDeps } = rewriteImports(src, map);
    expect(code).toContain(`from "@/components/ui/card"`);
    expect(registryDeps.has("card")).toBe(true);
  });

  it("rewrites a relative sibling import while preserving the type modifier", () => {
    const src = `import { Button, type ButtonProps } from "../button";\n`;
    const { code, registryDeps } = rewriteImports(src, map);
    expect(code).toMatch(/import \{ Button, type ButtonProps \} from "@\/components\/ui\/button"/);
    expect(registryDeps.has("button")).toBe(true);
  });

  it("leaves same-dir imports unchanged and does not add a registry dep", () => {
    const src = `import { Badge } from "./badge";\n`;
    const { code, registryDeps } = rewriteImports(src, map);
    expect(code).toBe(src);
    expect(registryDeps.size).toBe(0);
  });
});
