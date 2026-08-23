"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, User, Tag } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { useHisab } from "@/lib/store";
import { getCategory, getCategoryIcon, getCategoryColors, getCategoryImage } from "@/lib/categories";
import { formatRupees } from "@/lib/format";
import { IconBadge, InitialsBadge } from "@/components/ui/IconBadge";
import { findMerchant } from "@/lib/merchants";
import type { Direction, PaymentMethod, Transaction } from "@/lib/types";

const SOURCE_LABELS: Record<string, string> = {
  local_text: "Typed",
  voice: "Voice",
  manual: "Typed",
  settlement: "Settle up",
  ai_text: "AI parsed",
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
  const { transactions, entities, categories, updateTransaction, deleteTransaction, getOrCreateEntity } = useHisab();
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");

  const tx = useMemo(() => transactions.find((t) => t.id === txId) ?? null, [transactions, txId]);
  const lastTxRef = useRef<Transaction | null>(null);
  if (tx) {
    lastTxRef.current = tx;
  }
  const displayTx = tx ?? lastTxRef.current;

  const rawEntity = displayTx?.entityId ? entities.find((e) => e.id === displayTx.entityId) : undefined;
  const merchant = rawEntity ? findMerchant(rawEntity.name) : displayTx ? findMerchant(displayTx.description) : undefined;
  const entity = rawEntity
    ? {
        ...rawEntity,
        relationship: rawEntity.relationship || merchant?.relationship,
        avatar: rawEntity.avatar || merchant?.logo,
      }
    : undefined;

  const resolvedCategoryId = displayTx?.categoryId || merchant?.defaultCategoryId;

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [txType, setTxType] = useState<"person" | "category">("person");
  const [entityName, setEntityName] = useState("");
  const [itemName, setItemName] = useState("");
  const [direction, setDirection] = useState<Direction>("outgoing");

  if (!displayTx) return null;

  const label = entity ? entity.name : displayTx.name || getCategory(categories, resolvedCategoryId).label;

  function handleClose() {
    onClose();
    setTimeout(() => {
      setMode("view");
    }, 300);
  }

  function startEdit() {
    if (!displayTx) return;
    setAmount(String(displayTx.amount));
    setCategoryId(displayTx.categoryId ?? categories[0]?.id ?? "other");
    setPaymentMethod(displayTx.paymentMethod);
    if (displayTx.entityId) {
      const ent = entities.find((e) => e.id === displayTx.entityId);
      setTxType("person");
      setEntityName(ent?.name ?? displayTx.description ?? "");
      setItemName("");
      setDirection(displayTx.direction ?? "outgoing");
    } else {
      setTxType("category");
      setEntityName("");
      setItemName(displayTx.name ?? "");
      setDirection("outgoing");
    }
    setMode("edit");
  }

  function saveEdit() {
    if (!displayTx) return;
    const parsed = parseFloat(amount);
    const validAmount = Number.isNaN(parsed) || parsed < 0 ? displayTx.amount : parsed;

    if (txType === "person") {
      const cleanName = entityName.trim();
      if (cleanName) {
        const ent = getOrCreateEntity(cleanName);
        updateTransaction(displayTx.id, {
          amount: validAmount,
          entityId: ent.id,
          direction,
          description: ent.name,
          categoryId: undefined,
          paymentMethod,
        });
      } else {
        updateTransaction(displayTx.id, {
          amount: validAmount,
          direction,
          paymentMethod,
        });
      }
    } else {
      const catId = categoryId || "other";
      updateTransaction(displayTx.id, {
        amount: validAmount,
        entityId: undefined,
        direction: undefined,
        categoryId: catId,
        description: getCategory(categories, catId).label,
        name: itemName.trim() || undefined,
        paymentMethod,
      });
    }
    setMode("view");
  }

  function confirmDelete() {
    if (!displayTx) return;
    deleteTransaction(displayTx.id);
    handleClose();
  }

  return (
    <Sheet open={Boolean(txId && tx)} onClose={handleClose}>
      {mode === "delete" ? (
        <div className="flex flex-col gap-4 pt-2">
          <div>
            <p className="text-base font-semibold text-ink">Delete this expense?</p>
            <p className="mt-1 text-sm text-muted">
              {formatRupees(displayTx.amount)} · {label}
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
          <p className="text-base font-semibold text-ink">Edit transaction</p>

          {/* Type Switcher: Person vs Category */}
          <div className="flex rounded-xl bg-canvas p-1 border border-border">
            <button
              type="button"
              onClick={() => {
                setTxType("person");
                setEntityName((prev) => prev || itemName.trim() || displayTx.description || "");
              }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                txType === "person"
                  ? "bg-surface text-ink shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <User size={14} />
              Person / Account
            </button>
            <button
              type="button"
              onClick={() => {
                setTxType("category");
                setItemName((prev) => prev || entityName.trim() || displayTx.description || "");
              }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                txType === "category"
                  ? "bg-surface text-ink shadow-xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Tag size={14} />
              General Expense
            </button>
          </div>

          {/* Entity (Person) and Direction if txType === "person" */}
          {txType === "person" ? (
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">Person / Entity</span>
                <input
                  type="text"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  list="edit-entity-options"
                  placeholder="e.g. Ramesh, Ayush, Vendor..."
                  className="rounded-xl border border-border px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
                />
                <datalist id="edit-entity-options">
                  {entities.map((e) => (
                    <option key={e.id} value={e.name} />
                  ))}
                </datalist>
              </label>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">Direction (Len-Den)</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDirection("outgoing")}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-sm font-semibold transition-all ${
                      direction === "outgoing"
                        ? "border-rose bg-rose-soft/50 text-rose shadow-xs ring-2 ring-rose/20"
                        : "border-border bg-surface text-muted hover:bg-canvas"
                    }`}
                  >
                    <ArrowUpRight size={17} strokeWidth={2.5} />
                    Diya (You gave)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection("incoming")}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-sm font-semibold transition-all ${
                      direction === "incoming"
                        ? "border-mint bg-mint-soft/50 text-mint shadow-xs ring-2 ring-mint/20"
                        : "border-border bg-surface text-muted hover:bg-canvas"
                    }`}
                  >
                    <ArrowDownLeft size={17} strokeWidth={2.5} />
                    Liya (You got)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
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
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">Item name (optional)</span>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Chicken Tikka Masala"
                  className="rounded-xl border border-border px-4 py-3 text-sm font-medium text-ink outline-none focus:border-primary"
                />
              </label>
            </div>
          )}

          {/* Amount */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Amount</span>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-base font-semibold text-muted">₹</span>
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-border pl-8 pr-4 py-3 text-lg font-semibold text-ink outline-none focus:border-primary"
              />
            </div>
          </label>

          {/* Payment Method */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Payment method</span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: "cash", label: "Cash" },
                { value: "upi", label: "UPI" },
                { value: "bank", label: "Bank" },
                { value: "other", label: "Others" },
              ].map((p) => {
                const isSelected =
                  paymentMethod === p.value ||
                  (p.value === "other" && !["cash", "upi", "bank"].includes(paymentMethod));
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPaymentMethod(p.value as PaymentMethod)}
                    className={`rounded-xl border py-2.5 px-2 text-center text-sm font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary-soft text-primary ring-2 ring-primary/20 shadow-xs"
                        : "border-border bg-surface text-muted hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

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
          <div className="mb-2 flex justify-center">
            {entity ? (
              <InitialsBadge name={entity.name} avatarUrl={entity.avatar} size={58} />
            ) : (
              <IconBadge
                icon={getCategoryIcon(getCategory(categories, resolvedCategoryId).icon)}
                imageSrc={getCategoryImage(resolvedCategoryId)}
                bg={getCategoryColors(getCategory(categories, resolvedCategoryId).color).bg}
                fg={getCategoryColors(getCategory(categories, resolvedCategoryId).color).fg}
                size={58}
              />
            )}
          </div>
          <p className="text-center text-3xl font-semibold text-ink">{formatRupees(displayTx.amount)}</p>
          <p className="text-center text-sm text-muted">{label}</p>

          <div className="my-5 h-px bg-border" />

          <DetailRow label="Date" value={new Date(displayTx.createdAt).toLocaleString("en-IN", {
            day: "2-digit", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true,
          })} />
          {!entity && displayTx.name && <DetailRow label="Item" value={displayTx.name} />}
          {resolvedCategoryId && resolvedCategoryId !== "other" && (
            <DetailRow label="Category" value={getCategory(categories, resolvedCategoryId).label} />
          )}
          {entity && <DetailRow label="Account" value={`${entity.name}${entity.relationship ? ` · ${entity.relationship}` : ""}`} />}
          {entity && <DetailRow label="Direction" value={displayTx.direction === "incoming" ? "You got" : "You gave"} />}
          <DetailRow label="Payment" value={PAYMENT_OPTIONS.find((p) => p.value === displayTx.paymentMethod)?.label ?? displayTx.paymentMethod} />
          <DetailRow label="Added via" value={SOURCE_LABELS[displayTx.source] ?? "Typed"} />

          {displayTx.rawInput && (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Original entry</p>
              <p className="mt-1 rounded-xl bg-canvas px-4 py-3 text-sm italic text-ink">&ldquo;{displayTx.rawInput}&rdquo;</p>
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
