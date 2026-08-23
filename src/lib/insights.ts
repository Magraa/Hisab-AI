import type { Category, Transaction } from "./types";
import { getCategory, getCategoryColors } from "./categories";
import { withinRange, sumAmount } from "./selectors";

export type Period = "this_month" | "last_month" | "all_time";

export function periodRange(period: Period, now = new Date()): { start: Date; end: Date; prevStart: Date; prevEnd: Date } {
  if (period === "all_time") {
    const start = new Date(2000, 0, 1);
    const end = now;
    return { start, end, prevStart: start, prevEnd: start };
  }

  if (period === "last_month") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const prevStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const prevEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59, 999);
    return { start, end, prevStart, prevEnd };
  }

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = now;
  const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  return { start, end, prevStart, prevEnd };
}

export function categorized(transactions: Transaction[]): Transaction[] {
  return transactions.filter((t) => Boolean(t.categoryId));
}

export function inRange(transactions: Transaction[], start: Date, end: Date): Transaction[] {
  return transactions.filter((t) => withinRange(t.createdAt, start, end));
}

export interface CategorySlice {
  id: string;
  label: string;
  amount: number;
  pct: number;
  fg: string;
  bg: string;
}

export function categoryBreakdown(transactions: Transaction[], categories: Category[]): CategorySlice[] {
  const total = sumAmount(transactions);
  const totals = new Map<string, number>();
  for (const t of transactions) {
    const id = t.categoryId ?? "other";
    totals.set(id, (totals.get(id) ?? 0) + t.amount);
  }
  return Array.from(totals.entries())
    .map(([id, amount]) => {
      const cat = getCategory(categories, id);
      const colors = getCategoryColors(cat.color);
      return {
        id,
        label: cat.label,
        amount,
        pct: total > 0 ? Math.round((amount / total) * 100) : 0,
        fg: colors.fg,
        bg: colors.bg,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function conicGradient(slices: CategorySlice[]): string {
  if (slices.length === 0) return "var(--color-border)";
  let cursor = 0;
  const stops = slices.map((s) => {
    const start = cursor;
    cursor += s.pct;
    return `${s.fg} ${start}% ${cursor}%`;
  });
  if (cursor < 100) stops.push(`var(--color-border) ${cursor}% 100%`);
  return `conic-gradient(${stops.join(", ")})`;
}

export interface DayPoint {
  day: number;
  iso: string;
  amount: number;
}

export function dailyTotals(transactions: Transaction[], start: Date, end: Date): DayPoint[] {
  const points: DayPoint[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (cursor.getTime() <= endDay.getTime()) {
    const dayStart = new Date(cursor);
    const dayEnd = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate(), 23, 59, 59, 999);
    const amount = sumAmount(inRange(transactions, dayStart, dayEnd));
    points.push({ day: cursor.getDate(), iso: dayStart.toISOString(), amount });
    cursor.setDate(cursor.getDate() + 1);
  }
  return points;
}

export function buildInsightCards(
  current: CategorySlice[],
  previous: CategorySlice[],
  currentTotal: number,
  previousTotal: number
): Array<{ emoji: string; title: string; body: string }> {
  const cards: Array<{ emoji: string; title: string; body: string }> = [];

  for (const slice of current.slice(0, 3)) {
    const prevSlice = previous.find((p) => p.id === slice.id);
    const diff = slice.amount - (prevSlice?.amount ?? 0);
    if (Math.abs(diff) >= 100) {
      cards.push({
        emoji: diff > 0 ? "📈" : "📉",
        title: `${slice.label} is ${diff > 0 ? "rising" : "falling"}`,
        body: `You spent ${diff > 0 ? "more" : "less"} on ${slice.label.toLowerCase()} — a difference of ₹${Math.abs(Math.round(diff)).toLocaleString("en-IN")} vs last period.`,
      });
    }
  }

  if (current[0]) {
    cards.push({
      emoji: "📦",
      title: `${current[0].label} dominates`,
      body: `${current[0].label} makes up ${current[0].pct}% of this period's spending.`,
    });
  }

  if (previousTotal > 0) {
    const changePct = Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
    cards.push({
      emoji: changePct >= 0 ? "⬆️" : "⬇️",
      title: changePct >= 0 ? "Spending is up" : "Spending is down",
      body: `You're spending ${Math.abs(changePct)}% ${changePct >= 0 ? "more" : "less"} than the previous period.`,
    });
  }

  return cards.slice(0, 3);
}
