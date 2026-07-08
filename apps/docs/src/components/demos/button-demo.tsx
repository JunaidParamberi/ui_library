"use client";
import { Button } from "@manpowerhub/ui";

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button loading>Loading</Button>
    </div>
  );
}

export function ButtonDefaultState() {
  return <Button variant="primary">Save</Button>;
}
export function ButtonLoadingState() {
  return <Button loading>Save</Button>;
}
export function ButtonDisabledState() {
  return <Button disabled>Save</Button>;
}
