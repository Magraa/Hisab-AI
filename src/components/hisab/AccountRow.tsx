"use client";

import Link from "next/link";
import type { Entity } from "@/lib/types";
import type { EntityBalance } from "@/lib/selectors";
import { formatRupees } from "@/lib/format";
import { InitialsBadge } from "@/components/ui/IconBadge";

export function AccountRow({ entity, balance }: { entity: Entity; balance: EntityBalance }) {
  const polarityColor =
    balance.label === "You owe" ? "text-ink" : balance.label === "They owe you" ? "text-mint" : "text-subtle";

  return (
    <Link
      href={`/accounts/${entity.id}`}
      className="flex items-center gap-3 border-b border-border px-5 py-4 last:border-b-0"
    >
      <InitialsBadge name={entity.name} size={46} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-ink">{entity.name}</p>
        {entity.relationship && <p className="text-xs text-muted">{entity.relationship}</p>}
      </div>
      <div className="text-right">
        <p className="text-[15px] font-semibold text-ink">{formatRupees(balance.displayAmount)}</p>
        <p className={`text-xs font-medium ${polarityColor}`}>{balance.label}</p>
      </div>
    </Link>
  );
}
