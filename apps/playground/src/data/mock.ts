import type { KPI } from "@manpowerhub/ui";
import type { AreaChartPoint } from "@manpowerhub/ui";

export interface ActivityItem {
  id: string;
  name: string;
  initials: string;
  action: string;
  when: string;
}

export interface RecentRow {
  id: string;
  number: string;
  client: string;
  amount: string;
  status: string;
}

export interface DashboardData {
  kpis: KPI[];
  revenue: AreaChartPoint[];
  activity: ActivityItem[];
  recent: RecentRow[];
}

export const dashboardData: DashboardData = {
  kpis: [
    { label: "Active workers", value: "342", delta: "+12", trend: "up" },
    { label: "Open quotations", value: "18", delta: "+3", trend: "up" },
    { label: "Revenue (MTD)", value: "AED 1.24M", delta: "+8%", trend: "up" },
    { label: "Overdue invoices", value: "5", delta: "-2", trend: "down" },
  ],
  revenue: [
    { x: "Jan", y: 820 }, { x: "Feb", y: 910 }, { x: "Mar", y: 870 },
    { x: "Apr", y: 1020 }, { x: "May", y: 1180 }, { x: "Jun", y: 1240 },
  ],
  activity: [
    { id: "a1", name: "Priya Nair", initials: "PN", action: "approved Q-1002", when: "2h ago" },
    { id: "a2", name: "Sam Okoro", initials: "SO", action: "added 4 scaffolders to Phoenix Mills", when: "5h ago" },
    { id: "a3", name: "Lena Marchetti", initials: "LM", action: "created Q-1004", when: "1d ago" },
  ],
  recent: [
    { id: "r1", number: "Q-1004", client: "Northwind Labs", amount: "AED 48,200", status: "Draft" },
    { id: "r2", number: "Q-1003", client: "Phoenix Mills", amount: "AED 12,000", status: "Pending" },
    { id: "r3", number: "Q-1002", client: "Delta Rigging", amount: "AED 96,500", status: "Approved" },
  ],
};
