import { getPageMap } from "nextra/page-map";
import { NextraDocsLayout } from "../../src/components/nextra-docs-layout";

export default async function MdxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageMap = await getPageMap();
  return <NextraDocsLayout pageMap={pageMap}>{children}</NextraDocsLayout>;
}
