import React from "react";
import {
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  MapPin,
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
  locale: Locale;
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

  return (
    <div className="w-full py-12 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Story / Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[var(--border)] items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)] block mb-3">
              {messages.about.badge}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text)] mb-6">
              {messages.about.title}
            </h1>

            <div className="space-y-4 text-base sm:text-lg text-[var(--text)] leading-relaxed">
              <p>{messages.about.bio1}</p>
              <p>{messages.about.bio2}</p>
              <p className="text-[var(--text-muted)]">{messages.about.bio3}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={profile.cvUrl}
                download
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold text-sm hover:opacity-90 shadow-md shadow-[var(--accent)]/20 transition-all min-h-[44px]"
              >
                <FileText className="w-4 h-4" />
                <span>{messages.about.downloadCv}</span>
              </a>

              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
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

        {/* Career Timeline with Impact Bullets */}
        <section className="py-16 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 mb-10">
            <Briefcase className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
              {messages.about.experienceTitle}
            </h2>
          </div>

          <div className="space-y-12 max-w-4xl">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="relative pl-8 sm:pl-10 border-l-2 border-[var(--border)] pb-8 last:pb-0"
              >
                {/* Timeline node */}
                <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-[var(--accent)] ring-4 ring-[var(--surface)]" />

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                  <h3 className="text-xl font-bold text-[var(--text)]">
                    {resolveLocalized(exp.role, locale).text}{" "}
                    <span className="text-[var(--accent)] font-semibold">
                      @ {exp.company}
                    </span>
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-muted)] w-fit">
                    {resolveLocalized(exp.period, locale).text}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)] mb-4">{exp.location}</p>

                {/* Impact bullets adhering to action + context + measurable result */}
                <ul className="space-y-2.5 mb-5 text-sm sm:text-base text-[var(--text)] leading-relaxed">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[var(--accent)] font-bold mt-1 shrink-0">
                        •
                      </span>
                      <span>{resolveLocalized(b.fullText, locale).text}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5">
                  {exp.skillsUsed.map((skill) => (
                    <Tag key={skill} size="sm">
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>
            ))}
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
                  className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xs"
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
            <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block mb-1">
                2015 - 2019
              </span>
              <h3 className="font-bold text-lg text-[var(--text)]">
                Bachelor of Computer Science (Informatics)
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Bandung Institute of Technology (ITB) · Focus in HCI & Software Ergonomics
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
              <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block mb-1">
                2022
              </span>
              <h3 className="font-bold text-lg text-[var(--text)]">
                Nielsen Norman Group (NN/g) UX Master Certified
              </h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Specialization in Interaction Design & Design Systems Governance
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
