"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MoreHorizontal, Download, Printer, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useHisab } from "@/lib/store";
import { computeBalance, entityTransactions } from "@/lib/selectors";
import { formatRupees, formatDayLabel } from "@/lib/format";
import { HisabInput } from "@/components/hisab/HisabInput";
import { TransactionDetailSheet } from "@/components/hisab/TransactionDetailSheet";
import { Sheet } from "@/components/ui/Sheet";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Direction } from "@/lib/types";

export function AccountDetailScreen({ entityId }: { entityId: string }) {
  const { entities, transactions, addSettlement, updateEntity } = useHisab();
  const entity = entities.find((e) => e.id === entityId);

  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showSettle, setShowSettle] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const items = useMemo(
    () => (entity ? entityTransactions(transactions, entity.id) : []),
    [transactions, entity]
  );
  const balance = useMemo(
    () => (entity ? computeBalance(transactions, entity.id) : null),
    [transactions, entity]
  );

  if (!entity || !balance) {
    return (
      <div className="px-5 pt-6">
        <EmptyState title="Account not found" subtitle="This account may have been removed." />
      </div>
    );
  }

  function handleExportCsv() {
    const rows = [
      ["Date", "Direction", "Amount", "Payment Method"],
      ...items.map((t) => [
        new Date(t.createdAt).toLocaleString("en-IN"),
        t.direction === "incoming" ? "Received" : "Paid",
        String(t.amount),
        t.paymentMethod,
      ]),
    ];
    const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${entity!.name.replace(/\s+/g, "_")}_statement.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex items-center justify-between px-5 pt-6">
        <Link href="/accounts" aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink">
          <ArrowLeft size={18} />
        </Link>
        <button
          onClick={() => setShowEdit(true)}
          aria-label="Edit account"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="mt-2 flex flex-col items-center px-5 text-center">
        <h1 className="text-2xl font-semibold text-ink">{entity.name}</h1>
        {entity.relationship && <p className="text-sm text-muted">{entity.relationship}</p>}

        <p className="mt-5 text-sm text-muted">Balance</p>
        <p className="text-4xl font-semibold text-ink">{formatRupees(balance.displayAmount)}</p>
        <p className={`text-sm font-medium ${balance.label === "They owe you" ? "text-mint" : "text-muted"}`}>
          {balance.label}
        </p>
      </div>

      <div className="mx-5 mt-5 flex gap-3">
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white"
        >
          + Add expense
        </button>
        <button
          onClick={() => setShowSettle(true)}
          className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-ink"
        >
          Settle up
        </button>
      </div>

      {showAdd && (
        <div className="mx-5 mt-3">
          <HisabInput
            pinnedEntityName={entity.name}
            placeholder={`What did you spend on ${entity.name}?`}
            onAdded={() => setShowAdd(false)}
          />
        </div>
      )}

      <div className="mx-5 my-5 h-px bg-border" />

      <div className="px-5 pb-4">
        {items.length === 0 ? (
          <EmptyState title="No transactions yet" subtitle={`Record your first entry with ${entity.name}.`} />
        ) : (
          <div className="flex flex-col">
            {items.map((tx) => {
              const isIncoming = tx.direction === "incoming";
              return (
                <button
                  key={tx.id}
                  onClick={() => setSelectedTxId(tx.id)}
                  className="flex items-center gap-3 border-b border-border py-3 text-left last:border-b-0"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isIncoming ? "bg-mint-soft" : "bg-rose-soft"
                    }`}
                    aria-label={isIncoming ? "Money in" : "Money out"}
                  >
                    {isIncoming ? (
                      <ArrowDownLeft size={15} strokeWidth={2.5} className="text-mint" />
                    ) : (
                      <ArrowUpRight size={15} strokeWidth={2.5} className="text-rose" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted">{formatDayLabel(tx.createdAt)}</p>
                    <p className="text-[15px] font-medium text-ink">
                      {isIncoming ? `You got from ${entity.name}` : `You gave to ${entity.name}`}
                    </p>
                  </div>
                  <span className={`text-[15px] font-semibold ${isIncoming ? "text-mint" : "text-ink"}`}>
                    {isIncoming ? "+" : "-"}
                    {formatRupees(tx.amount)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="mx-5 mb-5 rounded-2xl border border-border bg-surface px-5 py-4">
          <TotalRow label="You gave" value={balance.totalGiven} />
          <TotalRow label="You got" value={balance.totalGot} />
          <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
            <span className="text-sm font-semibold text-ink">Net</span>
            <span className="text-sm font-semibold text-ink">{formatRupees(balance.net < 0 ? -balance.net : balance.net)}</span>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="mx-5 mb-8 flex gap-3">
          <button
            onClick={handleExportCsv}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-ink"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-ink"
          >
            <Printer size={16} /> Print / PDF
          </button>
        </div>
      )}

      <TransactionDetailSheet txId={selectedTxId} onClose={() => setSelectedTxId(null)} />

      <SettleUpSheet
        open={showSettle}
        onClose={() => setShowSettle(false)}
        entityName={entity.name}
        balance={balance}
        onSettle={(amount, direction) => {
          addSettlement(entity.id, amount, direction);
          setShowSettle(false);
        }}
      />

      <EditEntitySheet
        open={showEdit}
        onClose={() => setShowEdit(false)}
        name={entity.name}
        relationship={entity.relationship ?? ""}
        phone={entity.phone ?? ""}
        onSave={(patch) => {
          updateEntity(entity.id, patch);
          setShowEdit(false);
        }}
      />
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">{formatRupees(value)}</span>
    </div>
  );
}

function SettleUpSheet({
  open,
  onClose,
  entityName,
  balance,
  onSettle,
}: {
  open: boolean;
  onClose: () => void;
  entityName: string;
  balance: { label: string; displayAmount: number };
  onSettle: (amount: number, direction: Direction) => void;
}) {
  const [amount, setAmount] = useState(String(balance.displayAmount || ""));
  const [direction, setDirection] = useState<Direction>(balance.label === "You owe" ? "outgoing" : "incoming");

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex flex-col gap-4 pt-2">
        <p className="text-base font-semibold text-ink">Settle up with {entityName}</p>
        <p className="text-sm text-muted">
          Current balance: {formatRupees(balance.displayAmount)} {balance.label.toLowerCase()}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setDirection("outgoing")}
            className={`flex-1 rounded-xl border py-2.5 text-sm font-medium ${
              direction === "outgoing" ? "border-primary bg-primary-soft text-primary" : "border-border text-muted"
            }`}
          >
            You gave them
          </button>
          <button
            onClick={() => setDirection("incoming")}
            className={`flex-1 rounded-xl border py-2.5 text-sm font-medium ${
              direction === "incoming" ? "border-primary bg-primary-soft text-primary" : "border-border text-muted"
            }`}
          >
            You got from them
          </button>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Amount</span>
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-xl border border-border px-4 py-3 text-lg font-semibold text-ink outline-none focus:border-primary"
          />
        </label>

        <button
          onClick={() => {
            const parsed = parseFloat(amount);
            if (!Number.isNaN(parsed) && parsed > 0) onSettle(parsed, direction);
          }}
          className="rounded-xl bg-primary py-3 text-sm font-semibold text-white"
        >
          Record payment
        </button>
      </div>
    </Sheet>
  );
}

function EditEntitySheet({
  open,
  onClose,
  name,
  relationship,
  phone,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  relationship: string;
  phone: string;
  onSave: (patch: { name: string; relationship: string; phone: string }) => void;
}) {
  const [n, setN] = useState(name);
  const [r, setR] = useState(relationship);
  const [p, setP] = useState(phone);

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex flex-col gap-4 pt-2">
        <p className="text-base font-semibold text-ink">Edit account</p>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Name</span>
          <input
            value={n}
            onChange={(e) => setN(e.target.value)}
            className="rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Relationship</span>
          <input
            value={r}
            onChange={(e) => setR(e.target.value)}
            placeholder="Supplier, Customer, Employee..."
            className="rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Phone</span>
          <input
            value={p}
            onChange={(e) => setP(e.target.value)}
            className="rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
          />
        </label>

        <button
          onClick={() => onSave({ name: n.trim() || name, relationship: r.trim(), phone: p.trim() })}
          className="rounded-xl bg-primary py-3 text-sm font-semibold text-white"
        >
          Save
        </button>
      </div>
    </Sheet>
  );
}
