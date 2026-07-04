import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle, Button, Badge, cn } from "@manpowerhub/ui";

export const pricingGridVariants = cva("grid gap-4", {
  variants: {
    columns: {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: { columns: 3 },
});

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: { label: string; onClick: () => void };
  highlighted?: boolean;
  badge?: string;
}

export interface PricingTableProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pricingGridVariants> {
  tiers: PricingTier[];
  billingPeriod?: { value: "monthly" | "annual"; onChange: (value: "monthly" | "annual") => void };
}

export const PricingTable = React.forwardRef<HTMLDivElement, PricingTableProps>(
  ({ className, columns, tiers, billingPeriod, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-6", className)} {...props}>
      {billingPeriod && (
        <div className="mx-auto inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1" role="group" aria-label="Billing period">
          {(["monthly", "annual"] as const).map((p) => (
            <Button
              key={p}
              type="button"
              size="sm"
              variant={billingPeriod.value === p ? "primary" : "ghost"}
              aria-pressed={billingPeriod.value === p}
              onClick={() => billingPeriod.onChange(p)}
            >
              {p === "monthly" ? "Monthly" : "Annual"}
            </Button>
          ))}
        </div>
      )}

      <div className={pricingGridVariants({ columns })}>
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={cn(tier.highlighted && "border-primary ring-1 ring-primary/40")}
          >
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              {tier.badge && <Badge variant="accent">{tier.badge}</Badge>}
            </CardHeader>
            <CardBody>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-semibold tracking-tight">{tier.price}</span>
                {tier.period && <span className="text-sm text-muted-foreground">{tier.period}</span>}
              </div>
              {tier.description && <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>}
              <ul className="mt-4 flex flex-col gap-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="size-4 shrink-0 text-success" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.highlighted ? "primary" : "secondary"}
                className="mt-6 w-full"
                onClick={tier.cta.onClick}
              >
                {tier.cta.label}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  ),
);
PricingTable.displayName = "PricingTable";
