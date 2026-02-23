# 🚀 AI-Powered Analysis Hub

A sophisticated web application that leverages **Google Gemini AI** to provide professional insights into Instagram profiles, GitHub repositories, and Professional CVs.

## ✨ Features
* **📸 Instagram Analyzer**: Get deep branding and growth insights for any profile.
* **💻 GitHub Auditor**: Analyze code quality, documentation, and repository structure.
* **📄 CV Expert**: Receive professional feedback to optimize your resume for ATS.
* **🔐 Secure Auth**: Fully integrated with Clerk for a safe user experience.

## 🛠 Tech Stack
* **Framework**: Next.js 15 (App Router)
* **AI**: Google Generative AI (Gemini 2.0 Flash)
* **Auth**: Clerk
* **Styling**: Tailwind CSS
* **Deployment**: Vercel

---

## ⚙️ Installation & Setup

If you want to run this project locally, follow these steps:

### 1. Clone the repository
`git clone https://github.com/your-username/ai-analyzer-hub.git`

### 2. Install dependencies
`npm install`

### 3. Environment Variables
Create a `.env.local` file in the root folder and add your own API keys. **Do not share these keys!**

| Key | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Get it from [Google AI Studio](https://aistudio.google.com/) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | From your Clerk Dashboard |
| `CLERK_SECRET_KEY` | From your Clerk Dashboard |
| `GITHUB_TOKEN` | Personal Access Token from GitHub Settings |

### 4. Run the app
`npm run dev`

---

## 🔒 Security
This project is built with security in mind. All sensitive keys are managed via environment variables and are **not** included in the source code.
