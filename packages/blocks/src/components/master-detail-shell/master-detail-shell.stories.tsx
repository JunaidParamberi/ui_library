import type { Meta, StoryObj } from "@storybook/react";
import { MasterDetailShell } from "./master-detail-shell";

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-border p-4 text-sm text-foreground">{children}</div>
);

const meta: Meta<typeof MasterDetailShell> = {
  title: "Blocks/MasterDetailShell",
  component: MasterDetailShell,
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof MasterDetailShell>;

const list = (
  <Panel>
    List pane
    <br />
    Row A
    <br />
    Row B
    <br />
    Row C
  </Panel>
);
const detail = <Panel>Detail pane for selected row</Panel>;
const placeholder = <Panel>Select an item to view details</Panel>;
const full = <Panel>Full document view</Panel>;

export const Default: Story = {
  args: { list, detail, detailPlaceholder: placeholder, hasSelection: true, onBack: () => {} },
};

export const NoSelection: Story = {
  args: { list, detail, detailPlaceholder: placeholder, hasSelection: false },
};

export const FullView: Story = {
  args: { list, detail, full, isFull: true, hasSelection: true, onBack: () => {} },
};

export const Dark: Story = {
  args: { list, detail, detailPlaceholder: placeholder, hasSelection: true, onBack: () => {} },
  globals: { theme: "dark" },
};

export const Customization: Story = {
  args: {
    list,
    detail,
    detailPlaceholder: placeholder,
    hasSelection: true,
    onBack: () => {},
    listWidth: "26rem",
    className: "gap-8",
  },
};
