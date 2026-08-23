import type { ReactNode } from "react";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto h-[100dvh] max-h-[100dvh] w-full max-w-[440px] overflow-hidden flex flex-col">{children}</div>;
}

