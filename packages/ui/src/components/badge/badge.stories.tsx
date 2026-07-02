import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";
import { StatusBadge, type Status } from "./status-badge";

const meta = {
  title: "Core/Badge",
  component: Badge,
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Draft", variant: "outline" } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["success", "warning", "danger", "info", "accent", "outline"] as const).map((v) => (
        <Badge key={v} variant={v} dot>{v}</Badge>
      ))}
    </div>
  ),
};

const ALL: Status[] = [
  "paid", "sent", "draft", "overdue", "partially_paid", "active", "planning",
  "on hold", "done", "todo", "in_progress", "cancelled", "high", "med", "low", "approved",
];

export const StatusBadges: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {ALL.map((s) => <StatusBadge key={s} status={s} />)}
    </div>
  ),
};
