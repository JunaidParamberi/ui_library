"use client";
import { Card, CardHeader, CardTitle, CardBody } from "@manpowerhub/ui";

export function CardDemo() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
      </CardHeader>
      <CardBody>Card body content.</CardBody>
    </Card>
  );
}
