import Link from "next/link";
import { FileText, Github, Instagram, ScanSearch, Sparkles, Upload } from "lucide-react";
import ToolRecord from "@/components/ToolRecord";

const tools = [
  {
    title: "CV Analyzer",
    tag: "קורות חיים",
    icon: <FileText size={24} strokeWidth={1.6} aria-hidden="true" />,
    desc: "מעלים קורות חיים ותיאור משרה, ומקבלים ציון התאמה, פערים והמלצות לשיפור.",
    link: "/cv-analyzer",
  },
  {
    title: "Repo Analyzer",
    tag: "GitHub",
    icon: <Github size={24} strokeWidth={1.6} aria-hidden="true" />,
    desc: "Code Review אוטומטי לריפו: ארכיטקטורה, איכות קוד, סיכונים וציון.",
    link: "/repo-analyzer",
  },
  {
    title: "Instagram Analyzer",
    tag: "אינסטגרם",
    icon: <Instagram size={24} strokeWidth={1.6} aria-hidden="true" />,
    desc: "ניתוח מיתוג ותוכן לחשבון עסקי, עם נקודות לשיפור וביו מוצע.",
    link: "/instagram-analyzer",
  },
];

const steps = [
  { icon: <Upload size={18} strokeWidth={1.6} aria-hidden="true" />, title: "מעלים", text: "קובץ, קישור או כמה שורות על העסק." },
  { icon: <ScanSearch size={18} strokeWidth={1.6} aria-hidden="true" />, title: "מנתחים", text: "Gemini קורא את החומר ומשווה אותו לסטנדרט מקצועי." },
  { icon: <Sparkles size={18} strokeWidth={1.6} aria-hidden="true" />, title: "משפרים", text: "ציון ברור, חוזקות, פערים והמלצות שאפשר ליישם היום." },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <h1>
              ניתוח מקצועי.
              <br />
              בלי ניחושים.
            </h1>
            <p className="lead hero__lead">
              שלושה כלי AI במקום אחד: קורות חיים מול משרה, Code Review לפרויקטים, וניתוח חשבון אינסטגרם עסקי.
            </p>
            <div className="hero__actions">
              <Link href="/cv-analyzer" className="btn btn--primary">
                נסו את CV Analyzer
              </Link>
              <Link href="#tools" className="btn">
                לכלים
              </Link>
            </div>
          </div>
          <ToolRecord />
        </div>
      </section>

      <section id="tools" className="tools">
        <div className="container">
          <h2 className="section-head">שלושה כלים. ממשק אחד.</h2>
          <div className="rows">
            {tools.map((tool) => (
              <Link key={tool.link} href={tool.link} className="row-link">
                <div>
                  <h3 className="row-link__name">
                    {tool.icon}
                    <span>{tool.title}</span>
                  </h3>
                  <p className="row-link__tag">{tool.tag}</p>
                </div>
                <p className="row-link__desc">{tool.desc}</p>
                <span className="row-link__action">פתיחת הכלי</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="steps-band">
        <div className="container steps-band__grid">
          <h2>איך זה עובד</h2>
          <ol className="steps">
            {steps.map((s) => (
              <li key={s.title} className="step">
                <h3>
                  <span className="step__icon">{s.icon}</span>
                  {s.title}
                </h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
