import { create } from 'zustand';
import { Specification, specificationService } from '../services/specificationService';
import { useTeamStore } from './teamStore';

interface SpecificationStore {
  specifications: Specification[];
  currentSpec: Specification | null;
  loading: boolean;
  error: string | null;
  
  fetchSpecifications: () => Promise<void>;
  createSpecification: (spec: Omit<Specification, 'id' | 'created_at' | 'updated_at' | 'team_id'>) => Promise<void>;
  updateSpecification: (id: string, updates: Partial<Specification>) => Promise<void>;
  deleteSpecification: (id: string) => Promise<void>;
  setCurrentSpec: (spec: Specification | null) => void;
}

export const useSpecificationStore = create<SpecificationStore>((set) => ({
  specifications: [],
  currentSpec: null,
  loading: false,
  error: null,

  fetchSpecifications: async () => {
    set({ loading: true, error: null });
    try {
      const currentTeam = useTeamStore.getState().currentTeam;
      if (!currentTeam) {
        throw new Error('No team selected');
      }
      
      const specs = await specificationService.list(currentTeam.id);
      set({ specifications: specs, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch specifications', loading: false });
    }
  },

  createSpecification: async (spec) => {
    set({ loading: true, error: null });
    try {
      const currentTeam = useTeamStore.getState().currentTeam;
      if (!currentTeam) {
        throw new Error('No team selected');
      }

      const newSpec = await specificationService.create(currentTeam.id, spec);
      set(state => ({
        specifications: [...state.specifications, newSpec],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to create specification', loading: false });
    }
  },

  updateSpecification: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updatedSpec = await specificationService.update(id, updates);
      set(state => ({
        specifications: state.specifications.map(s => 
          s.id === id ? updatedSpec : s
        ),
        currentSpec: state.currentSpec?.id === id ? updatedSpec : state.currentSpec,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update specification', loading: false });
    }
  },

  deleteSpecification: async (id) => {
    set({ loading: true, error: null });
    try {
      await specificationService.delete(id);
      set(state => ({
        specifications: state.specifications.filter(s => s.id !== id),
        currentSpec: state.currentSpec?.id === id ? null : state.currentSpec,
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete specification', loading: false });
    }
  },

  setCurrentSpec: (spec) => {
    set({ currentSpec: spec });
  }
}));