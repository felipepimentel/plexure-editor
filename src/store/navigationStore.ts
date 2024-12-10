import { create } from 'zustand';

interface NavigationState {
  expandedPaths: string[];
  selectedPath: string | null;
  togglePath: (path: string) => void;
  selectPath: (path: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  expandedPaths: [],
  selectedPath: null,
  togglePath: (path) =>
    set((state) => ({
      expandedPaths: state.expandedPaths.includes(path)
        ? state.expandedPaths.filter((p) => p !== path)
        : [...state.expandedPaths, path]
    })),
  selectPath: (path) => set({ selectedPath: path })
}));