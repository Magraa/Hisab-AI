"use client";

import { useMemo, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { useHisab } from "@/lib/store";
import { getCategory } from "@/lib/categories";
import { formatRupees } from "@/lib/format";
import type { PaymentMethod } from "@/lib/types";

const SOURCE_LABELS: Record<string, string> = {
  local_text: "Typed",
  voice: "Voice",
  manual: "Typed",
  settlement: "Settle up",
};

const PAYMENT_OPTIONS: Array<{ value: PaymentMethod; label: string }> = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank", label: "Bank transfer" },
  { value: "card", label: "Card" },
  { value: "credit", label: "Credit" },
  { value: "other", label: "Other" },
];

export function TransactionDetailSheet({
  txId,
  onClose,
}: {
  txId: string | null;
  onClose: () => void;
}) {
  const { transactions, entities, categories, updateTransaction, deleteTransaction } = useHisab();
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");

  const tx = useMemo(() => transactions.find((t) => t.id === txId) ?? null, [transactions, txId]);
  const entity = tx?.entityId ? entities.find((e) => e.id === tx.entityId) : undefined;

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  if (!tx) return null;

  const label = entity ? entity.name : getCategory(categories, tx.categoryId).label;

  function startEdit() {
    if (!tx) return;
    setAmount(String(tx.amount));
    setCategoryId(tx.categoryId ?? "other");
    setPaymentMethod(tx.paymentMethod);
    setMode("edit");
  }

  function saveEdit() {
    if (!tx) return;
    const parsed = parseFloat(amount);
    updateTransaction(tx.id, {
      amount: Number.isNaN(parsed) ? tx.amount : parsed,
      categoryId: entity ? tx.categoryId : categoryId,
      paymentMethod,
    });
    setMode("view");
  }

  function confirmDelete() {
    if (!tx) return;
    deleteTransaction(tx.id);
    onClose();
    setMode("view");
  }

  return (
    <Sheet open={Boolean(txId)} onClose={() => { setMode("view"); onClose(); }}>
      {mode === "delete" ? (
        <div className="flex flex-col gap-4 pt-2">
          <div>
            <p className="text-base font-semibold text-ink">Delete this expense?</p>
            <p className="mt-1 text-sm text-muted">
              {formatRupees(tx.amount)} · {label}
            </p>
            <p className="mt-2 text-sm text-muted">This will be removed from your Hisab.</p>
          </div>
          <button
            onClick={() => setMode("view")}
            className="rounded-xl border border-border py-3 text-sm font-medium text-ink"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="rounded-xl bg-rose py-3 text-sm font-semibold text-white"
          >
            Delete expense
          </button>
        </div>
      ) : mode === "edit" ? (
        <div className="flex flex-col gap-4 pt-2">
          <p className="text-base font-semibold text-ink">Edit expense</p>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Amount</span>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl border border-border px-4 py-3 text-lg font-semibold text-ink outline-none focus:border-primary"
            />
          </label>

          {!entity && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Category</span>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Payment method</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            >
              {PAYMENT_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-2 flex gap-3">
            <button
              onClick={() => setMode("view")}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-ink"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 pt-2">
          <p className="text-center text-3xl font-semibold text-ink">{formatRupees(tx.amount)}</p>
          <p className="text-center text-sm text-muted">{label}</p>

          <div className="my-5 h-px bg-border" />

          <DetailRow label="Date" value={new Date(tx.createdAt).toLocaleString("en-IN", {
            day: "2-digit", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
          })} />
          {!entity && <DetailRow label="Category" value={getCategory(categories, tx.categoryId).label} />}
          {entity && <DetailRow label="Account" value={`${entity.name}${entity.relationship ? ` · ${entity.relationship}` : ""}`} />}
          {entity && <DetailRow label="Direction" value={tx.direction === "incoming" ? "You got" : "You gave"} />}
          <DetailRow label="Payment" value={PAYMENT_OPTIONS.find((p) => p.value === tx.paymentMethod)?.label ?? tx.paymentMethod} />
          <DetailRow label="Added via" value={SOURCE_LABELS[tx.source] ?? "Typed"} />

          {tx.rawInput && (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Original entry</p>
              <p className="mt-1 rounded-xl bg-canvas px-4 py-3 text-sm italic text-ink">&ldquo;{tx.rawInput}&rdquo;</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={startEdit}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-ink"
            >
              Edit
            </button>
            <button
              onClick={() => setMode("delete")}
              className="flex-1 rounded-xl border border-rose/30 py-3 text-sm font-medium text-rose"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Sheet>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
