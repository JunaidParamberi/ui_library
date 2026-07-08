import { describe, it, expect } from "vitest";
import path from "node:path";
import { buildSymbolMap } from "./symbol-map";

const UI_SRC = path.resolve(__dirname, "../../../../packages/ui/src");

describe("buildSymbolMap", () => {
  const map = buildSymbolMap(UI_SRC);

  it("maps card sub-exports to card", () => {
    expect(map.get("Card")).toEqual({ item: "card", file: "card" });
    expect(map.get("CardBody")).toEqual({ item: "card", file: "card" });
    expect(map.get("CardTitle")).toEqual({ item: "card", file: "card" });
  });

  it("maps Field to input", () => {
    expect(map.get("Field")).toEqual({ item: "input", file: "input" });
  });

  it("maps KPICard and KPI to kpi-card", () => {
    expect(map.get("KPICard")).toEqual({ item: "kpi-card", file: "kpi-card" });
    expect(map.get("KPI")).toEqual({ item: "kpi-card", file: "kpi-card" });
  });

  it("maps cn to utils", () => {
    expect(map.get("cn")).toEqual({ item: "utils", file: "utils" });
  });

  it("maps StatusBadge to the badge item but status-badge file", () => {
    expect(map.get("StatusBadge")).toEqual({ item: "badge", file: "status-badge" });
  });

  it("maps Badge to the badge item and badge file", () => {
    expect(map.get("Badge")).toEqual({ item: "badge", file: "badge" });
  });

  it("maps DataTable to the table item but data-table file", () => {
    expect(map.get("DataTable")).toEqual({ item: "table", file: "data-table" });
  });

  it("maps Table to the table item and table file", () => {
    expect(map.get("Table")).toEqual({ item: "table", file: "table" });
  });
});
