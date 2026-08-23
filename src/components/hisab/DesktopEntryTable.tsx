"use client";

import { Wallet, Smartphone, Landmark, CreditCard, MoreVertical } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Entity, Transaction } from "@/lib/types";
import { useHisab } from "@/lib/store";
import { getCategory, getCategoryColors, getCategoryIcon, getCategoryImage } from "@/lib/categories";
import { entityLabel } from "@/lib/selectors";
import { formatRupees, formatTime } from "@/lib/format";
import { IconBadge, InitialsBadge } from "@/components/ui/IconBadge";
import { EmptyState } from "@/components/ui/EmptyState";

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  bank: "Bank",
  card: "Card",
  credit: "Credit",
  other: "Other",
};

const PAYMENT_ICONS: Record<string, LucideIcon> = {
  cash: Wallet,
  upi: Smartphone,
  bank: Landmark,
  card: CreditCard,
  credit: CreditCard,
  other: Wallet,
};

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export function DesktopEntryTable({
  transactions,
  entities,
  showDate = false,
  onSelect,
  emptyTitle = "Nothing here yet",
  emptySubtitle,
}: {
  transactions: Transaction[];
  entities: Entity[];
  showDate?: boolean;
  onSelect?: (id: string) => void;
  emptyTitle?: string;
  emptySubtitle?: string;
}) {
  const { categories } = useHisab();

  if (transactions.length === 0) {
    return (
      <div className="p-6">
        <EmptyState title={emptyTitle} subtitle={emptySubtitle} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="text-xs font-semibold uppercase tracking-wide text-muted">
            {showDate && <th className="px-5 pb-3 pt-4 font-semibold">Date</th>}
            <th className="px-5 pb-3 pt-4 font-semibold">Description</th>
            <th className="px-5 pb-3 pt-4 font-semibold">Category</th>
            <th className="px-5 pb-3 pt-4 font-semibold">Payment</th>
            <th className="px-5 pb-3 pt-4 font-semibold">Time</th>
            <th className="px-5 pb-3 pt-4 text-right font-semibold">Amount</th>
            <th className="w-10 px-3 pb-3 pt-4" />
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isEntity = Boolean(tx.entityId);
            const category = getCategory(categories, tx.categoryId);
            const categoryColors = getCategoryColors(category.color);
            const label = isEntity ? entityLabel(entities, tx.entityId) ?? tx.description : category.label;
            const isIncoming = isEntity && tx.direction === "incoming";
            const PaymentIcon = PAYMENT_ICONS[tx.paymentMethod] ?? Wallet;

            return (
              <tr
                key={tx.id}
                onClick={() => onSelect?.(tx.id)}
                className="cursor-pointer border-t border-border text-sm transition-colors hover:bg-canvas"
              >
                {showDate && (
                  <td className="whitespace-nowrap px-5 py-3.5 text-muted">{formatShortDate(tx.createdAt)}</td>
                )}
                <td className="px-5 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    {isEntity ? (
                      <InitialsBadge name={label} size={34} />
                    ) : (
                      <IconBadge
                        icon={getCategoryIcon(category.icon)}
                        imageSrc={getCategoryImage(category.id)}
                        bg={categoryColors.bg}
                        fg={categoryColors.fg}
                        size={34}
                      />
                    )}
                    <span className="truncate font-medium text-ink">{label}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {isEntity ? (
                    <span
                      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                        isIncoming ? "bg-mint-soft text-mint" : "bg-rose-soft text-rose"
                      }`}
                    >
                      {isIncoming ? "Received" : "Paid"}
                    </span>
                  ) : (
                    <span
                      className="inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{ backgroundColor: categoryColors.bg, color: categoryColors.fg }}
                    >
                      {category.label}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <PaymentIcon size={14} />
                    {PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-muted">{formatTime(tx.createdAt)}</td>
                <td className={`whitespace-nowrap px-5 py-3.5 text-right font-semibold ${isIncoming ? "text-mint" : "text-ink"}`}>
                  {isEntity ? (isIncoming ? "+" : "-") : ""}
                  {formatRupees(tx.amount)}
                </td>
                <td className="px-3 py-3.5 text-right">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-subtle transition-colors hover:bg-canvas hover:text-ink">
                    <MoreVertical size={15} />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
