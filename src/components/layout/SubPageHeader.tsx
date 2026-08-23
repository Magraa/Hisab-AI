import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function SubPageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-6 pb-4">
      <Link
        href="/more"
        aria-label="Back"
        className="tap-active flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-ink transition-colors active:bg-primary-soft/40"
      >
        <ArrowLeft size={18} />
      </Link>
      <div>
        <h1 className="text-xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
