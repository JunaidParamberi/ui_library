import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Badge, cn } from "@manpowerhub/ui";

// Maps document status semantics onto the primitive Badge variants.
const pillVariants = cva("", {
  variants: {
    variant: {
      default: "outline",
      accent: "accent",
      success: "success",
      warn: "warning",
      outline: "outline",
    },
  },
  defaultVariants: { variant: "default" },
});

type BadgeVariant = "outline" | "accent" | "success" | "warning";
const toBadge: Record<string, BadgeVariant> = {
  default: "outline", accent: "accent", success: "success", warn: "warning", outline: "outline",
};

export interface StatusPillProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {
  dot?: boolean;
}

export const StatusPill = React.forwardRef<HTMLSpanElement, StatusPillProps>(
  ({ className, variant, dot = false, children, ...props }, ref) => (
    <Badge
      ref={ref}
      variant={toBadge[variant ?? "default"]}
      dot={dot}
      className={cn("font-mono text-[10px] uppercase tracking-wide", className)}
      {...props}
    >
      {children}
    </Badge>
  ),
);
StatusPill.displayName = "StatusPill";
