"use client";
import { useState, type ReactNode } from "react";

export function ComponentPreview({
  children,
  source,
}: {
  children: ReactNode;
  source?: string;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);
  const [darkPreview, setDarkPreview] = useState(false);

  async function copy() {
    if (!source) return;
    await navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-border bg-background">
      {source && (
        <div
          role="tablist"
          className="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1"
        >
          <button
            role="tab"
            aria-selected={tab === "preview"}
            onClick={() => setTab("preview")}
            className={`rounded px-3 py-1 text-sm ${tab === "preview" ? "bg-background font-medium" : "text-muted-foreground"}`}
          >
            Preview
          </button>
          <button
            role="tab"
            aria-selected={tab === "code"}
            onClick={() => setTab("code")}
            className={`rounded px-3 py-1 text-sm ${tab === "code" ? "bg-background font-medium" : "text-muted-foreground"}`}
          >
            Code
          </button>
          <button
            onClick={() => setDarkPreview((d) => !d)}
            aria-pressed={darkPreview}
            aria-label="Toggle dark preview"
            className="ml-auto rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {darkPreview ? "Light" : "Dark"}
          </button>
          <button
            onClick={copy}
            className="rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            aria-label="Copy code"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      {tab === "preview" || !source ? (
        <div
          data-testid="component-preview-container"
          className={`p-6${darkPreview ? " dark" : ""}`}
        >
          {children}
        </div>
      ) : (
        // Syntax highlighting deferred — plain monospace source is copyable and readable.
        <pre className="overflow-x-auto p-4 text-sm">
          <code>{source}</code>
        </pre>
      )}
    </div>
  );
}
