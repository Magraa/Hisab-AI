"use client";

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
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" style={{ height: HEIGHT }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-mint)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-mint)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#trendFill)" />
        <path d={linePath} fill="none" stroke="var(--color-mint)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={peak.x} cy={peak.y} r={3.5} fill="var(--color-mint)" />
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
