"use client";
import { motion, useReducedMotion } from "framer-motion";
import ReactMarkdown from "react-markdown";

function scoreColor(score: number) {
  if (score >= 80) return "#30d158";
  if (score >= 50) return "#ff9f0a";
  return "#ff453a";
}

/** Renders an AI report: an animated score ring when a score exists, then the markdown body. */
export default function Report({
  title,
  report,
  score,
  onReset,
  resetLabel,
}: {
  title: string;
  report: string;
  score: number | null;
  onReset: () => void;
  resetLabel: string;
}) {
  const reduce = useReducedMotion();
  const color = score === null ? "#a1a1a6" : scoreColor(score);
  const R = 34;
  const C = 2 * Math.PI * R;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-[28px] p-7 sm:p-10"
    >
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-line pb-8">
        <div>
          <p className="text-[13px] font-semibold text-muted">דוח ניתוח</p>
          <h2 className="mt-1 text-[28px] font-bold tracking-tight">{title}</h2>
        </div>
        {score !== null && (
          <div className="relative h-[84px] w-[84px] shrink-0" aria-label={`ציון ${score} מתוך 100`}>
            <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
              <circle cx="42" cy="42" r={R} fill="none" stroke="#2c2c2e" strokeWidth="7" />
              <motion.circle
                cx="42"
                cy="42"
                r={R}
                fill="none"
                stroke={color}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: reduce ? C - (C * score) / 100 : C }}
                animate={{ strokeDashoffset: C - (C * score) / 100 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center text-[24px] font-bold tabular-nums" style={{ color }}>
              {score}
            </span>
          </div>
        )}
      </div>

      <div className="report">
        <ReactMarkdown>{report}</ReactMarkdown>
      </div>

      <button
        onClick={onReset}
        className="mt-10 cursor-pointer rounded-full bg-surface-2 px-6 py-2.5 text-[15px] font-medium text-ink transition hover:bg-[#2c2c2e]"
      >
        {resetLabel}
      </button>
    </motion.section>
  );
}
