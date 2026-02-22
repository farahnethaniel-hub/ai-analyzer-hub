"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, CheckCircle2, Loader2, Lock } from 'lucide-react'; // הוספתי את Lock
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"; // הוספתי את Clerk

export default function CVAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const extractValidScore = (text: string | null) => {
    if (!text) return 0;
    const numbers = text.match(/\d+/g);
    if (!numbers) return 0;
    return numbers.map(Number).find(n => n <= 100) || 0;
  };

  const currentScore = extractValidScore(result);

  useEffect(() => {
    const version = pdfjsLib.version;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/legacy/build/pdf.worker.min.mjs`;
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#4ade80"; 
    if (score >= 50) return "#facc15"; 
    return "#f87171"; 
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      });
      
      const pdfDoc = await loadingTask.promise;
      let fullText = "";
      
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: fullText, jobDescription }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);

    } catch (error: any) {
      console.error("Analysis Error:", error);
      setResult("שגיאה: " + (error.message || "נכשלנו בניתוח הקובץ"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-[#0a0a0a] text-white p-8 flex flex-col items-center font-sans" 
      dir="rtl"
    >
      <div className="w-full flex justify-start mb-12 px-4">
        <Link 
          href="/" 
          className="text-gray-500 hover:text-white transition-all font-bold text-medium tracking-widest uppercase flex items-center gap-2"
        >
          חזרה לתפריט הראשי
        </Link>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/10 blur-[120px] pointer-events-none" />
        
        <h1 className="text-5xl font-black tracking-tighter mb-4 text-center">CV Analyzer</h1>
        <p className="text-gray-400 mb-12 font-bold leading-relaxed text-center">ניתוח קורות חיים מבוסס בינה מלאכותית</p>

        {/* --- אזור למחוברים בלבד --- */}
        <SignedIn>
          {!result && !isAnalyzing && (
            <div className="w-full flex flex-col items-center gap-8">
              <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <label className="block text-gray-500 font-bold text-xss mb-3 tracking-[0.2em] uppercase mr-2">
                  Job Description / דרישות התפקיד
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="הדבק כאן את תיאור המשרה כדי שה-AI ידע לבצע השוואה..."
                  className="w-full h-40 bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-3xl p-8 text-white placeholder:text-gray-700 focus:outline-none focus:border-white/20 transition-all resize-none font-medium text-lg leading-relaxed text-right"
                />
              </div>
              
              <div className="w-full bg-[#111] border border-gray-800 rounded-2xl p-12 hover:border-gray-700 transition-colors group relative cursor-pointer">
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)} 
                  accept=".pdf,.docx"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-900 rounded-full group-hover:scale-110 transition-transform">
                    <FileText className="text-gray-400 group-hover:text-white transition-colors animate-pulse" size={40} />
                  </div>
                  <span className="text-gray-400 font-bold">לחץ לבחירת קובץ PDF</span>
                </div>
              </div>

              {file && (
                <div className="flex flex-col items-center gap-6 w-full animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                    <CheckCircle2 className="text-green-500" size={18} />
                    <span className="text-sm font-bold text-gray-300">{file.name}</span>
                  </div>

                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="relative px-12 py-4 bg-black rounded-full font-bold text-white border border-white/10 hover:border-white/40 transition-all overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>מנתח כעת...</span>
                        </>
                      ) : (
                        <span>התחל ניתוח</span>
                      )}
                    </span>
                    {!isAnalyzing && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {isAnalyzing && (
            <div className="mt-20 flex flex-col items-center gap-6">
              <Loader2 className="animate-spin text-white" size={48} />
              <p className="text-lg font-bold text-gray-400 animate-pulse text-center">מנתח נתונים במערכת...</p>
            </div>
          )}

          {result && (
            <div className="mt-8 w-full bg-[#111] border border-gray-800 p-8 rounded-2xl animate-in zoom-in-95 text-right">
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <span className="text-gray-500 font-bold text-sm uppercase tracking-tighter">דוח ניתוח</span>
                <span className="text-white font-black">
                  התאמה: <span style={{ color: getScoreColor(currentScore) }}>{currentScore}%</span>
                </span>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed font-medium whitespace-pre-wrap">{result}</p>
              <button 
                onClick={() => {setResult(null); setFile(null);}} 
                className="mt-8 text-gray-500 hover:text-white text-sm font-bold transition-colors underline underline-offset-4"
              >
                ניתוח קובץ חדש
              </button>
            </div>
          )}
        </SignedIn>

        {/* --- אזור למנותקים (כמו באינסטגרם) --- */}
        <SignedOut>
          <div className="w-full flex flex-col items-center justify-center mt-10 bg-[#121212] border border-gray-800 rounded-3xl p-10 text-center shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)]">
            
            <div className="bg-black p-4 rounded-full mb-5 border border-gray-800 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Lock size={36} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-white">אזור לחברים בלבד</h2>
            <p className="text-gray-400 mb-8 text-base leading-relaxed">
              כדי לנתח קורות חיים ולהשוות אותם למשרות, אנא התחבר למערכת.
            </p>
            
            <div className="flex flex-col items-center gap-5 w-full">
              <SignInButton mode="modal">
                <button className="bg-[#1a1a1a] border border-gray-800 hover:border-white hover:text-white text-gray-300 px-10 py-3 rounded-full font-bold transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_-5px_rgba(255,255,255,0.3)] cursor-pointer w-full max-w-[250px]">
                  התחבר עכשיו
                </button>
              </SignInButton>

              <Link 
                href="/" 
                className="text-gray-500 hover:text-white text-sm font-medium transition-colors border-b border-transparent hover:border-white pb-1"
              >
                חזרה לתפריט הראשי
              </Link>
            </div>
          </div>
        </SignedOut>
      </div>
    </motion.main>
  );
}