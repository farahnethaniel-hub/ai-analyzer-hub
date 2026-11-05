import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const MODEL_NAME = "gemini-2.5-flash";

/** Returns a Gemini model, or throws a clear error when the API key is missing. */
export function getModel() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new ApiError("שירות ה-AI לא מוגדר כרגע. נסו שוב מאוחר יותר.", 500);
  }
  return new GoogleGenerativeAI(key).getGenerativeModel({ model: MODEL_NAME });
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/** Shared instruction so every report has the same structure and a parsable score line. */
export const REPORT_FORMAT = `
כתוב בעברית (מונחים טכניים יכולים להישאר באנגלית).
השתמש ב-Markdown פשוט בלבד: כותרות ## לכל חלק, ורשימות עם "-".
סיים תמיד בשורה נפרדת בדיוק בפורמט: SCORE: XX (מספר שלם בין 0 ל-100).
`;

/** Reads "SCORE: XX" from a report. Returns null when the model did not provide one. */
export function extractScore(text: string): number | null {
  const match = text.match(/SCORE:\s*(\d{1,3})/i);
  if (!match) return null;
  return Math.max(0, Math.min(100, parseInt(match[1], 10)));
}

/** Removes the score line so the report body can be rendered on its own. */
export function stripScore(text: string): string {
  return text.replace(/\**SCORE:\s*\d{1,3}\**\s*/gi, "").trim();
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  console.error("API error:", error);
  return NextResponse.json(
    { error: "משהו השתבש בזמן הניתוח. נסו שוב בעוד רגע." },
    { status: 500 }
  );
}
