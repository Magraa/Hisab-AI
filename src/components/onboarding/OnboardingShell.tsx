import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

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
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center text-ink"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-1 items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
