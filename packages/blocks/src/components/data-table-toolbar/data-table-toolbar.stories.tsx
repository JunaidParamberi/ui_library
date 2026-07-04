import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@manpowerhub/ui";
import { DataTableToolbar } from "./data-table-toolbar";

const meta: Meta<typeof DataTableToolbar> = { title: "Blocks/DataTableToolbar", component: DataTableToolbar };
export default meta;
type Story = StoryObj<typeof DataTableToolbar>;

function Controlled(args: Partial<React.ComponentProps<typeof DataTableToolbar>>) {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState("");
  return (
    <DataTableToolbar
      search={{ value: q, onChange: setQ, placeholder: "Search members…" }}
      filters={[
        {
          id: "status",
          placeholder: "Status",
          value: status,
          onChange: setStatus,
          options: [
            { label: "Active", value: "active" },
            { label: "Invited", value: "invited" },
            { label: "Disabled", value: "disabled" },
          ],
        },
      ]}
      actions={<Button variant="primary">Add member</Button>}
      {...args}
    />
  );
}

export const Default: Story = { render: (a) => <Controlled {...a} /> };
export const WithSelection: Story = {
  render: (a) => <Controlled {...a} selectedCount={3} bulkActions={<Button variant="danger" size="sm">Delete</Button>} />,
};
export const Compact: Story = { render: (a) => <Controlled {...a} density="compact" /> };
export const Dark: Story = { render: (a) => <Controlled {...a} />, globals: { theme: "dark" } };
export const Customization: Story = { render: (a) => <Controlled {...a} className="rounded-md border border-border px-3" /> };
