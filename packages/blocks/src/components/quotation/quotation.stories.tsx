import type { Meta, StoryObj } from "@storybook/react";
import { Quotation } from "./quotation";
import { createMockQuotationApi } from "./quotation.mock";

const meta: Meta<typeof Quotation> = { title: "Blocks/Quotation", component: Quotation };
export default meta;
type Story = StoryObj<typeof Quotation>;

export const Default: Story = { render: () => <Quotation api={createMockQuotationApi()} /> };
export const Empty: Story = { render: () => <Quotation api={createMockQuotationApi([])} /> };
export const Dark: Story = { render: () => <Quotation api={createMockQuotationApi()} />, globals: { theme: "dark" } };
export const Customization: Story = { render: () => <Quotation className="rounded-lg border border-border p-6" api={createMockQuotationApi()} /> };
