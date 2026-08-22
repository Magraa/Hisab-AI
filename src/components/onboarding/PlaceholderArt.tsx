import { Image as ImageIcon } from "lucide-react";
import { onboarding as theme } from "./theme";

export function PlaceholderArt({
  label,
  className = "",
  height = 160,
}: {
  label: string;
  className?: string;
  height?: number;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-center ${className}`}
      style={{ height, borderColor: theme.border, backgroundColor: "#F1EDE1" }}
    >
      <ImageIcon size={26} style={{ color: "#A8B3A2" }} />
      <span className="px-6 text-xs font-medium" style={{ color: "#8B9385" }}>
        {label}
      </span>
    </div>
  );
}
