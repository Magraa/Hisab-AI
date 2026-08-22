"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, BookOpen, PieChart, LayoutGrid } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TABS: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/", label: "Home", icon: Home },
  { href: "/accounts", label: "Accounts", icon: Users },
  { href: "/entries", label: "Entries", icon: BookOpen },
  { href: "/insights", label: "Insights", icon: PieChart },
  { href: "/more", label: "More", icon: LayoutGrid },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch justify-between px-1">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.4 : 2}
                className={active ? "text-primary" : "text-subtle"}
              />
              <span className={active ? "text-primary" : "text-subtle"}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
