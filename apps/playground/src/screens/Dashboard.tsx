import { PageHeader, StatCardRow, EmptyState } from "@manpowerhub/blocks";
import {
  AreaChart,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Avatar,
  AvatarFallback,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Skeleton,
  Button,
} from "@manpowerhub/ui";
import { LayoutDashboard } from "lucide-react";
import { useResource } from "../data/use-resource";
import { dashboardData, type DashboardData } from "../data/mock";

export function Dashboard() {
  const { data, status, refetch } = useResource<DashboardData>(() => dashboardData);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Overview of your workforce and quotations." />

      {status === "loading" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}

      {status === "empty" && (
        <EmptyState
          variant="dashed"
          icon={<LayoutDashboard />}
          title="Nothing to show yet"
          description="Once you add workers and quotations, your dashboard lights up here."
        />
      )}

      {status === "error" && (
        <div className="flex flex-col items-start gap-3 rounded-md border border-border p-6">
          <p className="text-sm text-destructive">Could not load the dashboard.</p>
          <Button onClick={refetch}>Retry</Button>
        </div>
      )}

      {status === "loaded" && data && (
        <div className="flex flex-col gap-6">
          <StatCardRow stats={data.kpis} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardBody>
                <AreaChart data={data.revenue} height={220} className="w-full" />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardBody>
                <ul className="flex flex-col gap-4">
                  {data.activity.map((a) => (
                    <li key={a.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{a.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm">
                          <span className="font-medium">{a.name}</span> {a.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{a.when}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent quotations</CardTitle>
            </CardHeader>
            <CardBody>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recent.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.number}</TableCell>
                      <TableCell>{r.client}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.amount}</TableCell>
                      <TableCell>
                        <Badge>{r.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
