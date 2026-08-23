"use client";

import { ArrowDownLeft, ArrowUpRight, Trash2 } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { formatRupees } from "@/lib/format";
import { triggerHaptic } from "@/lib/haptics";
import type { Direction, EntityType } from "@/lib/types";

export interface MultiEntryRow {
  id: string;
  amount: number | null;
  /** Person/vendor name for an entity row, or the item name for a category row. */
  name: string;
  categoryId?: string;
  entityName?: string;
  entityType?: EntityType;
  entityAvatar?: string;
  direction: Direction;
}

export function MultiEntryConfirmSheet({
  open,
  rows,
  onChange,
  onClose,
  onCommit,
}: {
  open: boolean;
  rows: MultiEntryRow[];
  onChange: (rows: MultiEntryRow[]) => void;
  onClose: () => void;
  onCommit: () => void;
}) {
  const total = rows.reduce((sum, r) => sum + (r.amount ?? 0), 0);
  const validCount = rows.filter((r) => r.amount !== null && r.amount > 0).length;

  function updateRow(id: string, patch: Partial<MultiEntryRow>) {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: string) {
    triggerHaptic("light");
    onChange(rows.filter((r) => r.id !== id));
  }

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex flex-col gap-3 pt-2">
        <div>
          <p className="text-base font-semibold text-ink">
            Confirm {rows.length} {rows.length === 1 ? "entry" : "entries"}
          </p>
          <p className="text-xs text-muted">Looks like more than one expense — check each one before adding.</p>
        </div>

        <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-0.5">
          {rows.map((row) => {
            const isIncoming = row.direction === "incoming";
            return (
              <div key={row.id} className="flex items-center gap-2 rounded-xl border border-border bg-canvas p-2.5">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic("light");
                    updateRow(row.id, { direction: isIncoming ? "outgoing" : "incoming" });
                  }}
                  title={`Click to switch to ${isIncoming ? "Diya (You gave)" : "Liya (You got)"}`}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isIncoming
                      ? "bg-mint-soft border-mint/40 text-mint"
                      : "bg-rose-soft border-rose/40 text-rose"
                  }`}
                >
                  {isIncoming ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                </button>

                <input
                  type="text"
                  value={row.name}
                  onChange={(e) => updateRow(row.id, { name: e.target.value })}
                  placeholder="Person or item"
                  className="min-w-0 flex-1 rounded-lg border border-border/80 bg-surface px-2.5 py-1.5 text-sm font-medium text-ink outline-none focus:border-primary"
                />

                <div className="flex shrink-0 items-center rounded-lg border border-border/80 bg-surface px-2 py-1.5">
                  <span className="mr-0.5 text-xs font-semibold text-muted">₹</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={row.amount ?? ""}
                    onChange={(e) =>
                      updateRow(row.id, { amount: e.target.value === "" ? null : parseFloat(e.target.value) })
                    }
                    placeholder="0"
                    className="w-14 bg-transparent text-sm font-semibold text-ink outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label="Remove entry"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-subtle hover:bg-rose-soft/40 hover:text-rose"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
          {rows.length === 0 && (
            <p className="rounded-xl border border-dashed border-border py-6 text-center text-sm text-muted">
              No entries left — cancel and try again.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted">Total</span>
          <span className="font-semibold text-ink">{formatRupees(total)}</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-ink"
          >
            Cancel
          </button>
          <button
            onClick={onCommit}
            disabled={validCount === 0}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
          >
            Add {validCount} {validCount === 1 ? "entry" : "entries"}
          </button>
        </div>
      </div>
    </Sheet>
  );
}
