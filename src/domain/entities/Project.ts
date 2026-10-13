import { LocalizedText } from "../value-objects/LocalizedText";
import { PublishStatus } from "../value-objects/PublishStatus";

export interface ProjectMetric {
  value: string;
  label: LocalizedText;
}

export interface ProjectSection {
  id: string;
  type: "context" | "research" | "process" | "solution" | "impact";
  title: LocalizedText;
  body: LocalizedText;
  highlights?: LocalizedText[];
  media?: {
    type: "image" | "embed";
    url: string;
    caption?: LocalizedText;
    alt: LocalizedText;
  }[];
}

export interface ProjectSolutionState {
  title: LocalizedText;
  description: LocalizedText;
  stateType: "default" | "empty" | "error" | "loading";
  previewUrl?: string;
}

export interface ProjectTLDR {
  problem: LocalizedText;
  solution: LocalizedText;
  impact: LocalizedText;
}

export interface Project {
  id: string;
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  role: string;
  duration: string;
  team: string;
  platforms: string[];
  tools: string[];
  category: "Fintech" | "Admin Tools" | "Mobile Apps" | "Design Systems";
  coverUrl: string;
  metrics: ProjectMetric[];
  tldr: ProjectTLDR;
  sections: ProjectSection[];
  solutionStates: ProjectSolutionState[];
  learnings: LocalizedText[];
  status: PublishStatus;
  isSampleProject: boolean;
  order: number;
  publishedAt: string;
}
