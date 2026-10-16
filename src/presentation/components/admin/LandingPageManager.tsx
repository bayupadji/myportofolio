"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  BarChart3,
  FolderGit2,
  Compass,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
  CheckCircle2,
  Zap,
  Check,
} from "lucide-react";
import { Profile, HeroMetric, ProcessStepItem, CtaBannerContent } from "@/domain/entities/Profile";
import { Project } from "@/domain/entities/Project";
import { ImageUploadDropzone } from "./ImageUploadDropzone";
import { toast } from "@/presentation/components/ui/Toast";
import { useUpdateProfileMutation } from "@/presentation/hooks/useAdminQueries";

interface LandingPageManagerProps {
  initialProfile: Profile;
  allProjects: Project[];
}

export const LandingPageManager: React.FC<LandingPageManagerProps> = ({
  initialProfile,
  allProjects,
}) => {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const updateProfileMutation = useUpdateProfileMutation();
  const isSaving = updateProfileMutation.isPending;

  // Accordion open/close states
  const [openSections, setOpenSections] = useState({
    hero: true,
    metrics: true,
    projects: false,
    process: false,
    cta: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Featured projects list
  const featuredIds = profile.featuredProjectIds || allProjects.slice(0, 4).map((p) => p.id);

  const toggleFeaturedProject = (projectId: string) => {
    let updated: string[];
    if (featuredIds.includes(projectId)) {
      updated = featuredIds.filter((id) => id !== projectId);
    } else {
      updated = [...featuredIds, projectId];
    }
    setProfile((prev) => ({ ...prev, featuredProjectIds: updated }));
  };

  // Metrics helper
  const handleMetricChange = (idx: number, field: keyof HeroMetric, val: string) => {
    const updated = [...profile.keyMetrics];
    if (field === "value") {
      updated[idx] = { ...updated[idx], value: val };
    } else if (field === "label") {
      updated[idx] = { ...updated[idx], label: { en: val, id: val } };
    } else if (field === "description") {
      updated[idx] = { ...updated[idx], description: { en: val, id: val } };
    }
    setProfile((prev) => ({ ...prev, keyMetrics: updated }));
  };

  // Process steps helper
  const handleProcessChange = (idx: number, field: "title" | "description", val: string) => {
    const defaultSteps: ProcessStepItem[] = profile.processSteps || [
      { stepNumber: 1, title: { en: "Discover & Understand", id: "" }, description: { en: "", id: "" } },
      { stepNumber: 2, title: { en: "Architecture & Wireframes", id: "" }, description: { en: "", id: "" } },
      { stepNumber: 3, title: { en: "Interactive UI & Testing", id: "" }, description: { en: "", id: "" } },
      { stepNumber: 4, title: { en: "Handoff, Scale & Impact", id: "" }, description: { en: "", id: "" } },
    ];
    const updated = [...defaultSteps];
    if (field === "title") {
      updated[idx] = { ...updated[idx], title: { en: val, id: val } };
    } else {
      updated[idx] = { ...updated[idx], description: { en: val, id: val } };
    }
    setProfile((prev) => ({ ...prev, processSteps: updated }));
  };

  // CTA banner helper
  const ctaBanner: CtaBannerContent = profile.ctaBanner || {
    badge: { en: "Open to New Opportunities", id: "Open to New Opportunities" },
    headline: { en: "Have a product challenge or an open role to discuss?", id: "" },
    description: { en: "I am ready to help turn your product ideas into intuitive, fast, and measurable digital experiences.", id: "" },
    primaryButtonText: { en: "Discuss a project", id: "Discuss a project" },
  };

  const handleCtaChange = (field: keyof CtaBannerContent, val: string) => {
    setProfile((prev) => ({
      ...prev,
      ctaBanner: {
        ...ctaBanner,
        [field]: { en: val, id: val },
      },
    }));
  };

  const handleToggleFreelance = () => {
    const nextState = !profile.isAvailableForFreelance;
    let nextStatus = profile.availabilityStatus?.en || "";
    if (
      !nextState &&
      (!nextStatus ||
        nextStatus.includes("Available for Full-time") ||
        nextStatus.includes("Available for Q4"))
    ) {
      nextStatus = "Limited Availability / Waitlist";
    } else if (
      nextState &&
      (!nextStatus || nextStatus.includes("Limited Availability"))
    ) {
      nextStatus = "Available for Full-time & Selected Freelance";
    }
    setProfile((prev) => ({
      ...prev,
      isAvailableForFreelance: nextState,
      availabilityStatus: { en: nextStatus, id: nextStatus },
    }));
    toast.info(
      nextState
        ? "Freelance availability enabled (Open for Work)."
        : "Freelance availability set to Limited.",
      "Availability Toggled"
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    try {
      await updateProfileMutation.mutateAsync(profile);
      setSavedSuccess(true);
      toast.success("Landing page settings saved successfully.", "Settings Saved");
      router.refresh();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save landing page settings", err);
      toast.error("Failed to save landing page settings. Please try again.");
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header & Global Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Landing Page Manager
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Customize all sections of your homepage (Hero, Impact Metrics, Featured Work, Process, & CTA Banner).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <div className="px-3.5 py-2 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/25 text-[var(--success)] text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved successfully!</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-[var(--accent)] text-[var(--accent-contrast)] hover:opacity-90 font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Landing Page</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        {/* ============================================================ */}
        {/* ACCORDION 1: HERO & AVAILABILITY */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection("hero")}
            className="w-full p-5 flex items-center justify-between hover:bg-[var(--surface-hover)]/40 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-[var(--text)]">
                  1. Hero Section & Availability Status
                </h2>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Headline, value proposition, avatar photo, and freelance availability badge.
                </p>
              </div>
            </div>
            {openSections.hero ? (
              <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
            )}
          </button>

          {openSections.hero && (
            <div className="p-6 pt-2 border-t border-[var(--border)] space-y-5 bg-[var(--background)]/40">
              {/* Availability Toggle & Custom Text */}
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[var(--accent)]" />
                      <span className="font-bold text-xs text-[var(--text)]">
                        Freelance & Work Availability
                      </span>
                    </div>
                    <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">
                      Controls the live pulsating status pill in the hero header.
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-semibold text-xs px-2.5 py-1 rounded-full ${
                        profile.isAvailableForFreelance
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}
                    >
                      {profile.isAvailableForFreelance
                        ? "Available for Projects"
                        : "Limited Availability"}
                    </span>
                    <button
                      type="button"
                      onClick={handleToggleFreelance}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        profile.isAvailableForFreelance ? "bg-[var(--accent)]" : "bg-zinc-600"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          profile.isAvailableForFreelance ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)]/70 space-y-1">
                  <label className="block font-semibold text-xs text-[var(--text)]">
                    Hero Status Pill Text
                  </label>
                  <p className="text-[11px] text-[var(--text-muted)] mb-1">
                    The text displayed in the pulsing status pill in the hero header.
                  </p>
                  <input
                    type="text"
                    value={profile.availabilityStatus?.en || ""}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        availabilityStatus: {
                          en: e.target.value,
                          id: e.target.value,
                        },
                      })
                    }
                    placeholder={
                      profile.isAvailableForFreelance
                        ? "Available for Full-time & Selected Freelance"
                        : "Limited Availability / Waitlist"
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text)] font-medium text-xs"
                  />
                </div>
              </div>

              {/* Avatar Photo Dropzone */}
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-3">
                <label className="block font-semibold text-[var(--text)]">
                  Hero Avatar Photo (1:1 Ratio)
                </label>
                <ImageUploadDropzone
                  label="Upload & Compress Profile Photo (WebP)"
                  folder="profile"
                  onUploadComplete={(publicUrl) => {
                    setProfile((prev) => ({ ...prev, avatarUrl: publicUrl }));
                  }}
                />

                {profile.avatarUrl && (
                  <div className="pt-2 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.avatarUrl}
                      alt="Avatar preview"
                      className="w-12 h-12 rounded-xl object-cover border border-[var(--border)] shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-[var(--text-muted)] font-semibold block mb-0.5">
                        Current Avatar URL (or paste external URL):
                      </span>
                      <input
                        type="text"
                        value={profile.avatarUrl}
                        onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-[11px] font-mono rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Role Badge Text
                  </label>
                  <input
                    type="text"
                    value={profile.heroRole?.en || profile.role.en}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        heroRole: { en: e.target.value, id: e.target.value },
                      })
                    }
                    placeholder="Generalist Product Designer (UI/UX)"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={profile.heroHeadline?.en || "Hi, I’m Bayu."}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        heroHeadline: { en: e.target.value, id: e.target.value },
                      })
                    }
                    placeholder="Hi, I’m Bayu."
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Hero Value Statement (One-liner pitch)
                </label>
                <textarea
                  rows={2}
                  value={profile.heroValueStatement?.en || profile.headline.en}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      heroValueStatement: { en: e.target.value, id: e.target.value },
                    })
                  }
                  placeholder="Crafting intuitive, high-impact digital experiences across web, mobile, and complex systems."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* ACCORDION 2: KEY IMPACT METRICS STRIP */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection("metrics")}
            className="w-full p-5 flex items-center justify-between hover:bg-[var(--surface-hover)]/40 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-[var(--text)]">
                  2. Hero Key Impact Metrics Strip
                </h2>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  The counter metrics ribbon highlighted directly under your hero headline.
                </p>
              </div>
            </div>
            {openSections.metrics ? (
              <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
            )}
          </button>

          {openSections.metrics && (
            <div className="p-6 pt-2 border-t border-[var(--border)] space-y-4 bg-[var(--background)]/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {profile.keyMetrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2.5 shadow-xs"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)] block">
                      Card #{idx + 1}
                    </span>

                    <div>
                      <label className="block text-[10px] font-semibold mb-0.5 text-[var(--text-muted)]">
                        Value (e.g. 6+, 100M+, 28%)
                      </label>
                      <input
                        type="text"
                        value={m.value}
                        onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                        placeholder="e.g. 6+"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold mb-0.5 text-[var(--text-muted)]">
                        Label Title
                      </label>
                      <input
                        type="text"
                        value={m.label.en}
                        onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                        placeholder="Years Experience"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold mb-0.5 text-[var(--text-muted)]">
                        Short Subtitle
                      </label>
                      <input
                        type="text"
                        value={m.description.en}
                        onChange={(e) => handleMetricChange(idx, "description", e.target.value)}
                        placeholder="Building B2B products"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* ACCORDION 3: FEATURED PROJECTS (SELECTED WORK) */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection("projects")}
            className="w-full p-5 flex items-center justify-between hover:bg-[var(--surface-hover)]/40 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-[var(--text)]">
                  3. Selected Work (Featured on Homepage)
                </h2>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Pick which case studies appear in the &ldquo;Selected Work&rdquo; grid on the landing page ({featuredIds.length} selected).
                </p>
              </div>
            </div>
            {openSections.projects ? (
              <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
            )}
          </button>

          {openSections.projects && (
            <div className="p-6 pt-2 border-t border-[var(--border)] space-y-4 bg-[var(--background)]/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allProjects.map((project) => {
                  const isChecked = featuredIds.includes(project.id);
                  return (
                    <div
                      key={project.id}
                      onClick={() => toggleFeaturedProject(project.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? "border-[var(--accent)] bg-[var(--accent)]/5 shadow-xs"
                          : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]/50 opacity-75"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.coverUrl}
                          alt={project.title.en}
                          className="w-14 h-9 rounded-lg object-cover border border-[var(--border)] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-[var(--text)] truncate block">
                            {project.title.en}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)] block">
                            {project.category} &bull; {project.status}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                            : "border border-[var(--border)] bg-[var(--background)]"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* ACCORDION 4: 4-STEP DESIGN PROCESS */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection("process")}
            className="w-full p-5 flex items-center justify-between hover:bg-[var(--surface-hover)]/40 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-[var(--text)]">
                  4. Design Methodology (4-Step Process Section)
                </h2>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  How you approach product problems from discovery to scalable delivery.
                </p>
              </div>
            </div>
            {openSections.process ? (
              <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
            )}
          </button>

          {openSections.process && (
            <div className="p-6 pt-2 border-t border-[var(--border)] space-y-4 bg-[var(--background)]/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(profile.processSteps || [
                  { stepNumber: 1, title: { en: "Discover & Understand", id: "" }, description: { en: "Deep-dive into business telemetry, user friction points, and stakeholder interviews.", id: "" } },
                  { stepNumber: 2, title: { en: "Architecture & Wireframes", id: "" }, description: { en: "Draft progressive user journeys, edge cases, and rapid low-fidelity layouts.", id: "" } },
                  { stepNumber: 3, title: { en: "Interactive UI & Testing", id: "" }, description: { en: "Build production-ready components, design tokens, and conduct moderated usability sessions.", id: "" } },
                  { stepNumber: 4, title: { en: "Handoff, Scale & Impact", id: "" }, description: { en: "Pair closely with engineering teams, define QA edge states, and measure post-launch analytics.", id: "" } },
                ]).map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-[10px] flex items-center justify-center">
                        {step.stepNumber}
                      </span>
                      <span className="font-bold text-xs text-[var(--text)]">
                        Step {step.stepNumber}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold mb-0.5 text-[var(--text-muted)]">
                        Step Title
                      </label>
                      <input
                        type="text"
                        value={step.title.en}
                        onChange={(e) => handleProcessChange(idx, "title", e.target.value)}
                        placeholder="e.g. Discover & Understand"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold mb-0.5 text-[var(--text-muted)]">
                        Step Explanation
                      </label>
                      <textarea
                        rows={2}
                        value={step.description.en}
                        onChange={(e) => handleProcessChange(idx, "description", e.target.value)}
                        placeholder="Explain this phase..."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text)] text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* ACCORDION 5: BOTTOM CTA BANNER CARD */}
        {/* ============================================================ */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => toggleSection("cta")}
            className="w-full p-5 flex items-center justify-between hover:bg-[var(--surface-hover)]/40 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-[var(--text)]">
                  5. Bottom High-Impact CTA Banner Card
                </h2>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  The conversion card shown at the bottom of the landing page inviting recruiters or clients to contact you.
                </p>
              </div>
            </div>
            {openSections.cta ? (
              <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
            )}
          </button>

          {openSections.cta && (
            <div className="p-6 pt-2 border-t border-[var(--border)] space-y-4 bg-[var(--background)]/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Banner Badge Label
                  </label>
                  <input
                    type="text"
                    value={ctaBanner.badge?.en || "Open to New Opportunities"}
                    onChange={(e) => handleCtaChange("badge", e.target.value)}
                    placeholder="Open to New Opportunities"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[var(--text)]">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaBanner.primaryButtonText.en}
                    onChange={(e) => handleCtaChange("primaryButtonText", e.target.value)}
                    placeholder="Discuss a project"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={ctaBanner.headline.en}
                  onChange={(e) => handleCtaChange("headline", e.target.value)}
                  placeholder="Have a product challenge or an open role to discuss?"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text)]">
                  Supporting Pitch Description
                </label>
                <textarea
                  rows={2}
                  value={ctaBanner.description.en}
                  onChange={(e) => handleCtaChange("description", e.target.value)}
                  placeholder="I am ready to help turn your product ideas into intuitive, fast, and measurable digital experiences."
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                />
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
