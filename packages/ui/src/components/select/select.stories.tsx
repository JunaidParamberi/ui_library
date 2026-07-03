import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel, SelectSeparator } from "./select";

const meta = { title: "Core/Select", parameters: { layout: "centered" } } satisfies Meta;
export default meta;

const fruits = ["Apple","Banana","Cherry","Date","Elderberry","Fig","Grape"];

export const Default: StoryObj = {
  render: () => (
    <div className="w-48">
      <Select>
        <SelectTrigger><SelectValue placeholder="Select fruit…" /></SelectTrigger>
        <SelectContent>
          {fruits.map(f => <SelectItem key={f} value={f.toLowerCase()}>{f}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: StoryObj = {
  name: "With Groups + Separator",
  render: () => (
    <div className="w-56">
      <Select>
        <SelectTrigger><SelectValue placeholder="Select status…" /></SelectTrigger>
        <SelectContent>
          <SelectLabel>Documents</SelectLabel>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="sent">Sent</SelectItem>
          <SelectSeparator />
          <SelectLabel>Payments</SelectLabel>
          <SelectItem value="paid">Paid</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: StoryObj = {
  render: () => (
    <div className="w-48">
      <Select disabled>
        <SelectTrigger><SelectValue placeholder="Disabled" /></SelectTrigger>
        <SelectContent><SelectItem value="a">Option</SelectItem></SelectContent>
      </Select>
    </div>
  ),
};

export const Large: StoryObj = {
  render: () => (
    <div className="w-48">
      <Select>
        <SelectTrigger inputSize="lg"><SelectValue placeholder="Large select…" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Customization: StoryObj = {
  name: "Customization (className wins)",
  render: () => (
    <div className="w-48">
      <Select>
        <SelectTrigger className="border-primary"><SelectValue placeholder="Custom border" /></SelectTrigger>
        <SelectContent><SelectItem value="a">Option</SelectItem></SelectContent>
      </Select>
    </div>
  ),
};
