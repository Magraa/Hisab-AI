"use client";

import type { Transaction } from "@/lib/types";
import { useHisab } from "@/lib/store";
import { getCategory, getCategoryColors, getCategoryIcon, getCategoryImage } from "@/lib/categories";
import { formatRupees, formatTime } from "@/lib/format";
import { IconBadge, InitialsBadge } from "@/components/ui/IconBadge";
import { ChevronRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { motion } from "motion/react";
import { triggerHaptic } from "@/lib/haptics";

export function TransactionRow({
  tx,
  entityName,
  onClick,
}: {
  tx: Transaction;
  entityName?: string;
  onClick?: () => void;
}) {
  const { categories } = useHisab();
  const isEntity = Boolean(tx.entityId);
  const category = getCategory(categories, tx.categoryId);
  const categoryColors = getCategoryColors(category.color);
  const label = isEntity ? entityName ?? tx.description : category.label;
  const paymentLabel = PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod;

  // Category-only rows are always money leaving the business (an expense).
  // Entity rows carry an explicit direction: "incoming" = money/value coming in.
  const isIncoming = isEntity && tx.direction === "incoming";

  const amountColor = isIncoming ? "text-mint" : "text-ink";
  const amountPrefix = isEntity ? (isIncoming ? "+" : "-") : "";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.985, backgroundColor: "var(--color-primary-soft, #f4f5fa)" }}
      transition={{ duration: 0.1 }}
      onClick={() => {
        triggerHaptic("light");
        onClick?.();
      }}
      className="flex w-full items-center gap-3 border-b border-border px-5 py-3.5 text-left last:border-b-0 transition-colors"
    >
      <div className="relative shrink-0">
        {isEntity ? (
          <InitialsBadge name={label} />
        ) : (
          <IconBadge
            icon={getCategoryIcon(category.icon)}
            imageSrc={getCategoryImage(category.id)}
            bg={categoryColors.bg}
            fg={categoryColors.fg}
          />
        )}
        <span
          className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-surface ${
            isIncoming ? "bg-mint" : "bg-rose"
          }`}
          aria-label={isIncoming ? "Money in" : "Money out"}
        >
          {isIncoming ? (
            <ArrowDownLeft size={10} strokeWidth={3} className="text-white" />
          ) : (
            <ArrowUpRight size={10} strokeWidth={3} className="text-white" />
          )}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium text-ink">{label}</p>
        <p className="text-xs text-muted">
          {formatTime(tx.createdAt)} · {paymentLabel}
        </p>
      </div>
      <span className={`text-[15px] font-semibold ${amountColor}`}>
        {amountPrefix}
        {formatRupees(tx.amount)}
      </span>
      <ChevronRight size={16} className="text-subtle" />
    </motion.button>
  );
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  bank: "Bank",
  card: "Card",
  credit: "Credit",
  other: "Other",
};
