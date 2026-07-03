import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium " +
    "transition-colors duration-fast ease-out focus-visible:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:   "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary: "border border-border bg-card text-foreground hover:bg-secondary",
        ghost:     "text-foreground hover:bg-secondary",
        danger:    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:   "border border-border bg-transparent text-foreground hover:bg-secondary",
      },
      size: {
        sm:      "h-[26px] px-2.5 text-sm [&_svg]:size-[13px]",
        default: "h-[30px] px-3 text-base [&_svg]:size-[13px]",
        lg:      "h-[38px] px-4 text-md [&_svg]:size-[15px]",
        icon:    "h-[30px] w-[30px] p-0 [&_svg]:size-[14px]",
        "icon-sm": "h-[26px] w-[26px] p-0 [&_svg]:size-[13px]",
        "icon-lg": "h-[38px] w-[38px] p-0 [&_svg]:size-[15px]",
      },
    },
    defaultVariants: { variant: "secondary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), "relative", className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        <span className={cn("inline-flex items-center gap-1.5", loading && "invisible")}>
          {children}
        </span>
        {loading && (
          <span className="absolute inset-0 grid place-items-center">
            <Loader2 className="size-4 animate-spin" aria-hidden />
          </span>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";
