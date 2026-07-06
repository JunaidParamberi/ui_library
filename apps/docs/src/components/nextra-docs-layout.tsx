"use client";

import { Footer, Layout, Navbar } from "nextra-theme-docs";
import type { PageMapItem } from "nextra";

export function NextraDocsLayout({
  children,
  pageMap,
}: {
  children: React.ReactNode;
  pageMap: PageMapItem[];
}) {
  return (
    <Layout
      navbar={
        <Navbar
          logo={
            <span className="font-display text-base font-semibold">
              ManpowerHub UI
            </span>
          }
        />
      }
      pageMap={pageMap}
      docsRepositoryBase="https://github.com/junaidparamberi/manpowerhub-ui/tree/main/apps/docs"
      footer={<Footer>ManpowerHub UI</Footer>}
      darkMode
    >
      {children}
    </Layout>
  );
}
