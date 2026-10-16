import React from "react";
import {
  FileText,
  GraduationCap,
  Sparkles,
  MapPin,
  CreditCard,
  Truck,
  Layers,
  Star,
} from "lucide-react";
import { Profile } from "@/domain/entities/Profile";
import { Experience } from "@/domain/entities/Experience";
import { Skill, SkillGroup } from "@/domain/entities/Skill";
import { Locale, resolveLocalized } from "@/domain/value-objects/LocalizedText";
import { Messages } from "@/presentation/i18n";
import { Tag } from "../ui/Tag";
import { HeroPhoto } from "../ui/HeroPhoto";

export interface AboutSectionProps {
  profile: Profile;
  experiences: Experience[];
  skills: Skill[];
  locale?: Locale;
  messages: Messages;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  experiences,
  skills,
  locale,
  messages,
}) => {
  // Group skills by category
  const skillGroups: SkillGroup[] = [
    "Research",
    "UX/Product",
    "UI/Visual",
    "Tools",
    "Light-dev",
  ];

  const summaryText = resolveLocalized(profile.summary, locale).text.trim();
  const headlineText = resolveLocalized(profile.headline, locale).text.trim();
  const isHtml = /<[a-z][\s\S]*>/i.test(summaryText);

  return (
    <div className="w-full py-12 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Story / Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[var(--border)] items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-mono font-semibold uppercase tracking-wider mb-4 border border-[var(--accent)]/20">
              <span>❖</span>
              <span>{messages.about.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text)] mb-6 text-balance leading-tight">
              {headlineText || messages.about.title}
            </h1>

            <div className="space-y-4 text-base sm:text-lg text-[var(--text)] leading-relaxed">
              {summaryText ? (
                isHtml ? (
                  <div
                    className="space-y-3 leading-relaxed [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5"
                    dangerouslySetInnerHTML={{ __html: summaryText }}
                  />
                ) : (
                  summaryText.split("\n\n").map((para, i) => (
                    <p key={i} className="text-pretty">
                      {para}
                    </p>
                  ))
                )
              ) : (
                <>
                  <p className="text-pretty">{messages.about.bio1}</p>
                  <p className="text-pretty">{messages.about.bio2}</p>
                  <p className="text-[var(--text-muted)] text-pretty">{messages.about.bio3}</p>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={profile.cvUrl}
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-sm hover:opacity-95 shadow-md shadow-[var(--accent)]/20 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] min-h-[44px]"
              >
                <FileText className="w-4 h-4" />
                <span>{messages.about.downloadCv}</span>
              </a>

              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono">
                <MapPin className="w-4 h-4 text-[var(--accent)]" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center items-center">
            <HeroPhoto
              avatarUrl={profile.avatarUrl}
              name={profile.name}
              role={resolveLocalized(profile.role, locale).text}
              tagline="UI/UX & Systems"
              variant="about"
            />
          </div>
        </div>

        {/* Career Timeline with Impact Bullets (Faithfully crafted after indrakusuma.dev/#experience) */}
        <section id="experience" className="py-16 sm:py-20 border-b border-[var(--border)] scroll-mt-20">
          {/* Section Header with Numbered Kicker & Divider line */}
          <div className="flex items-center gap-3.5 mb-3">
            <span className="font-mono text-[var(--accent)] text-xs sm:text-sm font-semibold tracking-wider uppercase">
              {locale === "id" ? "Pengalaman & Dampak" : "Experience & Impact"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] mb-12">
            {locale === "id" ? "Tempat saya menciptakan dampak nyata" : "Where I’ve made an impact"}
          </h2>

          {/* Timeline Rail & Items Container */}
          <div className="relative w-full">
            {/* Vertical Spine Line (Perfect center aligned with badges) */}
            <span
              aria-hidden="true"
              className="absolute top-4 bottom-4 left-7 sm:left-8 -translate-x-1/2 w-0.5 rounded-full bg-[var(--accent)]/30"
            />

            <div className="space-y-8 sm:space-y-10 w-full">
              {experiences.map((exp, expIdx) => {
                const roleText = resolveLocalized(exp.role, locale).text;
                const periodText = resolveLocalized(exp.period, locale).text;
                const isCurrent =
                  periodText.toLowerCase().includes("present") ||
                  periodText.toLowerCase().includes("sekarang") ||
                  periodText.toLowerCase().includes("now");

                return (
                  <div
                    key={exp.id}
                    className="relative pl-16 sm:pl-20 w-full"
                  >
                    {/* Pulsing Radar Ping for Current Role (Shared center anchor) */}
                    {isCurrent && (
                      <span
                        aria-hidden="true"
                        className="absolute top-1.5 left-7 sm:left-8 -translate-x-1/2 z-1 h-11 w-11 rounded-[14px] bg-[var(--accent)]/25 animate-ping pointer-events-none"
                      />
                    )}

                    {/* Company Logo / Monogram Badge (Shared center anchor) */}
                    <div
                      className="absolute top-1.5 left-7 sm:left-8 -translate-x-1/2 z-10 h-11 w-11 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] shadow-md flex items-center justify-center overflow-hidden"
                      title={exp.company}
                    >
                      {exp.logoUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={exp.logoUrl}
                          alt={`${exp.company} logo`}
                          className="h-full w-full object-contain p-1 rounded-[12px]"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full font-bold text-sm text-[var(--accent)]">
                          {expIdx === 0 ? (
                            <CreditCard className="w-5 h-5 text-[var(--accent)]" />
                          ) : expIdx === 1 ? (
                            <Truck className="w-5 h-5 text-[var(--accent)]" />
                          ) : (
                            <Layers className="w-5 h-5 text-[var(--accent)]" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Experience Card Container (with hover lift + accent outline, FULL WIDTH) */}
                    <div className="w-full rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xs transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[var(--accent)] hover:shadow-2xl">
                      {/* Top Row: Company Name & Highlight Pill */}
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
                        <h3 className="text-xl font-bold tracking-tight text-[var(--text)]">
                          {exp.company}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--accent)] whitespace-nowrap shadow-2xs">
                          <Star className="w-3.5 h-3.5 fill-[var(--accent)] text-[var(--accent)]" />
                          <span>
                            {expIdx === 0
                              ? "Core Scale-Up Impact"
                              : expIdx === 1
                              ? "Fleet OS Overhaul"
                              : "14+ Products Shipped"}
                          </span>
                        </span>
                      </div>

                      {/* Role & Period Details Divider */}
                      <div className="border-t border-[var(--border)] pt-4">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[16px] sm:text-[17px] font-bold text-[var(--text)]">
                            {roleText}
                          </span>
                          {isCurrent && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-[var(--success)] bg-[var(--success)]/10 border border-[var(--success)]/20">
                              {locale === "id" ? "AKTIF" : "CURRENT"}
                            </span>
                          )}
                        </div>

                        {/* Period & Location Meta */}
                        <div className="font-mono text-xs text-[var(--text-muted)] flex items-center gap-x-2.5 mb-4">
                          <span>{periodText}</span>
                          <span aria-hidden="true" className="text-[var(--border)]">•</span>
                          <span>{exp.location}</span>
                        </div>

                        {/* Impact Bullets with custom accent dot */}
                        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                          {exp.bullets.map((b, bIdx) => (
                            <li
                              key={bIdx}
                              className="relative pl-5 text-sm sm:text-[14.5px] text-[var(--text-muted)] leading-[1.6]"
                            >
                              <span
                                aria-hidden="true"
                                className="absolute top-[9px] left-0 h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
                              />
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: resolveLocalized(b.fullText, locale).text,
                                }}
                              />
                            </li>
                          ))}
                        </ul>

                        {/* Skills / Tools Used */}
                        <div className="mt-5 pt-4 border-t border-[var(--border)]/60 flex flex-wrap gap-1.5">
                          {exp.skillsUsed.map((skill) => (
                            <Tag key={skill} size="sm">
                              {skill}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Grouped Skills Matrix */}
        <section className="py-16 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 mb-10">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
              {messages.about.skillsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillGroups.map((group) => {
              const groupSkills = skills.filter((s) => s.group === group);
              return (
                <div
                  key={group}
                  className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-xs transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-[var(--accent)] hover:shadow-xl"
                >
                  <h3 className="text-base font-bold text-[var(--text)] pb-3 mb-4 border-b border-[var(--border)] flex items-center justify-between">
                    <span>{group}</span>
                    <span className="text-xs text-[var(--text-muted)] font-normal">
                      {groupSkills.length} competencies
                    </span>
                  </h3>
                  <ul className="space-y-2.5 text-sm">
                    {groupSkills.map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between text-[var(--text)]"
                      >
                        <span className="font-medium">{s.name}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-muted)] font-mono">
                          {s.level}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="pt-16">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
              {messages.about.educationTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg">
              <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-wider block mb-1 tabular-nums">
                2015 - 2019
              </span>
              <h3 className="font-bold text-lg text-[var(--text)] text-balance">
                Bachelor of Computer Science (Informatics)
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-1 text-pretty">
                Bandung Institute of Technology (ITB) · Focus in HCI & Software Ergonomics
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xs transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg">
              <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase tracking-wider block mb-1 tabular-nums">
                2022
              </span>
              <h3 className="font-bold text-lg text-[var(--text)] text-balance">
                Nielsen Norman Group (NN/g) UX Master Certified
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-1 text-pretty">
                Specialization in Interaction Design & Design Systems Governance
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
