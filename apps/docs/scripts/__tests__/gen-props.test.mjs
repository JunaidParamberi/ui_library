import { describe, expect, it } from "vitest";
import { normalizeProps } from "../gen-props.mjs";

describe("gen-props normalizeProps", () => {
  it("maps docgen props to the doc shape", () => {
    const input = {
      props: {
        variant: {
          name: "variant",
          type: { name: '"primary" | "secondary"' },
          required: false,
          defaultValue: { value: "secondary" },
          description: "Visual style",
        },
        id: { name: "id", type: { name: "string" }, required: true, defaultValue: null, description: "" },
      },
    };
    const out = normalizeProps(input);
    expect(out).toContainEqual({
      name: "variant",
      type: '"primary" | "secondary"',
      defaultValue: "secondary",
      required: false,
      description: "Visual style",
    });
    expect(out.find((p) => p.name === "id")).toMatchObject({ required: true, defaultValue: null });
  });
});
