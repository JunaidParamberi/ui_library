"use client";
import * as React from "react";
import { Command as Cmdk } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent, DialogTitle } from "../dialog";

export interface CommandMenuItem {
  id: string;
  label: string;
  onSelect: () => void;
  group?: string;
}

export interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandMenuItem[];
  className?: string;
}

export function CommandMenu({ open, onOpenChange, items, className }: CommandMenuProps) {
  const groups = React.useMemo(() => {
    const map = new Map<string, CommandMenuItem[]>();
    for (const item of items) {
      const key = item.group ?? "Commands";
      map.set(key, [...(map.get(key) ?? []), item]);
    }
    return Array.from(map.entries());
  }, [items]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-lg p-0 top-[20%] translate-y-0", className)}>
        <DialogTitle className="sr-only">Command menu</DialogTitle>
        <Cmdk className="flex flex-col overflow-hidden rounded-lg" label="Command menu">
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <Cmdk.Input
              placeholder="Type a command or search..."
              className="h-11 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <Cmdk.List className="max-h-80 overflow-y-auto p-2">
            <Cmdk.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Cmdk.Empty>
            {groups.map(([group, groupItems]) => (
              <Cmdk.Group
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
              >
                {groupItems.map((item) => (
                  <Cmdk.Item
                    key={item.id}
                    onSelect={item.onSelect}
                    className={cn(
                      "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm text-foreground",
                      "data-[selected=true]:bg-secondary",
                    )}
                  >
                    {item.label}
                  </Cmdk.Item>
                ))}
              </Cmdk.Group>
            ))}
          </Cmdk.List>
        </Cmdk>
      </DialogContent>
    </Dialog>
  );
}
