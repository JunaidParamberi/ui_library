import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../index";

function TestTabs() {
  return (
    <Tabs defaultValue="invoices">
      <TabsList>
        <TabsTrigger value="invoices">Invoices</TabsTrigger>
        <TabsTrigger value="quotes" count={3}>Quotes</TabsTrigger>
      </TabsList>
      <TabsContent value="invoices">Invoice content</TabsContent>
      <TabsContent value="quotes">Quote content</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("renders tabs with default active tab content", () => {
    render(<TestTabs />);
    expect(screen.getByText("Invoice content")).toBeVisible();
  });

  it("renders count pill on trigger", () => {
    render(<TestTabs />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("merges className on TabsTrigger", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" className="custom-tab">Tab A</TabsTrigger>
        </TabsList>
      </Tabs>
    );
    expect(document.querySelector(".custom-tab")).toBeInTheDocument();
  });

  it("switches content on click", async () => {
    const user = userEvent.setup();
    render(<TestTabs />);
    await user.click(screen.getByRole("tab", { name: /quotes/i }));
    expect(screen.getByText("Quote content")).toBeVisible();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<TestTabs />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
