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
      aria-busy={loading}
      className="btn btn--primary btn--wide"
    >
      {loading && <Loader2 className="spin keep-motion" size={18} aria-hidden="true" />}
      {loading ? loadingLabel : label}
    </button>
  );
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="error-note">
      {message}
    </p>
  );
}
