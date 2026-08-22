"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Sparkles,
} from "lucide-react";
import { useHisab } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";

export default function MorePage() {
  const { business, resetOnboarding } = useHisab();
  const router = useRouter();
  const isIndividual = business.accountKind === "individual";

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
        <div>
          <p className="font-semibold text-ink">{business.name}</p>
          <p className="text-xs text-muted">{isIndividual ? "Individual" : `${business.type} · Business Owner`}</p>
        </div>
        <Link
          href="/more/business"
          className="rounded-lg border border-mint/40 bg-surface px-3 py-1.5 text-sm font-medium text-mint"
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

      <SectionLabel>Developer</SectionLabel>
      <MenuList>
        <button
          onClick={() => {
            resetOnboarding();
            router.push("/onboarding");
          }}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft">
            <Sparkles size={18} className="text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium text-ink">Restart onboarding</p>
            <p className="truncate text-xs text-muted">Replay the welcome flow</p>
          </div>
          <ChevronRight size={16} className="text-subtle" />
        </button>
      </MenuList>

      <button
        onClick={() => router.push("/")}
        className="mx-5 mt-6 flex items-center justify-center gap-2 rounded-2xl bg-rose-soft py-3.5 text-sm font-semibold text-rose"
      >
        <LogOut size={16} /> Log out
      </button>
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
