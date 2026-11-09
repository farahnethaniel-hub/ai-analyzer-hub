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
        <body className={`${heebo.variable} min-h-screen bg-[#0a0a0a] text-white antialiased`}>
          <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-5 sm:px-8">
              <Link href="/" className="logo-link flex items-center gap-2 font-extrabold tracking-tight">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/20 text-xs font-light" dir="ltr">
                  NF
                </span>
                <span dir="ltr">AI Analyzer Hub</span>
              </Link>
              <div className="flex items-center">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="btn-lift cursor-pointer rounded-full border border-white/15 px-5 py-2 text-sm font-bold text-neutral-200 hover:border-blue-500 hover:text-blue-400">
                      התחברות
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }} />
                </SignedIn>
              </div>
            </div>
          </header>

          {children}

          <footer className="border-t border-white/5 py-8 text-center text-sm text-neutral-600">
            נבנה על ידי נתנאל פרח ·{" "}
            <a href="https://github.com/farahnethaniel-hub" className="link-underline hover:text-neutral-300" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
