import type { Meta, StoryObj } from "@storybook/react";
import type { KPI } from "@manpowerhub/ui";
import { StatCardRow } from "./stat-card-row";

const stats: KPI[] = [
  { label: "Revenue", value: "$48.2k", delta: "+12%", trend: "up", sub: "vs last month" },
  { label: "Active users", value: "3,912", delta: "+4%", trend: "up" },
  { label: "Churn", value: "1.4%", delta: "-0.2%", trend: "down" },
  { label: "NPS", value: "62", sub: "last 30 days" },
];

const meta: Meta<typeof StatCardRow> = { title: "Blocks/StatCardRow", component: StatCardRow };
export default meta;
type Story = StoryObj<typeof StatCardRow>;

export const ThreeUp: Story = { args: { stats: stats.slice(0, 3), columns: 3 } };
export const FourUp: Story = { args: { stats, columns: 4 } };
export const Loading: Story = { args: { stats, columns: 4, loading: true } };
export const Empty: Story = { args: { stats: [] } };
export const Dark: Story = { args: { stats: stats.slice(0, 3), columns: 3 }, globals: { theme: "dark" } };
export const Customization: Story = { args: { stats: stats.slice(0, 3), columns: 3, className: "gap-8" } };
