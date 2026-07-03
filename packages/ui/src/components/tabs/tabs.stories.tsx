import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const meta = { title: "Core/Tabs", parameters: { layout: "centered" } } satisfies Meta;
export default meta;

export const Default: StoryObj = {
  render: () => (
    <div className="w-[480px]">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><p className="text-muted-foreground">Overview content</p></TabsContent>
        <TabsContent value="activity"><p className="text-muted-foreground">Activity feed</p></TabsContent>
        <TabsContent value="settings"><p className="text-muted-foreground">Settings panel</p></TabsContent>
      </Tabs>
    </div>
  ),
};

export const WithCounts: StoryObj = {
  name: "With Counts",
  render: () => (
    <div className="w-[480px]">
      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices" count={12}>Invoices</TabsTrigger>
          <TabsTrigger value="quotes"   count={3}>Quotes</TabsTrigger>
          <TabsTrigger value="drafts"   count={0}>Drafts</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices"><p>Invoice list</p></TabsContent>
        <TabsContent value="quotes"><p>Quote list</p></TabsContent>
        <TabsContent value="drafts"><p>No drafts</p></TabsContent>
      </Tabs>
    </div>
  ),
};

export const WithDisabled: StoryObj = {
  name: "With Disabled Tab",
  render: () => (
    <div className="w-[480px]">
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Enabled</TabsTrigger>
          <TabsTrigger value="b" disabled>Disabled</TabsTrigger>
          <TabsTrigger value="c">Also Enabled</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="c">Content C</TabsContent>
      </Tabs>
    </div>
  ),
};

export const Customization: StoryObj = {
  name: "Customization (className wins)",
  render: () => (
    <Tabs defaultValue="a">
      <TabsList className="border-primary/30">
        <TabsTrigger value="a" className="text-primary">Custom Tab</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Content</TabsContent>
    </Tabs>
  ),
};
