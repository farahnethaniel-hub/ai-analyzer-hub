"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Lock } from "lucide-react";
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
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-3xl px-5 pb-24 pt-8"
    >
      <Link href="/" className="inline-flex items-center gap-0.5 text-[15px] font-medium text-accent hover:underline">
        <ChevronRight size={18} />
        כל הכלים
      </Link>

      <div className="mt-10 mb-12 flex flex-col items-center text-center">
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-[20px] border border-line bg-surface text-ink">{icon}</div>
        <h1 className="text-[40px] font-bold tracking-[-0.03em] sm:text-[56px]" dir="ltr">
          {title}
        </h1>
        <p className="mt-3 max-w-xl text-[19px] leading-relaxed text-muted">{subtitle}</p>
      </div>

      <SignedIn>{children}</SignedIn>

      <SignedOut>
        <div className="glass mx-auto flex max-w-md flex-col items-center rounded-[28px] p-10 text-center">
          <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-surface-2">
            <Lock size={24} strokeWidth={1.6} />
          </div>
          <h2 className="mb-2 text-[22px] font-semibold">צריך להתחבר</h2>
          <p className="mb-7 leading-relaxed text-muted">{lockedText}</p>
          <SignInButton mode="modal">
            <button className="w-full max-w-[240px] cursor-pointer rounded-full bg-accent px-8 py-3 text-[17px] font-medium text-white transition hover:bg-accent-hover">
              התחברות
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </motion.main>
  );
}
