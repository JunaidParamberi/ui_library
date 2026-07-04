import { useState } from "react";
import { KitchenSink } from "./pages/kitchen-sink";

type Page = { id: string; label: string; element: React.ReactNode };

const PAGES: Page[] = [
  { id: "kitchen-sink", label: "Kitchen Sink", element: <KitchenSink /> },
];

export function App() {
  const [active, setActive] = useState(PAGES[0]!.id);
  const current = PAGES.find((p) => p.id === active) ?? PAGES[0]!;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <nav className="w-56 shrink-0 border-r border-border p-4 space-y-1">
        <div className="mb-4 font-display text-lg">Playground</div>
        {PAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className="block w-full rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-secondary aria-[current=true]:bg-secondary aria-[current=true]:text-foreground"
            aria-current={p.id === active}
          >
            {p.label}
          </button>
        ))}
      </nav>
      <main className="flex-1 p-8">{current.element}</main>
    </div>
  );
}
