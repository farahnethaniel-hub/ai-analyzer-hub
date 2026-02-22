import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
// 1. הוספת ה-Import של Clerk
import { auth } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // 2. בדיקת המשתמש - חוסם גישה למי שלא מחובר
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cvText, jobDescription } = await req.json();

    console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `נתח את קורות החיים מול דרישות המשרה. 
ותן ציון מ0-100 כמה לדעתך האדם בעל קורות החיים אלו מתאים לדרישות המשרה . אם אתה מקבל קובץ שהוא לא קורות חיים או אינו עומד בדרישות המשרה - תן ציון בהתאם. שהתשובה לא תהיה ארוכה מידי
לאחר מכן תן פירוט של חוזקות וחולשות בצורה של בולטים.
דרישות המשרה: ${jobDescription}
טקסט קורות החיים: ${cvText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ result: response.text() });

  } catch (error: any) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}