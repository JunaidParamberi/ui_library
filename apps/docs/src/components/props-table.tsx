import propsData from "../generated/props.generated.json";

interface PropRow {
  name: string;
  type: string;
  defaultValue: string | boolean | number | null;
  required: boolean;
  description: string;
}

const data = propsData as unknown as Record<string, PropRow[]>;

export function PropsTable({ of }: { of: string }) {
  const rows = data[of];
  if (!rows || rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No documented props for <code>{of}</code>.
      </p>
    );
  }
  return (
    <div className="not-prose my-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2 pr-4 font-medium">Prop</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 pr-4 font-medium">Default</th>
            <th className="py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-border/50 align-top">
              <td className="py-2 pr-4 font-mono">
                {r.name}
                {r.required && <span className="text-danger"> *</span>}
              </td>
              <td className="py-2 pr-4 font-mono text-muted-foreground">{r.type}</td>
              <td className="py-2 pr-4 font-mono">{r.defaultValue?.toString() ?? "—"}</td>
              <td className="py-2">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
