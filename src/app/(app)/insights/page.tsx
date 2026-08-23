"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useHisab } from "@/lib/store";
import { formatRupees } from "@/lib/format";
import {
  categorized,
  categoryBreakdown,
  conicGradient,
  dailyTotals,
  inRange,
  periodRange,
  buildInsightCards,
  type Period,
} from "@/lib/insights";
import { sumAmount } from "@/lib/selectors";
import { PageHeader } from "@/components/layout/PageHeader";
import { SelectChip } from "@/components/ui/Chip";
import { Card } from "@/components/ui/Card";
import { TrendChart } from "@/components/hisab/TrendChart";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { triggerHaptic } from "@/lib/haptics";

const PERIOD_OPTIONS: Array<{ value: Period; label: string }> = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "all_time", label: "All Time" },
];

export default function InsightsPage() {
  const { transactions, categories } = useHisab();
  const [period, setPeriod] = useState<Period>("this_month");

  const data = useMemo(() => {
    const range = periodRange(period);
    const catTx = categorized(transactions);
    const current = inRange(catTx, range.start, range.end);
    const previous = period === "all_time" ? [] : inRange(catTx, range.prevStart, range.prevEnd);

    const currentTotal = sumAmount(current);
    const previousTotal = sumAmount(previous);
    const currentSlices = categoryBreakdown(current, categories);
    const previousSlices = categoryBreakdown(previous, categories);

    const trend = dailyTotals(current, range.start, range.end);
    const bestDay = trend.reduce((best, p) => (p.amount > best.amount ? p : best), trend[0] ?? { amount: 0, day: 0, iso: "" });

    const daysElapsed = trend.length || 1;
    const avgPerDay = currentTotal / daysElapsed;

    const cards = buildInsightCards(currentSlices, previousSlices, currentTotal, previousTotal);
    const changePct = previousTotal > 0 ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100) : null;

    return { current, currentTotal, previousTotal, currentSlices, trend, bestDay, avgPerDay, cards, changePct };
  }, [transactions, categories, period]);

  const periodChip = (
    <SelectChip
      label="Period"
      value={period}
      align="right"
      onChange={(v) => {
        triggerHaptic("light");
        setPeriod(v as Period);
      }}
      options={PERIOD_OPTIONS}
    />
  );

  const periodLabel = period === "this_month" ? "this month" : period === "last_month" ? "last month" : "all time";

  const donut =
    data.currentSlices.length === 0 ? (
      <EmptyState title="No categorized expenses yet" subtitle="Add a few entries to see the breakdown." />
    ) : (
      <div className="flex items-center gap-5">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative h-32 w-32 shrink-0 rounded-full shadow-xs"
          style={{ backgroundImage: conicGradient(data.currentSlices) }}
        >
          <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-surface text-center shadow-xs">
            <span className="text-[10px] text-muted">Total</span>
            <span className="text-sm font-semibold text-ink">
              <AnimatedNumber value={data.currentTotal} />
            </span>
          </div>
        </motion.div>
        <div className="flex-1 space-y-2">
          {data.currentSlices.slice(0, 5).map((s) => (
            <div key={s.id} className="flex items-center justify-between text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.fg }} />
                <span className="truncate text-ink">{s.label}</span>
              </div>
              <span className="ml-2 shrink-0 font-medium text-muted">{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    );

  const insightCards = data.cards.length > 0 && (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      {data.cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          className="rounded-2xl border border-border bg-surface p-4 shadow-2xs"
        >
          <p className="text-sm font-medium text-ink">
            {c.emoji} {c.title}
          </p>
          <p className="mt-1 text-sm text-muted">{c.body}</p>
        </motion.div>
      ))}
    </div>
  );

  return (
    <>
      <PageTransition className="lg:hidden">
        <PageHeader title="Insights" subtitle="Understand your business better" action={periodChip} />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 rounded-2xl bg-mint-soft px-5 py-5 shadow-xs"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-mint">Total spent {periodLabel}</p>
          <p className="mt-1 text-3xl font-semibold text-ink">
            <AnimatedNumber value={data.currentTotal} />
          </p>
          {data.changePct !== null && (
            <p className="mt-1 text-sm font-medium text-mint">
              {data.changePct >= 0 ? "↑" : "↓"} {Math.abs(data.changePct)}% {data.changePct >= 0 ? "more" : "less"} than previous period
            </p>
          )}
        </motion.div>

        <div className="mx-5 mt-4 grid grid-cols-2 gap-3">
          <StatTile label="Avg. per day" value={formatRupees(data.avgPerDay)} />
          <StatTile label="Total expenses" value={String(data.current.length)} />
          <StatTile
            label="Best spending day"
            value={data.bestDay?.amount ? `Day ${data.bestDay.day}` : "—"}
            hint={data.bestDay?.amount ? formatRupees(data.bestDay.amount) : undefined}
          />
          <StatTile
            label="vs previous period"
            value={data.changePct === null ? "—" : `${data.changePct >= 0 ? "+" : ""}${data.changePct}%`}
          />
        </div>

        <div className="mx-5 mt-5 rounded-2xl border border-border bg-surface p-5 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Where is your money going?</p>
          </div>
          {donut}
        </div>

        <div className="mx-5 mt-4 rounded-2xl border border-border bg-surface p-5 shadow-xs">
          <p className="mb-3 text-sm font-semibold text-ink">Spending trend</p>
          <TrendChart points={data.trend} />
        </div>

        {data.cards.length > 0 && (
          <div className="mx-5 mb-8 mt-5">
            <p className="mb-3 text-sm font-semibold text-ink">Insights</p>
            {insightCards}
          </div>
        )}
      </PageTransition>

      <div className="hidden lg:block">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Business overview</h1>
            <p className="mt-0.5 text-sm text-muted">Understand your business better</p>
          </div>
          {periodChip}
        </div>

        <Card className="mt-6 p-6 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wide text-mint">Total spent {periodLabel}</p>
          <p className="mt-1 text-3xl font-semibold text-ink">
            <AnimatedNumber value={data.currentTotal} />
          </p>
          {data.changePct !== null && (
            <p className="mt-1 text-sm font-medium text-mint">
              {data.changePct >= 0 ? "↑" : "↓"} {Math.abs(data.changePct)}% {data.changePct >= 0 ? "more" : "less"} than previous period
            </p>
          )}
        </Card>

        <div className="mt-5 grid grid-cols-4 gap-3">
          <StatTile label="Avg. per day" value={formatRupees(data.avgPerDay)} />
          <StatTile label="Total expenses" value={String(data.current.length)} />
          <StatTile
            label="Best spending day"
            value={data.bestDay?.amount ? `Day ${data.bestDay.day}` : "—"}
            hint={data.bestDay?.amount ? formatRupees(data.bestDay.amount) : undefined}
          />
          <StatTile
            label="vs previous period"
            value={data.changePct === null ? "—" : `${data.changePct >= 0 ? "+" : ""}${data.changePct}%`}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-5">
          <Card className="p-6 shadow-xs">
            <p className="mb-4 text-sm font-semibold text-ink">Spending trend</p>
            <TrendChart points={data.trend} />
          </Card>
          <Card className="p-6 shadow-xs">
            <p className="mb-4 text-sm font-semibold text-ink">Where is your money going?</p>
            {donut}
          </Card>
        </div>

        {data.cards.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-ink">Insights</p>
            {insightCards}
          </div>
        )}
      </div>
    </>
  );
}

function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl border border-border bg-surface p-4 shadow-2xs transition-colors"
    >
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </motion.div>
  );
}
