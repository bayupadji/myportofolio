import { LocalizedText } from "../value-objects/LocalizedText";

export interface ExperienceBullet {
  action: LocalizedText;
  context: LocalizedText;
  result: LocalizedText;
  fullText: LocalizedText;
}

export interface Experience {
  id: string;
  company: string;
  role: LocalizedText;
  period: LocalizedText;
  location: string;
  bullets: ExperienceBullet[];
  skillsUsed: string[];
  logoUrl?: string;
  order: number;
}
