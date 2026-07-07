/**
 * Single source-of-truth catalog mapping each documented component/block to
 * its demo key, docgen display name, and Storybook story location.
 *
 * - `slug`: doc route = MDX filename (no extension) under
 *   `apps/docs/content/components/*.mdx` or `apps/docs/content/blocks/*.mdx`.
 * - `demoKey`: demo file basename under `apps/docs/src/components/demos/*.tsx`.
 * - `docgenName`: component display name — a key in
 *   `apps/docs/src/generated/props.generated.json`.
 * - `story` / `storyId`: Storybook path, sourced from each component's
 *   `*.stories.tsx` `title` field and the values already passed to
 *   `<StorybookLink />` in the corresponding MDX file. When an MDX file omits
 *   `storyId`, `StorybookLink` falls back to the literal string "default" —
 *   this catalog mirrors that same fallback so it matches what the docs site
 *   actually renders/links today.
 * - `pkg`: "ui" for `packages/ui` components, "blocks" for `packages/blocks`.
 */
export interface CatalogEntry {
  slug: string;
  demoKey: string;
  docgenName: string;
  story: string;
  storyId: string;
  pkg: "ui" | "blocks";
}

export const catalog: CatalogEntry[] = [
  // Components (packages/ui)
  { slug: "app-shell", demoKey: "app-shell-demo", docgenName: "AppShell", story: "components-appshell", storyId: "default", pkg: "ui" },
  { slug: "area-chart", demoKey: "area-chart-demo", docgenName: "AreaChart", story: "components-areachart", storyId: "default", pkg: "ui" },
  { slug: "avatar", demoKey: "avatar-demo", docgenName: "Avatar", story: "components-avatar", storyId: "default", pkg: "ui" },
  { slug: "badge", demoKey: "badge-demo", docgenName: "Badge", story: "core-badge", storyId: "default", pkg: "ui" },
  { slug: "button", demoKey: "button-demo", docgenName: "Button", story: "core-button", storyId: "primary", pkg: "ui" },
  { slug: "card", demoKey: "card-demo", docgenName: "Card", story: "core-card", storyId: "default", pkg: "ui" },
  { slug: "checkbox", demoKey: "checkbox-demo", docgenName: "Checkbox", story: "core-controls", storyId: "checkbox-states", pkg: "ui" },
  { slug: "command-menu", demoKey: "command-menu-demo", docgenName: "CommandMenu", story: "components-commandmenu", storyId: "default", pkg: "ui" },
  { slug: "dialog", demoKey: "dialog-demo", docgenName: "Dialog", story: "components-dialog", storyId: "default", pkg: "ui" },
  { slug: "dropdown-menu", demoKey: "dropdown-menu-demo", docgenName: "DropdownMenu", story: "components-dropdownmenu", storyId: "default", pkg: "ui" },
  // NOTE: "Icons" is not a key in props.generated.json (it's a Record<string, LucideIcon>
  // re-export, not a discrete component the docgen tool extracts props for). See task-4-report.md.
  { slug: "icons", demoKey: "icons-demo", docgenName: "Icons", story: "components-icons", storyId: "default", pkg: "ui" },
  { slug: "input", demoKey: "input-demo", docgenName: "Input", story: "core-input", storyId: "default", pkg: "ui" },
  { slug: "kpi-card", demoKey: "kpi-card-demo", docgenName: "KPICard", story: "data-viz-kpicard", storyId: "default", pkg: "ui" },
  { slug: "progress", demoKey: "progress-demo", docgenName: "Progress", story: "components-progress", storyId: "default", pkg: "ui" },
  { slug: "select", demoKey: "select-demo", docgenName: "Select", story: "core-select", storyId: "default", pkg: "ui" },
  { slug: "skeleton", demoKey: "skeleton-demo", docgenName: "Skeleton", story: "components-skeleton", storyId: "default", pkg: "ui" },
  { slug: "table", demoKey: "table-demo", docgenName: "Table", story: "components-table", storyId: "default", pkg: "ui" },
  { slug: "tabs", demoKey: "tabs-demo", docgenName: "Tabs", story: "core-tabs", storyId: "default", pkg: "ui" },
  { slug: "theme-toggle", demoKey: "theme-toggle-demo", docgenName: "ThemeToggle", story: "components-themetoggle", storyId: "default", pkg: "ui" },
  { slug: "tooltip", demoKey: "tooltip-demo", docgenName: "Tooltip", story: "components-tooltip", storyId: "default", pkg: "ui" },

  // Blocks (packages/blocks)
  { slug: "auth-form", demoKey: "auth-form-demo", docgenName: "AuthForm", story: "blocks-authform", storyId: "default", pkg: "blocks" },
  { slug: "data-table-toolbar", demoKey: "data-table-toolbar-demo", docgenName: "DataTableToolbar", story: "blocks-datatabletoolbar", storyId: "default", pkg: "blocks" },
  { slug: "empty-state", demoKey: "empty-state-demo", docgenName: "EmptyState", story: "blocks-emptystate", storyId: "default", pkg: "blocks" },
  { slug: "page-header", demoKey: "page-header-demo", docgenName: "PageHeader", story: "blocks-pageheader", storyId: "default", pkg: "blocks" },
  { slug: "pricing-table", demoKey: "pricing-table-demo", docgenName: "PricingTable", story: "blocks-pricingtable", storyId: "default", pkg: "blocks" },
  { slug: "stat-card-row", demoKey: "stat-card-row-demo", docgenName: "StatCardRow", story: "blocks-statcardrow", storyId: "default", pkg: "blocks" },
];
