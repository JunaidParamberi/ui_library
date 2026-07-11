import { render, screen, act } from "@testing-library/react";
import { StateToggleProvider, type Forced } from "./state-toggle";
import { useResource } from "./use-resource";

function Probe() {
  const { data, status } = useResource(() => "payload", 100);
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="data">{data ?? "null"}</span>
    </div>
  );
}

function renderForced(forced: Forced) {
  return render(
    <StateToggleProvider initial={forced}>
      <Probe />
    </StateToggleProvider>,
  );
}

describe("useResource", () => {
  it("forces loaded and returns loader data", () => {
    renderForced("loaded");
    expect(screen.getByTestId("status")).toHaveTextContent("loaded");
    expect(screen.getByTestId("data")).toHaveTextContent("payload");
  });

  it("forces empty with null data", () => {
    renderForced("empty");
    expect(screen.getByTestId("status")).toHaveTextContent("empty");
    expect(screen.getByTestId("data")).toHaveTextContent("null");
  });

  it("forces error", () => {
    renderForced("error");
    expect(screen.getByTestId("status")).toHaveTextContent("error");
  });

  it("auto starts loading then resolves to loaded", async () => {
    vi.useFakeTimers();
    renderForced("auto");
    expect(screen.getByTestId("status")).toHaveTextContent("loading");
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    expect(screen.getByTestId("status")).toHaveTextContent("loaded");
    vi.useRealTimers();
  });
});
