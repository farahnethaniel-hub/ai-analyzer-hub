import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Octokit } from "octokit";
// 1. הוספת ה-Import של Clerk
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // 2. בדיקת המשתמש - חוסם גישה למי שלא מחובר
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoUrl } = await req.json();
    const token = process.env.GITHUB_TOKEN;
    const octokit = new Octokit({ auth: token });
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

    const cleanUrl = repoUrl.replace("https://github.com/", "").replace(/\/$/, "");
    const [owner, repo] = cleanUrl.split("/");

    const { data: repoData }: any = await octokit.rest.repos.get({ owner, repo });
    const defaultBranch = repoData.default_branch;

    const { data: treeData }: any = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: defaultBranch,
      recursive: "true",
    });

    const projectStructure = treeData.tree
      .filter((item: any) => item.type === "blob")
      .map((item: any) => item.path)
      .join("\n");

    const importantFiles = treeData.tree
      .filter((item: any) => 
        item.type === "blob" && 
        item.path.match(/\.(ts|tsx|js|jsx|c|cpp|h|hpp)$/i) && 
        !item.path.includes('node_modules') &&
        !item.path.includes('.config.') &&
        !item.path.includes('test') &&
        !item.path.includes('vcxproj')
      )
      .slice(0, 10);

    let fullCode = `PROJECT STRUCTURE:\n${projectStructure}\n\n`;

    for (const file of importantFiles) {
      try {
        const { data: f }: any = await octokit.rest.repos.getContent({ 
          owner, 
          repo, 
          path: file.path 
        });
        fullCode += `\n--- FILE: ${file.path} ---\n${Buffer.from(f.content, 'base64').toString()}\n`;
      } catch (e) { continue; }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
      Analyze this repository and provide a clean report:
      ${fullCode}
      
      Instructions:
      1. Write in plain text ONLY. 
      2. Do NOT use any Markdown symbols like #, *, _, or >.
      3. Use simple bullet points like "-" for lists.
      4. Separate sections with a single empty line.
      5. Format: Explain architecture, quality, risks, and end with SCORE: XX.
      
      Write in Hebrew, keep technical terms in English.
    `;

    const result = await model.generateContent(prompt);
    
    return NextResponse.json({ result: result.response.text() });

  } catch (error: any) {
    console.error("❌ ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}