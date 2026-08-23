import type { ReactNode } from "react";

// More/Settings has no dedicated PC mockup — this just keeps the existing
// mobile menu/forms from stretching edge-to-edge in the wide desktop
// workspace. No changes to the mobile markup itself.
export default function MoreLayout({ children }: { children: ReactNode }) {
  return <div className="lg:mx-auto lg:w-full lg:max-w-2xl">{children}</div>;
}
