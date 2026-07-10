import * as React from "react";
import { Button, cn } from "@manpowerhub/ui";

export interface MasterDetailShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Left pane, always mounted in split mode. */
  list: React.ReactNode;
  /** Right pane, shown when hasSelection is true. */
  detail?: React.ReactNode;
  /** Right pane shown on desktop when nothing is selected. */
  detailPlaceholder?: React.ReactNode;
  /** Full-width content (e.g. a printable document). */
  full?: React.ReactNode;
  /** When true, hide the split and show `full` across the whole width. */
  isFull?: boolean;
  /** Drives which pane shows on mobile and split vs placeholder on desktop. */
  hasSelection?: boolean;
  /** Back / exit-full handler. Renders a back control on mobile detail and in full view. */
  onBack?: () => void;
  /** Width of the list column on desktop. Default "20rem". */
  listWidth?: string;
}

export const MasterDetailShell = React.forwardRef<HTMLDivElement, MasterDetailShellProps>(
  (
    { className, style, list, detail, detailPlaceholder, full, isFull = false, hasSelection = false, onBack, listWidth = "20rem", ...props },
    ref,
  ) => {
    const backButton = onBack ? (
      <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>
    ) : null;

    if (isFull) {
      return (
        <div ref={ref} className={cn("flex flex-col gap-4", className)} style={style} {...props}>
          {backButton}
          <div>{full}</div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4 md:grid-cols-[var(--md-list-w)_1fr]",
          className,
        )}
        style={{ "--md-list-w": listWidth, ...style } as React.CSSProperties}
        {...props}
      >
        {/* List: full-width on mobile only when nothing selected; always visible on desktop */}
        <div className={cn("min-w-0", hasSelection && "hidden md:block")}>{list}</div>

        {/* Detail column */}
        <div className={cn("min-w-0", !hasSelection && "hidden md:block")}>
          {hasSelection ? (
            <div className="flex flex-col gap-4">
              <div className="md:hidden">{backButton}</div>
              {detail}
            </div>
          ) : (
            detailPlaceholder
          )}
        </div>
      </div>
    );
  },
);
MasterDetailShell.displayName = "MasterDetailShell";
