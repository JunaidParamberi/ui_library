import type { Meta, StoryObj } from "@storybook/react";
import { QuotationsPage } from "./quotations-page";
import { createMockQuotationApi, seedQuotations } from "../quotation";

const meta: Meta<typeof QuotationsPage> = {
  title: "Blocks/QuotationsPage",
  component: QuotationsPage,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof QuotationsPage>;

export const Default: Story = {
  render: () => <QuotationsPage api={createMockQuotationApi()} />,
};

export const Dark: Story = {
  parameters: { themes: { themeOverride: "dark" } },
  render: () => (
    <div className="dark bg-background p-6">
      <QuotationsPage api={createMockQuotationApi()} />
    </div>
  ),
};

export const Loading: Story = {
  render: () => {
    const never: ReturnType<typeof createMockQuotationApi> = {
      ...createMockQuotationApi(),
      list: () => new Promise(() => {}),
    };
    return <QuotationsPage api={never} />;
  },
};

export const Empty: Story = {
  render: () => <QuotationsPage api={createMockQuotationApi([])} />,
};

export const Error: Story = {
  render: () => {
    const failing: ReturnType<typeof createMockQuotationApi> = {
      ...createMockQuotationApi(),
      list: () => Promise.reject(new Error("Failed to load quotations")),
    };
    return <QuotationsPage api={failing} />;
  },
};

export const Customization: Story = {
  name: "Customization (currency + className)",
  render: () => (
    <QuotationsPage
      api={createMockQuotationApi(seedQuotations())}
      currency="USD"
      className="rounded-lg border border-border p-4"
    />
  ),
};
