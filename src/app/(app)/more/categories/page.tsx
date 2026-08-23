"use client";

import { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
import { useHisab } from "@/lib/store";
import type { Category, CategoryColor } from "@/lib/types";
import {
  CATEGORY_COLORS,
  CATEGORY_COLOR_KEYS,
  CATEGORY_ICON_KEYS,
  getCategoryColors,
  getCategoryIcon,
} from "@/lib/categories";
import { SubPageHeader } from "@/components/layout/SubPageHeader";
import { IconBadge } from "@/components/ui/IconBadge";
import { Sheet } from "@/components/ui/Sheet";

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useHisab();
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="pb-8">
      <SubPageHeader title="Categories" subtitle="How Hisab recognizes your expenses" />

      <div className="mx-5 overflow-hidden rounded-2xl border border-border bg-surface">
        {categories.map((c, i) => {
          const colors = getCategoryColors(c.color);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setEditing(c)}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left ${
                i === categories.length - 1 ? "" : "border-b border-border"
              }`}
            >
              <IconBadge icon={getCategoryIcon(c.icon)} bg={colors.bg} fg={colors.fg} size={38} />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium text-ink">{c.label}</p>
                {c.keywords.length > 0 && (
                  <p className="truncate text-xs text-muted">{c.keywords.slice(0, 4).join(", ")}</p>
                )}
              </div>
              <ChevronRight size={16} className="shrink-0 text-subtle" />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setCreating(true)}
        className="mx-5 mt-3 flex w-[calc(100%-2.5rem)] items-center justify-center gap-1.5 rounded-2xl border border-dashed border-border py-3 text-sm font-medium text-primary"
      >
        <Plus size={16} />
        Add category
      </button>

      <p className="mx-5 mt-3 text-xs text-muted">
        Hisab matches these keywords automatically against what you type or say — e.g. typing &ldquo;diesel&rdquo;
        picks Fuel.
      </p>

      <CategoryEditorSheet
        open={Boolean(editing)}
        category={editing}
        onClose={() => setEditing(null)}
        onSave={(patch) => {
          if (editing) updateCategory(editing.id, patch);
          setEditing(null);
        }}
        onDelete={
          editing && editing.id !== "other"
            ? () => {
                deleteCategory(editing.id);
                setEditing(null);
              }
            : undefined
        }
      />

      <CategoryEditorSheet
        open={creating}
        category={null}
        onClose={() => setCreating(false)}
        onSave={(patch) => {
          addCategory({
            label: patch.label ?? "New category",
            icon: patch.icon ?? "tag",
            color: patch.color ?? "subtle",
            keywords: patch.keywords ?? [],
          });
          setCreating(false);
        }}
      />
    </div>
  );
}

function CategoryEditorSheet({
  open,
  category,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (patch: Partial<Category>) => void;
  onDelete?: () => void;
}) {
  const isNew = !category;
  const [label, setLabel] = useState(category?.label ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "tag");
  const [color, setColor] = useState<CategoryColor>(category?.color ?? "subtle");
  const [keywordsText, setKeywordsText] = useState(category?.keywords.join(", ") ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Re-seed local form state whenever a different category (or "add new")
  // opens, since this sheet instance is reused across rows.
  const [openedFor, setOpenedFor] = useState(category?.id ?? "__new__");
  const currentKey = category?.id ?? "__new__";
  if (open && currentKey !== openedFor) {
    setOpenedFor(currentKey);
    setLabel(category?.label ?? "");
    setIcon(category?.icon ?? "tag");
    setColor(category?.color ?? "subtle");
    setKeywordsText(category?.keywords.join(", ") ?? "");
    setConfirmDelete(false);
  }

  function handleClose() {
    setConfirmDelete(false);
    onClose();
  }

  function handleSave() {
    const trimmed = label.trim();
    if (!trimmed) return;
    const keywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    onSave({ label: trimmed, icon, color, keywords });
  }

  return (
    <Sheet open={open} onClose={handleClose}>
      {confirmDelete ? (
        <div className="flex flex-col gap-4 pt-2">
          <div>
            <p className="text-base font-semibold text-ink">Delete &ldquo;{category?.label}&rdquo;?</p>
            <p className="mt-1 text-sm text-muted">
              Existing expenses in this category will move to &ldquo;Other&rdquo;.
            </p>
          </div>
          <button
            onClick={() => setConfirmDelete(false)}
            className="rounded-xl border border-border py-3 text-sm font-medium text-ink"
          >
            Cancel
          </button>
          <button onClick={onDelete} className="rounded-xl bg-rose py-3 text-sm font-semibold text-white">
            Delete category
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pt-2">
          <div className="flex items-center gap-3">
            <IconBadge icon={getCategoryIcon(icon)} bg={CATEGORY_COLORS[color].bg} fg={CATEGORY_COLORS[color].fg} size={48} />
            <p className="text-base font-semibold text-ink">{isNew ? "Add category" : "Edit category"}</p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Name</span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Packaging"
              className="rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Color</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLOR_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setColor(key)}
                  aria-label={key}
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: CATEGORY_COLORS[key].bg,
                    outline: color === key ? `2px solid ${CATEGORY_COLORS[key].fg}` : undefined,
                    outlineOffset: 2,
                  }}
                >
                  <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[key].fg }} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Icon</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_ICON_KEYS.map((key) => {
                const Icon = getCategoryIcon(key);
                const active = icon === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIcon(key)}
                    aria-label={key}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                      active ? "border-primary bg-primary-soft text-primary" : "border-border bg-canvas text-muted"
                    }`}
                  >
                    <Icon size={16} strokeWidth={2.2} />
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Keywords</span>
            <input
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="e.g. box, packing, tape"
              className="rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
            <span className="text-xs text-muted">Comma-separated. Typing one of these auto-picks this category.</span>
          </label>

          <div className="mt-2 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-ink"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!label.trim()}
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Save
            </button>
          </div>

          {onDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="mt-1 rounded-xl border border-rose/30 py-3 text-sm font-medium text-rose"
            >
              Delete category
            </button>
          )}
        </div>
      )}
    </Sheet>
  );
}
