import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardBody, Button, cn } from "@manpowerhub/ui";

export const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "gap-2 py-8 px-6",
        md: "gap-3 py-14 px-8",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  variant?: "dashed" | "plain";
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, size, variant = "dashed", icon, title, description, action, secondaryAction, ...props }, ref) => {
    if (variant === "plain") {
      return (
        <div ref={ref} className={cn(emptyStateVariants({ size }), className)} {...props}>
          {icon && <div className="mb-1 text-fg-3 [&_svg]:size-8">{icon}</div>}
          <h3 className="text-md font-semibold tracking-snug text-foreground">{title}</h3>
          {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
          {(action || secondaryAction) && (
            <div className="mt-2 flex items-center gap-2">
              {action && (
                <Button variant="primary" onClick={action.onClick}>
                  {action.label}
                </Button>
              )}
              {secondaryAction && (
                <Button variant="ghost" onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <Card ref={ref} dashed className={cn(emptyStateVariants({ size }), className)} {...props}>
        <CardBody>
          {icon && <div className="mb-1 text-fg-3 [&_svg]:size-8">{icon}</div>}
          <h3 className="text-md font-semibold tracking-snug text-foreground">{title}</h3>
          {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
          {(action || secondaryAction) && (
            <div className="mt-2 flex items-center gap-2">
              {action && (
                <Button variant="primary" onClick={action.onClick}>
                  {action.label}
                </Button>
              )}
              {secondaryAction && (
                <Button variant="ghost" onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    );
  },
);
EmptyState.displayName = "EmptyState";
