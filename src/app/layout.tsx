import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
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
      <html lang="he" dir="rtl">
        <body className={`${heebo.variable} min-h-screen bg-bg text-ink`}>
          <header className="sticky top-0 z-50 border-b border-line bg-[rgba(0,0,0,0.72)] backdrop-blur-xl backdrop-saturate-150">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
              <Link href="/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[10px] font-semibold text-black" dir="ltr">
                  NF
                </span>
                <span dir="ltr">AI Analyzer Hub</span>
              </Link>
              <nav className="flex items-center gap-6 text-[14px] text-muted">
                <Link href="/cv-analyzer" className="hidden transition-colors hover:text-ink sm:inline">
                  קורות חיים
                </Link>
                <Link href="/repo-analyzer" className="hidden transition-colors hover:text-ink sm:inline">
                  GitHub
                </Link>
                <Link href="/instagram-analyzer" className="hidden transition-colors hover:text-ink sm:inline">
                  אינסטגרם
                </Link>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="cursor-pointer rounded-full bg-ink px-4 py-1.5 text-[13px] font-medium text-black transition hover:opacity-85">
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

          <footer className="border-t border-line py-10 text-center text-[13px] text-muted">
            נבנה על ידי נתנאל פרח ·{" "}
            <a href="https://github.com/farahnethaniel-hub" className="transition-colors hover:text-ink" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
