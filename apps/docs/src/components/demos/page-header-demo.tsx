"use client";
import { PageHeader } from "@manpowerhub/blocks";
import { Badge, Button } from "@manpowerhub/ui";

export function PageHeaderDemo() {
  return (
    <PageHeader
      title="Team members"
      description="Invite and manage your team."
      badge={<Badge variant="accent">Preview</Badge>}
      actions={<Button variant="primary">Add member</Button>}
      bordered
    />
  );
}
