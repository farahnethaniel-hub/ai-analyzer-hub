export type ReportResult = { report: string; score: number | null };

/** POSTs JSON to an analysis route and returns the report, or throws with the server's message. */
export async function requestReport(url: string, payload: unknown): Promise<ReportResult> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("אין חיבור לשרת. בדקו את האינטרנט ונסו שוב.");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    throw new Error(data.error || "הניתוח נכשל. נסו שוב בעוד רגע.");
  }
  return { report: String(data.report ?? ""), score: typeof data.score === "number" ? data.score : null };
}
