import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ApiError, REPORT_FORMAT, errorResponse, extractScore, generate, stripScore } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) throw new ApiError("צריך להתחבר כדי להשתמש בכלי.", 401);

    const body = await req.json().catch(() => ({}));
    const username = String(body.username ?? "").trim().replace(/^@/, "");
    const bio = String(body.bio ?? "").trim().slice(0, 1000);
    const niche = String(body.niche ?? "").trim().slice(0, 300);
    const content = String(body.content ?? "").trim().slice(0, 4000);

    if (!username) throw new ApiError("הכניסו שם משתמש.");
    if (!bio && !content) {
      throw new ApiError("הדביקו את הביו או תיאור של התוכן, כדי שהניתוח יתבסס על מידע אמיתי.");
    }

    const prompt = `אתה יועץ שיווק דיגיטלי ומיתוג באינסטגרם.
נתח את החשבון @${username} רק לפי המידע שהמשתמש סיפק למטה.
אין לך גישה לאינסטגרם, אז אל תמציא עוקבים, פוסטים או נתונים שלא מופיעים כאן.
אם חסר מידע כדי לשפוט נושא מסוים, כתוב מה חסר.

מבנה התשובה:
## רושם ראשוני
## ביו ומיצוב
## אסטרטגיית תוכן
## חוזקות
## נקודות לשיפור
המלצות ברורות ומעשיות.
## ביו מוצע
גרסה משופרת של הביו, עד 150 תווים.
${REPORT_FORMAT}

תחום העסק: ${niche || "לא צוין"}
ביו: """${bio || "לא סופק"}"""
תיאור התוכן והפוסטים: """${content || "לא סופק"}"""`;

    const text = await generate(prompt);

    return NextResponse.json({ report: stripScore(text), score: extractScore(text) });
  } catch (error) {
    return errorResponse(error);
  }
}
