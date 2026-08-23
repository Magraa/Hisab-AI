"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Receipt } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHisab } from "@/lib/store";
import { computeBalance } from "@/lib/selectors";
import { formatRupees } from "@/lib/format";
import { PageHeader } from "@/components/layout/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { AccountRow } from "@/components/hisab/AccountRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { triggerHaptic } from "@/lib/haptics";

type FilterKey = "all" | "expenses" | "you_owe" | "they_owe" | "vendor" | "customer" | "employee";

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All" },
  { key: "expenses", label: "General Expenses" },
  { key: "you_owe", label: "You owe" },
  { key: "they_owe", label: "They owe you" },
  { key: "vendor", label: "Vendors" },
  { key: "customer", label: "Customers" },
  { key: "employee", label: "Employees" },
];

export default function AccountsPage() {
  const { entities, transactions } = useHisab();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const generalExpenses = useMemo(
    () => transactions.filter((t) => !t.entityId),
    [transactions]
  );
  const totalGeneralExpense = useMemo(
    () => generalExpenses.reduce((sum, t) => sum + (t.amount || 0), 0),
    [generalExpenses]
  );

  const showGeneralExpenseRow = useMemo(() => {
    if (filter !== "all" && filter !== "expenses") return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      "general expenses".includes(q) ||
      "kharcha".includes(q) ||
      "expenses".includes(q) ||
      "bills".includes(q) ||
      "daily".includes(q)
    );
  }, [filter, query]);

  const rows = useMemo(() => {
    if (filter === "expenses") return [];
    return entities
      .map((entity) => ({ entity, balance: computeBalance(transactions, entity.id) }))
      .filter(({ entity }) => entity.name.toLowerCase().includes(query.trim().toLowerCase()))
      .filter(({ entity, balance }) => {
        if (filter === "all") return true;
        if (filter === "you_owe") return balance.label === "You owe";
        if (filter === "they_owe") return balance.label === "They owe you";
        return entity.type === filter;
      })
      .sort((a, b) => b.balance.displayAmount - a.balance.displayAmount);
  }, [entities, transactions, query, filter]);

  const hasAnyAccount = rows.length > 0 || showGeneralExpenseRow;

  return (
    <PageTransition>
      <PageHeader title="Accounts" subtitle="Every person, vendor & expense account" />

      <div className="px-5">
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 shadow-2xs">
          <Search size={16} className="text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, vendors, expenses..."
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-subtle outline-none"
          />
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        {FILTERS.map((f) => (
          <Chip
            key={f.key}
            active={filter === f.key}
            onClick={() => {
              triggerHaptic("light");
              setFilter(f.key);
            }}
          >
            {f.label}
          </Chip>
        ))}
      </div>

      <div className="mt-4 px-5 pb-8">
        {!hasAnyAccount ? (
          <EmptyState
            title="No accounts found."
            subtitle={
              query
                ? "No accounts match your search."
                : 'The moment you mention a name — "Ramesh 500" — their account starts here automatically.'
            }
          />
        ) : (
          <motion.div
            layout
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs"
          >
            {showGeneralExpenseRow && (
              <Link
                href="/accounts/general-expenses"
                onClick={() => triggerHaptic("light")}
                className="tap-active flex items-center gap-3 border-b border-border px-5 py-4 last:border-b-0 transition-colors active:bg-primary-soft/40"
              >
                <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-amber-soft text-amber shadow-2xs">
                  <Receipt size={22} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-ink">General Expenses</p>
                  <span className="mt-0.5 inline-block rounded-full bg-amber-soft/70 px-2 py-0.5 text-[11px] font-medium text-amber">
                    {generalExpenses.length} {generalExpenses.length === 1 ? "expense" : "expenses"} · Daily bills & purchases
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-semibold text-ink">{formatRupees(totalGeneralExpense)}</p>
                  <p className="text-xs font-medium text-muted">Total spent</p>
                </div>
              </Link>
            )}

            <AnimatePresence initial={false}>
              {rows.map(({ entity, balance }) => (
                <motion.div
                  key={entity.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AccountRow entity={entity} balance={balance} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}


