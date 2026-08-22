import type { ReactNode } from "react";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto min-h-screen w-full max-w-[440px]">{children}</div>;
}
