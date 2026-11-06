"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

/** Shared frame for every tool page: back link, title, and a sign-in gate. */
export default function ToolLayout({
  title,
  subtitle,
  icon,
  lockedText,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  lockedText: string;
  children: ReactNode;
}) {
  return (
    <main className="tool">
      <Link href="/" className="text-link tool__back">
        כל הכלים
      </Link>

      <div className="tool__head">
        <h1 className="tool__title">
          <span aria-hidden="true">{icon}</span>
          <span>{title}</span>
        </h1>
        <p className="tool__subtitle">{subtitle}</p>
      </div>

      <SignedIn>{children}</SignedIn>

      <SignedOut>
        <div className="locked">
          <h2>
            <Lock size={20} strokeWidth={1.6} aria-hidden="true" />
            צריך להתחבר
          </h2>
          <p>{lockedText}</p>
          <SignInButton mode="modal">
            <button type="button" className="btn btn--primary">
              התחברות
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </main>
  );
}
