"use client";

import { motion } from "motion/react";
import type { DayPoint } from "@/lib/insights";

export function HomeSpendChart({ points }: { points: DayPoint[] }) {
  if (points.length === 0) return null;
  const max = Math.max(...points.map((p) => p.amount), 1);

  return (
    <div className="flex h-24 items-end gap-2.5">
      {points.map((p, i) => {
        const isLast = i === points.length - 1;
        const heightPct = p.amount > 0 ? Math.max(6, Math.round((p.amount / max) * 100)) : 3;
        return (
          <div key={p.iso} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <div className="flex h-[76px] w-full items-end">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPct}%` }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full rounded-md ${isLast ? "bg-primary" : "bg-primary-soft"}`}
              />
            </div>
            <span className={`text-[11px] ${isLast ? "font-semibold text-ink" : "text-subtle"}`}>{p.day}</span>
          </div>
        );
      })}
    </div>
  );
}
