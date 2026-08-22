import type { LucideIcon } from "lucide-react";

export function IconBadge({
  icon: Icon,
  bg,
  fg,
  size = 44,
}: {
  icon: LucideIcon;
  bg: string;
  fg: string;
  size?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: bg }}
    >
      <Icon size={size * 0.45} color={fg} strokeWidth={2.2} />
    </div>
  );
}

export function InitialsBadge({ name, size = 44 }: { name: string; size?: number }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-semibold text-primary"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials || "?"}
    </div>
  );
}
