"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Github, CheckCircle2, Loader2, Code2, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function RepoAnalyzer() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const extractValidScore = (text: string | null) => {
    if (!text) return 0;
    const match = text.match(/SCORE:\s*(\d+)/i);
    return match ? Math.min(parseInt(match[1]), 100) : 0;
  };

  const currentScore = extractValidScore(result);

  const handleAnalyze = async () => {
    if (!repoUrl) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('/api/analyze-repo', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);

    } catch (error: any) {
      console.error("Analysis Error:", error);
      setResult("שגיאה: " + (error.message || "נכשלנו בניתוח הפרויקט"));
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

      <div className="w-full max-w-2xl flex flex-col items-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/10 blur-[120px] pointer-events-none" />
        
        <h1 className="text-5xl font-black tracking-tighter mb-4 z-10">Repo Analyzer</h1>
        <p className="text-gray-400 mb-12 font-bold leading-relaxed z-10 text-center">ניתוח איכות קוד וארכיטקטורה מבוסס AI</p>

        <SignedIn>
          {!result && !isAnalyzing && (
            <div className="w-full flex flex-col items-center gap-8 z-10">
              <div className="w-full animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <label className="block text-gray-500 font-bold text-s mb-3 tracking-[0.2em] uppercase mr-2">
                  GITHUB REPOSITORY / לינק לפרויקט
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/user/repo"
                    className="w-full bg-white/[0.02] backdrop-blur-2xl border border-white/[0.05] rounded-3xl p-8 text-white placeholder:text-gray-700 focus:outline-none focus:border-white/20 transition-all font-medium text-lg ltr"
                    style={{ direction: 'ltr' }}
                  />
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !repoUrl}
                className="relative px-12 py-4 bg-black rounded-full font-bold text-white border border-white/10 hover:border-white/40 transition-all overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>התחל ניתוח פרויקט</span>
                </span>
                {!isAnalyzing && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="mt-20 flex flex-col items-center gap-6 z-10">
              <Loader2 className="animate-spin text-white" size={48} />
              <p className="text-lg font-bold text-gray-400 animate-pulse text-center">מנתח מבנה פרויקט כעת...</p>
            </div>
          )}

          {result && (
            <div className="mt-8 w-full bg-[#111] border border-gray-800 p-8 rounded-3xl animate-in zoom-in-95 text-right z-10">
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                <span className="text-gray-500 font-bold text-sm uppercase tracking-tighter">דוח איכות קוד</span>
                <span className="font-black" style={{ color: currentScore >= 80 ? '#4ade80' : currentScore >= 50 ? '#facc15' : '#f87171' }}>
                  ציון: {currentScore}%
                </span>
              </div>
              
              {/* כאן נמצא התיקון עם ReactMarkdown לעיצוב נקי */}
              <div className="text-lg text-gray-300 leading-relaxed font-medium text-right prose prose-invert max-w-none prose-p:leading-relaxed prose-li:my-2">
                <ReactMarkdown>
                  {result.replace(/SCORE:\s*\d+/i, '').trim()}
                </ReactMarkdown>
              </div>

              <button 
                onClick={() => {setResult(null); setRepoUrl('');}} 
                className="mt-8 text-gray-500 hover:text-white text-sm font-bold transition-colors underline underline-offset-4"
              >
                ניתוח פרויקט חדש
              </button>
            </div>
          )}
        </SignedIn>

        <SignedOut>
          <div className="w-full flex flex-col items-center justify-center mt-10 bg-[#121212] border border-gray-800 rounded-3xl p-10 text-center shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)] z-10">
            <div className="bg-black p-4 rounded-full mb-5 border border-gray-800 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Lock size={36} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-white">אזור לחברים בלבד</h2>
            <p className="text-gray-400 mb-8 text-base leading-relaxed">
              כדי לנתח ריפוזיטורים ולקבל תובנות על איכות הקוד שלך, אנא התחבר למערכת.
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