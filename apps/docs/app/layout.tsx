import "nextra-theme-docs/style.css";
import "./globals.css";

export const metadata = {
  title: {
    default: "ManpowerHub UI",
    template: "%s – ManpowerHub UI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
