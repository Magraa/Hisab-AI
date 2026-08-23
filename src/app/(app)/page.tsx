"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MoreHorizontal,
  Bell,
  Plus,
  Lightbulb,
  ArrowRight,
  CalendarDays,
  Camera,
  Download,
  Grid2x2,
  CreditCard,
  Store,
  User,
  Settings,
  HelpCircle,
  LayoutGrid,
  Zap,
  Sparkles,
  Bot,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHisab } from "@/lib/store";
import { greeting, formatRupees, formatTime } from "@/lib/format";
import { isToday, sumAmount, entityLabel } from "@/lib/selectors";
import {
  categorized,
  categoryBreakdown,
  conicGradient,
  dailyTotals,
  inRange,
  periodRange,
  buildInsightCards,
} from "@/lib/insights";
import { getCategory, getCategoryIcon } from "@/lib/categories";
import { HisabInput } from "@/components/hisab/HisabInput";
import { TransactionRow } from "@/components/hisab/TransactionRow";
import { TransactionDetailSheet } from "@/components/hisab/TransactionDetailSheet";
import { DesktopEntryTable } from "@/components/hisab/DesktopEntryTable";
import { HomeSpendChart } from "@/components/hisab/HomeSpendChart";
import { ReceiptScannerModal } from "@/components/hisab/ReceiptScannerModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card } from "@/components/ui/Card";
import { Sheet } from "@/components/ui/Sheet";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { triggerHaptic } from "@/lib/haptics";

const PREVIEW_COUNT = 5;

const PARSING_MODES = [
  {
    value: "local" as const,
    label: "Local only",
    icon: Zap,
    description: "Fast & 100% offline",
  },
  {
    value: "auto" as const,
    label: "Smart Auto",
    icon: Sparkles,
    description: "Local first · AI fallback",
  },
  {
    value: "ai" as const,
    label: "Always AI",
    icon: Bot,
    description: "Full Gemini AI analysis",
  },
];

