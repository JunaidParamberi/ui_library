"use client";
import { useState } from "react";
import { ThemeToggle } from "@manpowerhub/ui";

export function ThemeToggleDemo() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return <ThemeToggle theme={theme} onThemeChange={setTheme} />;
}

export function ThemeToggleLightState() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return <ThemeToggle theme={theme} onThemeChange={setTheme} />;
}
export function ThemeToggleDarkState() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  return <ThemeToggle theme={theme} onThemeChange={setTheme} />;
}
