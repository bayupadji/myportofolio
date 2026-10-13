"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, KeyRound, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError("Masukkan PIN admin terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "PIN yang dimasukkan salah");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal melakukan verifikasi";
      setError(msg);
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/en"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Portofolio Publik</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text)]">Admin Portal</h1>
              <p className="text-xs text-[var(--text-muted)]">
                Bayu Portfolio CMS &bull; Khusus Owner
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/25 text-[var(--error)] text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="pin-input"
                className="block text-xs font-semibold text-[var(--text)] uppercase tracking-wider mb-2"
              >
                Masukkan PIN Rahasia
              </label>
              <div className="relative">
                <input
                  id="pin-input"
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    setError(null);
                    setPin(e.target.value);
                  }}
                  placeholder="&bull; &bull; &bull; &bull;"
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-xl text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                  autoFocus
                  disabled={isLoading}
                />
                <KeyRound className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="mt-2 text-[11px] text-[var(--text-muted)] text-center">
                PIN default pengembangan: <code className="font-mono font-bold text-[var(--accent)]">1234</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || pin.length === 0}
              className="w-full py-3 px-4 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 disabled:opacity-50 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Buka Dashboard</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
