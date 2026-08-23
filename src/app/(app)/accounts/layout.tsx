import type { ReactNode } from "react";

// Accounts has no dedicated PC mockup — this just keeps the existing mobile
// list/ledger views from stretching edge-to-edge in the wide desktop
// workspace. No changes to the mobile markup itself.
export default function AccountsLayout({ children }: { children: ReactNode }) {
  return <div className="lg:mx-auto lg:w-full lg:max-w-3xl">{children}</div>;
}
