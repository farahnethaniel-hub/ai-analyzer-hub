"use client";
import { useState } from "react";
import { Github } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import Report from "@/components/Report";
import AnalyzeButton, { ErrorNote } from "@/components/AnalyzeButton";
import { requestReport, type ReportResult } from "@/lib/request";

export default function RepoAnalyzer() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReportResult | null>(null);

  const analyze = async () => {
    if (!repoUrl.trim()) return;
    setLoading(true);
    setError(null);
    try {
      setResult(await requestReport("/api/analyze-repo", { repoUrl }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "הניתוח נכשל.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Repo Analyzer"
      subtitle="Code Review אוטומטי לריפו ציבורי ב-GitHub: ארכיטקטורה, איכות קוד וסיכונים"
      icon={<Github size={30} />}
      lockedText="כדי לנתח ריפוזיטורים ולקבל Code Review, התחברו לחשבון."
    >
      {result ? (
        <Report
          title="Code Review"
          report={result.report}
          score={result.score}
          onReset={() => {
            setResult(null);
            setRepoUrl("");
          }}
          resetLabel="ניתוח ריפו אחר"
        />
      ) : (
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            analyze();
          }}
        >
          <div>
            <label htmlFor="repo" className="mb-2 block text-sm font-bold text-neutral-400">
              קישור לריפו
            </label>
            <input
              id="repo"
              type="text"
              dir="ltr"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-lg text-white placeholder:text-neutral-600 focus:border-blue-500/60 focus:outline-none"
            />
            <p className="mt-2 text-sm text-neutral-500">ריפו ציבורי בלבד. הניתוח לוקח בדרך כלל 20–40 שניות.</p>
          </div>

          <ErrorNote message={error} />

          <div className="flex justify-center">
            <AnalyzeButton
              loading={loading}
              disabled={!repoUrl.trim()}
              onClick={analyze}
              label="נתחו את הפרויקט"
              loadingLabel="קורא את הקוד..."
            />
          </div>
        </form>
      )}
    </ToolLayout>
  );
}
