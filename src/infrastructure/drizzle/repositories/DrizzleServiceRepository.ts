import { ServiceRepository } from "@/domain/repositories/ServiceRepository";
import { Service } from "@/domain/entities/Service";
import { db } from "../db";
import { servicesTable } from "../schema";
import { eq, asc } from "drizzle-orm";

export class DrizzleServiceRepository implements ServiceRepository {
  async getAll(): Promise<Service[]> {
    const rows = await db
      .select()
      .from(servicesTable)
      .orderBy(asc(servicesTable.order));

    return rows as Service[];
  }

  async save(service: Service): Promise<void> {
    const values = {
      id: service.id,
      slug: service.slug,
      title: service.title,
      summary: service.summary,
      targetAudience: service.targetAudience,
      deliverables: service.deliverables,
      processSteps: service.processSteps,
      order: service.order,
      status: service.status,
    };

    await db
      .insert(servicesTable)
      .values(values)
      .onConflictDoUpdate({
        target: servicesTable.id,
        set: values,
      });
  }

  async delete(id: string): Promise<void> {
    await db.delete(servicesTable).where(eq(servicesTable.id, id));
  }
}
