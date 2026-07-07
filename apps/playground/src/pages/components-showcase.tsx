import { useState } from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
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

      <section className="space-y-3">
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

      <section className="space-y-3">
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

      <section className="space-y-3">
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

      <section className="space-y-3">
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

      <section className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Progress / HealthRing</h2>
        <div className="flex items-center gap-8">
          <div className="flex-1 space-y-3">
            <Progress value={42} aria-label="Upload progress" />
            <Progress value={80} aria-label="Storage used" />
          </div>
          <HealthRing value={72} label="72%" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Skeleton / Spinner</h2>
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Spinner aria-label="Loading" />
        </div>
      </section>

      <section className="space-y-3">
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

      <section className="space-y-3">
        <h2 className="text-sm text-muted-foreground">ThemeToggle</h2>
        <ThemeToggle theme={theme} onThemeChange={setTheme} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm text-muted-foreground">CommandMenu</h2>
        <Button onClick={() => setCommandOpen(true)}>Open ⌘K</Button>
        <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} items={commandItems} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm text-muted-foreground">AppShell</h2>
        <AppShell
          className="h-48 min-h-0 overflow-hidden rounded-md border border-border"
          sidebar={<nav className="p-4 text-sm">Sidebar</nav>}
          topbar={<div className="text-sm font-medium">Topbar</div>}
        >
          <p className="text-sm text-muted-foreground">Main content area.</p>
        </AppShell>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm text-muted-foreground">AreaChart / MiniBars</h2>
        <div className="flex items-center gap-8">
          <AreaChart data={series} />
          <MiniBars data={[3, 8, 5, 12, 7, 15, 9]} />
        </div>
      </section>

      <section className="space-y-3">
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
