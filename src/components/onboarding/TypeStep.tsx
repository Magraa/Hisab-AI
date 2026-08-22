"use client";

import { ShoppingBag, Factory, UtensilsCrossed, Truck, Briefcase, Grid2x2, Check, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { onboarding as theme } from "./theme";

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
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center pt-6 text-center">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: theme.primarySoft }}
        >
          <ShoppingBag size={26} style={{ color: theme.primary }} />
        </span>
        <h1 className="mt-6 text-[26px] font-bold leading-snug" style={{ color: theme.ink }}>
          What kind of business do you run?
        </h1>
        <p className="mt-2 text-sm" style={{ color: theme.muted }}>
          This helps us personalize Hisab for you.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {TYPES.map((t) => {
          const selected = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className="relative rounded-2xl border-2 p-4 text-left"
              style={{
                borderColor: selected ? theme.primary : theme.cardBorder,
                backgroundColor: "#fff",
              }}
            >
              {selected && (
                <span
                  className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Check size={12} className="text-white" />
                </span>
              )}
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: t.bg }}
              >
                <t.icon size={20} style={{ color: t.fg }} />
              </span>
              <p className="mt-3 text-[15px] font-semibold" style={{ color: theme.ink }}>
                {t.label}
              </p>
              <p className="mt-0.5 text-xs leading-snug" style={{ color: theme.muted }}>
                {t.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      <div
        className="mt-5 flex items-start gap-3 rounded-2xl px-4 py-3.5"
        style={{ backgroundColor: theme.primarySoft }}
      >
        <Lightbulb size={18} style={{ color: theme.primary }} className="mt-0.5 shrink-0" />
        <p className="text-sm" style={{ color: theme.ink }}>
          Don&rsquo;t worry, you can change this later from Business settings.
        </p>
      </div>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={onContinue}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-white"
          style={{ backgroundColor: theme.primary }}
        >
          Continue <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
