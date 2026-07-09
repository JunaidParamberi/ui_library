import type { Meta, StoryObj } from "@storybook/react";
import { DocumentShell, ItemsTable, Totals, StatusPill } from "./document-shell";

const args = {
  type: "Quotation",
  id: "Q-1001",
  brand: { name: "Studio Marchetti", contact: ["lena@studio.com", "+971 50 482 9311"], trn: "100000000000003" },
  status: <StatusPill variant="warn" dot>Pending approval</StatusPill>,
  parties: [
    { label: "Prepared for", name: "Northwind Labs", lines: "Mumbai 400013, India" },
    { label: "Project", name: "Landing v3", lines: "Start 02 Jun 2026" },
    { label: "Details", name: "Q-1001", lines: "Issued 01 Jul 2026" },
  ],
  children: (
    <>
      <ItemsTable
        columns={[
          { key: "scope", header: "Scope" },
          { key: "qty", header: "Qty", align: "right" },
          { key: "amt", header: "Amount", align: "right" },
        ]}
        rows={[{ scope: "Discovery workshop", qty: "1", amt: "1,400.00" }]}
      />
      <Totals rows={[{ label: "Subtotal", value: "1,400.00" }, { label: "Total AED", value: "1,400.00", strong: true }]} />
    </>
  ),
};

const meta: Meta<typeof DocumentShell> = { title: "Blocks/DocumentShell", component: DocumentShell };
export default meta;
type Story = StoryObj<typeof DocumentShell>;

export const Default: Story = { args };
export const Dark: Story = { args, globals: { theme: "dark" } };
export const Customization: Story = { args: { ...args, className: "shadow-none" } };
