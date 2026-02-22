import { Rocket, FileText, Github, Instagram } from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  const tools = [
    {
      title: "CV Analyzer",
      icon: <FileText size={32} />,
      desc: "ניתוח קורות חיים והתאמה למשרה",
      link: "/cv-analyzer"
    },
    {
      title: "GitHub Repo Analyzer",
      icon: <Github size={32} />,
      desc: "ניתוח איכות קוד וארכיטקטורה",
      link: "/repo-analyzer" 
    },
    {
      title: "Instagram Business Analyzer",
      icon: <Instagram size={32} />,
      desc: "תובנות ומעורבות חשבון עסקי",
      link: "/instagram-analyzer"
    },
  ];

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white px-8 pb-8 font-sans relative" dir="rtl">
      
        <SignedOut>
  <div className="absolute top-5 right-10 z-50"> 
    <SignInButton mode="modal">
      <button className="bg-[#1a1a1a] border border-gray-800 hover:border-blue-500 hover:text-blue-400 text-gray-300 px-6 py-2 rounded-full font-bold transition-all shadow-sm hover:shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)] cursor-pointer">
        התחברות
      </button>
    </SignInButton>
  </div>
</SignedOut>

      {/* Header של התוכן */}
      <header className="flex flex-col items-center justify-center mb-16 pt-12">
        
        {/* הלוגו הזוהר - עם כוכבים מודגשים טיפה יותר */}
        <div className="relative flex items-center justify-center w-[140px] h-[140px] mb-4 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <filter id="blue-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.9  0 0 0 0 1  0 0 0 1 0" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* רקע כוכבים - אטימות הועלתה ל-0.6 והגדלנו טיפונת את הרדיוס */}
            <g fill="white" opacity="0.6">
              <circle cx="20" cy="30" r="0.8" /> <circle cx="150" cy="20" r="1.2" />
              <circle cx="180" cy="150" r="1" /> <circle cx="40" cy="180" r="0.7" />
              <circle cx="10" cy="100" r="1.1" /> <circle cx="190" cy="80" r="0.8" />
            </g>

            {/* העיגול והאותיות הזוהרים */}
            <g filter="url(#blue-glow)">
              <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="1.5" opacity="0.9" />
              <text x="100" y="100" textAnchor="middle" dominantBaseline="central" fontFamily="Arial, sans-serif" fontWeight="300" fontSize="70" fill="white" letterSpacing="-2">
                NF
              </text>
            </g>
          </svg>
        </div>

        {/* כותרת ראשית */}
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">
          AI Analyzer Hub
        </h1>
        
        {/* תת-כותרת */}
        <p className="mt-4 text-gray-400 text-xl font-bold tracking-wide">
         פלטפורמה אחת עם כמה כלים 
        </p>
      </header>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tools.map((tool, index) => (
          <Link href={tool.link} key={index} className="block group">
            <div className="bg-[#1a1a1a] border border-gray-800 p-8 rounded-3xl h-full hover:border-blue-500 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)] transition-all cursor-pointer">
              <div className="text-blue-400 mb-6 group-hover:scale-110 transition-transform flex justify-between items-start">
                {tool.icon}
                <span className="text-gray-700 text-4xl font-bold">.{index + 1}</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                {tool.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Future Section */}
      <section className="mt-20 max-w-2xl mx-auto bg-[#161616] p-8 rounded-2xl border border-dashed border-gray-700">
        <h3 className="text-xl font-semibold mb-6 text-gray-300">בעתיד אפשר להוסיף:</h3>
        <ul className="space-y-4">
          <li className="flex items-center gap-3 text-gray-400">📄 חוזים</li>
          <li className="flex items-center gap-3 text-gray-400">📊 דוחות פיננסיים</li>
          <li className="flex items-center gap-3 text-gray-400">📈 קמפיינים</li>
        </ul>
      </section>

    </main>
  );
}