export default function HomePage() {
  const {
    transactions,
    entities,
    categories,
    business,
    parsingMode,
    setParsingMode,
  } = useHisab();
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const todays = useMemo(
    () =>
      transactions
        .filter((t) => isToday(t.createdAt))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [transactions]
  );

  const todayTotal = sumAmount(todays);
  const avgExpense = todays.length > 0 ? todayTotal / todays.length : 0;

  // Desktop-only widgets (spend trend, monthly insight, top category, vs.
  // yesterday) — computed unconditionally since it's cheap, but only ever
  // rendered inside the `hidden lg:block` desktop tree below.
  const desktopData = useMemo(() => {
    const now = new Date();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    const trend = dailyTotals(transactions, weekStart, now);

    const yStart = new Date(now);
    yStart.setDate(now.getDate() - 1);
    const yesterdayStart = new Date(yStart.getFullYear(), yStart.getMonth(), yStart.getDate());
    const yesterdayEnd = new Date(yStart.getFullYear(), yStart.getMonth(), yStart.getDate(), 23, 59, 59, 999);
    const yesterdayTotal = sumAmount(inRange(transactions, yesterdayStart, yesterdayEnd));

    const monthRange = periodRange("this_month");
    const prevMonthRange = periodRange("last_month");
    const catTx = categorized(transactions);
    const currentMonthTx = inRange(catTx, monthRange.start, monthRange.end);
    const prevMonthTx = inRange(catTx, prevMonthRange.start, prevMonthRange.end);
    const currentSlices = categoryBreakdown(currentMonthTx, categories);
    const prevSlices = categoryBreakdown(prevMonthTx, categories);
    const insightCards = buildInsightCards(currentSlices, prevSlices, sumAmount(currentMonthTx), sumAmount(prevMonthTx));

    const todaySlices = categoryBreakdown(categorized(todays), categories);
    const topCategory = todaySlices[0];

    return { trend, yesterdayTotal, insightCards, todaySlices, topCategory };
  }, [transactions, categories, todays]);

  const vsYesterdayPct =
    desktopData.yesterdayTotal > 0
      ? Math.round(((todayTotal - desktopData.yesterdayTotal) / desktopData.yesterdayTotal) * 100)
      : null;

  const topCategoryFull = desktopData.topCategory ? getCategory(categories, desktopData.topCategory.id) : null;
  const TopCategoryIcon = topCategoryFull ? getCategoryIcon(topCategoryFull.icon) : null;

  return (
    <>
      <PageTransition className="lg:hidden">
        <div className="flex items-start justify-between px-5 pt-6">
          <div>
            <h1 className="text-xl font-semibold text-ink">{greeting()}, {business.userName || business.name || "Hisab User"} 👋</h1>
            <p className="text-sm text-muted">Here&rsquo;s your Hisab</p>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-label="More options"
              aria-expanded={mobileMenuOpen}
              onClick={() => {
                triggerHaptic("light");
                setMobileMenuOpen((prev) => !prev);
              }}
              className={`tap-active flex h-9 w-9 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                mobileMenuOpen
                  ? "border-primary bg-primary text-white shadow-xs"
                  : "border-border text-muted active:bg-primary-soft/40 hover:bg-canvas"
              }`}
            >
              <MoreHorizontal size={18} />
            </button>

            <AnimatePresence>
              {mobileMenuOpen && (
                <>
                  {/* Backdrop overlay to close on outside touch */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                  />

                  {/* Dropdown Menu */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -6 }}
                    transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
                    className="absolute right-0 top-11 z-50 w-64 origin-top-right overflow-hidden rounded-2xl border border-border/80 bg-surface/98 p-1.5 shadow-xl backdrop-blur-md"
                  >
                    {/* Parsing Mode Switcher */}
                    <div className="mb-1 rounded-xl border border-border/80 bg-canvas/80 p-2 shadow-2xs">
                      <div className="mb-1.5 flex items-center justify-between px-0.5">
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
                          <Cpu size={12} className="text-primary" />
                          Engine
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            parsingMode === "local"
                              ? "bg-mint-soft text-mint border border-mint/30"
                              : parsingMode === "auto"
                              ? "bg-primary-soft text-primary border border-primary/30"
                              : "bg-violet-soft text-violet border border-violet/30"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              parsingMode === "local"
                                ? "bg-mint"
                                : parsingMode === "auto"
                                ? "bg-primary animate-pulse"
                                : "bg-violet animate-pulse"
                            }`}
                          />
                          {parsingMode === "local" ? "Local" : parsingMode === "auto" ? "Auto" : "AI"}
                        </span>
                      </div>

                      {/* 3-way Segmented Switcher - Icons only */}
                      <div className="relative grid grid-cols-3 gap-1 rounded-lg bg-surface/90 p-1 border border-border/60 shadow-2xs">
                        {PARSING_MODES.map((mode) => {
                          const active = parsingMode === mode.value;
                          const Icon = mode.icon;
                          return (
                            <button
                              key={mode.value}
                              type="button"
                              title={mode.label}
                              aria-label={mode.label}
                              onClick={() => {
                                triggerHaptic("medium");
                                setParsingMode(mode.value);
                              }}
                              className={`relative flex items-center justify-center rounded-md py-1.5 transition-colors cursor-pointer select-none ${
                                active ? "text-white" : "text-muted hover:text-ink active:scale-95"
                              }`}
                            >
                              {active && (
                                <motion.div
                                  layoutId="active-parsing-pill"
                                  className="absolute inset-0 rounded-md bg-primary shadow-xs"
                                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                />
                              )}
                              <span className="relative z-10">
                                <Icon size={16} className={active ? "text-white" : "text-muted"} />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="my-1 border-t border-border/60" />

                    {/* Quick Actions */}
                    <div className="space-y-0.5">
                      {/* Scan Receipt option - commented out
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic("light");
                          setMobileMenuOpen(false);
                          setScannerOpen(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-all hover:bg-canvas active:scale-[0.98] active:bg-primary-soft/40 cursor-pointer"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mint-soft text-mint">
                          <Camera size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-ink leading-tight">Scan Receipt</p>
                          <p className="text-[11px] text-muted leading-tight truncate">AI bill & khata extractor</p>
                        </div>
                      </button>
                      */}

                      <Link
                        href="/more/export"
                        onClick={() => {
                          triggerHaptic("light");
                          setMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-all hover:bg-canvas active:scale-[0.98] active:bg-primary-soft/40 cursor-pointer"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                          <Download size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-ink leading-tight">Export Hisab</p>
                          <p className="text-[11px] text-muted leading-tight truncate">Download PDF & Excel</p>
                        </div>
                      </Link>
                    </div>

                    <div className="my-1 border-t border-border/60" />

                    {/* Management & Profile */}
                    <div className="space-y-0.5">
                      <Link
                        href="/more/categories"
                        onClick={() => {
                          triggerHaptic("light");
                          setMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-all hover:bg-canvas active:scale-[0.98] active:bg-primary-soft/40 cursor-pointer"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink border border-border/70">
                          <Grid2x2 size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-ink leading-tight">Categories</p>
                          <p className="text-[11px] text-muted leading-tight truncate">Manage expense tags</p>
                        </div>
                      </Link>

                      {/* Payment Methods option - commented out
                      <Link
                        href="/more/payment-methods"
                        onClick={() => {
                          triggerHaptic("light");
                          setMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-all hover:bg-canvas active:scale-[0.98] active:bg-primary-soft/40 cursor-pointer"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink border border-border/70">
                          <CreditCard size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-ink leading-tight">Payment Methods</p>
                          <p className="text-[11px] text-muted leading-tight truncate">UPI, Cash & Bank</p>
                        </div>
                      </Link>
                      */}

                      <Link
                        href="/more/business"
                        onClick={() => {
                          triggerHaptic("light");
                          setMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-all hover:bg-canvas active:scale-[0.98] active:bg-primary-soft/40 cursor-pointer"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink border border-border/70">
                          {business.accountKind === "individual" ? <User size={16} /> : <Store size={16} />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-ink leading-tight">
                            {business.accountKind === "individual" ? "Personal Profile" : "Business Details"}
                          </p>
                          <p className="text-[11px] text-muted leading-tight truncate">
                            {business.userName || business.name || "Manage account"}
                          </p>
                        </div>
                      </Link>
                    </div>

                    <div className="my-1 border-t border-border/60" />

                    {/* App Settings & More */}
                    <div className="space-y-0.5">
                      <Link
                        href="/more/settings"
                        onClick={() => {
                          triggerHaptic("light");
                          setMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-all hover:bg-canvas active:scale-[0.98] active:bg-primary-soft/40 cursor-pointer"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink border border-border/70">
                          <Settings size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-ink leading-tight">Settings</p>
                          <p className="text-[11px] text-muted leading-tight truncate">Theme, reminders & sync</p>
                        </div>
                      </Link>

                      <Link
                        href="/more/help"
                        onClick={() => {
                          triggerHaptic("light");
                          setMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-all hover:bg-canvas active:scale-[0.98] active:bg-primary-soft/40 cursor-pointer"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink border border-border/70">
                          <HelpCircle size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-ink leading-tight">Help & Support</p>
                          <p className="text-[11px] text-muted leading-tight truncate">Guides, FAQs & contact</p>
                        </div>
                      </Link>

                      {/* All Options - commented out
                      <Link
                        href="/more"
                        onClick={() => {
                          triggerHaptic("light");
                          setMobileMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl p-2 text-left transition-all hover:bg-canvas active:scale-[0.98] active:bg-primary-soft/40 cursor-pointer"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink border border-border/70">
                          <LayoutGrid size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-semibold text-ink leading-tight">All Options</p>
                          <p className="text-[11px] text-muted leading-tight truncate">Open full menu</p>
                        </div>
                      </Link>
                      */}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mx-5 mt-4 flex items-center justify-between rounded-2xl bg-mint-soft px-5 py-4 shadow-xs"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-mint">Today</p>
            <p className="mt-1 text-3xl font-semibold text-ink">
              <AnimatedNumber value={todayTotal} />
            </p>
            <p className="text-sm text-muted">spent so far</p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.04, 1], y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative flex h-24 w-24 shrink-0 items-center justify-center -my-2"
          >
            <Image
              src="/Assets/Home/teal-wallet-chart.webp"
              alt="Today's spend"
              width={100}
              height={100}
              className="h-full w-full object-contain select-none pointer-events-none opacity-75"
              priority
            />
          </motion.div>
        </motion.div>

        <div className="mx-5 mt-4">
          <HisabInput />
        </div>

        <div className="mt-6 flex items-center justify-between px-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Today&rsquo;s entries</p>
          <Link
            href="/entries"
            onClick={() => triggerHaptic("light")}
            className="text-sm font-medium text-primary hover:underline active:opacity-75"
          >
            View all
          </Link>
        </div>

        <div className="mt-2">
          {todays.length === 0 ? (
            <div className="px-5">
              <EmptyState
                title="Your Hisab starts here."
                subtitle="Nothing recorded today. Tell me what you spent."
              />
            </div>
          ) : (
            <div className="mx-5 overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
              <AnimatePresence initial={false}>
                {todays.slice(0, PREVIEW_COUNT).map((tx) => (
                  <motion.div
                    key={tx.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  >
                    <TransactionRow
                      tx={tx}
                      entityName={entityLabel(entities, tx.entityId)}
                      onClick={() => setSelectedTxId(tx.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {todays.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-5 mt-4 mb-6 flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 shadow-xs"
          >
            <div>
              <p className="text-sm text-muted">Today&rsquo;s total</p>
              <p className="text-2xl font-semibold text-ink">
                <AnimatedNumber value={todayTotal} />
              </p>
            </div>
            <span className="rounded-full bg-mint-soft px-3 py-1.5 text-sm font-medium text-mint">
              {todays.length} {todays.length === 1 ? "expense" : "expenses"}
            </span>
          </motion.div>
        )}
      </PageTransition>

      <div className="hidden lg:block">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">{greeting()}, {business.userName || business.name || "Hisab User"} 👋</h1>
            <p className="mt-1 text-sm text-muted">Here&rsquo;s your Hisab</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Desktop Parsing Engine Switcher */}
            <div className="flex items-center rounded-full border border-border bg-surface p-1 shadow-2xs">
              {PARSING_MODES.map((mode) => {
                const active = parsingMode === mode.value;
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.value}
                    type="button"
                    title={mode.label}
                    onClick={() => {
                      triggerHaptic("medium");
                      setParsingMode(mode.value);
                    }}
                    className={`relative flex items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 xl:px-3 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer select-none ${
                      active ? "text-white" : "text-muted hover:text-ink"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="desktop-parsing-pill"
                        className="absolute inset-0 rounded-full bg-primary shadow-xs"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">
                      <Icon size={14} className={active ? "text-white" : "text-muted"} />
                    </span>
                    <span className="relative z-10 hidden xl:inline">{mode.label}</span>
                  </button>
                );
              })}
            </div>

            <span className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-ink shadow-2xs">
              <CalendarDays size={16} className="text-muted" />
              {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-canvas hover:text-ink"
            >
              <Bell size={17} />
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic("light");
                setShowAddSheet(true);
              }}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
            >
              <Plus size={16} />
              Add expense
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-[1fr_320px] items-start gap-6">
          <div className="min-w-0">
            <Card className="p-6 shadow-xs">
              <div className="flex items-center gap-8">
                <div className="shrink-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Today&rsquo;s spend</p>
                  <p className="mt-2 text-3xl font-semibold text-ink">
                    <AnimatedNumber value={todayTotal} />
                  </p>
                  <p className="text-sm text-muted">spent so far</p>
                  {vsYesterdayPct !== null && (
                    <p className={`mt-1 text-xs font-medium ${vsYesterdayPct >= 0 ? "text-mint" : "text-rose"}`}>
                      {vsYesterdayPct >= 0 ? "↑" : "↓"} {Math.abs(vsYesterdayPct)}%{" "}
                      {vsYesterdayPct >= 0 ? "more" : "less"} than yesterday
                    </p>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <HomeSpendChart points={desktopData.trend} />
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm text-ink">
                    <span className="font-semibold">{todays.length}</span> {todays.length === 1 ? "expense" : "expenses"}
                  </p>
                  <p className="mt-2 text-xs text-muted">Avg. expense</p>
                  <p className="text-sm font-semibold text-ink">{formatRupees(avgExpense)}</p>
                </div>
              </div>
            </Card>

            <Card className="mt-5 border-primary/30 p-6 shadow-xs">
              <p className="mb-3 text-base font-semibold text-ink">What did you spend?</p>
              <HisabInput />
            </Card>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Today&rsquo;s entries</p>
                <Link href="/entries" className="text-sm font-medium text-primary hover:underline">
                  View all entries
                </Link>
              </div>
              <Card className="overflow-hidden shadow-xs">
                <DesktopEntryTable
                  transactions={todays}
                  entities={entities}
                  onSelect={setSelectedTxId}
                  emptyTitle="Your Hisab starts here."
                  emptySubtitle="Nothing recorded today. Tell me what you spent."
                />
              </Card>
              {todays.length > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-surface px-6 py-4 shadow-xs">
                  <p className="text-base font-semibold text-ink">Today&rsquo;s total</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-semibold text-ink">
                      <AnimatedNumber value={todayTotal} />
                    </p>
                    <span className="rounded-full bg-mint-soft px-3 py-1.5 text-sm font-medium text-mint">
                      {todays.length} {todays.length === 1 ? "expense" : "expenses"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <Card className="p-5 shadow-xs">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                <Lightbulb size={16} className="text-amber" />
                Quick insight
              </p>
              {desktopData.insightCards[0] ? (
                <>
                  <p className="mt-3 text-sm text-ink">{desktopData.insightCards[0].title}.</p>
                  <p className="mt-1 text-sm text-muted">{desktopData.insightCards[0].body}</p>
                  <Link
                    href="/insights"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    View insight <ArrowRight size={14} />
                  </Link>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  Add a few more expenses and Hisab will start spotting patterns here.
                </p>
              )}
            </Card>

            <Card className="p-5 shadow-xs">
              <p className="text-sm font-semibold text-ink">Top category today</p>
              {desktopData.topCategory && TopCategoryIcon ? (
                <div className="mt-3 flex items-center gap-4">
                  <div
                    className="relative h-16 w-16 shrink-0 rounded-full"
                    style={{ backgroundImage: conicGradient(desktopData.todaySlices) }}
                  >
                    <div className="absolute inset-[22%] rounded-full bg-surface" />
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                      <TopCategoryIcon size={15} style={{ color: desktopData.topCategory.fg }} />
                      <span className="truncate">{desktopData.topCategory.label}</span>
                    </p>
                    <p className="mt-1 text-base font-semibold text-ink">
                      {formatRupees(desktopData.topCategory.amount)}
                    </p>
                    <p className="text-xs text-muted">{desktopData.topCategory.pct}% of total</p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">No categorized expenses yet today.</p>
              )}
            </Card>

            <Card className="p-5 shadow-xs">
              <p className="text-sm font-semibold text-ink">Recent activity</p>
              {todays.length === 0 ? (
                <p className="mt-3 text-sm text-muted">Nothing recorded yet today.</p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {todays.slice(0, 3).map((tx) => {
                    const isEntity = Boolean(tx.entityId);
                    const label = isEntity
                      ? entityLabel(entities, tx.entityId) ?? tx.description
                      : tx.name || getCategory(categories, tx.categoryId).label;
                    const actionLabel = tx.source === "settlement" ? "Settlement added" : "Expense added";
                    return (
                      <li key={tx.id} className="flex gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-mint" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink">{actionLabel}</p>
                          <p className="truncate text-xs text-muted">
                            {label} · {formatRupees(tx.amount)} · {formatTime(tx.createdAt)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <Link
                href="/entries"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                View all activity <ArrowRight size={14} />
              </Link>
            </Card>
          </div>
        </div>
      </div>

      <TransactionDetailSheet txId={selectedTxId} onClose={() => setSelectedTxId(null)} />

      <Sheet open={showAddSheet} onClose={() => setShowAddSheet(false)}>
        <p className="mb-3 text-base font-semibold text-ink">Add an expense</p>
        <HisabInput onAdded={() => setShowAddSheet(false)} />
      </Sheet>

      <ReceiptScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
      />
    </>
  );
}
