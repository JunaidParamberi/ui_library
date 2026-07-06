import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton, Spinner } from "./skeleton";

const meta: Meta<typeof Skeleton> = { title: "Components/Skeleton", component: Skeleton };
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const TextLines: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-56" />
    </div>
  ),
};

export const CardShape: Story = { render: () => <Skeleton className="h-24 w-64 rounded-lg" /> };
export const Circle: Story = { render: () => <Skeleton className="size-10 rounded-full" /> };
export const Dark: Story = { ...TextLines, globals: { theme: "dark" } };
export const Customization: Story = { render: () => <Skeleton className="h-2 w-full bg-primary/20" /> };

export const SpinnerSizes: StoryObj<typeof Spinner> = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" aria-label="Loading" />
      <Spinner size="default" aria-label="Loading" />
      <Spinner size="lg" aria-label="Loading" />
    </div>
  ),
};
