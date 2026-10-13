export type SkillGroup = "Research" | "UX/Product" | "UI/Visual" | "Tools" | "Light-dev";

export interface Skill {
  id: string;
  group: SkillGroup;
  name: string;
  level: "Expert" | "Proficient" | "Familiar";
  order: number;
}
