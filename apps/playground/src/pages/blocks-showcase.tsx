import * as React from "react";
import {
  EmptyState,
  PageHeader,
  StatCardRow,
  AuthForm,
  DataTableToolbar,
  PricingTable,
  type PricingTier,
} from "@manpowerhub/blocks";
import { Badge, Button, type KPI } from "@manpowerhub/ui";
import { FolderOpen } from "lucide-react";

const stats: KPI[] = [
  { label: "Revenue", value: "$48.2k", delta: "+12%", trend: "up", sub: "vs last month" },
  { label: "Active users", value: "3,912", delta: "+4%", trend: "up" },
  { label: "Churn", value: "1.4%", delta: "-0.2%", trend: "down" },
];

const tiers: PricingTier[] = [
  { name: "Starter", price: "$0", period: "/mo", features: ["1 seat", "Community support"], cta: { label: "Start free", onClick: () => {} } },
  { name: "Pro", price: "$29", period: "/mo", features: ["5 seats", "Priority support", "Analytics"], cta: { label: "Choose Pro", onClick: () => {} }, highlighted: true, badge: "Popular" },
  { name: "Enterprise", price: "Custom", features: ["Unlimited seats", "SSO & SAML"], cta: { label: "Contact sales", onClick: () => {} } },
];

export function BlocksShowcase() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [period, setPeriod] = React.useState<"monthly" | "annual">("monthly");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12">
      <PageHeader
        title="Blocks showcase"
        description="Composed sections from @manpowerhub/blocks."
        badge={<Badge variant="accent">Preview</Badge>}
        actions={<Button variant="primary">Primary action</Button>}
        bordered
      />

      <StatCardRow stats={stats} columns={3} />

      <DataTableToolbar
        search={{ value: q, onChange: setQ, placeholder: "Search members…" }}
        filters={[
          {
            id: "status",
            placeholder: "Status",
            value: status,
            onChange: setStatus,
            options: [
              { label: "Active", value: "active" },
              { label: "Invited", value: "invited" },
            ],
          },
        ]}
        actions={<Button variant="primary">Add member</Button>}
      />

      <EmptyState
        icon={<FolderOpen />}
        title="No projects yet"
        description="Create your first project to get started."
        action={{ label: "New project", onClick: () => {} }}
      />

      <div className="flex justify-center">
        <AuthForm
          email={{ value: email, onChange: setEmail }}
          password={{ value: password, onChange: setPassword }}
          onSubmit={(e) => e.preventDefault()}
          footer={<a href="#" className="text-primary hover:underline">Forgot password?</a>}
        />
      </div>

      <PricingTable tiers={tiers} columns={3} billingPeriod={{ value: period, onChange: setPeriod }} />
    </div>
  );
}
