import Link from "next/link";
import { ChevronLeft, FileText, Github, Instagram, Sparkles, Upload, ScanSearch } from "lucide-react";
import HeroGlass from "@/components/HeroGlass";
import TiltCard from "@/components/TiltCard";
import Reveal from "@/components/Reveal";

const tools = [
  {
    title: "CV Analyzer",
    tag: "קורות חיים",
    icon: <FileText size={26} strokeWidth={1.6} />,
    desc: "מעלים קורות חיים ותיאור משרה, ומקבלים ציון התאמה, פערים והמלצות לשיפור.",
    link: "/cv-analyzer",
    tint: "text-[#2997ff] bg-[#2997ff]/12",
  },
  {
    title: "Repo Analyzer",
    tag: "GitHub",
    icon: <Github size={26} strokeWidth={1.6} />,
    desc: "Code Review אוטומטי לריפו: ארכיטקטורה, איכות קוד, סיכונים וציון.",
    link: "/repo-analyzer",
    tint: "text-[#30d158] bg-[#30d158]/12",
  },
  {
    title: "Instagram Analyzer",
    tag: "אינסטגרם",
    icon: <Instagram size={26} strokeWidth={1.6} />,
    desc: "ניתוח מיתוג ותוכן לחשבון עסקי, עם נקודות לשיפור וביו מוצע.",
    link: "/instagram-analyzer",
    tint: "text-[#ff6b9d] bg-[#ff6b9d]/12",
  },
];

const steps = [
  { icon: <Upload size={22} strokeWidth={1.6} />, title: "מעלים", text: "קובץ, קישור או כמה שורות על העסק." },
  { icon: <ScanSearch size={22} strokeWidth={1.6} />, title: "מנתחים", text: "Gemini קורא את החומר ומשווה אותו לסטנדרט מקצועי." },
  { icon: <Sparkles size={22} strokeWidth={1.6} />, title: "משפרים", text: "ציון ברור, חוזקות, פערים והמלצות שאפשר ליישם היום." },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroGlass />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 pt-24 pb-28 text-center sm:pt-32 sm:pb-36">
          <Reveal>
            <p className="mb-5 text-[15px] font-medium text-accent">מופעל על ידי Google Gemini</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="text-[44px] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-[80px]">
              ניתוח מקצועי.
              <br />
              <span className="bg-gradient-to-l from-[#f5f5f7] via-[#d2d2d7] to-[#6e6e73] bg-clip-text text-transparent">בלי ניחושים.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mx-auto mt-7 max-w-xl text-[19px] leading-relaxed text-muted sm:text-[21px]">
              שלושה כלי AI במקום אחד: קורות חיים מול משרה, Code Review לפרויקטים, וניתוח חשבון אינסטגרם עסקי.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="#tools" className="rounded-full bg-accent px-7 py-3 text-[17px] font-medium text-white transition hover:bg-accent-hover">
                לכלים
              </Link>
              <Link href="/cv-analyzer" className="group inline-flex items-center gap-1 text-[17px] font-medium text-accent">
                נסו את CV Analyzer
                <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="mx-auto max-w-6xl scroll-mt-20 px-5 pb-28">
        <Reveal>
          <h2 className="mb-12 text-center text-[34px] font-bold tracking-[-0.02em] sm:text-[48px]">שלושה כלים. ממשק אחד.</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {tools.map((tool, i) => (
            <Reveal key={tool.link} delay={i * 0.08} className="h-full">
              <Link href={tool.link} className="group block h-full rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                <TiltCard>
                  <div className="flex h-full min-h-[300px] flex-col p-8">
                    <div className={`mb-8 w-fit rounded-2xl p-3.5 ${tool.tint}`}>{tool.icon}</div>
                    <p className="text-[13px] font-semibold text-muted">{tool.tag}</p>
                    <h3 className="mt-1 text-[26px] font-bold tracking-tight" dir="ltr" style={{ textAlign: "right" }}>
                      {tool.title}
                    </h3>
                    <p className="mt-3 flex-1 text-[16px] leading-relaxed text-muted">{tool.desc}</p>
                    <span className="mt-8 inline-flex items-center gap-1 text-[16px] font-medium text-accent">
                      פתיחת הכלי
                      <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    </span>
                  </div>
                </TiltCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-line py-28">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <h2 className="text-center text-[34px] font-bold tracking-[-0.02em] sm:text-[48px]">איך זה עובד</h2>
          </Reveal>
          <div className="mt-16 grid gap-12 sm:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-surface text-accent">{s.icon}</div>
                  <h3 className="text-[21px] font-semibold">{s.title}</h3>
                  <p className="mt-2 max-w-[260px] text-[16px] leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
