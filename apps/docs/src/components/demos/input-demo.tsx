"use client";
import { Field, Input } from "@manpowerhub/ui";

export function InputDemo() {
  return (
    <Field label="Email" htmlFor="docs-email" className="max-w-sm">
      <Input id="docs-email" type="email" placeholder="you@example.com" />
    </Field>
  );
}

export function InputDefaultState() {
  return <Input placeholder="you@example.com" />;
}
export function InputDisabledState() {
  return <Input placeholder="you@example.com" disabled />;
}
export function InputInvalidState() {
  return <Input placeholder="you@example.com" invalid defaultValue="not-an-email" />;
}
