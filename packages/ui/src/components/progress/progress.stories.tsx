import type { Meta, StoryObj } from "@storybook/react";
import { Progress, HealthRing } from "./progress";

const meta: Meta<typeof Progress> = { title: "Components/Progress", component: Progress };
export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = { args: { value: 42, "aria-label": "Progress" } };
export const Full: Story = { args: { value: 100, "aria-label": "Progress" } };
export const Empty: Story = { args: { value: 0, "aria-label": "Progress" } };
export const Dark: Story = { ...Default, globals: { theme: "dark" } };
export const Customization: Story = { args: { value: 60, className: "h-3", "aria-label": "Progress" } };

export const HealthRingDefault: StoryObj<typeof HealthRing> = {
  render: () => <HealthRing value={72} label="72%" />,
};

export const HealthRingSizes: StoryObj<typeof HealthRing> = {
  render: () => (
    <div className="flex items-end gap-4">
      <HealthRing value={30} size={40} label="30%" />
      <HealthRing value={65} size={64} label="65%" />
      <HealthRing value={92} size={96} label="92%" />
    </div>
  ),
};
