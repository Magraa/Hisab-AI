"use client";

import { useEffect } from "react";

/**
 * Safely guards Element.prototype.releasePointerCapture against NotFoundError
 * DOMExceptions thrown by Next.js devtools or gesture handlers when a pointer
 * capture has already been released or the element unmounted.
 */
export function PointerPatch() {
  useEffect(() => {
    if (typeof window === "undefined" || !Element.prototype.releasePointerCapture) return;

    const originalReleasePointerCapture = Element.prototype.releasePointerCapture;
    Element.prototype.releasePointerCapture = function (pointerId: number) {
      try {
        if (this.hasPointerCapture && !this.hasPointerCapture(pointerId)) {
          return;
        }
        originalReleasePointerCapture.call(this, pointerId);
      } catch {
        // Suppress NotFoundError when pointer capture is already released
      }
    };
  }, []);

  return null;
}
