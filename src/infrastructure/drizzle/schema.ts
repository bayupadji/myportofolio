import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { LocalizedText } from "@/domain/value-objects/LocalizedText";
import { PublishStatus } from "@/domain/value-objects/PublishStatus";
import {
  ProjectMetric,
  ProjectSection,
  ProjectSolutionState,
  ProjectTLDR,
} from "@/domain/entities/Project";
import {
  SocialLink,
  HeroMetric,
  ProcessStepItem,
  CtaBannerContent,
} from "@/domain/entities/Profile";
import { ExperienceBullet } from "@/domain/entities/Experience";
import { ServiceProcessStep } from "@/domain/entities/Service";
import { SkillGroup } from "@/domain/entities/Skill";
import { MessageTopic } from "@/domain/entities/Message";

// 1. Projects Table
export const projectsTable = sqliteTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title", { mode: "json" }).$type<LocalizedText>().notNull(),
  summary: text("summary", { mode: "json" }).$type<LocalizedText>().notNull(),
  role: text("role").notNull(),
  duration: text("duration").notNull(),
  team: text("team").notNull(),
  platforms: text("platforms", { mode: "json" }).$type<string[]>().notNull(),
  tools: text("tools", { mode: "json" }).$type<string[]>().notNull(),
  category: text("category").notNull(),
  coverUrl: text("cover_url").notNull(),
  metrics: text("metrics", { mode: "json" }).$type<ProjectMetric[]>().notNull(),
  tldr: text("tldr", { mode: "json" }).$type<ProjectTLDR>().notNull(),
  sections: text("sections", { mode: "json" }).$type<ProjectSection[]>().notNull(),
  solutionStates: text("solution_states", { mode: "json" }).$type<ProjectSolutionState[]>().notNull(),
  learnings: text("learnings", { mode: "json" }).$type<LocalizedText[]>().notNull(),
  status: text("status").$type<PublishStatus>().notNull().default("draft"),
  isSampleProject: integer("is_sample_project", { mode: "boolean" }).notNull().default(false),
  order: integer("sort_order").notNull().default(0),
  publishedAt: text("published_at").notNull(),
});

// 2. Profile Table
export const profileTable = sqliteTable("profile", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role", { mode: "json" }).$type<LocalizedText>().notNull(),
  headline: text("headline", { mode: "json" }).$type<LocalizedText>().notNull(),
  summary: text("summary", { mode: "json" }).$type<LocalizedText>().notNull(),
  location: text("location").notNull(),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  cvUrl: text("cv_url").notNull(),
  availabilityStatus: text("availability_status", { mode: "json" }).$type<LocalizedText>().notNull(),
  isAvailableForFreelance: integer("is_available_for_freelance", { mode: "boolean" }).notNull().default(true),
  socialLinks: text("social_links", { mode: "json" }).$type<SocialLink[]>().notNull(),
  keyMetrics: text("key_metrics", { mode: "json" }).$type<HeroMetric[]>().notNull(),
  heroRole: text("hero_role", { mode: "json" }).$type<LocalizedText>(),
  heroHeadline: text("hero_headline", { mode: "json" }).$type<LocalizedText>(),
  heroValueStatement: text("hero_value_statement", { mode: "json" }).$type<LocalizedText>(),
  featuredProjectIds: text("featured_project_ids", { mode: "json" }).$type<string[]>(),
  processSteps: text("process_steps", { mode: "json" }).$type<ProcessStepItem[]>(),
  ctaBanner: text("cta_banner", { mode: "json" }).$type<CtaBannerContent>(),
});

// 3. Experiences Table
export const experiencesTable = sqliteTable("experiences", {
  id: text("id").primaryKey(),
  company: text("company").notNull(),
  role: text("role", { mode: "json" }).$type<LocalizedText>().notNull(),
  period: text("period", { mode: "json" }).$type<LocalizedText>().notNull(),
  location: text("location").notNull(),
  bullets: text("bullets", { mode: "json" }).$type<ExperienceBullet[]>().notNull(),
  skillsUsed: text("skills_used", { mode: "json" }).$type<string[]>().notNull(),
  logoUrl: text("logo_url"),
  order: integer("sort_order").notNull().default(0),
});

// 4. Skills Table
export const skillsTable = sqliteTable("skills", {
  id: text("id").primaryKey(),
  group: text("group_name").$type<SkillGroup>().notNull(),
  name: text("name").notNull(),
  level: text("level").$type<"Expert" | "Proficient" | "Familiar">().notNull(),
  order: integer("sort_order").notNull().default(0),
});

// 5. Services Table
export const servicesTable = sqliteTable("services", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title", { mode: "json" }).$type<LocalizedText>().notNull(),
  summary: text("summary", { mode: "json" }).$type<LocalizedText>().notNull(),
  targetAudience: text("target_audience", { mode: "json" }).$type<LocalizedText>().notNull(),
  deliverables: text("deliverables", { mode: "json" }).$type<LocalizedText[]>().notNull(),
  processSteps: text("process_steps", { mode: "json" }).$type<ServiceProcessStep[]>().notNull(),
  order: integer("sort_order").notNull().default(0),
  status: text("status").$type<"available" | "limited" | "booked">().notNull().default("available"),
});

// 6. Messages Table
export const messagesTable = sqliteTable("messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  topic: text("topic").$type<MessageTopic>().notNull(),
  body: text("body").notNull(),
  status: text("status").$type<"unread" | "read" | "replied">().notNull().default("unread"),
  createdAt: text("created_at").notNull(),
});

// 7. Admin Users Table
export const adminUsersTable = sqliteTable("admin_users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: text("created_at").notNull(),
});

// 8. Page Views (Analytics) Table
export const pageViewsTable = sqliteTable("page_views", {
  id: text("id").primaryKey(),
  path: text("path").notNull(),
  referrer: text("referrer"),
  visitorHash: text("visitor_hash").notNull(),
  createdAt: text("created_at").notNull(),
});

