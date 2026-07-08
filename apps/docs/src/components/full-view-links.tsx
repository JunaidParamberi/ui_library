import { catalog } from "../lib/catalog";
import { StorybookLink } from "./storybook-link";

const PLAYGROUND =
  process.env.NEXT_PUBLIC_PLAYGROUND_URL ?? "http://localhost:5173";

export function FullViewLinks({ slug }: { slug: string }) {
  const entry = catalog.find((c) => c.slug === slug);
  if (!entry) return null;
  return (
    <div className="not-prose my-4 flex flex-wrap gap-4 text-sm">
      <StorybookLink package={entry.pkg} story={entry.story} storyId={entry.storyId} />
      <a
        href={`${PLAYGROUND}/#${slug}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        Open in Playground →
      </a>
    </div>
  );
}
