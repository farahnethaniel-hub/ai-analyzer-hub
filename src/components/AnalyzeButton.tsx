"use client";
import { Loader2 } from "lucide-react";

export default function AnalyzeButton({
  loading,
  disabled,
  onClick,
  label,
  loadingLabel,
}: {
  loading: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 px-10 py-4 text-lg font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
    >
      {loading && <Loader2 className="animate-spin" size={20} />}
      {loading ? loadingLabel : label}
    </button>
  );
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-red-300">
      {message}
    </p>
  );
}
