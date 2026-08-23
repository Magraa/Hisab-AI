"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue } from "motion/react";
import { formatRupees } from "@/lib/format";

interface AnimatedNumberProps {
  value: number;
  format?: (val: number) => string;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  format = formatRupees,
  className = "",
  duration = 0.6,
}: AnimatedNumberProps) {
  const motionVal = useMotionValue(value);
  const [displayValue, setDisplayValue] = useState(() => format(value));

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration,
      ease: [0.16, 1, 0.3, 1], // snappy native spring-like ease
      onUpdate: (latest) => {
        setDisplayValue(format(latest));
      },
    });

    return () => controls.stop();
  }, [value, duration, format, motionVal]);

  return <span className={className}>{displayValue}</span>;
}
