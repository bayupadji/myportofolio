import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--text)] px-4">
      <div className="max-w-md text-center">
        <span className="text-6xl font-extrabold text-[var(--accent)] block mb-4">
          404
        </span>
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Page Not Found / Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-[var(--text-muted)] mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/en/work"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-sm hover:opacity-90 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Work / Lihat karya saya</span>
        </Link>
      </div>
    </div>
  );
}
