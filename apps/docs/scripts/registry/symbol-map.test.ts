import { describe, it, expect } from "vitest";
import path from "node:path";
import { buildSymbolMap } from "./symbol-map";

const UI_SRC = path.resolve(__dirname, "../../../../packages/ui/src");

describe("buildSymbolMap", () => {
  const map = buildSymbolMap(UI_SRC);

  it("maps card sub-exports to card", () => {
    expect(map.get("Card")).toBe("card");
    expect(map.get("CardBody")).toBe("card");
    expect(map.get("CardTitle")).toBe("card");
  });

  it("maps Field to input", () => {
    expect(map.get("Field")).toBe("input");
  });

  it("maps KPICard and KPI to kpi-card", () => {
    expect(map.get("KPICard")).toBe("kpi-card");
    expect(map.get("KPI")).toBe("kpi-card");
  });

  it("maps cn to utils", () => {
    expect(map.get("cn")).toBe("utils");
  });
});
