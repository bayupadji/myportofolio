"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";

function SessionStatusBanner() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const expired = searchParams.get("expired");

  if (!reason && !expired) return null;

  let message = "Sesi Anda telah berakhir. Silakan login kembali.";
  if (reason === "idle") {
    message =
      "Sesi Anda telah berakhir karena tidak ada aktivitas selama 30 menit. Silakan login kembali.";
  } else if (reason === "absolute") {
    message =
      "Batas waktu sesi 2 jam telah tercapai. Demi keamanan, silakan login kembali.";
  }

  return (
    <div
      role="status"
      className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-2.5 animate-in fade-in"
    >
      <Clock className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <span>{message}</span>
    </div>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Masukkan username dan password admin.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Autentikasi gagal. Periksa kredensial Anda.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Autentikasi gagal";
      setError(msg);
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] bg-designer-grid flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Ambient Lighting */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-[var(--accent)]/10 blur-[120px] pointer-events-none rounded-full"
        aria-hidden="true"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Web Portofolio</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-[var(--border)]">
            <div className="w-11 h-11 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center font-bold shadow-2xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[var(--text)] leading-tight text-balance">
                  Admin Control Center
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  SQLite DB
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Bayu Portfolio CMS &bull; Drizzle ORM
              </p>
            </div>
          </div>

          <Suspense fallback={null}>
            <SessionStatusBanner />
          </Suspense>

          {error && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/25 text-[var(--error)] text-xs flex items-center gap-2.5 animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username-input"
                className="block text-xs font-mono font-semibold text-[var(--text)] uppercase tracking-wider mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username-input"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setError(null);
                    setUsername(e.target.value);
                  }}
                  placeholder="skyviadmin"
                  required
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all font-mono"
                  disabled={isLoading}
                />
                <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password-input"
                className="block text-xs font-mono font-semibold text-[var(--text)] uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setError(null);
                    setPassword(e.target.value);
                  }}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all font-mono"
                  disabled={isLoading}
                  autoFocus
                />
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !username.trim() || !password}
              className="w-full py-3 px-4 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-95 disabled:opacity-50 font-semibold rounded-xl text-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[var(--accent)]/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi akun...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

