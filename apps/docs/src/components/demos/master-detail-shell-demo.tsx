"use client";
import * as React from "react";
import { MasterDetailShell } from "@manpowerhub/blocks";

const Panel = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg border border-border p-4 text-sm text-foreground">{children}</div>
);

export function MasterDetailShellDemo() {
  const [hasSelection, setHasSelection] = React.useState(true);
  return (
    <MasterDetailShell
      list={
        <Panel>
          List pane
          <br />
          Row A
          <br />
          Row B
        </Panel>
      }
      detail={<Panel>Detail pane for the selected row</Panel>}
      detailPlaceholder={<Panel>Select an item to view details</Panel>}
      hasSelection={hasSelection}
      onBack={() => setHasSelection(false)}
    />
  );
}
