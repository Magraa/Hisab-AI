"use client";

import { useEffect, type ReactNode } from "react";

export function Sheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-h-[85vh] w-full max-w-[440px] overflow-y-auto rounded-t-3xl bg-surface px-5 pb-8 pt-3 shadow-2xl">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
        {children}
      </div>
    </div>
  );
}
