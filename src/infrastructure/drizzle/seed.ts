import { db } from "./db";
import {
  projectsTable,
  profileTable,
  experiencesTable,
  skillsTable,
  servicesTable,
} from "./schema";
import {
  seedProfile,
  seedProjects,
  seedExperiences,
  seedSkills,
  seedServices,
} from "../mock/seedData";
import { sql } from "drizzle-orm";

export async function seedDatabaseIfEmpty() {
  try {
    // Check if profile exists
    const [existingProfile] = await db
      .select({ count: sql<number>`count(*)` })
      .from(profileTable);

    if (existingProfile && existingProfile.count > 0) {
      // Database already seeded
      return;
    }

    console.log("🌱 Initializing and seeding local SQLite database (portfolio.db)...");

    // 1. Seed Profile
    await db.insert(profileTable).values({
      id: seedProfile.id,
      name: seedProfile.name,
      role: seedProfile.role,
      headline: seedProfile.headline,
      summary: seedProfile.summary,
      location: seedProfile.location,
      email: seedProfile.email,
      avatarUrl: seedProfile.avatarUrl,
      cvUrl: seedProfile.cvUrl,
      availabilityStatus: seedProfile.availabilityStatus,
      isAvailableForFreelance: seedProfile.isAvailableForFreelance,
      socialLinks: seedProfile.socialLinks,
      keyMetrics: seedProfile.keyMetrics,
      heroRole: seedProfile.heroRole,
      heroHeadline: seedProfile.heroHeadline,
      heroValueStatement: seedProfile.heroValueStatement,
      featuredProjectIds: seedProfile.featuredProjectIds,
      processSteps: seedProfile.processSteps,
      ctaBanner: seedProfile.ctaBanner,
    });

    // 2. Seed Projects
    for (const project of seedProjects) {
      await db.insert(projectsTable).values({
        id: project.id,
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        role: project.role,
        duration: project.duration,
        team: project.team,
        platforms: project.platforms,
        tools: project.tools,
        category: project.category,
        coverUrl: project.coverUrl,
        metrics: project.metrics,
        tldr: project.tldr,
        sections: project.sections,
        solutionStates: project.solutionStates,
        learnings: project.learnings,
        status: project.status,
        isSampleProject: project.isSampleProject,
        order: project.order,
        publishedAt: project.publishedAt,
      });
    }

    // 3. Seed Experiences
    for (const exp of seedExperiences) {
      await db.insert(experiencesTable).values({
        id: exp.id,
        company: exp.company,
        role: exp.role,
        period: exp.period,
        location: exp.location,
        bullets: exp.bullets,
        skillsUsed: exp.skillsUsed,
        logoUrl: exp.logoUrl,
        order: exp.order,
      });
    }

    // 4. Seed Skills
    for (const skill of seedSkills) {
      await db.insert(skillsTable).values({
        id: skill.id,
        group: skill.group,
        name: skill.name,
        level: skill.level,
        order: skill.order,
      });
    }

    // 5. Seed Services
    for (const service of seedServices) {
      await db.insert(servicesTable).values({
        id: service.id,
        slug: service.slug,
        title: service.title,
        summary: service.summary,
        targetAudience: service.targetAudience,
        deliverables: service.deliverables,
        processSteps: service.processSteps,
        order: service.order,
        status: service.status,
      });
    }

    console.log("✅ Seed completed successfully: profile, projects, experiences, skills, services.");
  } catch (err) {
    console.error("❌ Failed to seed database:", err);
  }
}
