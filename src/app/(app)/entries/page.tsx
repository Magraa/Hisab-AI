"use client";

import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHisab } from "@/lib/store";
import { groupByDay, sumAmount, entityLabel, withinRange } from "@/lib/selectors";
import { formatRupees, formatDayHeading } from "@/lib/format";
import { getCategory } from "@/lib/categories";
import { PageHeader } from "@/components/layout/PageHeader";
import { SelectChip } from "@/components/ui/Chip";
import { TransactionRow } from "@/components/hisab/TransactionRow";
import { TransactionDetailSheet } from "@/components/hisab/TransactionDetailSheet";
import { HisabInput } from "@/components/hisab/HisabInput";
import { Sheet } from "@/components/ui/Sheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { triggerHaptic } from "@/lib/haptics";

const DATE_OPTIONS = [
  { value: "all", label: "All dates" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

const PAYMENT_OPTIONS = [
  { value: "all", label: "Payment" },
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank", label: "Bank" },
  { value: "card", label: "Card" },
  { value: "credit", label: "Credit" },
];

const AMOUNT_OPTIONS = [
  { value: "any", label: "Amount" },
  { value: "above_1000", label: "Above ₹1,000" },
  { value: "above_5000", label: "Above ₹5,000" },
  { value: "highest", label: "Highest first" },
];

export default function EntriesPage() {
  const { transactions, entities, categories } = useHisab();
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("any");
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = useMemo(() => {
    const now = new Date();
    let result = transactions.filter((tx) => {
      const label = tx.entityId ? entityLabel(entities, tx.entityId) ?? "" : getCategory(categories, tx.categoryId).label;
      if (query && !label.toLowerCase().includes(query.trim().toLowerCase())) return false;
      if (categoryFilter !== "all" && tx.categoryId !== categoryFilter) return false;
      if (paymentFilter !== "all" && tx.paymentMethod !== paymentFilter) return false;
      if (amountFilter === "above_1000" && tx.amount < 1000) return false;
      if (amountFilter === "above_5000" && tx.amount < 5000) return false;
      return true;
    });

    if (dateFilter === "today") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      result = result.filter((tx) => withinRange(tx.createdAt, start, end));
    } else if (dateFilter === "yesterday") {
      const y = new Date(now);
      y.setDate(now.getDate() - 1);
      const start = new Date(y.getFullYear(), y.getMonth(), y.getDate());
      const end = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59, 999);
      result = result.filter((tx) => withinRange(tx.createdAt, start, end));
    } else if (dateFilter === "week") {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      result = result.filter((tx) => withinRange(tx.createdAt, start, now));
    } else if (dateFilter === "month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      result = result.filter((tx) => withinRange(tx.createdAt, start, now));
    }

    if (amountFilter === "highest") {
      result = [...result].sort((a, b) => b.amount - a.amount);
    }

    return result;
  }, [transactions, entities, categories, query, dateFilter, categoryFilter, paymentFilter, amountFilter]);

  const groups = useMemo(() => groupByDay(filtered), [filtered]);
  const total = sumAmount(filtered);

  return (
    <PageTransition>
      <PageHeader title="Your Hisab" subtitle="All your expenses in one place" />

      <div className="px-5">
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 shadow-2xs">
          <Search size={16} className="text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your Hisab"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-subtle outline-none"
          />
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        <SelectChip label="Date" value={dateFilter} onChange={setDateFilter} options={DATE_OPTIONS} />
        <SelectChip
          label="Category"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[{ value: "all", label: "Category" }, ...categories.map((c) => ({ value: c.id, label: c.label }))]}
        />
        <SelectChip label="Payment" value={paymentFilter} onChange={setPaymentFilter} options={PAYMENT_OPTIONS} />
        <SelectChip label="Amount" value={amountFilter} onChange={setAmountFilter} options={AMOUNT_OPTIONS} />
      </div>

      <div className="mt-4 px-5 pb-28">
        {groups.length === 0 ? (
          <EmptyState title="Nothing here yet" subtitle="Try a different search or filter." />
        ) : (
          groups.map((group) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-5"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {formatDayHeading(group.iso)}
                </p>
                <p className="text-sm font-semibold text-mint">{formatRupees(sumAmount(group.items))}</p>
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
                {group.items.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    tx={tx}
                    entityName={entityLabel(entities, tx.entityId)}
                    onClick={() => setSelectedTxId(tx.id)}
                  />
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="pointer-events-none fixed bottom-24 left-1/2 z-20 flex w-full max-w-[440px] -translate-x-1/2 items-center justify-between px-5">
        {groups.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="pointer-events-auto rounded-full border border-border bg-surface/95 px-4 py-2 text-xs font-medium text-muted shadow-lg backdrop-blur-md"
          >
            Total: <span className="font-semibold text-ink"><AnimatedNumber value={total} /></span>
          </motion.div>
        ) : (
          <span />
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          onClick={() => {
            triggerHaptic("medium");
            setShowAdd(true);
          }}
          aria-label="Add expense"
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl shadow-primary/30"
        >
          <Plus size={24} />
        </motion.button>
      </div>

      <TransactionDetailSheet txId={selectedTxId} onClose={() => setSelectedTxId(null)} />

      <Sheet open={showAdd} onClose={() => setShowAdd(false)}>
        <p className="mb-3 text-base font-semibold text-ink">Add an expense</p>
        <HisabInput onAdded={() => setShowAdd(false)} />
      </Sheet>
    </PageTransition>
  );
}

