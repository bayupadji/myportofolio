import { Service } from "../entities/Service";

export interface ServiceRepository {
  getAll(): Promise<Service[]>;
}
