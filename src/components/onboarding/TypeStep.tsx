"use client";

import { ShoppingBag, Factory, UtensilsCrossed, Truck, Briefcase, Grid2x2, Check, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TYPES: Array<{ id: string; label: string; subtitle: string; icon: LucideIcon; bg: string; fg: string }> = [
  { id: "Retail", label: "Retail", subtitle: "Shops, kirana, clothing, electronics, etc.", icon: ShoppingBag, bg: "var(--color-mint-soft)", fg: "var(--color-mint)" },
  { id: "Manufacturing", label: "Manufacturing", subtitle: "Factories, production units, workshops", icon: Factory, bg: "var(--color-violet-soft)", fg: "var(--color-violet)" },
  { id: "Food & Beverages", label: "Food & Beverages", subtitle: "Restaurants, cafes, food joints, catering", icon: UtensilsCrossed, bg: "var(--color-peach-soft)", fg: "var(--color-peach)" },
  { id: "Trading", label: "Trading", subtitle: "Wholesalers, distributors, import/export", icon: Truck, bg: "var(--color-blue-soft)", fg: "var(--color-blue)" },
  { id: "Services", label: "Services", subtitle: "Consultancy, repair, services, agencies", icon: Briefcase, bg: "#DCF4F1", fg: "#0F766E" },
  { id: "Other", label: "Other", subtitle: "Any other type of business", icon: Grid2x2, bg: "var(--color-amber-soft)", fg: "var(--color-amber)" },
];

export function TypeStep({
  value,
  onChange,
  onContinue,
}: {
  value: string;
  onChange: (type: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden">
      <div className="flex flex-col items-center pt-[clamp(0.4rem,1.8vh,1rem)] text-center shrink-0">
        <span className="flex h-[clamp(2.5rem,6vh,3.25rem)] w-[clamp(2.5rem,6vh,3.25rem)] items-center justify-center rounded-full bg-primary-soft shadow-xs">
          <ShoppingBag size={20} className="text-primary" />
        </span>
        <h1 className="mt-[clamp(0.4rem,1.5vh,0.875rem)] text-[clamp(1.15rem,2.8vh,1.4rem)] font-bold leading-snug text-ink">
          What kind of business do you run?
        </h1>
        <p className="mt-[clamp(0.1rem,0.4vh,0.25rem)] text-[clamp(0.72rem,1.5vh,0.82rem)] text-muted">
          This helps us personalize Hisab for you.
        </p>
      </div>

      <div className="my-auto grid grid-cols-2 gap-[clamp(0.35rem,1.2vh,0.65rem)] py-[clamp(0.25rem,0.8vh,0.5rem)]">
        {TYPES.map((t) => {
          const selected = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={`relative rounded-2xl border-2 bg-surface p-[clamp(0.5rem,1.4vh,0.75rem)] text-left transition-all cursor-pointer ${
                selected ? "border-primary shadow-xs ring-1 ring-primary/20" : "border-border hover:bg-canvas/50"
              }`}
            >
              {selected && (
                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  <Check size={10} className="text-white" />
                </span>
              )}
              <span
                className="flex h-[clamp(1.75rem,4vh,2.25rem)] w-[clamp(1.75rem,4vh,2.25rem)] items-center justify-center rounded-full"
                style={{ backgroundColor: t.bg }}
              >
                <t.icon size={16} style={{ color: t.fg }} />
              </span>
              <p className="mt-[clamp(0.3rem,1vh,0.5rem)] text-[clamp(0.78rem,1.7vh,0.9rem)] font-semibold text-ink leading-tight">
                {t.label}
              </p>
              <p className="mt-0.5 text-[clamp(0.62rem,1.3vh,0.7rem)] leading-tight text-muted line-clamp-1">
                {t.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex shrink-0 items-start gap-2 rounded-2xl bg-primary-soft px-[clamp(0.65rem,2.5vw,0.875rem)] py-[clamp(0.4rem,1vh,0.6rem)]">
        <Lightbulb size={15} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-[clamp(0.7rem,1.4vh,0.78rem)] text-ink leading-snug">
          Don&rsquo;t worry, you can change this later from Business settings.
        </p>
      </div>

      <div className="shrink-0 pt-[clamp(0.5rem,1.5vh,0.875rem)]">
        <button
          type="button"
          onClick={onContinue}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-[clamp(0.75rem,2vh,1rem)] text-[clamp(0.95rem,2vh,1.05rem)] font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all cursor-pointer"
        >
          Continue <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
