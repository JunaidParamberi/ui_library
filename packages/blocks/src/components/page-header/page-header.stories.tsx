import type { Meta, StoryObj } from "@storybook/react";
import { Badge, Button } from "@manpowerhub/ui";
import { PageHeader } from "./page-header";

const meta: Meta<typeof PageHeader> = { title: "Blocks/PageHeader", component: PageHeader };
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: { title: "Team members", description: "Invite and manage your team." },
};

export const WithBadgeAndActions: Story = {
  args: {
    title: "Billing",
    description: "Manage your subscription and invoices.",
    badge: <Badge variant="accent">Pro</Badge>,
    actions: (
      <>
        <Button variant="secondary">Export</Button>
        <Button variant="primary">Upgrade</Button>
      </>
    ),
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    title: "General",
    bordered: true,
    breadcrumbs: [{ label: "Settings", href: "#" }, { label: "General" }],
  },
};

export const Dark: Story = {
  args: { ...WithBadgeAndActions.args },
  globals: { theme: "dark" },
};

export const Customization: Story = {
  args: { ...Default.args, className: "rounded-lg bg-secondary p-4" },
};
