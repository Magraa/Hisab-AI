import type { ReactNode } from "react";

export function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-10 text-center">
      <p className="text-base font-medium text-ink">{title}</p>
      {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      {action}
    </div>
  );
}
