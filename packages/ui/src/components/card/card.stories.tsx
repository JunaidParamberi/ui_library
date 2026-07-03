import type { Meta, StoryObj } from "@storybook/react";
import { MoreHorizontal } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "./card";
import { Button } from "../button/button";

const meta = { title: "Core/Card", parameters: { layout: "centered" } } satisfies Meta;
export default meta;

export const Basic: StoryObj = {
  render: () => (
    <Card className="w-80">
      <CardBody>A simple card with body content.</CardBody>
    </Card>
  ),
};

export const WithHeaderAndAction: StoryObj = {
  name: "Header + Action",
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
        <Button variant="ghost" size="icon-sm" aria-label="More"><MoreHorizontal /></Button>
      </CardHeader>
      <CardBody>Invoice list goes here.</CardBody>
    </Card>
  ),
};

export const WithFooter: StoryObj = {
  name: "With Footer",
  render: () => (
    <Card className="w-80">
      <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
      <CardBody>Body content.</CardBody>
      <CardFooter>Last updated 3 days ago</CardFooter>
    </Card>
  ),
};

export const Interactive: StoryObj = {
  render: () => (
    <Card interactive className="w-80 cursor-pointer">
      <CardBody>Hover me — shadow elevates.</CardBody>
    </Card>
  ),
};

export const DashedExplainer: StoryObj = {
  name: "Dashed (Explainer)",
  render: () => (
    <Card dashed className="w-80">
      <CardBody className="text-muted-foreground text-sm">
        No workers added yet. Add your first worker to get started.
      </CardBody>
    </Card>
  ),
};

export const Customization: StoryObj = {
  name: "Customization (className wins)",
  render: () => (
    <Card className="w-80 border-primary/40 bg-primary/5">
      <CardBody>Custom border and background.</CardBody>
    </Card>
  ),
};
