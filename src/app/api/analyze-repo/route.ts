import { NextResponse } from "next/server";
import { Octokit } from "octokit";
import { auth } from "@clerk/nextjs/server";
import { ApiError, REPORT_FORMAT, errorResponse, extractScore, getModel, stripScore } from "@/lib/ai";

const CODE_FILE = /\.(ts|tsx|js|jsx|py|java|cs|go|rs|c|cpp|h|hpp)$/i;
const SKIP_PATH = /(node_modules|dist\/|build\/|\.min\.|\.config\.|test|spec|vcxproj|vendor\/)/i;
const MAX_FILES = 12;
const MAX_FILE_CHARS = 6000;

/** Accepts "https://github.com/owner/repo", "github.com/owner/repo.git", "owner/repo" and similar. */
function parseRepo(input: string) {
  const cleaned = input
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^(www\.)?github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/\/+$/, "");
  const [owner, repo] = cleaned.split("/");
  if (!owner || !repo || !/^[\w.-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) {
    throw new ApiError("הכתובת לא נראית כמו ריפו של GitHub. דוגמה: https://github.com/user/repo");
  }
  return { owner, repo };
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) throw new ApiError("צריך להתחבר כדי להשתמש בכלי.", 401);

    const body = await req.json().catch(() => ({}));
    const { owner, repo } = parseRepo(String(body.repoUrl ?? ""));

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    let defaultBranch: string;
    try {
      const { data } = await octokit.rest.repos.get({ owner, repo });
      defaultBranch = data.default_branch;
    } catch (e: unknown) {
      const status = (e as { status?: number }).status;
      if (status === 404) throw new ApiError("הריפו לא נמצא, או שהוא פרטי.", 404);
      if (status === 403) throw new ApiError("הגענו למגבלת הבקשות של GitHub. נסו שוב בעוד כמה דקות.", 429);
      throw e;
    }

    const { data: tree } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: defaultBranch,
      recursive: "true",
    });

    const files = tree.tree.filter((item) => item.type === "blob" && item.path);
    const structure = files.map((item) => item.path).slice(0, 400).join("\n");

    const important = files
      .filter((item) => CODE_FILE.test(item.path!) && !SKIP_PATH.test(item.path!))
      .slice(0, MAX_FILES);

    let code = "";
    for (const file of important) {
      try {
        const { data } = await octokit.rest.repos.getContent({ owner, repo, path: file.path! });
        if (!Array.isArray(data) && data.type === "file" && "content" in data) {
          const content = Buffer.from(data.content, "base64").toString("utf8").slice(0, MAX_FILE_CHARS);
          code += `\n--- FILE: ${file.path} ---\n${content}\n`;
        }
      } catch {
        // A single unreadable file should not fail the whole analysis.
      }
    }

    const prompt = `אתה Senior Software Engineer שעושה Code Review לפרויקט ${owner}/${repo}.

מבנה התשובה:
## סיכום
מה הפרויקט עושה ובאיזה סטאק.
## ארכיטקטורה ומבנה
## איכות קוד
## סיכונים ובאגים אפשריים
## המלצות לשיפור
${REPORT_FORMAT}

מבנה הקבצים:
${structure}

קבצים מרכזיים:
${code || "(לא נמצאו קבצי קוד לקריאה)"}`;

    const result = await getModel().generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ report: stripScore(text), score: extractScore(text) });
  } catch (error) {
    return errorResponse(error);
  }
}
