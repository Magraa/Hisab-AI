import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { onboarding as theme } from "./theme";

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
    <div className="flex min-h-screen flex-col px-6 pb-8 pt-6" style={{ backgroundColor: theme.bg }}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center"
          style={{ color: theme.ink }}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-1 items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 flex-1 rounded-full"
              style={{ backgroundColor: i < step ? theme.primary : "#E1DBCB" }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
