import Link from "next/link";
import { ArrowLeft, FileText, Github, Instagram } from "lucide-react";

const tools = [
  {
    title: "CV Analyzer",
    icon: <FileText size={28} />,
    desc: "מעלים קורות חיים ותיאור משרה, ומקבלים ציון התאמה, פערים והמלצות לשיפור.",
    link: "/cv-analyzer",
  },
  {
    title: "Repo Analyzer",
    icon: <Github size={28} />,
    desc: "Code Review אוטומטי לריפו ב-GitHub: ארכיטקטורה, איכות קוד, סיכונים וציון.",
    link: "/repo-analyzer",
  },
  {
    title: "Instagram Analyzer",
    icon: <Instagram size={28} />,
    desc: "ניתוח מיתוג ותוכן לחשבון עסקי, עם נקודות לשיפור וביו מוצע.",
    link: "/instagram-analyzer",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24">
      <section className="flex flex-col items-center pt-20 pb-16 text-center">
        <p className="mb-4 rounded-full border border-white/10 px-4 py-1 text-sm text-neutral-400">מופעל על ידי Google Gemini</p>
        <h1 className="max-w-3xl bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-6xl">
          ניתוח מקצועי באמצעות AI
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-400">
          שלושה כלים במקום אחד: קורות חיים מול משרה, Code Review לפרויקטים, וניתוח חשבון אינסטגרם עסקי.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.link} href={tool.link} className="group block">
            <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-[#141414] p-7 transition hover:border-blue-500/60 hover:shadow-[0_0_40px_-15px_rgba(59,130,246,0.6)]">
              <div className="mb-6 w-fit rounded-2xl bg-blue-500/10 p-3 text-blue-400">{tool.icon}</div>
              <h2 className="mb-2 text-2xl font-bold" dir="ltr" style={{ textAlign: "right" }}>
                {tool.title}
              </h2>
              <p className="flex-1 leading-relaxed text-neutral-400">{tool.desc}</p>
              <span className="cta-link mt-6 font-bold text-blue-400">
                <span className="link-underline">פתיחת הכלי</span>
                <ArrowLeft size={18} className="cta-link__arrow" />
              </span>
            </article>
          </Link>
        ))}
      </section>
    </main>
  );
}
