/**
 * Haptic feedback utility using Web Vibration API where supported (primarily Android Chrome/PWA,
 * safe no-op on desktop or unsupported iOS Safari).
 */
export function triggerHaptic(type: "light" | "medium" | "heavy" | "success" | "warning" = "light") {
  if (typeof window === "undefined" || !("navigator" in window) || !navigator.vibrate) {
    return;
  }

  try {
    switch (type) {
      case "light":
        navigator.vibrate(10);
        break;
      case "medium":
        navigator.vibrate(20);
        break;
      case "heavy":
        navigator.vibrate(35);
        break;
      case "success":
        navigator.vibrate([15, 60, 25]);
        break;
      case "warning":
        navigator.vibrate([25, 40, 25]);
        break;
    }
  } catch {
    // Ignore any browser vibration permission or device issues
  }
}
