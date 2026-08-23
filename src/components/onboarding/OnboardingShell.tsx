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
    <div className="flex min-h-screen flex-col bg-canvas px-6 pb-8 pt-6">
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.88 }}
          type="button"
          onClick={() => {
            triggerHaptic("light");
            onBack();
          }}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center text-ink rounded-full active:bg-primary-soft/40"
        >
          <ArrowLeft size={20} />
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

      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

