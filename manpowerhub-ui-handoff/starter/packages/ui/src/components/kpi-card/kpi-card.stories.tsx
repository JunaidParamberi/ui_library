import type { Meta, StoryObj } from "@storybook/react";
import { KPICard } from "./kpi-card";

const meta = {
  title: "Data viz/KPICard",
  component: KPICard,
  tags: ["autodocs"],
} satisfies Meta<typeof KPICard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Up: Story = {
  args: { kpi: { label: "Revenue", value: "AED 42,180", delta: "+12%", trend: "up", sub: "vs last 30 days" } },
};
export const Down: Story = {
  args: { kpi: { label: "Overdue", value: "AED 8,400", delta: "-4%", trend: "down", sub: "3 invoices" } },
};
export const NoDelta: Story = {
  args: { kpi: { label: "Active sites", value: "24" } },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <KPICard delay={0} kpi={{ label: "Revenue", value: "AED 42,180", delta: "+12%", trend: "up", sub: "vs last 30 days" }} />
      <KPICard delay={1} kpi={{ label: "Workers", value: "2,847", delta: "+31", trend: "up", sub: "on payroll" }} />
      <KPICard delay={2} kpi={{ label: "Overdue", value: "AED 8,400", delta: "-4%", trend: "down", sub: "3 invoices" }} />
      <KPICard delay={3} kpi={{ label: "Active sites", value: "24" }} />
    </div>
  ),
};
