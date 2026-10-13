import { create } from "zustand";

export interface LightboxData {
  url: string;
  alt: string;
  caption?: string;
}

export type ThemePreference = "light" | "dark" | "system";

interface UiState {
  isMobileDrawerOpen: boolean;
  activeLightbox: LightboxData | null;
  theme: ThemePreference;
  selectedCategory: string;

  setMobileDrawerOpen: (open: boolean) => void;
  toggleMobileDrawer: () => void;
  openLightbox: (data: LightboxData) => void;
  closeLightbox: () => void;
  setTheme: (theme: ThemePreference) => void;
  setSelectedCategory: (category: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMobileDrawerOpen: false,
  activeLightbox: null,
  theme: "system",
  selectedCategory: "All",

  setMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
  toggleMobileDrawer: () => set((state) => ({ isMobileDrawerOpen: !state.isMobileDrawerOpen })),
  openLightbox: (data) => set({ activeLightbox: data }),
  closeLightbox: () => set({ activeLightbox: null }),
  setTheme: (theme) => set({ theme }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
