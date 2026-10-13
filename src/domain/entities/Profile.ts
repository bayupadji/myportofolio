import { LocalizedText } from "../value-objects/LocalizedText";

export interface SocialLink {
  platform: string;
  url: string;
  handle: string;
}

export interface HeroMetric {
  value: string;
  suffix?: string;
  label: LocalizedText;
  description: LocalizedText;
}

export interface Profile {
  id: string;
  name: string;
  role: LocalizedText;
  headline: LocalizedText;
  summary: LocalizedText;
  location: string;
  email: string;
  avatarUrl: string;
  cvUrl: string;
  availabilityStatus: LocalizedText;
  isAvailableForFreelance: boolean;
  socialLinks: SocialLink[];
  keyMetrics: HeroMetric[];
}
