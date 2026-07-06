"use client";
import { Field, Input } from "@manpowerhub/ui";

export function InputDemo() {
  return (
    <Field label="Email" htmlFor="docs-email" className="max-w-sm">
      <Input id="docs-email" type="email" placeholder="you@example.com" />
    </Field>
  );
}
