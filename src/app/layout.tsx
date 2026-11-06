import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Atkinson_Hyperlegible_Mono, IBM_Plex_Sans_Hebrew } from "next/font/google";
import "./globals.css";

const plex = IBM_Plex_Sans_Hebrew({
  variable: "--font-plex",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500"],
  display: "swap",
});

const atkinsonMono = Atkinson_Hyperlegible_Mono({
  variable: "--font-atkinson-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AI Analyzer Hub",
    template: "%s | AI Analyzer Hub",
  },
  description: "ניתוח קורות חיים, ריפוזיטורים ב-GitHub וחשבונות אינסטגרם עסקיים בעזרת AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="he" dir="rtl" className={`${plex.variable} ${atkinsonMono.variable}`}>
        <body>
          <header className="site-nav">
            <div className="container site-nav__inner">
              <Link href="/" className="wordmark">
                <span className="wordmark__mark ltr" aria-hidden="true">
                  NF
                </span>
                <span className="ltr">AI Analyzer Hub</span>
              </Link>
              <nav className="nav-links" aria-label="כלים">
                <Link href="/cv-analyzer" className="nav-link">
                  קורות חיים
                </Link>
                <Link href="/repo-analyzer" className="nav-link">
                  GitHub
                </Link>
                <Link href="/instagram-analyzer" className="nav-link">
                  אינסטגרם
                </Link>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button type="button" className="btn btn--sm">
                      התחברות
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                </SignedIn>
              </nav>
            </div>
          </header>

          {children}

          <footer className="site-footer">
            <div className="container">
              <p className="site-footer__name">AI Analyzer Hub</p>
              <div className="site-footer__meta">
                <p>
                  נבנה על ידי נתנאל פרח ·{" "}
                  <a href="https://github.com/farahnethaniel-hub" className="text-link" target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </p>
                <p>מופעל על ידי Google Gemini</p>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
