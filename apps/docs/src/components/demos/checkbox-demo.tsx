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
