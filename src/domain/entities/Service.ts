import { LocalizedText } from "../value-objects/LocalizedText";

export interface ServiceProcessStep {
  step: number;
  title: LocalizedText;
  description: LocalizedText;
}

export interface Service {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  targetAudience: LocalizedText;
  deliverables: LocalizedText[];
  processSteps: ServiceProcessStep[];
  order: number;
  status: "available" | "limited" | "booked";
}
