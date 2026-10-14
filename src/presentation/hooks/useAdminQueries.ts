"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { Project } from "@/domain/entities/Project";
import { Profile } from "@/domain/entities/Profile";
import { Experience } from "@/domain/entities/Experience";
import { Skill } from "@/domain/entities/Skill";
import { Service } from "@/domain/entities/Service";
import { PublishStatus } from "@/domain/value-objects/PublishStatus";
import {
  saveProjectAction,
  updateProjectStatusAction,
  deleteProjectAction,
} from "../actions/projectActions";
import {
  updateProfileAction,
  updateAvailabilityAction,
} from "../actions/profileActions";
import {
  saveExperienceAction,
  deleteExperienceAction,
} from "../actions/experienceActions";
import { saveSkillAction, deleteSkillAction } from "../actions/skillActions";
import {
  saveServiceAction,
  deleteServiceAction,
} from "../actions/serviceActions";
import {
  updateMessageStatusAction,
  deleteMessageAction,
} from "../actions/messageActions";

// =================== Projects ===================

export function useAdminProjects(initialData?: Project[]) {
  return useQuery<Project[]>({
    queryKey: queryKeys.projects,
    initialData,
    queryFn: async () => initialData || [],
  });
}

export function useUpdateProjectStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PublishStatus }) => {
      const res = await updateProjectStatusAction(id, status);
      if (!res.success) throw new Error(res.error || "Failed to update status");
      return res;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Project[]>(queryKeys.projects, (prev) => {
        if (!prev) return prev;
        return prev.map((p) => (p.id === data.id ? { ...p, status: data.status! } : p));
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

export function useSaveProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      const res = await saveProjectAction(project);
      if (!res.success) throw new Error(res.error || "Failed to save project");
      return res.project!;
    },
    onSuccess: (savedProject) => {
      queryClient.setQueryData<Project[]>(queryKeys.projects, (prev) => {
        if (!prev) return [savedProject];
        const exists = prev.some((p) => p.id === savedProject.id);
        if (exists) {
          return prev.map((p) => (p.id === savedProject.id ? savedProject : p));
        }
        return [...prev, savedProject];
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteProjectAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete project");
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Project[]>(queryKeys.projects, (prev) => {
        if (!prev) return prev;
        return prev.filter((p) => p.id !== deletedId);
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

// =================== Profile ===================

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Profile) => {
      const res = await updateProfileAction(profile);
      if (!res.success) throw new Error(res.error || "Failed to update profile");
      return res.profile!;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData<Profile>(queryKeys.profile, updatedProfile);
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useUpdateAvailabilityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      statusEn,
      statusId,
      isFreelance,
    }: {
      statusEn: string;
      statusId: string;
      isFreelance: boolean;
    }) => {
      const res = await updateAvailabilityAction(statusEn, statusId, isFreelance);
      if (!res.success) throw new Error(res.error || "Failed to update availability");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

// =================== Experience ===================

export function useSaveExperienceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (experience: Experience) => {
      const res = await saveExperienceAction(experience);
      if (!res.success) throw new Error(res.error || "Failed to save experience");
      return res.experience!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences });
    },
  });
}

export function useDeleteExperienceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteExperienceAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete experience");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.experiences });
    },
  });
}

// =================== Skills ===================

export function useSaveSkillMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skill: Skill) => {
      const res = await saveSkillAction(skill);
      if (!res.success) throw new Error(res.error || "Failed to save skill");
      return res.skill!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills });
    },
  });
}

export function useDeleteSkillMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteSkillAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete skill");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.skills });
    },
  });
}

// =================== Services ===================

export function useSaveServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Service) => {
      const res = await saveServiceAction(service);
      if (!res.success) throw new Error(res.error || "Failed to save service");
      return res.service!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services });
    },
  });
}

export function useDeleteServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteServiceAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete service");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services });
    },
  });
}

// =================== Messages ===================

export function useUpdateMessageStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "unread" | "read" | "replied";
    }) => {
      const res = await updateMessageStatusAction(id, status);
      if (!res.success) throw new Error(res.error || "Failed to update message status");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
}

export function useDeleteMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteMessageAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete message");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
}
