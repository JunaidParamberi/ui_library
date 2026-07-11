import * as React from "react";
import { Button } from "@manpowerhub/ui";

export type Forced = "auto" | "loading" | "loaded" | "empty" | "error";

interface StateToggleValue {
  forced: Forced;
  setForced: (f: Forced) => void;
}

const StateToggleContext = React.createContext<StateToggleValue | null>(null);

export function StateToggleProvider({
  initial = "auto",
  children,
}: {
  initial?: Forced;
  children: React.ReactNode;
}) {
  const [forced, setForced] = React.useState<Forced>(initial);
  const value = React.useMemo(() => ({ forced, setForced }), [forced]);
  return <StateToggleContext.Provider value={value}>{children}</StateToggleContext.Provider>;
}

export function useStateToggle(): StateToggleValue {
  const ctx = React.useContext(StateToggleContext);
  if (!ctx) throw new Error("useStateToggle must be used within StateToggleProvider");
  return ctx;
}

const OPTIONS: Forced[] = ["auto", "loading", "loaded", "empty", "error"];

export function StateToggle() {
  const { forced, setForced } = useStateToggle();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-md border border-border bg-background p-1 shadow-md">
      <span className="px-2 text-xs text-muted-foreground">State</span>
      {OPTIONS.map((o) => (
        <Button
          key={o}
          size="sm"
          variant={forced === o ? "primary" : "ghost"}
          onClick={() => setForced(o)}
        >
          {o}
        </Button>
      ))}
    </div>
  );
}
