import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Search } from "lucide-react";
import {
  Input,
  Button,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  cn,
} from "@manpowerhub/ui";

export const dataTableToolbarVariants = cva("flex flex-wrap items-center gap-2", {
  variants: {
    density: {
      comfortable: "py-2",
      compact: "py-1",
    },
  },
  defaultVariants: { density: "comfortable" },
});

export interface ToolbarFilter {
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export interface DataTableToolbarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof dataTableToolbarVariants> {
  search: { value: string; onChange: (value: string) => void; placeholder?: string };
  filters?: ToolbarFilter[];
  actions?: React.ReactNode;
  selectedCount?: number;
  bulkActions?: React.ReactNode;
}

export const DataTableToolbar = React.forwardRef<HTMLDivElement, DataTableToolbarProps>(
  ({ className, density, search, filters, actions, selectedCount = 0, bulkActions, ...props }, ref) => (
    <div ref={ref} className={cn(dataTableToolbarVariants({ density }), className)} {...props}>
      <div className="relative min-w-[180px] flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fg-3" aria-hidden />
        <Input
          type="search"
          className="pl-8"
          placeholder={search.placeholder ?? "Search…"}
          value={search.value}
          onChange={(e) => search.onChange(e.target.value)}
        />
      </div>

      {filters?.map((f) => (
        <Select key={f.id} value={f.value} onValueChange={f.onChange}>
          <SelectTrigger className="w-auto min-w-[140px]">
            <SelectValue placeholder={f.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {f.options.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}

      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="accent">{selectedCount} selected</Badge>
          {bulkActions}
        </div>
      )}

      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  ),
);
DataTableToolbar.displayName = "DataTableToolbar";
