import { create } from "zustand";
import { Project } from "@/domain/entities/Project";

export interface LightboxData {
  url: string;
  alt: string;
  caption?: string;
}

export type ThemePreference = "light" | "dark" | "system";

export interface UiState {
  // Mobile Navigation Drawer (Public)
  isMobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
  toggleMobileDrawer: () => void;

  // Mobile Admin Sidebar Drawer
  isAdminDrawerOpen: boolean;
  setAdminDrawerOpen: (open: boolean) => void;
  toggleAdminDrawer: () => void;

  // Image Lightbox
  activeLightbox: LightboxData | null;
  openLightbox: (data: LightboxData) => void;
  closeLightbox: () => void;

  // Project Quick View Modal
  quickViewProject: Project | null;
  setQuickViewProject: (project: Project | null) => void;

  // Case Studies Category Filter
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  // Theme Preference
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobileDrawerOpen: false,
  setMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
  toggleMobileDrawer: () => set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),

  isAdminDrawerOpen: false,
  setAdminDrawerOpen: (open) => set({ isAdminDrawerOpen: open }),
  toggleAdminDrawer: () => set((state) => ({ isAdminDrawerOpen: !state.isAdminDrawerOpen })),

  activeLightbox: null,
  openLightbox: (data) => set({ activeLightbox: data }),
  closeLightbox: () => set({ activeLightbox: null }),

  quickViewProject: null,
  setQuickViewProject: (project) => set({ quickViewProject: project }),

  selectedCategory: "All",
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  theme: "system",
  setTheme: (theme) => set({ theme }),
}));
