# 🚀 AI-Powered Analysis Hub

A sophisticated web application that leverages **Google Gemini AI** to provide professional insights into Instagram profiles, GitHub repositories, and Professional CVs.

## ✨ Features
* **📸 Instagram Analyzer**: Branding and content feedback for a business account, based on the bio and content description you provide, plus a suggested bio.
* **💻 Repo Analyzer**: Automated code review for public GitHub repositories: architecture, code quality, risks and a score.
* **📄 CV Analyzer**: Upload a PDF resume and a job description to get a match score, gaps and concrete improvements.
* **🔐 Secure Auth**: Fully integrated with Clerk for a safe user experience.

## 🛠 Tech Stack
* **Framework**: Next.js 16 (App Router), React 19, TypeScript
* **AI**: Google Generative AI (Gemini 2.5 Flash)
* **Auth**: Clerk
* **Styling**: Tailwind CSS
* **Deployment**: Vercel

---
### 🌐 [If you want to try the web version, I highly recommend visiting here!](https://ai-analyzer-hub.vercel.app/instagram-analyzer)
## ⚙️ Installation & Setup

If you want to run this project locally, follow these steps:

### 1. Clone the repository
`git clone https://github.com/farahnethaniel-hub/ai-analyzer-hub.git`

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

## API tests

An integration test suite in Python (pytest + requests) runs against a live deployment over HTTP, so it exercises the real stack: routing, Clerk auth, input validation and error responses.

| File | What it checks |
| --- | --- |
| `tests/test_pages.py` | Public pages load, Hebrew RTL markup, unknown pages return 404 |
| `tests/test_api_auth.py` | Every analysis endpoint rejects anonymous and forged-token calls (401) and non-POST methods (405) |
| `tests/test_api_validation.py` | Signed-in requests with bad input get a clear 400/404 before any AI call |
| `tests/test_api_live.py` | Full analyses return a scored report with the expected sections (opt-in, spends Gemini quota) |

```bash
pip install -r tests/requirements.txt
pytest                                   # anonymous tests against production
BASE_URL=https://<preview>.vercel.app pytest
CLERK_SECRET_KEY=sk_... CLERK_TEST_USER_ID=user_... pytest   # adds the signed-in tests
RUN_LIVE_AI=1 ...                        # adds the live AI tests
```

The signed-in tests open a short-lived session for a dedicated Clerk test user through the Clerk Backend API and send a fresh session token with every request.

GitHub Actions (`.github/workflows/api-tests.yml`) runs the suite on every push, on pull requests, after each successful production deployment, and on demand.
