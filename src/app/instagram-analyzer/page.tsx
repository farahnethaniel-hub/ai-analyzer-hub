'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Lock } from "lucide-react";
// הוספת ה-Import של האנימציה
import { motion } from 'framer-motion';

export default function InstagramAnalyzer() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleAnalyze = async () => {
        if (!username) return alert("אחי, שכחת שם משתמש");
        
        setLoading(true);
        setResult(""); 
        
        try {
            const res = await fetch('/api/instagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl: username }), 
            });
            
            const data = await res.json();
            setResult(data.result || data.text || "סיימנו, בדוק את הטרמינל");
        } catch (e) {
            setResult("תקלה בחיבור");
        } finally {
            setLoading(false);
        }
    };

    const scoreMatch = result.match(/SCORE:\s*(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

    return (
        /* שינוי ה-main ל-motion.main והוספת הגדרות ה-Fade */
        <motion.main 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ 
                backgroundColor: '#030303', 
                minHeight: '100vh', 
                color: 'white',
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif', 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <style jsx global>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            <div style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                width: '50%',
                height: '20%',
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.07) 0%, rgba(0,0,0,0) 10000%)',
                filter: 'blur(100px)',
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'absolute', top: '40px', right: '40px', zIndex: 100 }}>
                <Link href="/" style={{
                    color: 'rgba(255, 255, 255, 0.4)',
                    textDecoration: 'none',
                    fontSize: '1.0rem',
                    fontWeight: '700',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'; }}
                >
                    חזרה לתפריט הראשי
                </Link>
            </div>

            <div style={{ 
                position: 'relative', 
                zIndex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                paddingTop: '80px',
                width: '100%'
            }}>
                
                <h1 style={{
                    fontSize: '4.0rem',
                    fontWeight: '900',
                    letterSpacing: '-3px',
                    fontFamily: 'inherit'
                }}>
                    Instagram Analyzer
                </h1>

                <p style={{ 
                    color: '#b3b3b3' ,
                    fontSize: '17px', 
                    fontWeight: 'bold', 
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    direction: 'rtl',
                    textAlign: 'center',
                    marginTop: '15px',
                    letterSpacing: 'normal'
                }}>
                    ניתוח חשבון אינסטגרם מבוסס <span style={{ direction: 'ltr' }}>AI</span>
                </p>

                <div style={{ marginTop: '50px', width: '100%', maxWidth: '550px', padding: '0 20px' }}>
                    
                    <SignedIn>
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '3px solid rgba(255,255,255,0.05)',
                                    borderTop: '3px solid #e5e5e5', 
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                <div style={{ 
                                    color: '#a3a3a3', 
                                    fontSize: '1.1rem', 
                                    fontWeight: '700', 
                                    direction: 'rtl',
                                    textShadow: 'none' 
                                }}>
                                    מנתח נתונים במערכת...
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'flex-end', 
                                    marginBottom: '10px' 
                                }}>
                                    <div>
                                        {score !== null && (
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                                                <span style={{ 
                                                    fontSize: '1.6rem', 
                                                    fontWeight: '900', 
                                                    color: score >= 80 ? '#4ade80' : '#fb923c',
                                                    textShadow: 'none' 
                                                }}>
                                                    {score}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ 
                                        color: 'rgba(255, 255, 255, 0.3)', 
                                        fontSize: '0.9rem', 
                                        fontWeight: 'bold', 
                                        letterSpacing: '2px', 
                                        textAlign: 'right'
                                    }}>
                                        INSTAGRAM PROFILE / שם משתמש
                                    </div>
                                </div>

                                <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    borderRadius: '20px',
                                    padding: '40px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '20px',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <input 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        type="text" 
                                        placeholder="Username..."
                                        style={{
                                            width: '100%',
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            padding: '15px',
                                            borderRadius: '12px',
                                            color: 'white',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            textAlign: 'center'
                                        }}
                                    />
                                    
                                    <button 
                                        onClick={handleAnalyze}
                                        style={{
                                            backgroundColor: '#0a0a0a',
                                            color: 'rgba(255, 255, 255, 0.5)',
                                            padding: '12px 45px',
                                            borderRadius: '9999px',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            fontWeight: '600',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            outline: 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#111111';
                                            e.currentTarget.style.color = '#ffffff';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#0a0a0a';
                                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        Analyze profile
                                    </button>

                                    {result && (
                                        <div style={{
                                            marginTop: '20px',
                                            padding: '25px',
                                            backgroundColor: 'rgba(255,255,255,0.02)',
                                            borderRadius: '15px',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            textAlign: 'right',
                                            direction: 'rtl'
                                        }}>
                                            <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '1px' }}>
                                                ANALYSIS REPORT
                                            </div>
                                            <div style={{ 
                                                fontSize: '1rem', 
                                                lineHeight: '1.7', 
                                                color: '#d1d5db',
                                                whiteSpace: 'pre-wrap',
                                                fontFamily: 'system-ui'
                                            }}>
                                                {result.replace(/SCORE:\s*\d+/, '').trim()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </SignedIn>

                    <SignedOut>
                        <div className="flex flex-col items-center justify-center mt-10 bg-[#121212] border border-gray-800 rounded-3xl p-10 text-center shadow-[0_0_30px_-10px_rgba(255,255,255,0.05)]" dir="rtl">
                            
                            <div className="bg-black p-4 rounded-full mb-5 border border-gray-800 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                                <Lock size={36} className="text-white" />
                            </div>
                            
                            <h2 className="text-2xl font-bold mb-3 text-white">אזור לחברים בלבד</h2>
                            <p className="text-gray-400 mb-8 text-base leading-relaxed">
                                כדי לנתח פרופילי אינסטגרם לעומק, אנא התחבר למערכת.
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
            </div>
        </motion.main>
    );
}