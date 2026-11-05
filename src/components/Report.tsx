"use client";
import ReactMarkdown from "react-markdown";

function scoreColor(score: number) {
  if (score >= 80) return "#4ade80";
  if (score >= 50) return "#facc15";
  return "#f87171";
}

/** Renders an AI report: a score ring when a score exists, then the markdown body. */
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
  const color = score === null ? "#a3a3a3" : scoreColor(score);
  const ring = score === null ? 0 : score;

  return (
    <section className="rounded-3xl border border-white/10 bg-[#111] p-6 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">דוח ניתוח</p>
          <h2 className="mt-1 text-2xl font-bold">{title}</h2>
        </div>
        {score !== null && (
          <div
            className="grid h-20 w-20 shrink-0 place-items-center rounded-full"
            style={{ background: `conic-gradient(${color} ${ring * 3.6}deg, #262626 0deg)` }}
            aria-label={`ציון ${score} מתוך 100`}
          >
            <div className="grid h-[68px] w-[68px] place-items-center rounded-full bg-[#111]">
              <span className="text-2xl font-extrabold tabular-nums" style={{ color }}>
                {score}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="report">
        <ReactMarkdown>{report}</ReactMarkdown>
      </div>

      <button
        onClick={onReset}
        className="mt-8 cursor-pointer rounded-full border border-white/15 px-6 py-2.5 text-sm font-bold text-neutral-300 transition hover:border-white/40 hover:text-white"
      >
        {resetLabel}
      </button>
    </section>
  );
}
