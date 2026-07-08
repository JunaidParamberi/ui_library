import { describe, it, expect } from "vitest";
import { rewriteImports } from "./rewrite-imports";

const map = new Map<string, string>([
  ["Card", "card"], ["CardBody", "card"], ["Button", "button"],
  ["Badge", "badge"], ["cn", "utils"],
]);

describe("rewriteImports", () => {
  it("splits a barrel import into per-module alias imports", () => {
    const src = `import { Card, CardBody, Button, Badge, cn } from "@manpowerhub/ui";\n`;
    const { code, registryDeps } = rewriteImports(src, map, "block");
    expect(code).toContain(`from "@/components/ui/card"`);
    expect(code).toContain(`from "@/components/ui/button"`);
    expect(code).toContain(`from "@/components/ui/badge"`);
    expect(code).toContain(`from "@/lib/utils"`);
    expect(code).not.toContain("@manpowerhub");
    expect(registryDeps).toEqual(new Set(["card", "button", "badge", "utils"]));
  });

  it("groups multiple symbols from the same module into one import", () => {
    const src = `import { Card, CardBody } from "@manpowerhub/ui";\n`;
    const { code } = rewriteImports(src, map, "block");
    const cardImports = code.match(/from "@\/components\/ui\/card"/g) ?? [];
    expect(cardImports).toHaveLength(1);
    expect(code).toMatch(/import \{ Card, CardBody \} from "@\/components\/ui\/card"/);
  });

  it("leaves type-only imports intact", () => {
    const src = `import { KPICard, type KPI } from "@manpowerhub/ui";\n`;
    const m = new Map([["KPICard", "kpi-card"], ["KPI", "kpi-card"]]);
    const { code } = rewriteImports(src, m, "block");
    expect(code).toMatch(/import \{ KPICard, type KPI \} from "@\/components\/ui\/kpi-card"/);
  });
});
