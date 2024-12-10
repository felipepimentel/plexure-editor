import { v4 as uuidv4 } from 'uuid';
import { Specification } from './specificationService';
import { sampleSpecifications } from '../data/sampleSpecifications';

const STORAGE_KEY = 'swagger-editor-specifications';

export const localStorageService = {
  getSpecifications(): Specification[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialize with sample specifications
        const specs = sampleSpecifications.map(spec => ({
          id: uuidv4(),
          ...spec,
          user_id: 'local',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(specs));
        return specs;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to get specifications from localStorage:', error);
      return [];
    }
  },

  saveSpecifications(specifications: Specification[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(specifications));
    } catch (error) {
      console.error('Failed to save specifications to localStorage:', error);
    }
  },

  addSpecification(spec: Omit<Specification, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Specification {
    const specifications = this.getSpecifications();
    const newSpec: Specification = {
      id: uuidv4(),
      ...spec,
      user_id: 'local',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    specifications.push(newSpec);
    this.saveSpecifications(specifications);
    return newSpec;
  },

  updateSpecification(id: string, updates: Partial<Specification>): Specification {
    const specifications = this.getSpecifications();
    const index = specifications.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Specification not found');

    const updatedSpec = {
      ...specifications[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    specifications[index] = updatedSpec;
    this.saveSpecifications(specifications);
    return updatedSpec;
  },

  deleteSpecification(id: string): void {
    const specifications = this.getSpecifications();
    const filtered = specifications.filter(s => s.id !== id);
    this.saveSpecifications(filtered);
  }
};