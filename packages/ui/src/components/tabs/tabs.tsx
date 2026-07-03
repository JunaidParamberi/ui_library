"use client";
import * as React from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

export const Tabs = RadixTabs.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof RadixTabs.List>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.List>
>(({ className, ...props }, ref) => (
  <RadixTabs.List
    ref={ref}
    className={cn(
      "flex items-end gap-0 border-b border-border",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {
  count?: number;
}

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Trigger>,
  TabsTriggerProps
>(({ className, children, count, ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex items-center gap-1.5 pb-2.5 pt-1 px-1 mr-5 text-base font-medium",
      "text-muted-foreground transition-colors duration-fast",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:text-foreground",
      // Active underline via pseudo-element
      "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:rounded-full",
      "after:transition-colors after:duration-fast",
      "data-[state=inactive]:after:bg-transparent",
      "data-[state=active]:after:bg-primary",
      className,
    )}
    {...props}
  >
    {children}
    {count !== undefined && (
      <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-xs font-medium text-muted-foreground">
        {count}
      </span>
    )}
  </RadixTabs.Trigger>
));
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(({ className, ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={cn(
      "mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";
