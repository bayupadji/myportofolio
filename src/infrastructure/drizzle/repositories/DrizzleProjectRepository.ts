import { ProjectRepository } from "@/domain/repositories/ProjectRepository";
import { Project } from "@/domain/entities/Project";
import { PublishStatus } from "@/domain/value-objects/PublishStatus";
import { db } from "../db";
import { projectsTable } from "../schema";
import { eq, asc, and } from "drizzle-orm";

export class DrizzleProjectRepository implements ProjectRepository {
  async getPublished(): Promise<Project[]> {
    const rows = await db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.status, "published"))
      .orderBy(asc(projectsTable.order));

    return rows as Project[];
  }

  async getBySlug(slug: string, publishedOnly = true): Promise<Project | null> {
    const condition = publishedOnly
      ? and(eq(projectsTable.slug, slug), eq(projectsTable.status, "published"))
      : eq(projectsTable.slug, slug);

    const [row] = await db
      .select()
      .from(projectsTable)
      .where(condition)
      .limit(1);

    return (row as Project) || null;
  }

  async getAll(): Promise<Project[]> {
    const rows = await db
      .select()
      .from(projectsTable)
      .orderBy(asc(projectsTable.order));

    return rows as Project[];
  }

  async updateStatus(id: string, status: PublishStatus): Promise<void> {
    await db
      .update(projectsTable)
      .set({ status })
      .where(eq(projectsTable.id, id));
  }

  async save(project: Project): Promise<void> {
    const values = {
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
    };

    await db
      .insert(projectsTable)
      .values(values)
      .onConflictDoUpdate({
        target: projectsTable.id,
        set: values,
      });
  }

  async delete(id: string): Promise<void> {
    await db.delete(projectsTable).where(eq(projectsTable.id, id));
  }
}
