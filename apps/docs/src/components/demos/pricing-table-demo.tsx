"use client";
import * as React from "react";
import { PricingTable, type PricingTier } from "@manpowerhub/blocks";

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    features: ["1 seat"],
    cta: { label: "Start free", onClick: () => {} },
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    features: ["5 seats", "Analytics"],
    cta: { label: "Choose Pro", onClick: () => {} },
    highlighted: true,
    badge: "Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited seats"],
    cta: { label: "Contact sales", onClick: () => {} },
  },
];

export function PricingTableDemo() {
  const [period, setPeriod] = React.useState<"monthly" | "annual">("monthly");
  return (
    <PricingTable
      tiers={tiers}
      columns={3}
      billingPeriod={{ value: period, onChange: setPeriod }}
    />
  );
}
