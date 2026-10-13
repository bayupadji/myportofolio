"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Save,
  Loader2,
  CheckCircle2,
  Zap,
  Globe,
  FileText,
  Mail,
  MapPin,
} from "lucide-react";
import { Profile } from "@/domain/entities/Profile";
import { ImageUploadDropzone } from "./ImageUploadDropzone";

interface ProfileManagerProps {
  initialProfile: Profile;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  initialProfile,
}) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              Profil & Ketersediaan
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Ubah identitas profesional, bio dwibahasa, status ketersediaan kerja, dan tautan resume.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-2 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/25 text-[var(--success)] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Perubahan berhasil disimpan!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Availability Card */}
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-[var(--text)]">
                  Status Ketersediaan Freelance / Hiring
                </h2>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Ditampilkan pada Header publik, banner Hero, dan halaman Services.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setProfile({
                  ...profile,
                  isAvailableForFreelance: !profile.isAvailableForFreelance,
                })
              }
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors min-h-[36px] ${
                profile.isAvailableForFreelance
                  ? "bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/25"
                  : "bg-amber-500/10 text-amber-500 border border-amber-500/25"
              }`}
            >
              {profile.isAvailableForFreelance ? "Open (Tersedia)" : "Limited (Terbatas)"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold mb-1 text-[var(--text)]">
                Teks Status (English)
              </label>
              <input
                type="text"
                value={profile.availabilityStatus.en}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    availabilityStatus: {
                      ...profile.availabilityStatus,
                      en: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[var(--text)]">
                Teks Status (Indonesian)
              </label>
              <input
                type="text"
                value={profile.availabilityStatus.id}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    availabilityStatus: {
                      ...profile.availabilityStatus,
                      id: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
              />
            </div>
          </div>
        </div>

        {/* Basic Info Card */}
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border)]">
            <UserCheck className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="font-bold text-sm text-[var(--text)]">
              Informasi Utama Desainer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-[var(--text)]">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[var(--text)] flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                Email Publik
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[var(--text)] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                Lokasi Domisili
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
              />
            </div>
          </div>

          {/* Role EN & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-[var(--text)]">
                Jabatan / Role (English)
              </label>
              <input
                type="text"
                value={profile.role.en}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    role: { ...profile.role, en: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[var(--text)]">
                Jabatan / Role (Indonesian)
              </label>
              <input
                type="text"
                value={profile.role.id}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    role: { ...profile.role, id: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
              />
            </div>
          </div>

          {/* Headline EN & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-[var(--text)]">
                Headline Hero (English)
              </label>
              <textarea
                rows={2}
                value={profile.headline.en}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    headline: { ...profile.headline, en: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[var(--text)]">
                Headline Hero (Indonesian)
              </label>
              <textarea
                rows={2}
                value={profile.headline.id}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    headline: { ...profile.headline, id: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
              />
            </div>
          </div>

          {/* Bio Summary EN & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-[var(--text)]">
                About Bio Story (English)
              </label>
              <textarea
                rows={3}
                value={profile.summary.en}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    summary: { ...profile.summary, en: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-[var(--text)]">
                About Bio Story (Indonesian)
              </label>
              <textarea
                rows={3}
                value={profile.summary.id}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    summary: { ...profile.summary, id: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
              />
            </div>
          </div>
        </div>

        {/* Media & Resume Assets */}
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border)]">
            <FileText className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="font-bold text-sm text-[var(--text)]">
              Foto Avatar & Tautan CV
            </h2>
          </div>

          <div className="space-y-4">
            {/* Avatar Dropzone */}
            <div className="space-y-2">
              <label className="block font-semibold text-[var(--text)]">
                Foto Profil / Headshot Avatar (Rasio 1:1)
              </label>
              <ImageUploadDropzone
                label="Upload & Kompres Avatar Profil ke Supabase"
                preset="avatar"
                bucket="portfolio-assets"
                folder="avatars"
                onUploadComplete={(publicUrl) => {
                  setProfile((prev) => ({ ...prev, avatarUrl: publicUrl }));
                }}
              />
            </div>

            {/* Avatar Preview & Manual URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  URL Foto Profil (Aktif)
                </label>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatarUrl}
                    alt="Preview avatar"
                    className="w-12 h-12 object-cover rounded-full border border-[var(--border)] bg-zinc-800 shrink-0"
                  />
                  <input
                    type="text"
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] font-mono text-[11px]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  URL / Path File CV Resume (PDF)
                </label>
                <input
                  type="text"
                  value={profile.cvUrl}
                  onChange={(e) => setProfile({ ...profile, cvUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] font-mono text-[11px]"
                  placeholder="/cv.pdf atau URL storage..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--border)]">
            <Globe className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="font-bold text-sm text-[var(--text)]">
              Tautan Sosial & Portofolio Eksternal
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.socialLinks.map((link, idx) => (
              <div key={link.platform} className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] space-y-2">
                <span className="font-bold text-[var(--text)] capitalize block">
                  {link.platform}
                </span>
                <input
                  type="text"
                  value={link.url}
                  placeholder={`https://${link.platform}.com/...`}
                  onChange={(e) => {
                    const newLinks = [...profile.socialLinks];
                    newLinks[idx] = { ...newLinks[idx], url: e.target.value };
                    setProfile({ ...profile, socialLinks: newLinks });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan Profil...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
