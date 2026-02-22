import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
// 1. הוספת ה-Import של Clerk לאבטחה
import { auth } from "@clerk/nextjs/server";

// המפתח נמשך מה-Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 2. בדיקת המשתמש - מוודא שהבקשה מגיעה ממשתמש מחובר בלבד
    const { userId } = await auth();
    
    if (!userId) {
      console.log("❌ Unauthorized attempt to Instagram API");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Full body received:", body);

    const username = body.repoUrl; // השארתי את הלוגיקה שלך כפי שהיא
    
    if (!username) {
       console.log("❌ Error: username is missing from body");
       return NextResponse.json({ error: "שם משתמש חסר" }, { status: 400 });
    }

    console.log("--- DEBUG: Analyzing user: " + username + " ---");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `נתח את פרופיל האינסטגרם: ${username}.  אני רוצה שתתן חוות דעת מקצועית ומעמיקה על פרופיל האינסטגרם הבא:
[תדביק כאן לינק או תיאור מלא של הפרופיל]

תנתח את הפרופיל כאילו אתה מומחה לשיווק דיגיטלי, מיתוג אישי וגדילה אורגנית באינסטגרם.

תתייחס לנקודות הבאות:
תמונת פרופיל – רושם ראשוני, מקצועיות, התאמה לנישה
ביו – בהירות, הנעה לפעולה, מיצוב ומיתוג
Highlights – שימוש נכון, עיצוב, סדר
פיד – אחידות, אסתטיקה, צבעים, סגנון
איכות התוכן – ערך, בידול, רלוונטיות לקהל יעד
קריאייטיב – פתיחים חזקים, הוקים, ויראליות פוטנציאלית
קופי וכתיבה – בהירות, שכנוע, סגנון
אסטרטגיית תוכן – האם יש קו ברור?
רמת מקצועיות כללית
פוטנציאל צמיחה

לאחר הניתוח:
תן רשימת נקודות לשיפור (ברורות ומעשיות)
תן גם נקודות חוזק
תסכם בציון כולל SCORE: 0-100
תסביר למה נתת את הציון הזה
תהיה ישיר, אמיתי ולא נחמד סתם. תדבר כמו יועץ אמיתי.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("--- DEBUG SUCCESS ---");
    return NextResponse.json({ text: text });
    
  } catch (error: any) {
    console.error("❌ ERROR:", error.message);
    return NextResponse.json({ 
      text: `שגיאה: ${error.message}. וודא שהמפתח תקין.` 
    }, { status: 500 });
  }
}