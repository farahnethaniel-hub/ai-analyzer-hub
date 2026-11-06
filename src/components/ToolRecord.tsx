"use client";
import { useRef, useState, type KeyboardEvent } from "react";

/** What each tool takes and the report sections it writes, read from the API prompts. */
const records = [
  {
    id: "cv",
    name: "CV Analyzer",
    short: "קורות חיים",
    inputs: ["קובץ PDF של קורות החיים", "תיאור המשרה"],
    sections: ["סיכום", "חוזקות", "פערים מול המשרה", "המלצות לשיפור קורות החיים"],
  },
  {
    id: "repo",
    name: "Repo Analyzer",
    short: "GitHub",
    inputs: ["קישור לריפו ציבורי ב-GitHub"],
    sections: ["סיכום", "ארכיטקטורה ומבנה", "איכות קוד", "סיכונים ובאגים אפשריים", "המלצות לשיפור"],
  },
  {
    id: "instagram",
    name: "Instagram Analyzer",
    short: "אינסטגרם",
    inputs: ["שם משתמש", "תחום העסק", "הביו הנוכחי", "תיאור התוכן"],
    sections: ["רושם ראשוני", "ביו ומיצוב", "אסטרטגיית תוכן", "חוזקות", "נקודות לשיפור", "ביו מוצע"],
  },
];

export default function ToolRecord() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    // RTL: the arrow that points toward the next tab is ArrowLeft
    const step = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + records.length) % records.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const r = records[active];

  return (
    <figure className="record" aria-label="מה כל כלי מקבל ומה הוא מחזיר">
      <div className="record__tabs" role="tablist" aria-label="בחירת כלי" onKeyDown={onKey}>
        {records.map((rec, i) => (
          <button
            key={rec.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${rec.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${rec.id}`}
            tabIndex={i === active ? 0 : -1}
            className="record__tab"
            onClick={() => setActive(i)}
          >
            <span className="record__tab-full ltr">{rec.name}</span>
            <span className="record__tab-short">{rec.short}</span>
          </button>
        ))}
      </div>

      <div key={r.id} className="record__panel" role="tabpanel" id={`panel-${r.id}`} aria-labelledby={`tab-${r.id}`}>
        <div className="record__row">
          <p className="record__label record__label--person">מה נותנים</p>
          <ul className="record__inputs">
            {r.inputs.map((input) => (
              <li key={input} className="chip">
                {input}
              </li>
            ))}
          </ul>
        </div>
        <div className="record__row">
          <p className="record__label record__label--instrument">מה מקבלים</p>
          <ol className="record__sections">
            {r.sections.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
        <div className="record__row">
          <p className="record__label record__label--instrument">ציון</p>
          <p className="record__score">
            מספר שלם בין <span className="measured">0</span> ל-<span className="measured">100</span>
          </p>
        </div>
      </div>
    </figure>
  );
}
