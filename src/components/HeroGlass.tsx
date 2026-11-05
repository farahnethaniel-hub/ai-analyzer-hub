"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * One soft light behind the hero headline that drifts toward the pointer.
 * Transform-only animation (no blur filters at runtime) so it stays smooth.
 */
export default function HeroGlass() {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 40, damping: 18 });
  const y = useSpring(rawY, { stiffness: 40, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 80);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 50);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [rawX, rawY, reduce]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-[38%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x,
          y,
          willChange: "transform",
          background:
            "radial-gradient(circle at 50% 50%, rgba(41,151,255,0.28) 0%, rgba(94,92,230,0.16) 35%, rgba(0,0,0,0) 70%)",
        }}
      />
      {/* thin horizon line, the way Apple product pages frame a hero */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}
