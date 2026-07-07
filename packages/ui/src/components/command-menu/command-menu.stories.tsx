import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { CommandMenu } from "./command-menu";

const meta: Meta<typeof CommandMenu> = { title: "Components/CommandMenu", component: CommandMenu };
export default meta;
type Story = StoryObj<typeof CommandMenu>;

const items = [
  { id: "new", label: "New project", onSelect: () => {}, group: "Actions" },
  { id: "settings", label: "Open settings", onSelect: () => {}, group: "Actions" },
  { id: "docs", label: "Search documentation", onSelect: () => {}, group: "Navigation" },
];

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open ⌘K</Button>
        <CommandMenu open={open} onOpenChange={setOpen} items={items} />
      </>
    );
  },
};

export const AlwaysOpen: Story = { args: { open: true, onOpenChange: () => {}, items } };
export const Dark: Story = { ...AlwaysOpen, globals: { theme: "dark" } };
export const Empty: Story = { args: { open: true, onOpenChange: () => {}, items: [] } };
export const Customization: Story = { args: { open: true, onOpenChange: () => {}, items, className: "max-w-xl" } };
