import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, Switch, RadioGroup, RadioGroupItem } from "./checkbox";

const meta = { title: "Core/Controls", parameters: { layout: "centered" } } satisfies Meta;
export default meta;

export const CheckboxStates: StoryObj = {
  name: "Checkbox – states",
  render: () => (
    <div className="flex flex-col gap-3">
      <Checkbox id="cb-unchecked" label="Unchecked" />
      <Checkbox id="cb-checked" label="Checked" defaultChecked />
      <Checkbox id="cb-indeterminate" label="Indeterminate" checked="indeterminate" />
      <Checkbox id="cb-disabled" label="Disabled" disabled />
      <Checkbox id="cb-disabled-checked" label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

export const SwitchStates: StoryObj = {
  name: "Switch – states",
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch id="sw-off"  label="Notifications off" />
      <Switch id="sw-on"   label="Notifications on" defaultChecked />
      <Switch id="sw-dis"  label="Disabled" disabled />
    </div>
  ),
};

export const RadioGroupStory: StoryObj = {
  name: "RadioGroup",
  render: () => (
    <RadioGroup defaultValue="monthly">
      {["monthly","quarterly","annually"].map(v => (
        <div key={v} className="flex items-center gap-2">
          <RadioGroupItem value={v} id={`r-${v}`} />
          <label htmlFor={`r-${v}`} className="text-base capitalize cursor-pointer">{v}</label>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Customization: StoryObj = {
  name: "Customization (className wins)",
  render: () => <Checkbox id="custom" label="Custom ring" className="border-primary" />,
};
