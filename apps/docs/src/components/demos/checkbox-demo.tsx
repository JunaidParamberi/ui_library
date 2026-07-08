"use client";
import { Checkbox, Switch } from "@manpowerhub/ui";

export function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox id="docs-cb" label="Accept terms" defaultChecked />
      <Switch id="docs-sw" label="Notifications" defaultChecked />
    </div>
  );
}

export function CheckboxUncheckedState() {
  return <Checkbox id="docs-cb-unchecked" label="Accept terms" />;
}
export function CheckboxCheckedState() {
  return <Checkbox id="docs-cb-checked" label="Accept terms" defaultChecked />;
}
export function CheckboxIndeterminateState() {
  return (
    <Checkbox
      id="docs-cb-indeterminate"
      label="Accept terms"
      checked="indeterminate"
      onCheckedChange={() => {}}
    />
  );
}
export function CheckboxDisabledState() {
  return <Checkbox id="docs-cb-disabled" label="Accept terms" disabled />;
}
