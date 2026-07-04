import type { Meta, StoryObj } from "@storybook/react";
import { FolderOpen } from "lucide-react";
import { EmptyState } from "./empty-state";

const meta: Meta<typeof EmptyState> = {
  title: "Blocks/EmptyState",
  component: EmptyState,
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: <FolderOpen />,
    title: "No projects yet",
    description: "Create your first project to get started.",
    action: { label: "New project", onClick: () => {} },
  },
};

export const Plain: Story = {
  args: { variant: "plain", title: "Nothing here", description: "This list is empty." },
};

export const NoAction: Story = {
  args: { icon: <FolderOpen />, title: "All caught up", description: "You have no pending items." },
};

export const Dark: Story = {
  args: { ...Default.args },
  globals: { theme: "dark" },
};

export const Customization: Story = {
  args: {
    ...Default.args,
    className: "border-primary/40 bg-primary/5",
  },
};
