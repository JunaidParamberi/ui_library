import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { Button, type ButtonProps } from "../button";

export interface ThemeToggleProps extends Omit<ButtonProps, "onClick" | "children"> {
  theme: "light" | "dark";
  onThemeChange: (next: "light" | "dark") => void;
}

export const ThemeToggle = React.forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ theme, onThemeChange, variant = "ghost", size = "icon", ...props }, ref) => {
    const next = theme === "light" ? "dark" : "light";
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label={`Switch to ${next} theme`}
        onClick={() => onThemeChange(next)}
        {...props}
      >
        {theme === "light" ? <Moon aria-hidden /> : <Sun aria-hidden />}
      </Button>
    );
  },
);
ThemeToggle.displayName = "ThemeToggle";
