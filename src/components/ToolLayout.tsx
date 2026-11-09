"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full pb-20 pt-6"
    >
      {/* The back link sits against the page edge, in line with the header */}
      <div className="px-5 sm:px-8">
        <Link href="/" className="back-link text-sm font-semibold text-neutral-500 hover:text-white">
          <ArrowRight size={16} className="back-link__arrow" />
          <span className="link-underline">כל הכלים</span>
        </Link>
      </div>

      <div className="mx-auto max-w-3xl px-5">
      <div className="mt-8 mb-10 flex flex-col items-center text-center">
        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-blue-400">{icon}</div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 text-lg text-neutral-400">{subtitle}</p>
      </div>

      <SignedIn>{children}</SignedIn>

      <SignedOut>
        <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-white/10 bg-[#121212] p-10 text-center">
          <div className="mb-5 rounded-full border border-white/10 bg-black p-4">
            <Lock size={30} />
          </div>
          <h2 className="mb-2 text-xl font-bold">צריך להתחבר</h2>
          <p className="mb-7 leading-relaxed text-neutral-400">{lockedText}</p>
          <SignInButton mode="modal">
            <button className="btn-lift w-full max-w-[240px] cursor-pointer rounded-full bg-white px-8 py-3 font-bold text-black hover:bg-neutral-200">
              התחברות
            </button>
          </SignInButton>
        </div>
      </SignedOut>
      </div>
    </motion.main>
  );
}
