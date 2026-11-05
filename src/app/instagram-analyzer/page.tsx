"use client";
import { useState } from "react";
import { Instagram } from "lucide-react";
import ToolLayout from "@/components/ToolLayout";
import Report from "@/components/Report";
import AnalyzeButton, { ErrorNote } from "@/components/AnalyzeButton";
import { requestReport, type ReportResult } from "@/lib/request";

const field =
  "field";

export default function InstagramAnalyzer() {
  const [username, setUsername] = useState("");
  const [niche, setNiche] = useState("");
  const [bio, setBio] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReportResult | null>(null);

  const ready = username.trim() && (bio.trim() || content.trim());

  const analyze = async () => {
    if (!ready) return;
    setLoading(true);
    setError(null);
    try {
      setResult(await requestReport("/api/instagram", { username, niche, bio, content }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "הניתוח נכשל.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Instagram Analyzer"
      subtitle="ניתוח מיתוג ותוכן לחשבון עסקי, עם המלצות וביו משופר"
      icon={<Instagram size={30} />}
      lockedText="כדי לנתח חשבון אינסטגרם עסקי, התחברו לחשבון."
    >
      {result ? (
        <Report
          title={`@${username.replace(/^@/, "")}`}
          report={result.report}
          score={result.score}
          onReset={() => setResult(null)}
          resetLabel="ניתוח חשבון אחר"
        />
      ) : (
        <form
          className="glass flex flex-col gap-5 rounded-[28px] p-6 sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            analyze();
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="ig-user" className="mb-2 block text-[14px] font-semibold text-muted">
                שם משתמש
              </label>
              <input id="ig-user" dir="ltr" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="@yourbusiness" className={field} />
            </div>
            <div>
              <label htmlFor="ig-niche" className="mb-2 block text-[14px] font-semibold text-muted">
                תחום העסק
              </label>
              <input id="ig-niche" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="למשל: סטודיו לפילאטיס בתל אביב" className={field} />
            </div>
          </div>

          <div>
            <label htmlFor="ig-bio" className="mb-2 block text-[14px] font-semibold text-muted">
              הביו הנוכחי
            </label>
            <textarea id="ig-bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="העתיקו את הביו מהפרופיל" className={`${field} h-28 resize-none`} />
          </div>

          <div>
            <label htmlFor="ig-content" className="mb-2 block text-[14px] font-semibold text-muted">
              על מה הפוסטים והרילס?
            </label>
            <textarea
              id="ig-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="תארו בקצרה את התוכן: סוגי פוסטים, נושאים, כמה פעמים בשבוע מפרסמים, מה עובד ומה פחות"
              className={`${field} h-36 resize-none`}
            />
            <p className="mt-2 text-sm text-muted">ה-AI לא נכנס לאינסטגרם, ולכן הניתוח מבוסס רק על מה שתכתבו כאן.</p>
          </div>

          <ErrorNote message={error} />

          <div className="flex justify-center">
            <AnalyzeButton loading={loading} disabled={!ready} onClick={analyze} label="נתחו את החשבון" loadingLabel="מנתח את החשבון..." />
          </div>
        </form>
      )}
    </ToolLayout>
  );
}
