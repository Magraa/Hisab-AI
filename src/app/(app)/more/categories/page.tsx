import { CATEGORIES } from "@/lib/categories";
import { SubPageHeader } from "@/components/layout/SubPageHeader";
import { IconBadge } from "@/components/ui/IconBadge";

export default function CategoriesPage() {
  return (
    <div className="pb-8">
      <SubPageHeader title="Categories" subtitle="How Hisab recognizes your expenses" />

      <div className="mx-5 overflow-hidden rounded-2xl border border-border bg-surface">
        {CATEGORIES.map((c, i) => (
          <div
            key={c.id}
            className={`flex items-center gap-3 px-4 py-3.5 ${i === CATEGORIES.length - 1 ? "" : "border-b border-border"}`}
          >
            <IconBadge icon={c.icon} bg={c.bg} fg={c.fg} size={38} />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-ink">{c.label}</p>
              {c.keywords.length > 0 && (
                <p className="truncate text-xs text-muted">{c.keywords.slice(0, 4).join(", ")}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mx-5 mt-3 text-xs text-muted">
        Custom categories are coming soon — for now Hisab recognizes these automatically from what you type.
      </p>
    </div>
  );
}
