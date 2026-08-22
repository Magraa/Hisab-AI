"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useHisab } from "@/lib/store";
import { computeBalance } from "@/lib/selectors";
import { PageHeader } from "@/components/layout/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { AccountRow } from "@/components/hisab/AccountRow";
import { EmptyState } from "@/components/ui/EmptyState";

type FilterKey = "all" | "you_owe" | "they_owe" | "vendor" | "customer" | "employee";

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "All" },
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

  const rows = useMemo(() => {
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

  return (
    <div>
      <PageHeader title="Accounts" subtitle="Every person and vendor in your Hisab" />

      <div className="px-5">
        <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5">
          <Search size={16} className="text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, vendors..."
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-subtle outline-none"
          />
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1">
        {FILTERS.map((f) => (
          <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </Chip>
        ))}
      </div>

      <div className="mt-4 px-5 pb-8">
        {rows.length === 0 ? (
          <EmptyState
            title="No one in your Hisab yet."
            subtitle={
              query
                ? "No accounts match your search."
                : 'The moment you mention a name — "Ramesh 500" — their account starts here automatically.'
            }
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {rows.map(({ entity, balance }) => (
              <AccountRow key={entity.id} entity={entity} balance={balance} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
