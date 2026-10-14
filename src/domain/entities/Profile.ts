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

export interface ProcessStepItem {
  stepNumber: number;
  title: LocalizedText;
  description: LocalizedText;
}

export interface CtaBannerContent {
  badge?: LocalizedText;
  headline: LocalizedText;
  description: LocalizedText;
  primaryButtonText: LocalizedText;
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
  heroRole?: LocalizedText;
  heroHeadline?: LocalizedText;
  heroValueStatement?: LocalizedText;
  featuredProjectIds?: string[];
  processSteps?: ProcessStepItem[];
  ctaBanner?: CtaBannerContent;
}
