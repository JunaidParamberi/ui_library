import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@manpowerhub/ui";
import "./document-shell.css";

export { StatusPill } from "./status-pill";
export type { StatusPillProps } from "./status-pill";

export const sheetVariants = cva(
  "mph-sheet relative mx-auto bg-card px-16 pb-20 pt-14 font-body text-foreground shadow-pop",
  {
    variants: {
      brandStyle: {
        default: "",
        mono: "",     // styled with Invoice
        branded: "",
        serif: "",
      },
    },
    defaultVariants: { brandStyle: "default" },
  },
);

export const Sheet = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof sheetVariants>
>(({ className, brandStyle, ...props }, ref) => (
  <div ref={ref} className={cn(sheetVariants({ brandStyle }), className)} {...props} />
));
Sheet.displayName = "Sheet";

export interface Party {
  label: string;
  name: React.ReactNode;
  lines?: React.ReactNode;
}

export interface BrandBlock {
  name: string;
  mark?: React.ReactNode;
  trn?: string;
  contact?: string[];
  preparedBy?: string;
}

export const DocHeader = ({
  type, id, idSuffix, status, brand,
}: { type: string; id: string; idSuffix?: string; status?: React.ReactNode; brand: BrandBlock }) => (
  <header className="mb-8 flex items-start justify-between gap-6">
    <div className="flex items-start gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-foreground font-display text-lg font-bold text-background">
        {brand.mark ?? brand.name.charAt(0)}
      </div>
      <div>
        <div className="font-display font-semibold text-foreground">{brand.name}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {brand.preparedBy && <div>{brand.preparedBy}</div>}
          {brand.contact?.map((c) => <div key={c}>{c}</div>)}
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-display text-3xl font-semibold tracking-tight text-foreground">{type}</div>
      <div className="font-mono text-xs text-muted-foreground">
        {id}{idSuffix ? ` ${idSuffix}` : ""}
      </div>
      {status && <div className="mt-3 flex justify-end">{status}</div>}
    </div>
  </header>
);

export const Party = ({ label, name, lines }: Party) => (
  <div>
    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="mt-1 font-medium text-foreground">{name}</div>
    {lines && <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{lines}</div>}
  </div>
);

export const PartiesGrid = ({ parties }: { parties: Party[] }) => (
  <div
    className="mb-8 grid gap-8 border-t border-border pt-6"
    style={{ gridTemplateColumns: `repeat(${Math.min(parties.length, 3)}, minmax(0, 1fr))` }}
  >
    {parties.map((p) => <Party key={p.label} {...p} />)}
  </div>
);

export interface ItemColumn {
  key: string;
  header: string;
  align?: "left" | "right";
}
export interface ItemsTableProps extends React.HTMLAttributes<HTMLTableElement> {
  columns: ItemColumn[];
  rows: Array<Record<string, React.ReactNode>>;
}
export const ItemsTable = React.forwardRef<HTMLTableElement, ItemsTableProps>(
  ({ className, columns, rows, ...props }, ref) => (
    <table ref={ref} className={cn("mb-6 w-full border-collapse text-sm", className)} {...props}>
      <thead>
        <tr className="border-b border-border">
          {columns.map((c) => (
            <th key={c.key} className={cn("py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground", c.align === "right" ? "text-right" : "text-left")}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-border/60">
            {columns.map((c) => (
              <td key={c.key} className={cn("py-3 align-top text-foreground", c.align === "right" ? "text-right tabular-nums" : "text-left")}>
                {row[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
);
ItemsTable.displayName = "ItemsTable";

export interface TotalsRow { label: string; value: React.ReactNode; strong?: boolean }
export const Totals = ({ rows, className }: { rows: TotalsRow[]; className?: string }) => (
  <div className={cn("ml-auto w-72", className)}>
    {rows.map((r) => (
      <div
        key={r.label}
        className={cn(
          "flex justify-between py-1 text-sm",
          r.strong ? "mt-1 border-t border-border pt-2 font-semibold text-foreground" : "text-muted-foreground",
        )}
      >
        <span>{r.label}</span>
        <span className="tabular-nums">{r.value}</span>
      </div>
    ))}
  </div>
);

export const PageNum = ({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) => (
  <div className="absolute inset-x-16 bottom-8 flex justify-between text-[10px] text-muted-foreground">
    <span>{left}</span>
    <span>{right}</span>
  </div>
);

export interface DocumentShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetVariants> {
  type: string;
  id: string;
  idSuffix?: string;
  status?: React.ReactNode;
  brand: BrandBlock;
  parties: Party[];
  footer?: React.ReactNode;
  pageLabel?: string;
}

export const DocumentShell = React.forwardRef<HTMLDivElement, DocumentShellProps>(
  ({ className, brandStyle, type, id, idSuffix, status, brand, parties, footer, pageLabel = "Page 1 of 1", children, ...props }, ref) => (
    <Sheet ref={ref} brandStyle={brandStyle} className={className} {...props}>
      <DocHeader type={type} id={id} idSuffix={idSuffix} status={status} brand={brand} />
      <PartiesGrid parties={parties} />
      {children}
      {footer && <div className="mt-8 border-t border-border pt-6">{footer}</div>}
      <PageNum
        left={brand.trn ? [brand.name, brand.trn].join(" · ") : undefined}
        right={pageLabel}
      />
    </Sheet>
  ),
);
DocumentShell.displayName = "DocumentShell";
