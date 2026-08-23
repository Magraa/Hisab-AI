"use client";

import { Keyboard, Mic, Camera, Check, ShieldCheck } from "lucide-react";

const BAR_HEIGHTS = [4, 10, 16, 8, 18, 12, 14, 8, 16, 10, 6];

export function RecordStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden">
      <div className="flex flex-col items-center pt-[clamp(0.4rem,1.8vh,1rem)] text-center shrink-0">
        <span className="flex h-[clamp(2.5rem,6vh,3.25rem)] w-[clamp(2.5rem,6vh,3.25rem)] items-center justify-center rounded-full bg-primary-soft shadow-xs">
          <Keyboard size={20} className="text-primary" />
        </span>
        <h1 className="mt-[clamp(0.4rem,1.5vh,0.875rem)] text-[clamp(1.15rem,2.8vh,1.4rem)] font-bold leading-snug text-ink">
          How do you want to record expenses?
        </h1>
        <p className="mt-[clamp(0.1rem,0.4vh,0.25rem)] text-[clamp(0.72rem,1.5vh,0.82rem)] text-muted">
          Choose your preferred way. You can use all three anytime.
        </p>
      </div>

      <div className="my-auto flex flex-col gap-[clamp(0.4rem,1.2vh,0.65rem)] py-[clamp(0.25rem,0.8vh,0.5rem)]">
        {/* Type it */}
        <div className="flex items-center gap-[clamp(0.5rem,2.5vw,0.875rem)] rounded-2xl border-2 border-border bg-surface p-[clamp(0.5rem,1.4vh,0.75rem)] shadow-2xs">
          <span className="flex h-[clamp(2.25rem,5vh,2.75rem)] w-[clamp(2.25rem,5vh,2.75rem)] shrink-0 items-center justify-center rounded-full bg-primary-soft">
            <Keyboard size={18} className="text-primary" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[clamp(0.82rem,1.8vh,0.92rem)] font-semibold text-ink leading-tight">Type it</p>
            <p className="text-[clamp(0.68rem,1.4vh,0.76rem)] text-muted leading-tight mt-0.5">Quickly type what you spent</p>
            <AlwaysOnBadge />
          </div>
          <div className="flex h-[clamp(2.25rem,5vh,2.75rem)] w-[clamp(3.5rem,14vw,4.25rem)] shrink-0 items-center justify-center rounded-xl bg-primary-soft px-2">
            <span className="rounded-md bg-surface px-1.5 py-0.5 text-[clamp(0.65rem,1.3vh,0.75rem)] font-medium text-ink shadow-2xs">500 diesel</span>
          </div>
        </div>

        {/* Say it */}
        <div className="flex items-center gap-[clamp(0.5rem,2.5vw,0.875rem)] rounded-2xl border-2 border-border bg-surface p-[clamp(0.5rem,1.4vh,0.75rem)] shadow-2xs">
          <span
            className="flex h-[clamp(2.25rem,5vh,2.75rem)] w-[clamp(2.25rem,5vh,2.75rem)] shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--color-violet-soft)" }}
          >
            <Mic size={18} style={{ color: "var(--color-violet)" }} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[clamp(0.82rem,1.8vh,0.92rem)] font-semibold text-ink leading-tight">Say it</p>
            <p className="text-[clamp(0.68rem,1.4vh,0.76rem)] text-muted leading-tight mt-0.5">Speak in Hindi, Hinglish or English</p>
            <AlwaysOnBadge />
          </div>
          <div
            className="flex h-[clamp(2.25rem,5vh,2.75rem)] w-[clamp(3.5rem,14vw,4.25rem)] shrink-0 flex-col items-center justify-center gap-1 rounded-xl"
            style={{ backgroundColor: "var(--color-violet-soft)" }}
          >
            <div className="flex h-3.5 items-end gap-[2px]">
              {BAR_HEIGHTS.map((h, i) => (
                <span key={i} className="w-[2px] rounded-full" style={{ height: Math.min(h, 14), backgroundColor: "var(--color-violet)" }} />
              ))}
            </div>
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-violet)" }}
            >
              <Mic size={9} className="text-white" />
            </span>
          </div>
        </div>

        {/* Scan it */}
        <div className="flex items-center gap-[clamp(0.5rem,2.5vw,0.875rem)] rounded-2xl border-2 border-border bg-surface p-[clamp(0.5rem,1.4vh,0.75rem)] shadow-2xs">
          <span
            className="flex h-[clamp(2.25rem,5vh,2.75rem)] w-[clamp(2.25rem,5vh,2.75rem)] shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--color-peach-soft)" }}
          >
            <Camera size={18} style={{ color: "var(--color-peach)" }} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[clamp(0.82rem,1.8vh,0.92rem)] font-semibold text-ink leading-tight">Scan it</p>
            <p className="text-[clamp(0.68rem,1.4vh,0.76rem)] text-muted leading-tight mt-0.5">Scan paper bills & receipts</p>
            <AlwaysOnBadge />
          </div>
          <div
            className="flex h-[clamp(2.25rem,5vh,2.75rem)] w-[clamp(3.5rem,14vw,4.25rem)] shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "var(--color-peach-soft)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Assets/onboarding/receipt-scanner-icon.webp" alt="" className="h-[clamp(1.75rem,4vh,2.25rem)] w-[clamp(1.75rem,4vh,2.25rem)] object-contain" />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-start gap-2.5 rounded-2xl bg-primary-soft px-[clamp(0.65rem,2.5vw,0.875rem)] py-[clamp(0.4rem,1vh,0.6rem)]">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-[clamp(0.7rem,1.4vh,0.78rem)] text-ink leading-snug">
          Your data is safe and private. Only you can see your Hisab.
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

function AlwaysOnBadge() {
  return (
    <span
      className="mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[clamp(0.6rem,1.2vh,0.7rem)] font-medium"
      style={{ backgroundColor: "var(--color-mint-soft)", color: "var(--color-mint)" }}
    >
      <Check size={10} /> Always on
    </span>
  );
}
