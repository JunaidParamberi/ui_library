// apps/docs/scripts/registry/verify-registry.test.ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const DOCS = path.resolve(__dirname, "../..");
const R = path.join(DOCS, "public/r");

const files = fs.existsSync(R) ? fs.readdirSync(R).filter((f) => f.endsWith(".json")) : [];

describe("generated registry", () => {
  it("has been generated (run `pnpm gen:registry` first)", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it("contains no @manpowerhub import in any emitted file content", () => {
    for (const f of files) {
      const json = JSON.parse(fs.readFileSync(path.join(R, f), "utf8"));
      for (const file of json.files ?? []) {
        expect(file.content ?? "").not.toContain("@manpowerhub/");
      }
    }
  });

  it("references only registry items that exist as their own file", () => {
    const names = new Set(files.map((f) => f.replace(/\.json$/, "")));
    for (const f of files) {
      const json = JSON.parse(fs.readFileSync(path.join(R, f), "utf8"));
      for (const dep of json.registryDependencies ?? []) {
        expect(names.has(dep)).toBe(true);
      }
    }
  });
});
