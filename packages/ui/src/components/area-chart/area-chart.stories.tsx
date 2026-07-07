import type { Meta, StoryObj } from "@storybook/react";
import { AreaChart, MiniBars } from "./area-chart";

const meta: Meta<typeof AreaChart> = { title: "Components/AreaChart", component: AreaChart };
export default meta;

const series = [
  { x: 0, y: 10 }, { x: 1, y: 25 }, { x: 2, y: 18 }, { x: 3, y: 32 },
  { x: 4, y: 28 }, { x: 5, y: 40 }, { x: 6, y: 35 },
];

export const Default: StoryObj<typeof AreaChart> = { args: { data: series } };
export const Wide: StoryObj<typeof AreaChart> = { args: { data: series, width: 480, height: 120 } };
export const Empty: StoryObj<typeof AreaChart> = { args: { data: [] } };
export const Dark: StoryObj<typeof AreaChart> = { ...Default, globals: { theme: "dark" } };
export const Customization: StoryObj<typeof AreaChart> = { args: { data: series, className: "opacity-80" } };

export const MiniBarsDefault: StoryObj<typeof MiniBars> = {
  render: () => <MiniBars data={[3, 8, 5, 12, 7, 15, 9]} />,
};
