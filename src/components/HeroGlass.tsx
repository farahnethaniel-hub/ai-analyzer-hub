"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * A soft light behind the hero that follows the pointer across the hero area.
 * Transform-only animation (no blur filters at runtime) so it stays smooth.
 */
export default function HeroGlass() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 70, damping: 20, mass: 0.8 });
  const y = useSpring(rawY, { stiffness: 70, damping: 20, mass: 0.8 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Offset from the hero centre, clamped so the light stays inside the hero.
      const dx = Math.max(-r.width / 2, Math.min(r.width / 2, e.clientX - (r.left + r.width / 2)));
      const dy = Math.max(-r.height / 2, Math.min(r.height / 2, e.clientY - (r.top + r.height / 2)));
      rawX.set(dx * 0.85);
      rawY.set(dy * 0.85);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rawX, rawY, reduce]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="h-[560px] w-[560px] rounded-full"
          style={{
            x,
            y,
            willChange: "transform",
            background:
              "radial-gradient(circle at 50% 50%, rgba(41,151,255,0.32) 0%, rgba(94,92,230,0.18) 35%, rgba(0,0,0,0) 70%)",
          }}
        />
      </div>
      {/* thin horizon line, the way Apple product pages frame a hero */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}
