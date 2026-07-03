import * as React from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Elevate on hover + show pointer. */
  interactive?: boolean;
  /** Dashed border + subtle fill (explainer cards). */
  dashed?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, dashed = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-md border bg-card text-card-foreground shadow-xs",
        interactive && "cursor-pointer transition-shadow duration-fast ease-out hover:shadow-sm",
        dashed && "border-dashed bg-secondary shadow-none",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between gap-2 border-b px-4 py-3.5", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-md font-semibold tracking-snug", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4", className)} {...props} />,
);
CardBody.displayName = "CardBody";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("border-t px-4 py-3 text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";
