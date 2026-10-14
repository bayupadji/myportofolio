"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Loader2,
} from "lucide-react";
import { Service } from "@/domain/entities/Service";
import {
  useSaveServiceMutation,
  useDeleteServiceMutation,
} from "@/presentation/hooks/useAdminQueries";

interface ServicesManagerProps {
  initialServices: Service[];
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({
  initialServices,
}) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const saveServiceMutation = useSaveServiceMutation();
  const deleteServiceMutation = useDeleteServiceMutation();
  const isSaving = saveServiceMutation.isPending;

  const handleOpenNew = () => {
    const emptyService: Service = {
      id: `srv-${Date.now()}`,
      slug: "",
      title: { en: "", id: "" },
      summary: { en: "", id: "" },
      targetAudience: { en: "Early-stage startups & scale-ups", id: "Early-stage startups & scale-ups" },
      deliverables: [
        { en: "High-fidelity Figma source files & interactive prototypes", id: "" },
        { en: "Design token taxonomy & developer handoff documentation", id: "" },
      ],
      processSteps: [],
      order: services.length + 1,
      status: "available",
    };
    setEditingService(emptyService);
    setIsModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Permanently delete service "${title}"?`)) return;
    try {
      await deleteServiceMutation.mutateAsync(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!editingService || !editingService.title.en.trim()) return;
    try {
      const slug =
        editingService.slug ||
        editingService.title.en
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

      const payload = {
        ...editingService,
        slug,
      };

      await saveServiceMutation.mutateAsync(payload);
      setServices((prev) => {
        const exists = prev.some((s) => s.id === payload.id);
        if (exists) {
          return prev.map((s) => (s.id === payload.id ? payload : s));
        }
        return [...prev, payload];
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              Freelance Services Manager
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-muted)]">
              {services.length} Offerings
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Manage your service offerings, target audiences, deliverables, and availability status.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List */}
      <div className="border border-[var(--border)] rounded-2xl bg-[var(--surface)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
        {services.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)]">
            No freelance services configured yet. Click &ldquo;Add New Service&rdquo; to create one.
          </div>
        ) : (
          services.map((srv) => (
            <div
              key={srv.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-hover)]/40 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[var(--text)]">{srv.title.en}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                      srv.status === "available"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {srv.status}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    &bull; For: {srv.targetAudience.en}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)]">{srv.summary.en}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {srv.deliverables.slice(0, 3).map((d, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--text-muted)]"
                    >
                      {d.en}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(srv)}
                  className="p-2 rounded-xl border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-hover)] cursor-pointer"
                  title="Edit Service"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(srv.id, srv.title.en)}
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

      {/* Edit / Create Service Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h2 className="font-bold text-base text-[var(--text)]">
                {editingService.title.en ? `Edit: ${editingService.title.en}` : "Add New Service"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] cursor-pointer hover:bg-[var(--surface-hover)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Service Title *
                </label>
                <input
                  type="text"
                  value={editingService.title.en}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      title: { en: e.target.value, id: e.target.value },
                    })
                  }
                  placeholder="e.g. End-to-End Product Design"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
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
                    placeholder="e.g. Early-stage startups & scale-ups"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Availability Status
                  </label>
                  <select
                    value={editingService.status}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        status: e.target.value as Service["status"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] font-semibold"
                  >
                    <option value="available">Available (Active)</option>
                    <option value="limited">Limited</option>
                    <option value="full">Fully Booked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  One-Line Summary Pitch
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
                  placeholder="Comprehensive product design from user discovery to production-ready Figma handoff..."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Key Deliverables
                </label>
                <div className="space-y-2">
                  {editingService.deliverables.map((d, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={d.en}
                        onChange={(e) => {
                          const updated = [...editingService.deliverables];
                          updated[dIdx] = { en: e.target.value, id: e.target.value };
                          setEditingService({ ...editingService, deliverables: updated });
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingService.deliverables.filter((_, i) => i !== dIdx);
                          setEditingService({ ...editingService, deliverables: updated });
                        }}
                        className="p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setEditingService({
                        ...editingService,
                        deliverables: [
                          ...editingService.deliverables,
                          { en: "New deliverable item", id: "New deliverable item" },
                        ],
                      });
                    }}
                    className="text-xs text-[var(--accent)] font-semibold hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add deliverable</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save Service</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
