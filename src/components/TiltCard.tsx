"use client";
import type { ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

/** A card that leans gently toward the pointer, with a faint light that follows it. */
export default function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), spring);
  const lx = useTransform(px, (v: number) => `${v * 100}%`);
  const ly = useTransform(py, (v: number) => `${v * 100}%`);
  const light = useMotionTemplate`radial-gradient(420px circle at ${lx} ${ly}, rgba(255,255,255,0.07), transparent 60%)`;

  return (
    <div style={{ perspective: 1200 }} className="h-full">
      <motion.div
        onPointerMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={reduce ? undefined : { rotateX, rotateY, willChange: "transform" }}
        className={`glass relative h-full overflow-hidden rounded-[28px] transition-colors duration-300 hover:border-white/20 ${className}`}
      >
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: light }} />
        <div className="relative">{children}</div>
      </motion.div>
    </div>
  );
}
