import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";

const meta: Meta<typeof Tooltip> = { title: "Components/Tooltip", component: Tooltip };
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Helpful text</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const AlwaysOpen: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline">Trigger</Button>
        </TooltipTrigger>
        <TooltipContent>Always visible for visual testing</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const Dark: Story = { ...AlwaysOpen, globals: { theme: "dark" } };

export const Customization: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger asChild>
          <Button variant="outline">Trigger</Button>
        </TooltipTrigger>
        <TooltipContent className="bg-primary text-primary-foreground border-primary">
          Custom styled
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
