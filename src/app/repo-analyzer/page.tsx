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
      icon={<Github size={30} strokeWidth={1.6} />}
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
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            analyze();
          }}
        >
          <div>
            <label htmlFor="repo" className="label">
              קישור לריפו
            </label>
            <input
              id="repo"
              type="text"
              dir="ltr"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="field"
            />
            <p className="hint">ריפו ציבורי בלבד. הניתוח לוקח בדרך כלל 20 עד 40 שניות.</p>
          </div>

          <ErrorNote message={error} />

          <div className="panel__actions">
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
