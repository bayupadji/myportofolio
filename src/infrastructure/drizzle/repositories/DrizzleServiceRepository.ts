import { ServiceRepository } from "@/domain/repositories/ServiceRepository";
import { Service } from "@/domain/entities/Service";
import { db } from "../db";
import { servicesTable } from "../schema";
import { eq, asc } from "drizzle-orm";
import { seedDatabaseIfEmpty } from "../seed";

export class DrizzleServiceRepository implements ServiceRepository {
  private initialized = false;

  private async ensureInit() {
    if (!this.initialized) {
      await seedDatabaseIfEmpty();
      this.initialized = true;
    }
  }

  async getAll(): Promise<Service[]> {
    await this.ensureInit();
    const rows = await db
      .select()
      .from(servicesTable)
      .orderBy(asc(servicesTable.order));

    return rows as Service[];
  }

  async save(service: Service): Promise<void> {
    await this.ensureInit();
    const [existing] = await db
      .select({ id: servicesTable.id })
      .from(servicesTable)
      .where(eq(servicesTable.id, service.id))
      .limit(1);

    if (existing) {
      await db
        .update(servicesTable)
        .set({
          slug: service.slug,
          title: service.title,
          summary: service.summary,
          targetAudience: service.targetAudience,
          deliverables: service.deliverables,
          processSteps: service.processSteps,
          order: service.order,
          status: service.status,
        })
        .where(eq(servicesTable.id, service.id));
    } else {
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
  }

  async delete(id: string): Promise<void> {
    await this.ensureInit();
    await db.delete(servicesTable).where(eq(servicesTable.id, id));
  }
}
