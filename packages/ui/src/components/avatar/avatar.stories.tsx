import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

const meta: Meta<typeof Avatar> = { title: "Components/Avatar", component: Avatar };
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/64" alt="User avatar" />
      <AvatarFallback>JP</AvatarFallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JP</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
      <Avatar size="default"><AvatarFallback>MD</AvatarFallback></Avatar>
      <Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
    </div>
  ),
};

export const Dark: Story = { ...Default, globals: { theme: "dark" } };

export const Customization: Story = {
  render: () => (
    <Avatar className="ring-2 ring-primary">
      <AvatarFallback>JP</AvatarFallback>
    </Avatar>
  ),
};
