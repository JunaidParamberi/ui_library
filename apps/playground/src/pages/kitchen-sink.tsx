import { Button } from "@manpowerhub/ui";

export function KitchenSink() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display text-foreground">Kitchen Sink</h1>
      <section className="space-y-3">
        <h2 className="text-sm text-muted-foreground">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </section>
    </div>
  );
}
