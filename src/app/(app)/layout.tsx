import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { CloudErrorBanner } from "@/components/layout/CloudErrorBanner";
import { OnboardingGate } from "@/components/layout/OnboardingGate";
import { InstallPwaBanner } from "@/components/pwa/InstallPrompt";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full max-w-[440px] flex-col bg-canvas lg:max-w-[1440px] lg:flex-row">
      <DesktopSidebar />
      <div className="flex w-full flex-1 flex-col lg:min-w-0">
        <OnboardingGate />
        <CloudErrorBanner />
        <InstallPwaBanner />
        <main className="flex-1 pb-2 lg:px-10 lg:pb-10 lg:pt-8">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
