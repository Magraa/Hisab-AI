"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";
import { HisabInput } from "@/components/hisab/HisabInput";

export function FirstExpenseStep({ onFinish }: { onFinish: () => void }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center pt-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
          <PenLine size={26} className="text-primary" />
        </span>
        <h1 className="mt-6 text-[26px] font-bold leading-snug text-ink">You&rsquo;re ready.</h1>
        <p className="mt-2 text-sm text-muted">
          Try your first expense — type or say something like &ldquo;500 diesel&rdquo;.
        </p>
      </div>

      <div className="mt-8">
        <HisabInput onAdded={() => setAdded(true)} />
      </div>

      <div className="mt-auto pt-8">
        {added ? (
          <button
            type="button"
            onClick={onFinish}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white"
          >
            Continue to Hisab <span aria-hidden>→</span>
          </button>
        ) : (
          <button type="button" onClick={onFinish} className="w-full py-4 text-center text-sm font-medium text-muted">
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
