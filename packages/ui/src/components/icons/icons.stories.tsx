import type { Meta, StoryObj } from "@storybook/react";
import { Icons } from "./icons";

const meta: Meta = { title: "Components/Icons" };
export default meta;

export const AllIcons: StoryObj = {
  render: () => (
    <div className="grid grid-cols-6 gap-4">
      {Object.entries(Icons).map(([name, Icon]) => (
        <div key={name} className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
          <Icon className="size-5 text-foreground" aria-hidden />
          {name}
        </div>
      ))}
    </div>
  ),
};

export const Dark: StoryObj = { ...AllIcons, globals: { theme: "dark" } };
