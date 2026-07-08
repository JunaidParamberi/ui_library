import { describe, it, expect, beforeAll } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { buildRegistry } from "./build-registry";

const ROOT = path.resolve(__dirname, "../../../..");
let reg: ReturnType<typeof buildRegistry>;

beforeAll(() => {
  const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), "reg-stage-"));
  reg = buildRegistry({
    uiSrc: path.join(ROOT, "packages/ui/src"),
    blocksSrc: path.join(ROOT, "packages/blocks/src"),
    utilsSrc: path.join(ROOT, "packages/ui/src/lib/utils.ts"),
    tokensSrc: path.join(ROOT, "packages/tokens/src"),
    outDir: path.join(ROOT, "apps/docs/public/r"),
    stageDir,
  });
});

describe("buildRegistry", () => {
  const item = (n: string) => reg.items.find((i) => i.name === n)!;

  it("emits a registry:ui item for button", () => {
    expect(item("button").type).toBe("registry:ui");
  });

  it("emits button files with type registry:ui so shadcn places them in components/ui", () => {
    expect(item("button").files[0].type).toBe("registry:ui");
  });

  it("stages button files flat (no per-component subdir) so shadcn lands them at components/ui/button.tsx", () => {
    expect(item("button").files[0].path).toBe("ui/button.tsx");
  });

  it("stages badge item with two flat files: ui/badge.tsx and ui/status-badge.tsx", () => {
    const paths = item("badge").files.map((f) => f.path).sort();
    expect(paths).toEqual(["ui/badge.tsx", "ui/status-badge.tsx"]);
  });

  it("emits pricing-table as a block that depends on card/button/badge/utils", () => {
    const pt = item("pricing-table");
    expect(pt.type).toBe("registry:block");
    for (const dep of ["card", "button", "badge", "utils"]) {
      expect(pt.registryDependencies).toContain(`http://localhost:3001/r/${dep}.json`);
    }
  });

  it("emits pricing-table files with type registry:block (unchanged)", () => {
    expect(item("pricing-table").files[0].type).toBe("registry:block");
  });

  it("includes a utils lib item targeting lib/utils.ts", () => {
    const u = item("utils");
    expect(u.type).toBe("registry:lib");
    expect(u.files[0].target).toBe("lib/utils.ts");
  });

  it("emits utils files with type registry:lib (unchanged)", () => {
    expect(item("utils").files[0].type).toBe("registry:lib");
  });

  it("stages files with no residual @manpowerhub import", () => {
    for (const it of reg.items) {
      for (const f of it.files) {
        const staged = fs.readFileSync(path.join(reg.stageDir, f.path), "utf8");
        expect(staged).not.toContain("@manpowerhub/");
      }
    }
  });

  it("stages files with no residual cross-module relative import", () => {
    for (const it of reg.items) {
      for (const f of it.files) {
        const staged = fs.readFileSync(path.join(reg.stageDir, f.path), "utf8");
        expect(staged).not.toContain("../../lib/utils");
        expect(staged).not.toMatch(/from ["']\.\.\//);
      }
    }
  });

  it("includes utils as a registry dependency of button", () => {
    expect(item("button").registryDependencies).toContain("http://localhost:3001/r/utils.json");
  });

  it("includes card, badge, and utils as registry dependencies of kpi-card", () => {
    const kc = item("kpi-card");
    for (const dep of ["card", "badge", "utils"]) {
      expect(kc.registryDependencies).toContain(`http://localhost:3001/r/${dep}.json`);
    }
  });

  it("includes dialog and utils as registry dependencies of command-menu", () => {
    const cm = item("command-menu");
    for (const dep of ["dialog", "utils"]) {
      expect(cm.registryDependencies).toContain(`http://localhost:3001/r/${dep}.json`);
    }
  });

  it("uses a custom baseUrl when provided", () => {
    const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), "reg-stage-baseurl-"));
    const customReg = buildRegistry({
      uiSrc: path.join(ROOT, "packages/ui/src"),
      blocksSrc: path.join(ROOT, "packages/blocks/src"),
      utilsSrc: path.join(ROOT, "packages/ui/src/lib/utils.ts"),
      tokensSrc: path.join(ROOT, "packages/tokens/src"),
      outDir: path.join(ROOT, "apps/docs/public/r"),
      stageDir,
      baseUrl: "http://localhost:5055",
    });
    const pt = customReg.items.find((i) => i.name === "pricing-table")!;
    expect(pt.registryDependencies).toContain("http://localhost:5055/r/card.json");
  });
});
