"use client";

import { Check } from "lucide-react";
import { THEMES } from "@/lib/themes";
import { useTheme } from "./ThemeProvider";

export function ThemePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-3">
      {THEMES.map((t) => {
        const selected = theme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 text-left ${
              selected ? "border-primary" : "border-border"
            }`}
          >
            <span
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border"
              style={{ backgroundColor: t.swatch.canvas }}
            >
              <span className="h-5 w-5 rounded-full" style={{ backgroundColor: t.swatch.primary }} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-ink">{t.label}</p>
              <p className="text-xs text-muted">{t.description}</p>
            </div>
            {selected && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
                <Check size={14} className="text-white" />
              </span>
            )}
          </button>
        );
      })}
      <p className="text-xs text-muted">More themes will show up here as they&rsquo;re added.</p>
    </div>
  );
}
