"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  Grid2x2,
  CreditCard,
  Download,
  ShieldCheck,
  Settings as SettingsIcon,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
  Bell,
  Mail,
} from "lucide-react";
import { useHisab } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { InitialsBadge } from "@/components/ui/IconBadge";
import { PageHeader } from "@/components/layout/PageHeader";
import { BackupPromoCard } from "@/components/layout/BackupPromoCard";

export default function MorePage() {
  const { business, cloudUser } = useHisab();
  const [signingOut, setSigningOut] = useState(false);
  const isIndividual = business.accountKind === "individual";

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setSigningOut(false);
  }

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between px-5 pt-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">More</h1>
          <p className="text-sm text-muted">Manage your Hisab</p>
        </div>
        <button aria-label="Notifications" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted">
          <Bell size={18} />
        </button>
      </div>

      <div className="mx-5 mt-4 flex items-center justify-between rounded-2xl bg-mint-soft px-5 py-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <InitialsBadge
            name={business.userName || business.name || "Hisab User"}
            avatarUrl={business.avatar}
            size={48}
          />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">
              {business.accountKind === "business"
                ? (business.name || "My Business")
                : (business.userName || business.name || "Your Hisab")}
            </p>
            <p className="truncate text-xs text-muted">
              {isIndividual
                ? (business.userName || business.name
                    ? `${business.userName || business.name} · Individual`
                    : "Individual")
                : `${business.type} · ${business.userName || business.name || "Business Owner"}`}
            </p>
          </div>
        </div>
        <Link
          href="/more/business"
          className="shrink-0 rounded-lg border border-mint/40 bg-surface px-3 py-1.5 text-sm font-medium text-mint"
        >
          Edit
        </Link>
      </div>

      <div className="mx-5 mt-3 flex items-center justify-between rounded-2xl bg-primary-soft px-5 py-4">
        <div>
          <p className="font-semibold text-ink">Upgrade to Hisab Pro</p>
          <p className="text-sm text-muted">Unlock advanced insights and more</p>
        </div>
        <Link href="/more/subscription" className="flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">
          View Plans <ChevronRight size={14} />
        </Link>
      </div>

      <SectionLabel>{isIndividual ? "Profile" : "Business"}</SectionLabel>
      <MenuList>
        <MenuRow
          href="/more/business"
          icon={Store}
          title={isIndividual ? "Your Details" : "Business Details"}
          subtitle={isIndividual ? "Name, currency" : "Name, type, currency"}
        />
        <MenuRow href="/more/categories" icon={Grid2x2} title="Categories" subtitle="Manage your expense categories" />
        <MenuRow href="/more/payment-methods" icon={CreditCard} title="Payment Methods" subtitle="Cash, UPI, Bank, Card etc." />
        <MenuRow href="/more/export" icon={Download} title="Export" subtitle="Download your Hisab" last />
      </MenuList>

      <SectionLabel>Account &amp; App</SectionLabel>
      <MenuList>
        <MenuRow href="/more/subscription" icon={ShieldCheck} title="Subscription" subtitle="Free Plan · Upgrade for more power" />
        <MenuRow href="/more/settings" icon={SettingsIcon} title="Settings" subtitle="Language, notifications, privacy" />
        <MenuRow href="/more/help" icon={HelpCircle} title="Help & Support" subtitle="Get help, contact us" />
        <MenuRow href="/more/about" icon={Info} title="About Hisab" subtitle="Version 0.1.0" last />
      </MenuList>

      {cloudUser ? (
        <>
          <SectionLabel>Account</SectionLabel>
          <MenuList>
            <div className="flex items-center justify-between gap-3 px-4 py-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                  <Mail size={18} className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-ink">Logged in as</p>
                  <p className="truncate text-xs text-muted">{cloudUser.email || "Active account"}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex shrink-0 items-center gap-1.5 rounded-xl border border-rose/30 bg-rose-soft/40 px-3.5 py-2 text-xs font-semibold text-rose transition-all hover:bg-rose-soft active:scale-[0.98] cursor-pointer disabled:opacity-60"
              >
                <LogOut size={14} />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </MenuList>
        </>
      ) : (
        <div className="mt-6">
          <BackupPromoCard />
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return <p className="mb-2 mt-6 px-5 text-xs font-semibold uppercase tracking-wide text-muted">{children}</p>;
}

function MenuList({ children }: { children: React.ReactNode }) {
  return <div className="mx-5 overflow-hidden rounded-2xl border border-border bg-surface">{children}</div>;
}

function MenuRow({
  href,
  icon: Icon,
  title,
  subtitle,
  last,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle: string;
  last?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3.5 ${last ? "" : "border-b border-border"}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft">
        <Icon size={18} className="text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium text-ink">{title}</p>
        <p className="truncate text-xs text-muted">{subtitle}</p>
      </div>
      <ChevronRight size={16} className="text-subtle" />
    </Link>
  );
}
