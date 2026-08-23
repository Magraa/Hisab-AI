"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MoreHorizontal, Download, MessageCircle, ArrowDownLeft, ArrowUpRight, X, Receipt, Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHisab } from "@/lib/store";
import { computeBalance, entityTransactions } from "@/lib/selectors";
import { getCategory } from "@/lib/categories";
import { formatRupees, formatDayLabel } from "@/lib/format";
import { HisabInput } from "@/components/hisab/HisabInput";
import { TransactionDetailSheet } from "@/components/hisab/TransactionDetailSheet";
import { Sheet } from "@/components/ui/Sheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { InitialsBadge } from "@/components/ui/IconBadge";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { triggerHaptic } from "@/lib/haptics";
import type { Direction, Entity } from "@/lib/types";
import { buildStatementPdf, statementFilename } from "@/lib/statementPdf";
import { sendStatementToWhatsApp } from "@/lib/whatsapp";
import { findMerchant } from "@/lib/merchants";

export function AccountDetailScreen({ entityId }: { entityId: string }) {
  const { entities, transactions, categories, business, addSettlement, updateEntity } = useHisab();
  const isGeneralExpenses = entityId === "general-expenses" || entityId === "expenses";

  const rawEntity = isGeneralExpenses
    ? {
        id: "general-expenses",
        name: "General Expenses",
        aliases: [],
        type: "group" as const,
        relationship: "Daily expenses & bills",
        createdAt: new Date().toISOString(),
      }
    : entities.find((e) => e.id === entityId);

  const merchant = !isGeneralExpenses && rawEntity ? findMerchant(rawEntity.name) : undefined;
  const entity = rawEntity
    ? {
        ...rawEntity,
        relationship: rawEntity.relationship || merchant?.relationship,
        avatar: rawEntity.avatar || merchant?.logo,
      }
    : undefined;

  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showSettle, setShowSettle] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [waStatus, setWaStatus] = useState<string | null>(null);

  const items = useMemo(() => {
    if (isGeneralExpenses) {
      return transactions
        .filter((t) => !t.entityId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return entity ? entityTransactions(transactions, entity.id) : [];
  }, [transactions, entity, isGeneralExpenses]);

  const totalSpent = useMemo(
    () => items.reduce((sum, t) => sum + (t.amount || 0), 0),
    [items]
  );

  const balance = useMemo(() => {
    if (isGeneralExpenses) {
      return {
        label: `${items.length} ${items.length === 1 ? "expense" : "expenses"} recorded`,
        displayAmount: totalSpent,
        net: -totalSpent,
        totalGiven: totalSpent,
        totalGot: 0,
      };
    }
    return entity ? computeBalance(transactions, entity.id) : null;
  }, [transactions, entity, isGeneralExpenses, items.length, totalSpent]);

  if (!entity || !balance) {
    return (
      <div className="px-5 pt-6">
        <EmptyState title="Account not found" subtitle="This account may have been removed." />
      </div>
    );
  }

  function handleExportCsv() {
    const rows = isGeneralExpenses
      ? [
          ["Date", "Category", "Description", "Amount", "Payment Method"],
          ...items.map((t) => [
            new Date(t.createdAt).toLocaleString("en-IN"),
            getCategory(categories, t.categoryId).label,
            t.name || t.description,
            String(t.amount),
            t.paymentMethod,
          ]),
        ]
      : [
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
    a.download = isGeneralExpenses
      ? "General_Expenses_statement.csv"
      : `${entity!.name.replace(/\s+/g, "_")}_statement.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function buildPdfBlob(): Blob {
    const entBalance = computeBalance(transactions, entity!.id);
    return buildStatementPdf(entity!, items, entBalance, business);
  }

  function handleDownloadPdf() {
    const blob = buildPdfBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = statementFilename(entity!);
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleWhatsApp() {
    if (!entity!.phone) return;
    setWaStatus(null);
    const blob = buildPdfBlob();
    const filename = statementFilename(entity!);
    const file = new File([blob], filename, { type: "application/pdf" });
    const caption = `Hisab statement for ${entity!.name} — ${balance!.label} ${formatRupees(balance!.displayAmount)}.`;

    const result = await sendStatementToWhatsApp({ phone: entity!.phone, file, caption });
    if (result === "shared") {
      setWaStatus("Sent to the WhatsApp share sheet.");
    } else if (result === "opened-chat") {
      handleDownloadPdf();
      setWaStatus("Opened WhatsApp chat — attach the PDF that just downloaded.");
    } else {
      setWaStatus("That phone number doesn't look valid for WhatsApp.");
    }
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-between px-5 pt-6">
        <Link
          href="/accounts"
          aria-label="Back"
          onClick={() => triggerHaptic("light")}
          className="tap-active flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink transition-colors active:bg-primary-soft/40"
        >
          <ArrowLeft size={18} />
        </Link>
        {!isGeneralExpenses && (
          <button
            onClick={() => {
              triggerHaptic("light");
              setShowEdit(true);
            }}
            aria-label="Edit account"
            className="tap-active flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors active:bg-primary-soft/40"
          >
            <MoreHorizontal size={18} />
          </button>
        )}
      </div>

      <div className="mt-2 flex flex-col items-center px-5 text-center">
        {isGeneralExpenses ? (
          <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-soft text-amber shadow-2xs">
            <Receipt size={28} strokeWidth={2.2} />
          </div>
        ) : (
          <div className="mb-3">
            <InitialsBadge name={entity.name} avatarUrl={entity.avatar} size={72} />
          </div>
        )}
        <h1 className="text-2xl font-semibold text-ink">{entity.name}</h1>
        {entity.relationship && <p className="text-sm text-muted">{entity.relationship}</p>}

        <p className="mt-5 text-sm text-muted">{isGeneralExpenses ? "Total Spent" : "Balance"}</p>
        <p className="text-4xl font-semibold text-ink">
          <AnimatedNumber value={balance.displayAmount} />
        </p>
        <p className={`text-sm font-medium ${balance.label === "They owe you" ? "text-mint" : "text-muted"}`}>
          {balance.label}
        </p>
      </div>

      <div className="mx-5 mt-5 flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            triggerHaptic("light");
            setShowAdd((s) => !s);
          }}
          className={`flex-1 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-xs ${
            isGeneralExpenses ? "w-full" : ""
          }`}
        >
          + Add expense
        </motion.button>
        {!isGeneralExpenses && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              triggerHaptic("light");
              setShowSettle(true);
            }}
            className="flex-1 rounded-xl border border-border bg-surface py-3 text-sm font-semibold text-ink shadow-2xs"
          >
            Settle up
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-5 mt-3 overflow-hidden"
          >
            <HisabInput
              pinnedEntityName={isGeneralExpenses ? undefined : entity.name}
              placeholder={
                isGeneralExpenses
                  ? "What did you spend? (e.g. Chai 40, Petrol 500)"
                  : `What did you spend on ${entity.name}?`
              }
              onAdded={() => setShowAdd(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-5 my-5 h-px bg-border" />

      <div className="px-5 pb-4">
        {items.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            subtitle={
              isGeneralExpenses
                ? "Record daily expenses like chai, fuel, groceries, or supplies."
                : `Record your first entry with ${entity.name}.`
            }
          />
        ) : (
          <div className="flex flex-col">
            {items.map((tx) => {
              const isIncoming = tx.direction === "incoming";
              const category = getCategory(categories, tx.categoryId);
              return (
                <button
                  key={tx.id}
                  onClick={() => setSelectedTxId(tx.id)}
                  className="flex items-center gap-3 border-b border-border py-3 text-left last:border-b-0 w-full transition-colors active:bg-primary-soft/20"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isGeneralExpenses
                        ? "bg-amber-soft text-amber"
                        : isIncoming
                        ? "bg-mint-soft text-mint"
                        : "bg-rose-soft text-rose"
                    }`}
                    aria-label={isGeneralExpenses ? "Expense" : isIncoming ? "Money in" : "Money out"}
                  >
                    {isGeneralExpenses ? (
                      <Tag size={16} strokeWidth={2.2} />
                    ) : isIncoming ? (
                      <ArrowDownLeft size={16} strokeWidth={2.5} />
                    ) : (
                      <ArrowUpRight size={16} strokeWidth={2.5} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted">
                      {formatDayLabel(tx.createdAt)} · {tx.paymentMethod.toUpperCase()}
                    </p>
                    <p className="text-[15px] font-medium text-ink truncate">
                      {isGeneralExpenses
                        ? tx.name || tx.description || category.label
                        : isIncoming
                        ? `You got from ${entity.name}`
                        : `You gave to ${entity.name}`}
                    </p>
                  </div>
                  <span
                    className={`text-[15px] font-semibold ${
                      isGeneralExpenses ? "text-ink" : isIncoming ? "text-mint" : "text-ink"
                    }`}
                  >
                    {isGeneralExpenses ? "-" : isIncoming ? "+" : "-"}
                    {formatRupees(tx.amount)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {items.length > 0 && !isGeneralExpenses && (
        <div className="mx-5 mb-5 rounded-2xl border border-border bg-surface px-5 py-4">
          <TotalRow label="You gave" value={balance.totalGiven} />
          <TotalRow label="You got" value={balance.totalGot} />
          <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
            <span className="text-sm font-semibold text-ink">Net</span>
            <span className="text-sm font-semibold text-ink">
              {formatRupees(balance.net < 0 ? -balance.net : balance.net)}
            </span>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="mx-5 mb-8 flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={handleExportCsv}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-ink"
            >
              <Download size={16} /> Export CSV
            </button>
            {!isGeneralExpenses && (
              <button
                onClick={handleDownloadPdf}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-ink"
              >
                <Download size={16} /> Download PDF
              </button>
            )}
          </div>

          {!isGeneralExpenses && entity.phone && (
            <button
              onClick={handleWhatsApp}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-mint-soft py-3 text-sm font-semibold text-mint"
            >
              <MessageCircle size={16} /> Send statement on WhatsApp
            </button>
          )}

          {waStatus && (
            <div className="flex items-start justify-between gap-2 rounded-xl bg-primary-soft px-4 py-3 text-xs text-ink">
              <p>{waStatus}</p>
              <button onClick={() => setWaStatus(null)} aria-label="Dismiss" className="shrink-0 text-muted">
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      <TransactionDetailSheet txId={selectedTxId} onClose={() => setSelectedTxId(null)} />

      {!isGeneralExpenses && (
        <>
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
            aliases={entity.aliases}
            onSave={(patch) => {
              updateEntity(entity.id, patch);
              setShowEdit(false);
            }}
          />
        </>
      )}
    </PageTransition>
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
  aliases,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  relationship: string;
  phone: string;
  aliases: string[];
  onSave: (patch: Partial<Entity>) => void;
}) {
  const [n, setN] = useState(name);
  const [r, setR] = useState(relationship);
  const [p, setP] = useState(phone);

  const merchant = useMemo(() => findMerchant(name), [name]);
  const builtInAliases = useMemo(() => merchant?.aliases ?? [], [merchant]);
  const builtInSet = useMemo(() => new Set(builtInAliases.map((a) => a.toLowerCase())), [builtInAliases]);

  const [customAliases, setCustomAliases] = useState<string[]>(() => {
    return (aliases || []).filter((a) => !builtInSet.has(a.toLowerCase()));
  });
  const [aliasInput, setAliasInput] = useState("");

  useEffect(() => {
    setN(name);
    setR(relationship);
    setP(phone);
    setCustomAliases((aliases || []).filter((a) => !builtInSet.has(a.toLowerCase())));
  }, [name, relationship, phone, aliases, builtInSet]);

  function addAlias() {
    const value = aliasInput.trim();
    if (!value) return;
    const lower = value.toLowerCase();
    const inBuiltIn = builtInSet.has(lower);
    const inCustom = customAliases.some((a) => a.toLowerCase() === lower);
    const isSameAsName = lower === n.trim().toLowerCase();

    if (!inBuiltIn && !inCustom && !isSameAsName) {
      setCustomAliases((list) => [...list, value]);
    }
    setAliasInput("");
  }

  function removeCustomAlias(value: string) {
    setCustomAliases((list) => list.filter((a) => a !== value));
  }

  function handleSave() {
    onSave({
      name: n.trim() || name,
      relationship: r.trim(),
      phone: p.trim(),
      aliases: [...builtInAliases, ...customAliases],
    });
  }

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex flex-col gap-4 pt-2">
        <p className="text-base font-semibold text-ink">Edit account</p>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Official name</span>
          <input
            value={n}
            onChange={(e) => setN(e.target.value)}
            className="rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
          />
        </label>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Also known as</span>
            {builtInAliases.length > 0 && (
              <span className="text-[11px] font-medium text-muted bg-canvas border border-border/70 rounded-full px-2 py-0.5">
                {builtInAliases.length} built-in
              </span>
            )}
          </div>
          <p className="text-xs text-muted">
            Hisab recognizes these keywords and speech nicknames automatically when adding expenses.
          </p>

          {(builtInAliases.length > 0 || customAliases.length > 0) && (
            <div className="flex flex-wrap gap-2 pt-1">
              {/* Built-in system aliases (hardcoded, protected) */}
              {builtInAliases.map((alias) => (
                <span
                  key={`builtin-${alias}`}
                  className="flex items-center gap-1.5 rounded-full border border-border/80 bg-surface px-3 py-1 text-xs font-medium text-muted shadow-2xs"
                  title="Built-in keyword"
                >
                  <span className="text-[10px] opacity-60">🔒</span>
                  {alias}
                </span>
              ))}

              {/* User-defined custom aliases (can be removed) */}
              {customAliases.map((alias) => (
                <span
                  key={`custom-${alias}`}
                  className="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary shadow-2xs"
                >
                  {alias}
                  <button
                    type="button"
                    onClick={() => removeCustomAlias(alias)}
                    aria-label={`Remove ${alias}`}
                    className="hover:opacity-75 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <input
              value={aliasInput}
              onChange={(e) => setAliasInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAlias();
                }
              }}
              placeholder="Add custom alias or nickname..."
              className="min-w-0 flex-1 rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={addAlias}
              className="rounded-xl border border-border px-4 text-sm font-medium text-ink hover:bg-canvas transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Relationship / Service</span>
          <input
            value={r}
            onChange={(e) => setR(e.target.value)}
            placeholder="Food Delivery, Cab Service, Supplier..."
            className="rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Phone</span>
          <input
            value={p}
            onChange={(e) => setP(e.target.value)}
            placeholder="e.g. +91 98765 43210"
            className="rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
          />
          <span className="text-xs text-muted">Include the country code so &ldquo;Send on WhatsApp&rdquo; can find the right chat.</span>
        </label>

        <button
          onClick={handleSave}
          className="rounded-xl bg-primary py-3 text-sm font-semibold text-white"
        >
          Save
        </button>
      </div>
    </Sheet>
  );
}
