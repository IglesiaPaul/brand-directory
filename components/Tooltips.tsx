// components/Tooltip.tsx
import { ReactNode, useEffect, useId, useState } from "react";

/**
 * Accessible tooltip:
 * - Desktop: shows on hover or keyboard focus.
 * - Mobile (touch devices): disabled (returns children only).
 */
export default function Tooltip({
  label,
  children,
  disabled,
  side = "top",
}: {
  label: string;
  children: ReactNode;
  disabled?: boolean;
  side?: "top" | "bottom";
}) {
  const [isTouch, setIsTouch] = useState(false);
  const tid = useId();

  useEffect(() => {
    const mq = window.matchMedia?.("(pointer: coarse)");
    setIsTouch(mq?.matches ?? false);
  }, []);

  const off = disabled || isTouch;

  if (off) {
    return <span>{children}</span>;
  }

  // Position classes
  const pos =
    side === "top"
      ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
      : "top-full mt-2 left-1/2 -translate-x-1/2";

  return (
    <span className="relative inline-flex group focus-within:outline-none" aria-describedby={tid}>
      {children}
      <span
        id={tid}
        role="tooltip"
        className={`pointer-events-none absolute ${pos} z-20 whitespace-nowrap rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 shadow-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150`}
      >
        {label}
      </span>
    </span>
  );
}
