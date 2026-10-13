"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { Project } from "@/domain/entities/Project";
import { PublishStatus } from "@/domain/value-objects/PublishStatus";

export function useAdminProjects(initialData?: Project[]) {
  return useQuery<Project[]>({
    queryKey: queryKeys.projects,
    initialData,
    queryFn: async () => {
      // In SSR / App Router this is initially hydrated from Server Component
      return initialData || [];
    },
  });
}

export function useUpdateProjectStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; id: string; status: PublishStatus }, Error, { id: string; status: PublishStatus }>({
    mutationFn: async ({ id, status }) => {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update project status");
      }

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Project[]>(queryKeys.projects, (prev) => {
        if (!prev) return prev;
        return prev.map((p) => (p.id === data.id ? { ...p, status: data.status } : p));
      });
    },
  });
}
