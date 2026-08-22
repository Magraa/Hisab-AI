"use client";

import Link from "next/link";
import type { Entity } from "@/lib/types";
import type { EntityBalance } from "@/lib/selectors";
import { formatRupees } from "@/lib/format";
import { InitialsBadge } from "@/components/ui/IconBadge";
import { relationshipStyle } from "@/lib/relationships";

export function AccountRow({ entity, balance }: { entity: Entity; balance: EntityBalance }) {
  const polarityColor =
    balance.label === "You owe" ? "text-ink" : balance.label === "They owe you" ? "text-mint" : "text-subtle";
  const style = relationshipStyle(entity.relationship);

  return (
    <Link
      href={`/accounts/${entity.id}`}
      className="flex items-center gap-3 border-b border-border px-5 py-4 last:border-b-0"
    >
      <InitialsBadge name={entity.name} size={46} bg={style.bg} fg={style.fg} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-ink">{entity.name}</p>
        {entity.relationship && (
          <span
            className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: style.bg, color: style.fg }}
          >
            {entity.relationship}
          </span>
        )}
      </div>
      <div className="text-right">
        <p className="text-[15px] font-semibold text-ink">{formatRupees(balance.displayAmount)}</p>
        <p className={`text-xs font-medium ${polarityColor}`}>{balance.label}</p>
      </div>
    </Link>
  );
}
