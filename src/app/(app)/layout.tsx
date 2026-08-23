import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { CloudErrorBanner } from "@/components/layout/CloudErrorBanner";
import { OnboardingGate } from "@/components/layout/OnboardingGate";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full max-w-[440px] flex-col bg-canvas">
      <OnboardingGate />
      <CloudErrorBanner />
      <main className="flex-1 pb-2">{children}</main>
      <BottomNav />
    </div>
  );
}
