import { Service } from "../entities/Service";

export interface ServiceRepository {
  getAll(): Promise<Service[]>;
  save(service: Service): Promise<void>;
  delete(id: string): Promise<void>;
}
