import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "./card";
import { Button } from "../button";

const meta = {
  title: "Core/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <Button variant="ghost" size="sm">View</Button>
      </CardHeader>
      <CardBody>Body content goes here.</CardBody>
      <CardFooter>Updated 2 hours ago</CardFooter>
    </Card>
  ),
};

export const Interactive: Story = { ...Basic, args: { interactive: true } };
export const Dashed: Story = {
  render: () => (
    <Card dashed className="w-80 p-6 text-sm text-muted-foreground">
      Drop a file here, or click to browse.
    </Card>
  ),
};
