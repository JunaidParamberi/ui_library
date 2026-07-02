import type { Meta, StoryObj } from "@storybook/react";
import { Download, Plus } from "lucide-react";
import { Button } from "./button";

const meta = {
  title: "Core/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost", "danger", "outline"] },
    size: { control: "select", options: ["sm", "default", "lg", "icon"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: { children: "Save changes", variant: "primary" },
} satisfies Meta<typeof Button>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const WithIcon: Story = {
  args: { variant: "secondary", children: (<><Download /> Download</>) },
};
export const Loading: Story = { args: { loading: true, children: "Saving" } };
export const Disabled: Story = { args: { disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["primary", "secondary", "ghost", "danger", "outline"] as const).map((v) => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add"><Plus /></Button>
    </div>
  ),
};
