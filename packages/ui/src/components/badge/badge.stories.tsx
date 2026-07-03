import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";
import { StatusBadge, type Status } from "./status-badge";

const meta = { title: "Core/Badge", parameters: { layout: "centered" } } satisfies Meta;
export default meta;

export const Default: StoryObj = { render: () => <Badge>Draft</Badge> };

export const AllVariants: StoryObj = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["success","warning","danger","info","accent","outline"] as const).map(v => (
        <Badge key={v} variant={v}>{v}</Badge>
      ))}
    </div>
  ),
};

export const AllVariantsWithDot: StoryObj = {
  name: "All Variants — With Dot",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["success","warning","danger","info","accent","outline"] as const).map(v => (
        <Badge key={v} variant={v} dot>{v}</Badge>
      ))}
    </div>
  ),
};

export const AllStatuses: StoryObj = {
  name: "StatusBadge — All Statuses",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["paid","sent","draft","overdue","partially_paid","written_off","active","planning",
         "on hold","done","todo","in_progress","cancelled","high","med","low","approved"] as const
      ).map(s => <StatusBadge key={s} status={s as Status} />)}
    </div>
  ),
};

export const Customization: StoryObj = {
  name: "Customization (className wins)",
  render: () => <Badge variant="success" className="text-base px-3">Custom size</Badge>,
};
