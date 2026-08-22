"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Wallet } from "lucide-react";
import { useHisab } from "@/lib/store";
import { greeting, formatRupees } from "@/lib/format";
import { isToday, sumAmount, entityLabel } from "@/lib/selectors";
import { HisabInput } from "@/components/hisab/HisabInput";
import { TransactionRow } from "@/components/hisab/TransactionRow";
import { TransactionDetailSheet } from "@/components/hisab/TransactionDetailSheet";
import { EmptyState } from "@/components/ui/EmptyState";

const PREVIEW_COUNT = 5;

export default function HomePage() {
  const { transactions, entities, business } = useHisab();
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  const todays = useMemo(
    () =>
      transactions
        .filter((t) => isToday(t.createdAt))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [transactions]
  );

  const todayTotal = sumAmount(todays);

  return (
    <div>
      <div className="flex items-start justify-between px-5 pt-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">{greeting()}, Mayank 👋</h1>
          <p className="text-sm text-muted">Here&rsquo;s your {business.name} Hisab</p>
        </div>
        <Link
          href="/more"
          aria-label="More"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted"
        >
          <MoreHorizontal size={18} />
        </Link>
      </div>

      <div className="mx-5 mt-4 flex items-center justify-between rounded-2xl bg-mint-soft px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-mint">Today</p>
          <p className="mt-1 text-3xl font-semibold text-ink">{formatRupees(todayTotal)}</p>
          <p className="text-sm text-muted">spent so far</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
          <Wallet size={26} className="text-mint" />
        </div>
      </div>

      <div className="mx-5 mt-4">
        <HisabInput />
      </div>

      <div className="mt-6 flex items-center justify-between px-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Today&rsquo;s entries</p>
        <Link href="/entries" className="text-sm font-medium text-primary">
          View all
        </Link>
      </div>

      <div className="mt-2">
        {todays.length === 0 ? (
          <div className="px-5">
            <EmptyState
              title="Your Hisab starts here."
              subtitle="Nothing recorded today. Tell me what you spent."
            />
          </div>
        ) : (
          <div className="mx-5 overflow-hidden rounded-2xl border border-border bg-surface">
            {todays.slice(0, PREVIEW_COUNT).map((tx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                entityName={entityLabel(entities, tx.entityId)}
                onClick={() => setSelectedTxId(tx.id)}
              />
            ))}
          </div>
        )}
      </div>

      {todays.length > 0 && (
        <div className="mx-5 mt-4 mb-6 flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4">
          <div>
            <p className="text-sm text-muted">Today&rsquo;s total</p>
            <p className="text-2xl font-semibold text-ink">{formatRupees(todayTotal)}</p>
          </div>
          <span className="rounded-full bg-mint-soft px-3 py-1.5 text-sm font-medium text-mint">
            {todays.length} {todays.length === 1 ? "expense" : "expenses"}
          </span>
        </div>
      )}

      <TransactionDetailSheet txId={selectedTxId} onClose={() => setSelectedTxId(null)} />
    </div>
  );
}
