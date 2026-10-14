"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Briefcase,
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Loader2,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
} from "lucide-react";
import { Profile } from "@/domain/entities/Profile";
import { Experience, ExperienceBullet } from "@/domain/entities/Experience";
import { Skill } from "@/domain/entities/Skill";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { WysiwygEditor } from "@/presentation/components/ui/WysiwygEditor";
import {
  useUpdateProfileMutation,
  useSaveExperienceMutation,
  useDeleteExperienceMutation,
} from "@/presentation/hooks/useAdminQueries";

function bulletsToHtml(bullets: ExperienceBullet[]): string {
  if (!bullets || bullets.length === 0) return "";
  const texts = bullets.map((b) => b.fullText?.en || b.action?.en || "").filter(Boolean);
  if (texts.length === 0) return "";

  if (texts.length === 1 && /<\/?[a-z][\s\S]*>/i.test(texts[0])) {
    return texts[0];
  }
  return `<ul>${texts.map((t) => `<li>${t}</li>`).join("")}</ul>`;
}

function htmlToBullets(html: string): ExperienceBullet[] {
  if (typeof window === "undefined") {
    return [
      {
        action: { en: html, id: html },
        context: { en: "", id: "" },
        result: { en: "", id: "" },
        fullText: { en: html, id: html },
      },
    ];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const liElements = Array.from(doc.querySelectorAll("li"));

  if (liElements.length > 0) {
    return liElements
      .map((li) => {
        const inner = li.innerHTML.trim();
        return {
          action: { en: inner, id: inner },
          context: { en: "", id: "" },
          result: { en: "", id: "" },
          fullText: { en: inner, id: inner },
        };
      })
      .filter((b) => b.fullText.en.length > 0);
  }

  const pElements = Array.from(doc.querySelectorAll("p"));
  if (pElements.length > 0) {
    return pElements
      .map((p) => {
        const inner = p.innerHTML.trim();
        return {
          action: { en: inner, id: inner },
          context: { en: "", id: "" },
          result: { en: "", id: "" },
          fullText: { en: inner, id: inner },
        };
      })
      .filter((b) => b.fullText.en.length > 0);
  }

  const trimmed = html.trim();
  if (!trimmed) return [];

  return [
    {
      action: { en: trimmed, id: trimmed },
      context: { en: "", id: "" },
      result: { en: "", id: "" },
      fullText: { en: trimmed, id: trimmed },
    },
  ];
}

interface AboutManagerProps {
  initialProfile: Profile;
  initialExperiences: Experience[];
  initialSkills: Skill[];
}

export const AboutManager: React.FC<AboutManagerProps> = ({
  initialProfile,
  initialExperiences,
  initialSkills,
}) => {
  const [activeTab, setActiveTab] = useState<"bio" | "experience">("bio");
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [skills] = useState<Skill[]>(initialSkills);

  const updateProfileMutation = useUpdateProfileMutation();
  const saveExpMutation = useSaveExperienceMutation();
  const deleteExpMutation = useDeleteExperienceMutation();

  const isSavingProfile = updateProfileMutation.isPending;
  const isSavingExp = saveExpMutation.isPending;
  const [profileSaved, setProfileSaved] = useState(false);

  // Experience modal state
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [editorHtml, setEditorHtml] = useState<string>("");
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);

  // Handlers for Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(false);
    try {
      await updateProfileMutation.mutateAsync(profile);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for Experience
  const handleOpenNewExp = () => {
    const emptyExp: Experience = {
      id: `exp-${Date.now()}`,
      company: "",
      logoUrl: "",
      role: { en: "", id: "" },
      period: { en: "2024 — Present", id: "2024 — Sekarang" },
      location: "Jakarta / Remote",
      bullets: [
        {
          action: { en: "Led product design", id: "Led product design" },
          context: { en: "for fintech platform", id: "for fintech platform" },
          result: { en: "increasing retention by 15%", id: "increasing retention by 15%" },
          fullText: {
            en: "Led product design for fintech platform, increasing retention by 15%.",
            id: "Led product design for fintech platform, increasing retention by 15%.",
          },
        },
      ],
      skillsUsed: ["Figma", "Design Systems"],
      order: experiences.length + 1,
    };
    setEditingExp(emptyExp);
    setEditorHtml(bulletsToHtml(emptyExp.bullets));
    setIsExpModalOpen(true);
  };

  const handleEditExp = (exp: Experience) => {
    setEditingExp({ ...exp });
    setEditorHtml(bulletsToHtml(exp.bullets));
    setIsExpModalOpen(true);
  };

  const handleDeleteExp = async (id: string, company: string) => {
    if (!window.confirm(`Delete work experience at "${company}"?`)) return;
    try {
      await deleteExpMutation.mutateAsync(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveExp = async () => {
    if (!editingExp || !editingExp.company.trim()) return;
    try {
      await saveExpMutation.mutateAsync(editingExp);
      setExperiences((prev) => {
        const exists = prev.some((e) => e.id === editingExp.id);
        if (exists) {
          return prev.map((e) => (e.id === editingExp.id ? editingExp : e));
        }
        return [editingExp, ...prev];
      });
      setIsExpModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            About Me Manager
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Manage your personal bio story, career timeline, resume link, and design skills.
          </p>
        </div>

        {activeTab === "experience" && (
          <button
            onClick={handleOpenNewExp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Work Experience</span>
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab("bio")}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === "bio"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Bio, Resume & Skills</span>
        </button>
        <button
          onClick={() => setActiveTab("experience")}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === "experience"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Career Timeline ({experiences.length})</span>
        </button>
      </div>

      {/* TAB 1: BIO, RESUME & SKILLS */}
      {activeTab === "bio" && (
        <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
          {profileSaved && (
            <div className="p-3.5 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/25 text-[var(--success)] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Bio and profile details saved successfully!</span>
            </div>
          )}

          {/* Basic Identity */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-[var(--text)]">Professional Identity</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Bayu"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">Public Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="bayu.design@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">Location & Timezone</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="Jakarta, Indonesia (UTC+7)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                  />
                </div>
              </div>
            </div>

            {/* About Bio Narrative */}
            <div className="space-y-1.5 pt-2">
              <label className="block font-semibold text-[var(--text)]">
                About Narrative Story (WYSIWYG)
              </label>
              <p className="text-[11px] text-[var(--text-muted)] mb-1">
                Your personal journey, design philosophy, and career summary displayed on the /about page.
              </p>
              <WysiwygEditor
                value={profile.summary.en}
                onChange={(html) =>
                  setProfile({
                    ...profile,
                    summary: { en: html, id: html },
                  })
                }
                minHeight="140px"
              />
            </div>
          </div>

          {/* Resume & Social Links */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-[var(--text)]">Resume & Social Profiles</h2>

            <div>
              <label className="block font-semibold mb-1 text-[var(--text)]">
                Resume / CV Download URL (PDF)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={profile.cvUrl}
                  onChange={(e) => setProfile({ ...profile, cvUrl: e.target.value })}
                  placeholder="/cv/Bayu-Product-Designer-Resume.pdf"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {profile.socialLinks.map((link, idx) => (
                <div key={idx} className="space-y-1">
                  <label className="block font-semibold text-[var(--text)]">
                    {link.platform} URL
                  </label>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...profile.socialLinks];
                      updated[idx] = { ...updated[idx], url: e.target.value };
                      setProfile({ ...profile, socialLinks: updated });
                    }}
                    placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Skills Matrix Overview */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-[var(--text)]">Design Skills Matrix</h2>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Skills categorized across research, UX, UI, and tools ({skills.length} skills listed).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--text)]"
                >
                  <span className="font-semibold">{s.name}</span>
                  <span className="text-[10px] text-[var(--text-muted)] ml-1.5 opacity-70">
                    ({s.group})
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-6 py-2.5 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save About Details</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: CAREER TIMELINE (EXPERIENCES) */}
      {activeTab === "experience" && (
        <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
          {experiences.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              No work experience entries recorded yet.
            </div>
          ) : (
            experiences.map((exp) => (
              <div
                key={exp.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-hover)]/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {exp.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={exp.logoUrl}
                      alt={exp.company}
                      className="w-12 h-12 object-contain p-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] flex items-center justify-center font-bold text-xs text-[var(--accent)] shrink-0">
                      {exp.company ? exp.company.slice(0, 2).toUpperCase() : "CO"}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-sm text-[var(--text)]">
                        {exp.company}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent)]/10 text-[var(--accent)] font-semibold">
                        {exp.role.en}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {exp.period.en} &bull; {exp.location}
                    </p>
                    <div
                      className="text-xs text-[var(--text-muted)] mt-1.5 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          exp.bullets
                            .map((b) => b.fullText?.en || b.action?.en)
                            .filter(Boolean)
                            .join(" &bull; ") || "No achievements recorded",
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEditExp(exp)}
                    className="p-2 rounded-xl border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] cursor-pointer"
                    title="Edit Experience"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteExp(exp.id, exp.company)}
                    className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Experience Edit/Create Modal */}
      {isExpModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h2 className="font-bold text-base text-[var(--text)]">
                {editingExp.company ? `Edit: ${editingExp.company}` : "Add Work Experience"}
              </h2>
              <button
                onClick={() => setIsExpModalOpen(false)}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] cursor-pointer hover:bg-[var(--surface-hover)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={editingExp.company}
                  onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                  placeholder="e.g. Tokopedia, Gojek, PayPulse"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                />
              </div>

              {/* Company Logo Dropzone & Preview */}
              <div className="space-y-2 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                <label className="block font-semibold text-[var(--text)]">
                  Company Logo (1:1 Ratio)
                </label>
                <ImageUploadDropzone
                  label="Upload & Compress Company Logo (WebP)"
                  folder="general"
                  onUploadComplete={(publicUrl) => {
                    setEditingExp((prev) => (prev ? { ...prev, logoUrl: publicUrl } : null));
                  }}
                />

                {editingExp.logoUrl && (
                  <div className="pt-1.5 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editingExp.logoUrl}
                      alt="Preview logo"
                      className="w-10 h-10 object-contain p-1 rounded-xl border border-[var(--border)] bg-zinc-800/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold text-[var(--text-muted)] block mb-0.5">
                        Active Logo URL (or edit manually):
                      </span>
                      <input
                        type="text"
                        value={editingExp.logoUrl}
                        onChange={(e) =>
                          setEditingExp({ ...editingExp, logoUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full px-2.5 py-1.5 text-[11px] font-mono rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    value={editingExp.role.en}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        role: { en: e.target.value, id: e.target.value },
                      })
                    }
                    placeholder="Senior Product Designer"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Time Period
                  </label>
                  <input
                    type="text"
                    value={editingExp.period.en}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        period: { en: e.target.value, id: e.target.value },
                      })
                    }
                    placeholder="2022 — Present"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Key Achievements & Impact (WYSIWYG)
                </label>
                <p className="text-[11px] text-[var(--text-muted)] mb-1.5">
                  Format achievements using bullet points, bold numbers/metrics, or switch to HTML mode.
                </p>
                <WysiwygEditor
                  value={editorHtml}
                  onChange={(newHtml) => {
                    setEditorHtml(newHtml);
                    setEditingExp((prev) => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        bullets: htmlToBullets(newHtml),
                      };
                    });
                  }}
                  placeholder="• Led product design reducing drop-off by 35%&#10;• Shipped high-impact design system used by 12 engineers"
                  minHeight="140px"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => setIsExpModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExp}
                disabled={isSavingExp}
                className="px-5 py-2 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSavingExp ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
