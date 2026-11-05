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
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-10 py-3.5 text-[17px] font-medium text-white transition hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto"
    >
      {loading && <Loader2 className="animate-spin" size={18} />}
      {loading ? loadingLabel : label}
    </button>
  );
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-2xl border border-[#ff453a]/25 bg-[#ff453a]/[0.06] px-5 py-3.5 text-[15px] text-[#c4271d]">
      {message}
    </p>
  );
}
