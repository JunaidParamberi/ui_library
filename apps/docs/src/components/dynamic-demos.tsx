"use client";

import dynamic from "next/dynamic";

function loading() {
  return <div className="h-20 animate-pulse rounded bg-muted" />;
}

export const BadgeDemo = dynamic(
  () => import("./demos/badge-demo").then((m) => m.BadgeDemo),
  { ssr: false, loading },
);
export const ButtonDemo = dynamic(
  () => import("./demos/button-demo").then((m) => m.ButtonDemo),
  { ssr: false, loading },
);
export const CardDemo = dynamic(
  () => import("./demos/card-demo").then((m) => m.CardDemo),
  { ssr: false, loading },
);
export const CheckboxDemo = dynamic(
  () => import("./demos/checkbox-demo").then((m) => m.CheckboxDemo),
  { ssr: false, loading },
);
export const InputDemo = dynamic(
  () => import("./demos/input-demo").then((m) => m.InputDemo),
  { ssr: false, loading },
);
export const KpiCardDemo = dynamic(
  () => import("./demos/kpi-card-demo").then((m) => m.KpiCardDemo),
  { ssr: false, loading },
);
export const SelectDemo = dynamic(
  () => import("./demos/select-demo").then((m) => m.SelectDemo),
  { ssr: false, loading },
);
export const TabsDemo = dynamic(
  () => import("./demos/tabs-demo").then((m) => m.TabsDemo),
  { ssr: false, loading },
);
export const AuthFormDemo = dynamic(
  () => import("./demos/auth-form-demo").then((m) => m.AuthFormDemo),
  { ssr: false, loading },
);
export const DataTableToolbarDemo = dynamic(
  () =>
    import("./demos/data-table-toolbar-demo").then((m) => m.DataTableToolbarDemo),
  { ssr: false, loading },
);
export const EmptyStateDemo = dynamic(
  () => import("./demos/empty-state-demo").then((m) => m.EmptyStateDemo),
  { ssr: false, loading },
);
export const PageHeaderDemo = dynamic(
  () => import("./demos/page-header-demo").then((m) => m.PageHeaderDemo),
  { ssr: false, loading },
);
export const PricingTableDemo = dynamic(
  () => import("./demos/pricing-table-demo").then((m) => m.PricingTableDemo),
  { ssr: false, loading },
);
export const StatCardRowDemo = dynamic(
  () => import("./demos/stat-card-row-demo").then((m) => m.StatCardRowDemo),
  { ssr: false, loading },
);
export const AvatarDemo = dynamic(
  () => import("./demos/avatar-demo").then((m) => m.AvatarDemo),
  { ssr: false, loading },
);
export const TooltipDemo = dynamic(
  () => import("./demos/tooltip-demo").then((m) => m.TooltipDemo),
  { ssr: false, loading },
);
export const DialogDemo = dynamic(
  () => import("./demos/dialog-demo").then((m) => m.DialogDemo),
  { ssr: false, loading },
);
export const DropdownMenuDemo = dynamic(
  () => import("./demos/dropdown-menu-demo").then((m) => m.DropdownMenuDemo),
  { ssr: false, loading },
);
export const ProgressDemo = dynamic(
  () => import("./demos/progress-demo").then((m) => m.ProgressDemo),
  { ssr: false, loading },
);
export const SkeletonDemo = dynamic(
  () => import("./demos/skeleton-demo").then((m) => m.SkeletonDemo),
  { ssr: false, loading },
);
export const TableDemo = dynamic(
  () => import("./demos/table-demo").then((m) => m.TableDemo),
  { ssr: false, loading },
);
export const ThemeToggleDemo = dynamic(
  () => import("./demos/theme-toggle-demo").then((m) => m.ThemeToggleDemo),
  { ssr: false, loading },
);
export const CommandMenuDemo = dynamic(
  () => import("./demos/command-menu-demo").then((m) => m.CommandMenuDemo),
  { ssr: false, loading },
);
export const AppShellDemo = dynamic(
  () => import("./demos/app-shell-demo").then((m) => m.AppShellDemo),
  { ssr: false, loading },
);
export const AreaChartDemo = dynamic(
  () => import("./demos/area-chart-demo").then((m) => m.AreaChartDemo),
  { ssr: false, loading },
);
export const IconsDemo = dynamic(
  () => import("./demos/icons-demo").then((m) => m.IconsDemo),
  { ssr: false, loading },
);
