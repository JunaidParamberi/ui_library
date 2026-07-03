import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "./button";

const meta = {
  title: "Core/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["primary","secondary","ghost","danger","outline"] },
    size:    { control: "select", options: ["sm","default","lg","icon","icon-sm","icon-lg"] },
    loading: { control: "boolean" },
    disabled:{ control: "boolean" },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story   = { args: { variant: "primary",   children: "Save changes" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Cancel" } };
export const Ghost: Story     = { args: { variant: "ghost",     children: "Details" } };
export const Danger: Story    = { args: { variant: "danger",    children: "Delete" } };
export const Outline: Story   = { args: { variant: "outline",   children: "Export" } };

export const AllVariants: Story = {
  name: "All Variants",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["primary","secondary","ghost","danger","outline"] as const).map(v => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex items-center flex-wrap gap-2">
      {(["sm","default","lg"] as const).map(s => (
        <Button key={s} variant="primary" size={s}>{s}</Button>
      ))}
    </div>
  ),
};

export const WithLeadingIcon: Story = {
  name: "With Leading Icon",
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary" size="sm"><Plus />Add item</Button>
      <Button variant="primary"><Plus />Add item</Button>
      <Button variant="primary" size="lg"><Plus />Add item</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  name: "Icon Only",
  render: () => (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="icon-sm" aria-label="Delete"><Trash2 /></Button>
      <Button variant="secondary" size="icon"    aria-label="Delete"><Trash2 /></Button>
      <Button variant="secondary" size="icon-lg" aria-label="Delete"><Trash2 /></Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary"   loading>Save changes</Button>
      <Button variant="secondary" loading>Cancel</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["primary","secondary","ghost","danger","outline"] as const).map(v => (
        <Button key={v} variant={v} disabled>{v}</Button>
      ))}
    </div>
  ),
};

export const AsLink: Story = {
  name: "asChild (renders as <a>)",
  render: () => (
    <Button asChild variant="primary">
      <a href="#">Go to dashboard</a>
    </Button>
  ),
};

export const Customization: Story = {
  name: "Customization (className wins)",
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary" className="rounded-full px-6">Rounded</Button>
      <Button variant="secondary" className="border-dashed">Dashed</Button>
    </div>
  ),
};
