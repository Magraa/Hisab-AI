import type { Entity, Transaction } from "./types";
import { dateKey, isSameDay } from "./format";

export interface EntityBalance {
  totalGiven: number; // value/cash the business gave this entity
  totalGot: number; // value/cash the business got from this entity
  net: number; // positive = they owe you, negative = you owe them
  label: "You owe" | "They owe you" | "Settled";
  displayAmount: number;
}

// Same convention real khata apps use: whoever received net value owes it back.
// "You gave" more than you "got" -> they owe you. "You got" more than you "gave" -> you owe them.
export function computeBalance(transactions: Transaction[], entityId: string): EntityBalance {
  let totalGiven = 0;
  let totalGot = 0;
  for (const tx of transactions) {
    if (tx.entityId !== entityId) continue;
    if (tx.direction === "outgoing") totalGiven += tx.amount;
    else if (tx.direction === "incoming") totalGot += tx.amount;
  }
  const net = totalGiven - totalGot;
  const label = net > 0 ? "They owe you" : net < 0 ? "You owe" : "Settled";
  return { totalGiven, totalGot, net, label, displayAmount: Math.abs(net) };
}

export function entityTransactions(transactions: Transaction[], entityId: string): Transaction[] {
  return transactions
    .filter((t) => t.entityId === entityId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function isToday(iso: string): boolean {
  return isSameDay(new Date(iso), new Date());
}

export function sumAmount(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => acc + t.amount, 0);
}

export function groupByDay(transactions: Transaction[]): Array<{ key: string; iso: string; items: Transaction[] }> {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const groups = new Map<string, Transaction[]>();
  for (const tx of sorted) {
    const key = dateKey(tx.createdAt);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tx);
  }
  return Array.from(groups.entries()).map(([key, items]) => ({ key, iso: items[0].createdAt, items }));
}

export function withinRange(iso: string, start: Date, end: Date): boolean {
  const t = new Date(iso).getTime();
  return t >= start.getTime() && t <= end.getTime();
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function entityLabel(entities: Entity[], entityId: string | undefined): string | undefined {
  if (!entityId) return undefined;
  return entities.find((e) => e.id === entityId)?.name;
}
