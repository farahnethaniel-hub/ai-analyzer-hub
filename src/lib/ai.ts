import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

/**
 * Models tried in order. GEMINI_MODEL (optional env var) goes first.
 * Gemini 2.5 is only served to keys that used it before, so newer models lead the list.
 */
const MODELS = [
  process.env.GEMINI_MODEL?.trim(),
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash",
].filter((m, i, all): m is string => !!m && all.indexOf(m) === i);

/** Errors worth retrying with the next model: model missing or not enabled, overload, quota. */
const RETRY_STATUSES = new Set([404, 429, 500, 503]);

function apiKey() {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new ApiError("מפתח ה-API של Gemini לא מוגדר בשרת (GEMINI_API_KEY).", 500);
  }
  return key;
}

function geminiStatus(e: unknown): number | undefined {
  const err = e as { status?: number; message?: string };
  if (typeof err.status === "number") return err.status;
  const m = err.message?.match(/\[(\d{3})[^\]]*\]/);
  return m ? Number(m[1]) : undefined;
}

/** Turns a Gemini SDK error into a message the user can act on. */
function toApiError(e: unknown): ApiError {
  const status = geminiStatus(e);
  const msg = String((e as { message?: string }).message ?? "");
  if (status === 400 && /api key/i.test(msg)) return new ApiError("מפתח ה-API של Gemini לא תקין. צריך לעדכן אותו בהגדרות של Vercel.", 500);
  if (status === 401 || status === 403) return new ApiError("מפתח ה-API של Gemini נחסם או שאין לו הרשאה למודל.", 500);
  if (status === 429) return new ApiError("נגמרה מכסת השימוש היומית ב-Gemini. נסו שוב מחר או שדרגו את המפתח.", 429);
  if (status === 503 || status === 500) return new ApiError("שירות ה-AI של גוגל עמוס כרגע. נסו שוב בעוד דקה.", 503);
  return new ApiError(`שגיאה משירות ה-AI: ${msg.slice(0, 200)}`, 502);
}

/** Generates text, moving to the next model when one is missing, overloaded or out of quota. */
export async function generate(prompt: string): Promise<string> {
  const client = new GoogleGenerativeAI(apiKey());
  let lastError: unknown;
  for (const model of MODELS) {
    try {
      const res = await client.getGenerativeModel({ model }).generateContent(prompt);
      return res.response.text();
    } catch (e) {
      lastError = e;
      console.error(`Gemini model ${model} failed:`, e);
      const status = geminiStatus(e);
      if (status === undefined || !RETRY_STATUSES.has(status)) break;
    }
  }
  throw toApiError(lastError);
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
