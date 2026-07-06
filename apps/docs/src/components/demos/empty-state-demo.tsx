"use client";
import { EmptyState } from "@manpowerhub/blocks";
import { FolderOpen } from "lucide-react";

export function EmptyStateDemo() {
  return (
    <EmptyState
      icon={<FolderOpen />}
      title="No projects yet"
      description="Create your first project to get started."
      action={{ label: "New project", onClick: () => {} }}
    />
  );
}
