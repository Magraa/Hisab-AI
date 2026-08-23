"use client";

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { triggerHaptic } from "@/lib/haptics";

export function OnboardingShell({
  step,
  totalSteps,
  onBack,
  children,
}: {
  step: number;
  totalSteps: number;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] max-h-[100dvh] w-full flex-col justify-between overflow-hidden bg-canvas px-[clamp(1rem,4.5vw,1.5rem)] py-[clamp(0.75rem,2.5vh,1.25rem)]">
      <div className="flex shrink-0 items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.88 }}
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onBack();
          }}
          aria-label="Back"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink active:bg-primary-soft/40 cursor-pointer"
        >
          <ArrowLeft size={19} />
        </motion.button>
        <div className="flex flex-1 items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-border">
              <motion.div
                initial={false}
                animate={{
                  width: i < step ? "100%" : "0%",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
    </div>
  );
}

