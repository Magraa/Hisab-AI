"use client";

import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { getAvatarForName } from "@/lib/avatars";

export function IconBadge({
  icon: Icon,
  imageSrc,
  bg,
  fg,
  size = 44,
}: {
  icon?: LucideIcon;
  imageSrc?: string;
  bg?: string;
  fg?: string;
  size?: number;
}) {
  const [imgErr, setImgErr] = useState(false);

  if (imageSrc && !imgErr) {
    return (
      <div
        className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/40 bg-surface shadow-2xs"
        style={{ width: size, height: size, backgroundColor: bg }}
      >
        <Image
          src={imageSrc}
          alt="Category mascot"
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setImgErr(true)}
          unoptimized
        />
      </div>
    );
  }

  if (!Icon) return null;

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: bg }}
    >
      <Icon size={size * 0.45} color={fg} strokeWidth={2.2} />
    </div>
  );
}

export function InitialsBadge({
  name,
  avatarUrl,
  size = 44,
  bg,
  fg,
  showAvatar = true,
}: {
  name: string;
  avatarUrl?: string;
  size?: number;
  bg?: string;
  fg?: string;
  showAvatar?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  const cleanName = (name || "").trim();
  const initials = cleanName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  const resolvedAvatar = avatarUrl || (showAvatar && cleanName ? getAvatarForName(cleanName).path : null);

  if (resolvedAvatar && !imgError) {
    return (
      <div
        className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/50 bg-surface shadow-2xs"
        style={{ width: size, height: size, backgroundColor: bg }}
      >
        <Image
          src={resolvedAvatar}
          alt={cleanName || "Avatar"}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${
        bg || fg ? "" : "bg-primary-soft text-primary"
      }`}
      style={{ width: size, height: size, fontSize: size * 0.38, backgroundColor: bg, color: fg }}
    >
      {initials || "?"}
    </div>
  );
}
