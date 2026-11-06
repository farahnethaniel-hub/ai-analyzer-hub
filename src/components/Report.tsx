"use client";
import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";

function meterTone(score: number) {
  if (score >= 80) return "meter__fill meter__fill--ok";
  if (score < 50) return "meter__fill meter__fill--bad";
  return "meter__fill";
}

/** Renders a report: the score as a reading with a meter that draws once, then the markdown body. */
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
  return (
    <section className="report-card" aria-label="דוח ניתוח">
      <div className="report-card__head">
        <h2 className="report-card__title">{title}</h2>
        {score !== null && (
          <>
            <p className="reading ltr" aria-label={`ציון ${score} מתוך 100`}>
              <span className="reading__value">{score}</span>
              <span className="reading__unit">/100</span>
            </p>
            <div className="meter" aria-hidden="true">
              <div className={meterTone(score)} style={{ "--v": score / 100 } as CSSProperties} />
            </div>
          </>
        )}
      </div>

      <div className="report-card__body report">
        <ReactMarkdown>{report}</ReactMarkdown>
      </div>

      <div className="report-card__foot">
        <button type="button" onClick={onReset} className="btn">
          {resetLabel}
        </button>
      </div>
    </section>
  );
}
