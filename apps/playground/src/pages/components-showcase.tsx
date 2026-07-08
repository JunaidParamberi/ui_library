import { useState } from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Checkbox,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  KPICard,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Progress,
  HealthRing,
  Skeleton,
  Spinner,
  DataTable,
  ThemeToggle,
  CommandMenu,
  AppShell,
  AreaChart,
  MiniBars,
  Icons,
} from "@manpowerhub/ui";

interface Person {
  id: string;
  name: string;
  role: string;
  age: number;
}

const people: Person[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", age: 36 },
  { id: "2", name: "Grace Hopper", role: "Engineer", age: 85 },
  { id: "3", name: "Alan Turing", role: "Researcher", age: 41 },
];

const commandItems = [
  { id: "new", label: "New project", onSelect: () => {}, group: "Actions" },
  { id: "settings", label: "Open settings", onSelect: () => {}, group: "Actions" },
];

const series = [
  { x: 0, y: 10 }, { x: 1, y: 25 }, { x: 2, y: 18 }, { x: 3, y: 32 },
  { x: 4, y: 28 }, { x: 5, y: 40 }, { x: 6, y: 35 },
];

export function ComponentsShowcase() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-display text-foreground">Components Showcase</h1>

      <section id="button" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Button</h2>
        <div className="flex items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </section>

      <section id="badge" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Badge</h2>
        <div className="flex items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
        </div>
      </section>

      <section id="card" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Card</h2>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Project status</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted-foreground">Everything is on track.</p>
          </CardBody>
          <CardFooter>
            <Button size="sm" variant="outline">View details</Button>
          </CardFooter>
        </Card>
      </section>

      <section id="input" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Input</h2>
        <div className="max-w-sm space-y-2">
          <Input placeholder="Email address" />
          <Input placeholder="Disabled" disabled />
        </div>
      </section>

      <section id="select" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Select</h2>
        <div className="w-48">
          <Select>
            <SelectTrigger><SelectValue placeholder="Select fruit…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="cherry">Cherry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section id="checkbox" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Checkbox</h2>
        <div className="flex flex-col gap-2">
          <Checkbox id="cb-showcase-unchecked" label="Unchecked" />
          <Checkbox id="cb-showcase-checked" label="Checked" defaultChecked />
        </div>
      </section>

      <section id="tabs" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Tabs</h2>
        <Tabs defaultValue="overview" className="w-[360px]">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"><p className="text-sm text-muted-foreground">Overview content</p></TabsContent>
          <TabsContent value="activity"><p className="text-sm text-muted-foreground">Activity feed</p></TabsContent>
        </Tabs>
      </section>

      <section id="kpi-card" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">KPICard</h2>
        <div className="grid max-w-md grid-cols-2 gap-3">
          <KPICard kpi={{ label: "Revenue", value: "AED 42,180", delta: "+12%", trend: "up", sub: "vs last 30 days" }} />
          <KPICard kpi={{ label: "Active sites", value: "24" }} />
        </div>
      </section>

      <section id="avatar" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Avatar</h2>
        <div className="flex items-center gap-4">
          <Avatar size="sm"><AvatarFallback>SM</AvatarFallback></Avatar>
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/64" alt="User avatar" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
        </div>
      </section>

      <section id="tooltip" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Tooltip</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>Helpful text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </section>

      <section id="dialog" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Dialog</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete item</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button variant="danger">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section id="dropdown-menu" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">DropdownMenu</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section id="progress" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Progress / HealthRing</h2>
        <div className="flex items-center gap-8">
          <div className="flex-1 space-y-3">
            <Progress value={42} aria-label="Upload progress" />
            <Progress value={80} aria-label="Storage used" />
          </div>
          <HealthRing value={72} label="72%" />
        </div>
      </section>

      <section id="skeleton" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Skeleton / Spinner</h2>
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Spinner aria-label="Loading" />
        </div>
      </section>

      <section id="table" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Table / DataTable</h2>
        <DataTable
          columns={[
            { key: "name", header: "Name" },
            { key: "role", header: "Role" },
            { key: "age", header: "Age" },
          ]}
          data={people}
          getRowId={(p: Person) => p.id}
        />
      </section>

      <section id="theme-toggle" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">ThemeToggle</h2>
        <ThemeToggle theme={theme} onThemeChange={setTheme} />
      </section>

      <section id="command-menu" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">CommandMenu</h2>
        <Button onClick={() => setCommandOpen(true)}>Open ⌘K</Button>
        <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} items={commandItems} />
      </section>

      <section id="app-shell" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">AppShell</h2>
        <AppShell
          className="h-48 min-h-0 overflow-hidden rounded-md border border-border"
          sidebar={<nav className="p-4 text-sm">Sidebar</nav>}
          topbar={<div className="text-sm font-medium">Topbar</div>}
        >
          <p className="text-sm text-muted-foreground">Main content area.</p>
        </AppShell>
      </section>

      <section id="area-chart" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">AreaChart / MiniBars</h2>
        <div className="flex items-center gap-8">
          <AreaChart data={series} />
          <MiniBars data={[3, 8, 5, 12, 7, 15, 9]} />
        </div>
      </section>

      <section id="icons" className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Icons</h2>
        <div className="flex items-center gap-4">
          {Object.entries(Icons).map(([name, Icon]) => (
            <Icon key={name} className="size-5 text-foreground" aria-hidden />
          ))}
        </div>
      </section>
    </div>
  );
}
