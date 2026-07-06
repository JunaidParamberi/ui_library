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
