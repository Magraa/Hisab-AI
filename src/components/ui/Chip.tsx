"use client";

import { useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { triggerHaptic } from "@/lib/haptics";

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
  align = "left",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left?: number; right?: number }>({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value) ?? options[0];
  const isDefault = value === options[0]?.value;

  useEffect(() => {
    setMounted(true);
  }, []);

  function updatePosition() {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const isRightAligned = align === "right" || rect.left + 170 > window.innerWidth;
    if (isRightAligned) {
      setCoords({
        top: rect.bottom + 6,
        right: Math.max(8, window.innerWidth - rect.right),
      });
    } else {
      setCoords({
        top: rect.bottom + 6,
        left: Math.max(8, rect.left),
      });
    }
  }

  function handleToggle() {
    triggerHaptic("light");
    if (!open) {
      updatePosition();
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!open) return;

    function handleScrollOrResize() {
      updatePosition();
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, align]);

  return (
    <>
      <motion.button
        ref={buttonRef}
        whileTap={{ scale: 0.96 }}
        type="button"
        onClick={handleToggle}
        aria-label={label}
        aria-expanded={open}
        className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors shadow-2xs ${
          !isDefault
            ? "border-primary bg-primary-soft text-primary font-semibold shadow-xs"
            : "border-border bg-surface text-muted hover:text-ink"
        }`}
      >
        <span className="whitespace-nowrap">{selectedOption?.label ?? label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center"
        >
          <ChevronDown size={14} className={!isDefault ? "text-primary" : "text-subtle"} />
        </motion.span>
      </motion.button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Transparent backdrop overlay for instant click dismissal */}
                <div
                  className="fixed inset-0 z-[9990] bg-transparent"
                  onClick={() => setOpen(false)}
                />

                {/* Floating portal dropdown menu */}
                <motion.div
                  ref={menuRef}
                  initial={{ opacity: 0, scale: 0.9, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -6 }}
                  transition={{ type: "spring", stiffness: 450, damping: 26 }}
                  style={{
                    position: "fixed",
                    top: `${coords.top}px`,
                    ...(coords.left !== undefined ? { left: `${coords.left}px` } : {}),
                    ...(coords.right !== undefined ? { right: `${coords.right}px` } : {}),
                  }}
                  className="z-[9999] min-w-[160px] max-h-64 overflow-y-auto rounded-2xl border border-border bg-surface p-1.5 shadow-2xl backdrop-blur-md"
                >
                  <div className="flex flex-col gap-0.5">
                    {options.map((option) => {
                      const isSelected = option.value === value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            triggerHaptic("light");
                            onChange(option.value);
                            setOpen(false);
                          }}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                            isSelected
                              ? "bg-primary-soft font-semibold text-primary"
                              : "text-ink hover:bg-canvas active:bg-primary-soft/50"
                          }`}
                        >
                          <span className="truncate">{option.label}</span>
                          {isSelected && <Check size={14} className="shrink-0 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}


