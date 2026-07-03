import type { Meta, StoryObj } from "@storybook/react";
import { Search } from "lucide-react";
import { Input, Textarea, Field } from "./input";

const meta = { title: "Core/Input", component: Input, parameters: { layout: "centered" } } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: "Enter value…" } };
export const Large: Story   = { args: { inputSize: "lg", placeholder: "Large input" } };
export const Disabled: Story = { args: { placeholder: "Disabled", disabled: true } };
export const Invalid: Story  = { args: { invalid: true, defaultValue: "bad@" } };

export const WithLabel: Story = {
  name: "With Label + Hint",
  render: () => (
    <Field label="Email address" hint="We'll never share your email." htmlFor="email">
      <Input id="email" type="email" placeholder="you@example.com" />
    </Field>
  ),
};

export const WithError: Story = {
  name: "With Error",
  render: () => (
    <Field label="Email" error="Please enter a valid email." htmlFor="email-err">
      <Input id="email-err" invalid defaultValue="notanemail" />
    </Field>
  ),
};

export const WithLeadingIcon: Story = {
  name: "With Leading Icon",
  render: () => (
    <div className="relative w-64">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-[13px] text-fg-3" />
      <Input className="pl-8" placeholder="Search…" />
    </div>
  ),
};

export const TextareaStory: Story = {
  name: "Textarea",
  render: () => (
    <Field label="Notes" htmlFor="notes">
      <Textarea id="notes" placeholder="Write something…" />
    </Field>
  ),
};

export const Customization: Story = {
  name: "Customization (className wins)",
  render: () => <Input className="border-primary ring-primary/20" defaultValue="Styled" />,
};
