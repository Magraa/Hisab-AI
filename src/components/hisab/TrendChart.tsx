"use client";

import { motion } from "motion/react";
import type { DayPoint } from "@/lib/insights";
import { formatRupees } from "@/lib/format";

const WIDTH = 300;
const HEIGHT = 110;
const PAD = 8;

export function TrendChart({ points }: { points: DayPoint[] }) {
  if (points.length < 2) {
    return <p className="py-8 text-center text-sm text-muted">Not enough data yet.</p>;
  }

  const max = Math.max(...points.map((p) => p.amount), 1);
  const stepX = (WIDTH - PAD * 2) / (points.length - 1);

  const coords = points.map((p, i) => {
    const x = PAD + i * stepX;
    const y = HEIGHT - PAD - (p.amount / max) * (HEIGHT - PAD * 2);
    return { x, y, p };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${HEIGHT - PAD} L${coords[0].x.toFixed(1)},${HEIGHT - PAD} Z`;

  const peakIndex = coords.reduce((best, c, i) => (c.p.amount > coords[best].p.amount ? i : best), 0);
  const peak = coords[peakIndex];

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full overflow-visible" style={{ height: HEIGHT }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-mint)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-mint)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#trendFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="var(--color-mint)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Pulsing ring around peak point */}
        <motion.circle
          cx={peak.x}
          cy={peak.y}
          r={7}
          fill="var(--color-mint)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.4, 0, 0.4], scale: [0.8, 1.8, 0.8] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.8 }}
        />
        {/* Main peak dot */}
        <motion.circle
          cx={peak.x}
          cy={peak.y}
          r={4}
          fill="var(--color-mint)"
          stroke="var(--color-surface)"
          strokeWidth={1.5}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 450, damping: 20, delay: 0.7 }}
        />
      </svg>
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>Day {points[0].day}</span>
        <span className="font-medium text-ink">
          Peak: Day {peak.p.day} · {formatRupees(peak.p.amount)}
        </span>
        <span>Day {points[points.length - 1].day}</span>
      </div>
    </div>
  );
}

