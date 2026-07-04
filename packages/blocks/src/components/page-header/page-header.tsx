import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@manpowerhub/ui";

export const pageHeaderVariants = cva("flex flex-col gap-3 pb-4", {
  variants: {
    bordered: {
      true: "border-b border-border",
      false: "",
    },
  },
  defaultVariants: { bordered: false },
});

const rowVariants = cva("flex gap-4", {
  variants: {
    align: {
      start: "flex-col",
      between: "items-start justify-between",
    },
  },
  defaultVariants: { align: "between" },
});

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof pageHeaderVariants> {
  align?: "start" | "between";
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
}

export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  ({ className, align, bordered, title, description, badge, actions, breadcrumbs, ...props }, ref) => (
    <header ref={ref} className={cn(pageHeaderVariants({ bordered }), className)} {...props}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {breadcrumbs.map((c, i) => (
              <li key={c.href ?? c.label} className="flex items-center gap-1.5">
                {c.href ? (
                  <a href={c.href} className="hover:text-foreground">{c.label}</a>
                ) : (
                  <span aria-current="page" className="text-foreground">{c.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <span aria-hidden>/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className={rowVariants({ align })}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">{title}</h1>
            {badge}
          </div>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  ),
);
PageHeader.displayName = "PageHeader";
