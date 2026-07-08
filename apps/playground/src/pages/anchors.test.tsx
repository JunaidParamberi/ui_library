import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComponentsShowcase } from "./components-showcase";
import { BlocksShowcase } from "./blocks-showcase";

// Mirrors the docs catalog slugs in apps/docs/src/lib/catalog.ts.
const EXPECTED_COMPONENTS = [
  "app-shell",
  "area-chart",
  "avatar",
  "badge",
  "button",
  "card",
  "checkbox",
  "command-menu",
  "dialog",
  "dropdown-menu",
  "icons",
  "input",
  "kpi-card",
  "progress",
  "select",
  "skeleton",
  "table",
  "tabs",
  "theme-toggle",
  "tooltip",
];

const EXPECTED_BLOCKS = [
  "auth-form",
  "data-table-toolbar",
  "empty-state",
  "page-header",
  "pricing-table",
  "stat-card-row",
];

describe("playground anchors", () => {
  it("renders an id anchor for each known component slug", () => {
    const { container } = render(<ComponentsShowcase />);
    for (const slug of EXPECTED_COMPONENTS) {
      expect(container.querySelector(`#${slug}`), slug).not.toBeNull();
    }
  });

  it("renders an id anchor for each known block slug", () => {
    const { container } = render(<BlocksShowcase />);
    for (const slug of EXPECTED_BLOCKS) {
      expect(container.querySelector(`#${slug}`), slug).not.toBeNull();
    }
  });
});
