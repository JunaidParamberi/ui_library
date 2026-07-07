"use client";
import { useState } from "react";
import { Button, CommandMenu } from "@manpowerhub/ui";

const items = [
  { id: "new", label: "New project", onSelect: () => {}, group: "Actions" },
  { id: "settings", label: "Open settings", onSelect: () => {}, group: "Actions" },
  { id: "docs", label: "Search documentation", onSelect: () => {}, group: "Navigation" },
];

export function CommandMenuDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open ⌘K</Button>
      <CommandMenu open={open} onOpenChange={setOpen} items={items} />
    </>
  );
}
