"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";
import { HisabInput } from "@/components/hisab/HisabInput";

export function FirstExpenseStep({ onFinish }: { onFinish: () => void }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden">
      <div className="flex flex-col items-center pt-[clamp(0.5rem,2vh,1.25rem)] text-center shrink-0">
        <span className="flex h-[clamp(2.75rem,6.5vh,3.5rem)] w-[clamp(2.75rem,6.5vh,3.5rem)] items-center justify-center rounded-full bg-primary-soft shadow-xs">
          <PenLine size={22} className="text-primary" />
        </span>
        <h1 className="mt-[clamp(0.5rem,1.8vh,1rem)] text-[clamp(1.2rem,3vh,1.5rem)] font-bold leading-snug text-ink">
          You&rsquo;re ready.
        </h1>
        <p className="mt-[clamp(0.15rem,0.5vh,0.35rem)] text-[clamp(0.75rem,1.6vh,0.85rem)] text-muted">
          Try your first expense — type or say something like &ldquo;500 diesel&rdquo;.
        </p>
      </div>

      <div className="my-auto py-[clamp(0.5rem,2vh,1rem)] w-full">
        <HisabInput onAdded={() => setAdded(true)} />
      </div>

      <div className="shrink-0 pt-[clamp(0.5rem,1.5vh,1rem)]">
        {added ? (
          <button
            type="button"
            onClick={onFinish}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-[clamp(0.75rem,2vh,1rem)] text-[clamp(0.95rem,2vh,1.05rem)] font-semibold text-white shadow-md hover:bg-primary-hover active:scale-[0.99] transition-all cursor-pointer"
          >
            Continue to Hisab <span aria-hidden>→</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onFinish}
            className="w-full py-[clamp(0.6rem,1.5vh,0.875rem)] text-center text-[clamp(0.8rem,1.6vh,0.875rem)] font-medium text-muted hover:text-ink cursor-pointer transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
