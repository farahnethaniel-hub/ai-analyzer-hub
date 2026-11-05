"use client";
import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";

/**
 * Floating frosted-glass shapes behind the hero. They drift slowly and lean
 * toward the pointer at different depths, which gives the scene its 3D feel.
 */
const SHAPES = [
  { size: 340, top: "6%", right: "8%", depth: 40, radius: "42% 58% 55% 45% / 48% 42% 58% 52%", from: "#c9e2ff", to: "#e8dcff", delay: 0 },
  { size: 220, top: "48%", right: "70%", depth: 70, radius: "50%", from: "#ffe3ef", to: "#dfe9ff", delay: 1.5 },
  { size: 160, top: "62%", right: "18%", depth: 100, radius: "36% 64% 40% 60% / 55% 45% 55% 45%", from: "#d6f5ec", to: "#d9e6ff", delay: 0.8 },
];

function Shape({ s, mx, my }: { s: (typeof SHAPES)[number]; mx: MotionValue<number>; my: MotionValue<number> }) {
  const x = useTransform(mx, (v: number) => v * s.depth);
  const y = useTransform(my, (v: number) => v * s.depth);
  const reduce = useReducedMotion();
  return (
    <motion.div className="absolute" style={{ top: s.top, right: s.right, x, y }}>
      <motion.div
        animate={reduce ? undefined : { y: [0, -18, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        style={{
          width: s.size,
          height: s.size,
          borderRadius: s.radius,
          background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -20px 40px rgba(255,255,255,0.35), 0 30px 60px -20px rgba(0,60,140,0.18)",
          opacity: 0.85,
        }}
      />
    </motion.div>
  );
}

export default function HeroGlass() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 20 });
  const my = useSpring(rawY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * -1);
      rawY.set((e.clientY / window.innerHeight - 0.5) * -1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [rawX, rawY]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {SHAPES.map((s, i) => (
        <Shape key={i} s={s} mx={mx} my={my} />
      ))}
      {/* frosted veil so the shapes read as depth behind glass */}
      <div className="absolute inset-0 backdrop-blur-[2px]" />
    </div>
  );
}
