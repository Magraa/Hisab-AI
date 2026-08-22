// Best-effort "send to WhatsApp" helper. There is no browser API that can
// both target a specific phone number AND attach a file — Web Share API can
// attach a file but only opens the general share sheet (user picks the
// contact themselves), while a wa.me link can target the exact number but
// carries text only, no attachment. We try the file-share path first since
// it's the richer experience, and fall back to the targeted chat link.
export type WhatsAppResult = "shared" | "opened-chat" | "invalid-phone";

export function sanitizePhoneForWhatsApp(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 10) return null;
  // Assume a bare 10-digit number is Indian and missing its country code.
  return digits.length === 10 ? `91${digits}` : digits;
}

export async function sendStatementToWhatsApp(params: {
  phone: string;
  file: File;
  caption: string;
}): Promise<WhatsAppResult> {
  const digits = sanitizePhoneForWhatsApp(params.phone);
  if (!digits) return "invalid-phone";

  const canShareFiles =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [params.file] });

  if (canShareFiles) {
    try {
      await navigator.share({ files: [params.file], text: params.caption });
      return "shared";
    } catch {
      // User cancelled, or the share sheet failed — fall through to the
      // targeted chat link below rather than leaving them with nothing.
    }
  }

  const url = `https://wa.me/${digits}?text=${encodeURIComponent(params.caption)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  return "opened-chat";
}
