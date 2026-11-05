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
      icon={<FileText size={30} />}
      lockedText="כדי לנתח קורות חיים ולהשוות אותם למשרות, התחברו לחשבון."
    >
      {result ? (
        <Report title="התאמה למשרה" report={result.report} score={result.score} onReset={reset} resetLabel="ניתוח קובץ חדש" />
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="job" className="mb-2 block text-sm font-bold text-neutral-400">
              תיאור המשרה
            </label>
            <textarea
              id="job"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="הדביקו כאן את דרישות המשרה..."
              className="h-44 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-lg leading-relaxed text-white placeholder:text-neutral-600 focus:border-blue-500/60 focus:outline-none"
            />
          </div>

          <label
            htmlFor="cv"
            className="group flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center transition hover:border-blue-500/50"
          >
            {file ? (
              <>
                <CheckCircle2 className="text-green-400" size={36} />
                <span className="font-bold text-neutral-200">{file.name}</span>
                <span className="text-sm text-neutral-500">לחצו כדי להחליף קובץ</span>
              </>
            ) : (
              <>
                <Upload className="text-neutral-400 transition group-hover:text-blue-400" size={36} />
                <span className="font-bold text-neutral-300">העלאת קורות חיים</span>
                <span className="text-sm text-neutral-500">PDF בלבד, עד {MAX_FILE_MB}MB</span>
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

          <div className="flex justify-center">
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
