import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeToggle } from "./theme-toggle";

const meta: Meta<typeof ThemeToggle> = { title: "Components/ThemeToggle", component: ThemeToggle };
export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Interactive: Story = {
  render: () => {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    return <ThemeToggle theme={theme} onThemeChange={setTheme} />;
  },
};

export const LightState: Story = { args: { theme: "light", onThemeChange: () => {} } };
export const DarkState: Story = { args: { theme: "dark", onThemeChange: () => {} } };
export const Dark: Story = { ...LightState, globals: { theme: "dark" } };
export const Customization: Story = { args: { theme: "light", onThemeChange: () => {}, size: "icon-lg" } };
