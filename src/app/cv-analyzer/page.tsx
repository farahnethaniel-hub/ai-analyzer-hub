"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, FileText, Upload } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import ToolLayout from "@/components/ToolLayout";
import Report from "@/components/Report";
import AnalyzeButton, { ErrorNote } from "@/components/AnalyzeButton";
import { requestReport, type ReportResult } from "@/lib/request";

const MAX_FILE_MB = 5;

async function readPdfText(file: File) {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data, isEvalSupported: false, useSystemFonts: true }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => ("str" in item ? item.str : "")).join(" ") + "\n";
  }
  return text.trim();
}

export default function CVAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReportResult | null>(null);

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.mjs`;
  }, []);

  const pickFile = (f: File | null) => {
    setError(null);
    if (!f) return setFile(null);
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setFile(null);
      return setError("אפשר להעלות רק קובץ PDF.");
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setFile(null);
      return setError(`הקובץ גדול מדי. הגודל המקסימלי הוא ${MAX_FILE_MB}MB.`);
    }
    setFile(f);
  };

  const analyze = async () => {
    if (!file || !jobDescription.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const cvText = await readPdfText(file).catch(() => {
        throw new Error("לא הצלחנו לקרוא את ה-PDF. נסו לייצא אותו מחדש.");
      });
      setResult(await requestReport("/api/analyze", { cvText, jobDescription }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "הניתוח נכשל.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setFile(null);
    setError(null);
  };

  return (
    <ToolLayout
      title="CV Analyzer"
      subtitle="השוואה בין קורות החיים לדרישות המשרה, עם ציון התאמה והמלצות"
      icon={<FileText size={30} strokeWidth={1.6} />}
      lockedText="כדי לנתח קורות חיים ולהשוות אותם למשרות, התחברו לחשבון."
    >
      {result ? (
        <Report title="התאמה למשרה" report={result.report} score={result.score} onReset={reset} resetLabel="ניתוח קובץ חדש" />
      ) : (
        <div className="panel">
          <div>
            <label htmlFor="job" className="label">
              תיאור המשרה
            </label>
            <textarea
              id="job"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="הדביקו כאן את דרישות המשרה..."
              className="field field--area"
              rows={7}
            />
          </div>

          <label
            htmlFor="cv"
            className={file ? "dropzone dropzone--done" : "dropzone"}
          >
            {file ? (
              <>
                <CheckCircle2 size={32} strokeWidth={1.6} aria-hidden="true" />
                <span className="dropzone__name ltr">{file.name}</span>
                <span className="dropzone__note">לחצו כדי להחליף קובץ</span>
              </>
            ) : (
              <>
                <Upload size={32} strokeWidth={1.6} aria-hidden="true" />
                <span className="dropzone__name">העלאת קורות חיים</span>
                <span className="dropzone__note">PDF בלבד, עד {MAX_FILE_MB}MB</span>
              </>
            )}
            <input
              id="cv"
              type="file"
              accept=".pdf,application/pdf"
              className="sr-only"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <ErrorNote message={error} />

          <div className="panel__actions">
            <AnalyzeButton
              loading={loading}
              disabled={!file || !jobDescription.trim()}
              onClick={analyze}
              label="נתחו את ההתאמה"
              loadingLabel="מנתח את קורות החיים..."
            />
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
