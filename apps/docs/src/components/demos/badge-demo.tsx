"use client";
import { Badge } from "@manpowerhub/ui";

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="accent">Accent</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}
