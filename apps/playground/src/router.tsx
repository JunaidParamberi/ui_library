import type { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AppShell } from "./app/AppShell";
import { QuotationApiProvider } from "./data/quotation-api";
import { Dashboard } from "./screens/Dashboard";
import { QuotationsScreen } from "./screens/Quotations";
import { QuotationFormScreen } from "./screens/QuotationForm";

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
          { path: "quotations", element: <QuotationsScreen /> },
          { path: "quotations/new", element: <QuotationFormScreen /> },
          { path: "quotations/:id", element: <QuotationsScreen /> },
          { path: "quotations/:id/edit", element: <QuotationFormScreen /> },
        ],
      },
    ],
  },
];
