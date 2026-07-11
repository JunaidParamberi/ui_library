import * as React from "react";
import { useStateToggle } from "./state-toggle";

export type ResourceStatus = "loading" | "loaded" | "empty" | "error";

export function useResource<T>(
  loader: () => T,
  delayMs = 600,
): { data: T | null; status: ResourceStatus; refetch: () => void } {
  const { forced } = useStateToggle();
  const [status, setStatus] = React.useState<ResourceStatus>("loading");
  const [data, setData] = React.useState<T | null>(null);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (forced !== "auto") {
      setStatus(forced);
      setData(forced === "loaded" ? loader() : null);
      return;
    }
    setStatus("loading");
    setData(null);
    const t = setTimeout(() => {
      setData(loader());
      setStatus("loaded");
    }, delayMs);
    return () => clearTimeout(t);
    // loader is treated as stable (module-level mock); tick forces re-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced, tick, delayMs]);

  const refetch = React.useCallback(() => setTick((n) => n + 1), []);
  return { data, status, refetch };
}
