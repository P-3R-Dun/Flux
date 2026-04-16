import { create } from 'zustand';
import { type ProfileDT, type CategoryDT } from '../services/dashboard.service';

interface DashboardState {
    profile: ProfileDT | null;
    categories: CategoryDT[];
    setProfile: (profile: ProfileDT) => void;
    setCategories: (categories: CategoryDT[]) => void;
    clearStore: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    profile: null,
    categories: [],
    setProfile: (profile) => set({ profile }),
    setCategories: (categories) => set({ categories }),
    clearStore: () => set({ profile: null, categories: [] })
}));