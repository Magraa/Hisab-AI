"use client";

import { useEffect, type ReactNode } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
import { triggerHaptic } from "@/lib/haptics";

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
    triggerHaptic("light");
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 90 || info.velocity.y > 400) {
      triggerHaptic("light");
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Animated backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Animated bottom drawer with drag down */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 340,
              mass: 0.8,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            className="relative z-10 max-h-[85vh] w-full max-w-[440px] overflow-y-auto rounded-t-3xl bg-surface px-5 pb-8 pt-3 shadow-2xl touch-pan-y"
          >
            <div className="mx-auto mb-4 h-1.5 w-10 cursor-grab active:cursor-grabbing rounded-full bg-border" />
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

