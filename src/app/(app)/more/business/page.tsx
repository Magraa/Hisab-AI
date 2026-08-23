"use client";

import { useState } from "react";
import { Sparkles, Shuffle, RotateCcw } from "lucide-react";
import { useHisab } from "@/lib/store";
import { SubPageHeader } from "@/components/layout/SubPageHeader";
import { InitialsBadge } from "@/components/ui/IconBadge";
import { getAvatarForName, getRandomAvatar, AVATAR_LIST } from "@/lib/avatars";
import type { AccountKind } from "@/lib/types";

const BUSINESS_TYPES = ["Retail", "Manufacturing", "Food & Beverages", "Trading", "Services", "Other"];
const CURRENCIES = [{ value: "INR", label: "₹ INR" }];

export default function BusinessSettingsPage() {
  const { business, updateBusiness } = useHisab();
  const [accountKind, setAccountKind] = useState<AccountKind>(business.accountKind);
  const [name, setName] = useState(business.name);
  const [userName, setUserName] = useState(business.userName || "");
  const [customAvatar, setCustomAvatar] = useState<string | null>(business.avatar || null);
  const [type, setType] = useState(business.type);
  const [saved, setSaved] = useState(false);

  const isIndividual = accountKind === "individual";
  const effectiveName = (userName.trim() || name.trim() || "Hisab User");
  const autoAvatarObj = getAvatarForName(effectiveName);
  const activeAvatarObj = customAvatar
    ? AVATAR_LIST.find((a) => a.path === customAvatar) || autoAvatarObj
    : autoAvatarObj;

  function handleShuffleAvatar() {
    const random = getRandomAvatar();
    setCustomAvatar(random.path);
  }

  function handleResetAvatar() {
    setCustomAvatar(null);
  }

  function save() {
    const cleanUserName = userName.trim() || (isIndividual ? (name.trim() || "Hisab User") : (business.userName || "Hisab User"));
    const cleanBusinessName = isIndividual ? cleanUserName : (name.trim() || business.name || "My Business");

    updateBusiness({
      name: cleanBusinessName,
      userName: cleanUserName,
      avatar: customAvatar || undefined,
      type: isIndividual ? "Individual" : type,
      currency: "INR",
      accountKind,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="pb-8">
      <SubPageHeader title={isIndividual ? "Your Details" : "Business Details"} />

      <div className="mx-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Account type</span>
          <div className="inline-flex rounded-full border border-border bg-surface p-1">
            {(["business", "individual"] as AccountKind[]).map((kind) => (
              <button
                key={kind}
                onClick={() => setAccountKind(kind)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold ${
                  accountKind === kind ? "bg-primary text-white" : "text-muted"
                }`}
              >
                {kind === "business" ? "Business" : "Individual"}
              </button>
            ))}
          </div>
        </div>

        {!isIndividual ? (
          <>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Business name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sharma Traders"
                className="rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-ink outline-none focus:border-primary"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Your name
              </span>
              <input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Hisab User"
                className="rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-ink outline-none focus:border-primary"
              />
            </label>
          </>
        ) : (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Your name
            </span>
            <input
              value={userName || name}
              onChange={(e) => {
                setUserName(e.target.value);
                setName(e.target.value);
              }}
              placeholder="Hisab User"
              className="rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-ink outline-none focus:border-primary"
            />
          </label>
        )}

        {/* Assigned Avatar Section */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Your Avatar
          </span>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-2xs">
            <InitialsBadge
              name={effectiveName}
              avatarUrl={customAvatar || activeAvatarObj.path}
              size={64}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-ink">
                {activeAvatarObj.name}
              </p>
              <p className="text-xs text-muted">
                {customAvatar ? "Custom mascot avatar" : `Auto-assigned for ${effectiveName}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShuffleAvatar}
                aria-label="Shuffle avatar"
                title="Shuffle avatar"
                className="flex items-center gap-1 rounded-xl border border-border bg-canvas px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-primary-soft hover:text-primary active:scale-95"
              >
                <Shuffle size={13} />
                Shuffle
              </button>
              {customAvatar && (
                <button
                  type="button"
                  onClick={handleResetAvatar}
                  aria-label="Reset to default avatar"
                  title="Reset to default"
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-canvas text-muted transition-colors hover:bg-primary-soft hover:text-primary active:scale-95"
                >
                  <RotateCcw size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {!isIndividual && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">Business type</span>
            <div className="grid grid-cols-2 gap-2">
              {BUSINESS_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-xl border py-3 text-sm font-medium ${
                    type === t ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Currency</span>
          <select
            defaultValue="INR"
            disabled
            className="rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-ink opacity-70 outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <button onClick={save} className="mt-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white">
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
