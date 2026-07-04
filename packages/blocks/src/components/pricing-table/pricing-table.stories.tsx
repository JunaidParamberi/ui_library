import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PricingTable, type PricingTier } from "./pricing-table";

const tiers: PricingTier[] = [
  { name: "Starter", price: "$0", period: "/mo", description: "For trying things out.", features: ["1 seat", "Community support", "1 GB storage"], cta: { label: "Start free", onClick: () => {} } },
  { name: "Pro", price: "$29", period: "/mo", description: "For growing teams.", features: ["5 seats", "Priority support", "50 GB storage", "Analytics"], cta: { label: "Choose Pro", onClick: () => {} }, highlighted: true, badge: "Popular" },
  { name: "Enterprise", price: "Custom", description: "For large orgs.", features: ["Unlimited seats", "SSO & SAML", "Dedicated support"], cta: { label: "Contact sales", onClick: () => {} } },
];

const meta: Meta<typeof PricingTable> = { title: "Blocks/PricingTable", component: PricingTable };
export default meta;
type Story = StoryObj<typeof PricingTable>;

export const ThreeTiers: Story = { args: { tiers, columns: 3 } };

export const WithBillingToggle: Story = {
  render: (a) => {
    const [period, setPeriod] = React.useState<"monthly" | "annual">("monthly");
    return <PricingTable {...a} tiers={tiers} billingPeriod={{ value: period, onChange: setPeriod }} />;
  },
};

export const Dark: Story = { args: { tiers, columns: 3 }, globals: { theme: "dark" } };
export const Customization: Story = { args: { tiers, columns: 3, className: "gap-10" } };
