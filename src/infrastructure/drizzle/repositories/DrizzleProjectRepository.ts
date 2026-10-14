import { ProjectRepository } from "@/domain/repositories/ProjectRepository";
import { Project } from "@/domain/entities/Project";
import { PublishStatus } from "@/domain/value-objects/PublishStatus";
import { db } from "../db";
import { projectsTable } from "../schema";
import { eq, asc } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "../seed";

export class DrizzleProjectRepository implements ProjectRepository {
  private initialized = false;

  private async ensureInit() {
    if (!this.initialized) {
      await seedDatabaseIfEmpty();
      this.initialized = true;
    }
  }

  async getPublished(): Promise<Project[]> {
    await this.ensureInit();
    const rows = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.status, "published"))
      .orderBy(asc(projectsTable.order));

    return rows as Project[];
  }

  async getBySlug(slug: string): Promise<Project | null> {
    await this.ensureInit();
    const [row] = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.slug, slug))
      .limit(1);

    return (row as Project) || null;
  }

  async getAll(): Promise<Project[]> {
    await this.ensureInit();
    const rows = await db
      .select()
      .from(projectsTable)
      .orderBy(asc(projectsTable.order));

    return rows as Project[];
  }

  async updateStatus(id: string, status: PublishStatus): Promise<void> {
    await this.ensureInit();
    await db
      .update(projectsTable)
      .set({ status })
      .where(eq(projectsTable.id, id));
  }

  async save(project: Project): Promise<void> {
    await this.ensureInit();
    const [existing] = await db
      .select({ id: projectsTable.id })
      .from(projectsTable)
      .where(eq(projectsTable.id, project.id))
      .limit(1);

    if (existing) {
      await db
        .update(projectsTable)
        .set({
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
        })
        .where(eq(projectsTable.id, project.id));
    } else {
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
  }

  async delete(id: string): Promise<void> {
    await this.ensureInit();
    await db.delete(projectsTable).where(eq(projectsTable.id, id));
  }
}
