"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Settings as SettingsIcon } from "lucide-react";
import { useHisab } from "@/lib/store";
import { InitialsBadge } from "@/components/ui/IconBadge";
import { NAV_TABS } from "./BottomNav";

export function DesktopSidebar() {
  const pathname = usePathname();
  const { business } = useHisab();

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-border px-4 py-6 lg:flex lg:h-full lg:overflow-y-auto">
      <div className="flex flex-col">
        <Link href="/" className="flex items-center gap-2.5 px-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface p-1.5 shadow-2xs">
            <Image src="/Assets/logo.webp" alt="" width={28} height={28} className="h-full w-full object-contain" />
          </span>
          <span className="text-lg font-semibold text-ink">Hisab</span>
        </Link>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_TABS.map((tab) => {
            const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? "bg-primary-soft font-semibold text-primary" : "text-muted hover:bg-canvas hover:text-ink"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <Link
          href="/more/settings"
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname.startsWith("/more/settings")
              ? "bg-primary-soft font-semibold text-primary"
              : "text-muted hover:bg-canvas hover:text-ink"
          }`}
        >
          <SettingsIcon size={18} />
          Settings
        </Link>

        <Link
          href="/more"
          className="flex items-center gap-3 rounded-xl border border-border bg-canvas px-3 py-2.5 transition-colors hover:bg-primary-soft/40"
        >
          <InitialsBadge name={business.userName || business.name || "Hisab User"} avatarUrl={business.avatar} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{business.userName || business.name || "Hisab User"}</p>
            <p className="truncate text-xs text-muted">{business.accountKind === "business" ? (business.name || "Your business") : "Individual Hisab"}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
