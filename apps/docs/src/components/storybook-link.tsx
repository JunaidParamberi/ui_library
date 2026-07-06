import type { ComponentProps } from "react";

const BASE = {
  ui: process.env.NEXT_PUBLIC_STORYBOOK_UI_URL ?? "http://localhost:6006",
  blocks:
    process.env.NEXT_PUBLIC_STORYBOOK_BLOCKS_URL ?? "http://localhost:6007",
} as const;

export interface StorybookLinkProps extends ComponentProps<"a"> {
  package: keyof typeof BASE;
  story: string;
  storyId?: string;
  label?: string;
}

export function StorybookLink({
  package: pkg,
  story,
  storyId = "default",
  label = "Open in Storybook →",
  ...props
}: StorybookLinkProps) {
  const href = `${BASE[pkg]}/?path=/story/${story}--${storyId}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
      {...props}
    >
      {label}
    </a>
  );
}
