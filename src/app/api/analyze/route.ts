import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ApiError, REPORT_FORMAT, errorResponse, extractScore, generate, stripScore } from "@/lib/ai";

const MAX_CV_CHARS = 20000;
const MAX_JOB_CHARS = 8000;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) throw new ApiError("צריך להתחבר כדי להשתמש בכלי.", 401);

    const body = await req.json().catch(() => ({}));
    const cvText = String(body.cvText ?? "").trim();
    const jobDescription = String(body.jobDescription ?? "").trim();

    if (cvText.length < 50) {
      throw new ApiError("לא הצלחנו לקרוא טקסט מהקובץ. ודאו שזה PDF עם טקסט ולא תמונה סרוקה.");
    }
    if (jobDescription.length < 20) {
      throw new ApiError("הדביקו תיאור משרה מלא יותר כדי שנוכל להשוות.");
    }

    const prompt = `אתה מגייס טכני מנוסה. השווה בין קורות החיים לבין דרישות המשרה.
אם הקובץ אינו קורות חיים, ציין זאת ותן ציון נמוך.

מבנה התשובה:
## סיכום
2-3 משפטים על רמת ההתאמה.
## חוזקות
## פערים מול המשרה
## המלצות לשיפור קורות החיים
המלצות מעשיות וקצרות.
${REPORT_FORMAT}

דרישות המשרה:
"""${jobDescription.slice(0, MAX_JOB_CHARS)}"""

קורות החיים:
"""${cvText.slice(0, MAX_CV_CHARS)}"""`;

    const text = await generate(prompt);

    return NextResponse.json({ report: stripScore(text), score: extractScore(text) });
  } catch (error) {
    return errorResponse(error);
  }
}
