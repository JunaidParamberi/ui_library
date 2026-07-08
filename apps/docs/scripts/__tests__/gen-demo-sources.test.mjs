import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { stripUseClient, buildSourcesMap } from "../gen-demo-sources.mjs";

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "__fixtures__");

describe("gen-demo-sources", () => {
  it("strips the use client directive", () => {
    expect(stripUseClient('"use client";\nimport x;')).toBe("import x;");
    expect(stripUseClient("import x;")).toBe("import x;");
  });

  it("keys the map by basename without extension", () => {
    const map = buildSourcesMap(fixtures);
    expect(Object.keys(map)).toContain("sample-demo");
    expect(map["sample-demo"]).toContain("SampleDemo");
    expect(map["sample-demo"]).not.toContain("use client");
  });
});
