const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatRupees(amount: number): string {
  return currencyFormatter.format(Math.round(amount));
}

const plainNumberFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

// jsPDF's built-in fonts (Helvetica etc.) don't include the ₹ glyph — it
// silently renders as a mangled superscript character. Use "Rs." instead of
// the symbol anywhere text goes into a generated PDF.
export function formatRupeesPlain(amount: number): string {
  return `Rs. ${plainNumberFormatter.format(Math.round(amount))}`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDayHeading(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const dayMonthYear = date
    .toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();

  if (isSameDay(date, today)) return `TODAY · ${dayMonthYear}`;
  if (isSameDay(date, yesterday)) return `YESTERDAY · ${dayMonthYear}`;
  return dayMonthYear;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function dateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
