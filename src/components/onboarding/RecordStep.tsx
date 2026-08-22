"use client";

import { Keyboard, Mic, Camera, Check, ShieldCheck } from "lucide-react";

const BAR_HEIGHTS = [6, 14, 22, 12, 26, 16, 20, 10, 24, 14, 8];

export function RecordStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col items-center pt-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
          <Keyboard size={26} className="text-primary" />
        </span>
        <h1 className="mt-6 text-[26px] font-bold leading-snug text-ink">How do you want to record expenses?</h1>
        <p className="mt-2 text-sm text-muted">Choose your preferred way. You can use all three anytime.</p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center gap-4 rounded-2xl border-2 border-border p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft">
            <Keyboard size={22} className="text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-ink">Type it</p>
            <p className="mt-0.5 text-xs text-muted">Quickly type what you spent in your own words.</p>
            <AlwaysOnBadge />
          </div>
          <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-primary-soft px-2">
            <span className="rounded-md bg-surface px-2 py-1 text-[11px] font-medium text-ink">500 diesel</span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border-2 border-border p-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--color-violet-soft)" }}
          >
            <Mic size={22} style={{ color: "var(--color-violet)" }} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-ink">Say it</p>
            <p className="mt-0.5 text-xs text-muted">Speak naturally in Hindi, Hinglish or any language.</p>
            <AlwaysOnBadge />
          </div>
          <div
            className="flex h-16 w-20 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl"
            style={{ backgroundColor: "var(--color-violet-soft)" }}
          >
            <div className="flex h-6 items-end gap-[2px]">
              {BAR_HEIGHTS.map((h, i) => (
                <span key={i} className="w-[2px] rounded-full" style={{ height: h, backgroundColor: "var(--color-violet)" }} />
              ))}
            </div>
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-violet)" }}
            >
              <Mic size={12} className="text-white" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border-2 border-border p-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--color-peach-soft)" }}
          >
            <Camera size={22} style={{ color: "var(--color-peach)" }} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-ink">Scan it</p>
            <p className="mt-0.5 text-xs text-muted">Scan receipts to extract amount and details.</p>
            <AlwaysOnBadge />
          </div>
          <div
            className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "var(--color-peach-soft)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Assets/receipt-scanner-icon.png" alt="" className="h-16 w-16 object-contain" />
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-primary-soft px-4 py-3.5">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-sm text-ink">Your data is safe and private. Only you can see your Hisab.</p>
      </div>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={onContinue}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white"
        >
          Continue <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

function AlwaysOnBadge() {
  return (
    <span
      className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: "var(--color-mint-soft)", color: "var(--color-mint)" }}
    >
      <Check size={11} /> Always on
    </span>
  );
}
