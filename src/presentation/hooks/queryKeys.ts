export const queryKeys = {
  projects: ["projects"] as const,
  project: (slug: string) => ["projects", slug] as const,
  messages: ["messages"] as const,
  profile: ["profile"] as const,
  services: ["services"] as const,
};
