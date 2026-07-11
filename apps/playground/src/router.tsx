import type { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AppShell } from "./app/AppShell";
import { QuotationApiProvider } from "./data/quotation-api";
import { Dashboard } from "./screens/Dashboard";
import { QuotationsList } from "./screens/QuotationsList";
import { QuotationDetailScreen } from "./screens/QuotationDetail";
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
          { path: "quotations", element: <QuotationsList /> },
          { path: "quotations/new", element: <QuotationFormScreen /> },
          { path: "quotations/:id", element: <QuotationDetailScreen /> },
          { path: "quotations/:id/edit", element: <QuotationFormScreen /> },
        ],
      },
    ],
  },
];
