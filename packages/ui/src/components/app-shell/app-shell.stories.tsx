import type { Meta, StoryObj } from "@storybook/react";
import { AppShell } from "./app-shell";

const meta: Meta<typeof AppShell> = { title: "Components/AppShell", component: AppShell };
export default meta;
type Story = StoryObj<typeof AppShell>;

const Sidebar = () => (
  <nav className="flex flex-col gap-1 p-4">
    <div className="mb-2 font-display text-lg">ManpowerHub</div>
    <a className="rounded-md px-3 py-2 text-sm hover:bg-secondary" href="#">Dashboard</a>
    <a className="rounded-md px-3 py-2 text-sm hover:bg-secondary" href="#">Reports</a>
  </nav>
);
const Topbar = () => <div className="text-sm font-medium">Dashboard</div>;

export const Default: Story = {
  render: () => (
    <AppShell sidebar={<Sidebar />} topbar={<Topbar />}>
      <p className="text-sm text-muted-foreground">Main content area.</p>
    </AppShell>
  ),
};

export const SidebarCollapsed: Story = {
  render: () => (
    <AppShell sidebar={<Sidebar />} topbar={<Topbar />} sidebarOpen={false}>
      <p className="text-sm text-muted-foreground">Main content area, sidebar collapsed.</p>
    </AppShell>
  ),
};

export const Dark: Story = { ...Default, globals: { theme: "dark" } };
export const Customization: Story = {
  render: () => (
    <AppShell sidebar={<Sidebar />} topbar={<Topbar />} sidebarWidth={200}>
      <p className="text-sm text-muted-foreground">Narrower 200px sidebar.</p>
    </AppShell>
  ),
};
