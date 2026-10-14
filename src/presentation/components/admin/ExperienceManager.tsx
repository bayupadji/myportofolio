"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Layers,
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { Experience, ExperienceBullet } from "@/domain/entities/Experience";
import { Service } from "@/domain/entities/Service";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { WysiwygEditor } from "@/presentation/components/ui/WysiwygEditor";
import {
  useSaveExperienceMutation,
  useDeleteExperienceMutation,
  useSaveServiceMutation,
  useDeleteServiceMutation,
} from "@/presentation/hooks/useAdminQueries";

function bulletsToHtml(bullets: ExperienceBullet[]): string {
  if (!bullets || bullets.length === 0) return "";
  const texts = bullets.map((b) => b.fullText?.en || b.action?.en || "").filter(Boolean);
  if (texts.length === 0) return "";

  // If already structured HTML (e.g. <ul>, <li>, <p>)
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
  if (!trimmed) {
    return [];
  }

  return [
    {
      action: { en: trimmed, id: trimmed },
      context: { en: "", id: "" },
      result: { en: "", id: "" },
      fullText: { en: trimmed, id: trimmed },
    },
  ];
}

interface ExperienceManagerProps {
  initialExperiences: Experience[];
  initialServices: Service[];
}

export const ExperienceManager: React.FC<ExperienceManagerProps> = ({
  initialExperiences,
  initialServices,
}) => {
  const [activeTab, setActiveTab] = useState<"experiences" | "services">("experiences");
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [services, setServices] = useState<Service[]>(initialServices);

  // Experience modal state
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [editorHtml, setEditorHtml] = useState<string>("");
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [isSavingExp, setIsSavingExp] = useState(false);

  // Service modal state
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isSavingService, setIsSavingService] = useState(false);

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
          action: { en: "Led product design", id: "Memimpin desain produk" },
          context: { en: "for fintech platform", id: "untuk platform fintech" },
          result: { en: "increasing retention by 15%", id: "meningkatkan retensi 15%" },
          fullText: {
            en: "Led product design for fintech platform, increasing retention by 15%.",
            id: "Memimpin desain produk untuk platform fintech, meningkatkan retensi 15%.",
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

  const saveExpMutation = useSaveExperienceMutation();
  const deleteExpMutation = useDeleteExperienceMutation();
  const saveServiceMutation = useSaveServiceMutation();
  const deleteServiceMutation = useDeleteServiceMutation();

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
    setIsSavingExp(true);
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
    } finally {
      setIsSavingExp(false);
    }
  };

  // Handlers for Services
  const handleOpenNewService = () => {
    const emptyService: Service = {
      id: `srv-${Date.now()}`,
      slug: "",
      title: { en: "", id: "" },
      summary: { en: "", id: "" },
      targetAudience: { en: "Early-stage startups", id: "Early-stage startups" },
      deliverables: [{ en: "Complete Figma source files", id: "Complete Figma source files" }],
      processSteps: [],
      order: services.length + 1,
      status: "available",
    };
    setEditingService(emptyService);
    setIsServiceModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
    setIsServiceModalOpen(true);
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!window.confirm(`Delete service "${title}"?`)) return;
    try {
      await deleteServiceMutation.mutateAsync(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveService = async () => {
    if (!editingService || !editingService.title.en.trim()) return;
    setIsSavingService(true);
    try {
      await saveServiceMutation.mutateAsync(editingService);
      setServices((prev) => {
        const exists = prev.some((e) => e.id === editingService.id);
        if (exists) {
          return prev.map((e) => (e.id === editingService.id ? editingService : e));
        }
        return [...prev, editingService];
      });
      setIsServiceModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingService(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Experience & Services
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Manage your career timeline and freelance service offerings.
          </p>
        </div>

        {activeTab === "experiences" ? (
          <button
            onClick={handleOpenNewExp}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Work Experience</span>
          </button>
        ) : (
          <button
            onClick={handleOpenNewService}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab("experiences")}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === "experiences"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Work Experience ({experiences.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === "services"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Freelance Services ({services.length})</span>
        </button>
      </div>

      {/* TAB 1: EXPERIENCES LIST */}
      {activeTab === "experiences" && (
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

      {/* TAB 2: SERVICES LIST */}
      {activeTab === "services" && (
        <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
          {services.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              No freelance services created yet.
            </div>
          ) : (
            services.map((srv) => (
              <div
                key={srv.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-hover)]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-[var(--text)]">
                      {srv.title.en}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        srv.status === "available"
                          ? "bg-[var(--success)]/10 text-[var(--success)]"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {srv.status}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {srv.summary.en}
                  </p>
                  <div className="text-[11px] text-[var(--text-muted)] mt-1">
                    Audience: <span className="text-[var(--text)] font-semibold">{srv.targetAudience.en}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEditService(srv)}
                    className="p-2 rounded-xl border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(srv.id, srv.title.en)}
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

      {/* Experience Modal */}
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
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
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
                        Active Logo URL (can be edited manually):
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
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
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
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
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

      {/* Service Modal */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h2 className="font-bold text-base text-[var(--text)]">
                {editingService.title.en ? `Edit: ${editingService.title.en}` : "Add New Service"}
              </h2>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] cursor-pointer hover:bg-[var(--surface-hover)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={editingService.title.en}
                  onChange={(e) => {
                    const val = e.target.value;
                    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    setEditingService({
                      ...editingService,
                      title: { en: val, id: val },
                      slug: editingService.slug || slug,
                    });
                  }}
                  placeholder="Design Sprint & Rapid Prototyping"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Service Summary / Description
                </label>
                <textarea
                  rows={2}
                  value={editingService.summary.en}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      summary: { en: e.target.value, id: e.target.value },
                    })
                  }
                  placeholder="Brief summary of what this service solves..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={editingService.targetAudience.en}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        targetAudience: { en: e.target.value, id: e.target.value },
                      })
                    }
                    placeholder="Early-stage startups, B2B SaaS"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Service Status
                  </label>
                  <select
                    value={editingService.status}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        status: e.target.value as Service["status"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                  >
                    <option value="available">Available (Open for briefs)</option>
                    <option value="limited">Limited (Few slots left)</option>
                    <option value="booked">Booked (Fully booked)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveService}
                disabled={isSavingService}
                className="px-5 py-2 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSavingService ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
