import { describe, expect, it } from "vitest";
import { catalog } from "../../lib/catalog";
import { demoSources } from "../../generated/demo-sources.generated";
import propsData from "../../generated/props.generated.json";

const props = propsData as Record<string, unknown>;

describe("catalog integrity", () => {
  it("every catalog demoKey has generated source", () => {
    for (const c of catalog) {
      expect(Object.keys(demoSources), `demoKey ${c.demoKey}`).toContain(c.demoKey);
    }
  });

  it("every catalog docgenName has a props entry", () => {
    for (const c of catalog) {
      if (c.docgenName) {
        expect(Object.keys(props), `docgenName ${c.docgenName}`).toContain(c.docgenName);
      }
    }
  });

  it("slugs are unique", () => {
    const slugs = catalog.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
