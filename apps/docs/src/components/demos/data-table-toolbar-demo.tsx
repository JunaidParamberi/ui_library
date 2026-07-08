"use client";
import * as React from "react";
import { DataTableToolbar } from "@manpowerhub/blocks";
import { Button } from "@manpowerhub/ui";

export function DataTableToolbarDemo() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState("");
  return (
    <DataTableToolbar
      search={{ value: q, onChange: setQ, placeholder: "Search members…" }}
      filters={[
        {
          id: "status",
          placeholder: "Status",
          value: status,
          onChange: setStatus,
          options: [
            { label: "Active", value: "active" },
            { label: "Invited", value: "invited" },
          ],
        },
      ]}
      actions={<Button variant="primary">Add member</Button>}
    />
  );
}

export function DataTableToolbarDefaultState() {
  const [q, setQ] = React.useState("");
  return (
    <DataTableToolbar
      search={{ value: q, onChange: setQ, placeholder: "Search members…" }}
      actions={<Button variant="primary">Add member</Button>}
    />
  );
}

export function DataTableToolbarSelectedState() {
  const [q, setQ] = React.useState("");
  return (
    <DataTableToolbar
      search={{ value: q, onChange: setQ, placeholder: "Search members…" }}
      selectedCount={3}
      bulkActions={
        <Button variant="ghost" size="sm">
          Remove
        </Button>
      }
      actions={<Button variant="primary">Add member</Button>}
    />
  );
}
