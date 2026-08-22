import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full max-w-[440px] flex-col bg-canvas">
      <main className="flex-1 pb-2">{children}</main>
      <BottomNav />
    </div>
  );
}
