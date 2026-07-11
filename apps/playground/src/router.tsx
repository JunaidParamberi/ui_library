import type { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AppShell } from "./app/AppShell";
import { QuotationApiProvider } from "./data/quotation-api";
import { Dashboard } from "./screens/Dashboard";
import { QuotationsList } from "./screens/QuotationsList";

function Placeholder({ name }: { name: string }) {
  return <div className="text-muted-foreground">{name} — coming in a later task.</div>;
}

function PlaceholderOutlet() {
  return <Outlet />;
}

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        element: (
          <QuotationApiProvider>
            <PlaceholderOutlet />
          </QuotationApiProvider>
        ),
        children: [
          { path: "quotations", element: <QuotationsList /> },
          { path: "quotations/new", element: <Placeholder name="Quotation form" /> },
          { path: "quotations/:id", element: <Placeholder name="Quotation detail" /> },
          { path: "quotations/:id/edit", element: <Placeholder name="Quotation form" /> },
        ],
      },
    ],
  },
];
