import type { ButtonHTMLAttributes } from "react";

export function Chip({
  active,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={`tap-active whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-primary bg-primary-soft text-primary font-semibold shadow-xs"
          : "border-border bg-surface text-muted"
      } ${className}`}
      {...props}
    />
  );
}

export function SelectChip({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  const isDefault = value === options[0]?.value;
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none rounded-full border px-3.5 py-2 pr-7 text-sm font-medium ${
          isDefault ? "border-border bg-surface text-muted" : "border-primary bg-primary-soft text-primary"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs">▾</span>
    </div>
  );
}
