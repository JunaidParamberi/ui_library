"use client";
import * as React from "react";
import * as RadixCheckbox from "@radix-ui/react-checkbox";
import * as RadixRadio from "@radix-ui/react-radio-group";
import * as RadixSwitch from "@radix-ui/react-switch";
import { Check, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

// ─── Checkbox ───────────────────────────────────────────────────────────────

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>, "children"> {
  label?: string;
}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof RadixCheckbox.Root>,
  CheckboxProps
>(({ className, label, id, ...props }, ref) => (
  <div className="flex items-center gap-2">
    <RadixCheckbox.Root
      ref={ref}
      id={id}
      className={cn(
        "size-4 shrink-0 rounded-xs border border-input bg-card",
        "transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-primary-foreground",
        className,
      )}
      {...props}
    >
      <RadixCheckbox.Indicator className="flex items-center justify-center text-current">
        <Check className="size-3 data-[state=indeterminate]:hidden" />
        <Minus className="size-3 hidden data-[state=indeterminate]:block" />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
    {label && (
      <label htmlFor={id} className="text-base text-foreground cursor-pointer select-none">
        {label}
      </label>
    )}
  </div>
));
Checkbox.displayName = "Checkbox";

// ─── RadioGroup ─────────────────────────────────────────────────────────────

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadixRadio.Root>,
  React.ComponentPropsWithoutRef<typeof RadixRadio.Root>
>(({ className, ...props }, ref) => (
  <RadixRadio.Root ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />
));
RadioGroup.displayName = "RadioGroup";

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadixRadio.Item>,
  React.ComponentPropsWithoutRef<typeof RadixRadio.Item>
>(({ className, ...props }, ref) => (
  <RadixRadio.Item
    ref={ref}
    className={cn(
      "size-4 shrink-0 rounded-full border border-input bg-card",
      "transition-colors duration-fast",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-primary",
      className,
    )}
    {...props}
  >
    <RadixRadio.Indicator className="flex items-center justify-center">
      <span className="size-2 rounded-full bg-primary block" />
    </RadixRadio.Indicator>
  </RadixRadio.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

// ─── Switch ─────────────────────────────────────────────────────────────────

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadixSwitch.Root>, "children"> {
  label?: string;
}

export const Switch = React.forwardRef<
  React.ElementRef<typeof RadixSwitch.Root>,
  SwitchProps
>(({ className, label, id, ...props }, ref) => (
  <div className="flex items-center gap-2">
    <RadixSwitch.Root
      ref={ref}
      id={id}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "bg-secondary transition-colors duration-fast",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <RadixSwitch.Thumb
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-card shadow-xs",
          "transition-transform duration-fast",
          "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        )}
      />
    </RadixSwitch.Root>
    {label && (
      <label htmlFor={id} className="text-base text-foreground cursor-pointer select-none">
        {label}
      </label>
    )}
  </div>
));
Switch.displayName = "Switch";
