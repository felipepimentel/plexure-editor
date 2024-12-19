import { z } from 'zod';

export interface Environment {
  id: string;
  name: string;
  description?: string;
  variables: Record<string, string>;
  servers: ServerConfig[];
  isActive?: boolean;
}

export interface ServerConfig {
  url: string;
  description?: string;
  variables?: Record<string, string>;
}

const environmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  variables: z.record(z.string()),
  servers: z.array(z.object({
    url: z.string(),
    description: z.string().optional(),
    variables: z.record(z.string()).optional(),
  })),
  isActive: z.boolean().optional(),
});

const STORAGE_KEY = 'api-environments';

export class EnvironmentManager {
  private environments: Environment[] = [];
  private activeEnvironment: Environment | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const environments = z.array(environmentSchema).parse(parsed);
        this.environments = environments;
        this.activeEnvironment = environments.find(env => env.isActive) || null;
      }
    } catch (error) {
      console.error('Failed to load environments:', error);
      this.environments = [];
      this.activeEnvironment = null;
    }
  }

  private saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.environments));
  }

  getEnvironments(): Environment[] {
    return this.environments;
  }

  getActiveEnvironment(): Environment | null {
    return this.activeEnvironment;
  }

  addEnvironment(environment: Omit<Environment, 'id'>): Environment {
    const newEnvironment: Environment = {
      ...environment,
      id: Date.now().toString(),
    };

    this.environments.push(newEnvironment);
    this.saveToStorage();
    return newEnvironment;
  }

  updateEnvironment(id: string, updates: Partial<Environment>): Environment {
    const index = this.environments.findIndex(env => env.id === id);
    if (index === -1) {
      throw new Error(`Environment with id ${id} not found`);
    }

    const updatedEnvironment = {
      ...this.environments[index],
      ...updates,
    };

    this.environments[index] = updatedEnvironment;
    this.saveToStorage();
    return updatedEnvironment;
  }

  deleteEnvironment(id: string) {
    const index = this.environments.findIndex(env => env.id === id);
    if (index === -1) {
      throw new Error(`Environment with id ${id} not found`);
    }

    this.environments.splice(index, 1);
    if (this.activeEnvironment?.id === id) {
      this.activeEnvironment = null;
    }
    this.saveToStorage();
  }

  setActiveEnvironment(id: string | null) {
    // Deactivate current environment
    if (this.activeEnvironment) {
      this.updateEnvironment(this.activeEnvironment.id, { isActive: false });
    }

    if (id) {
      const environment = this.environments.find(env => env.id === id);
      if (!environment) {
        throw new Error(`Environment with id ${id} not found`);
      }

      this.activeEnvironment = environment;
      this.updateEnvironment(id, { isActive: true });
    } else {
      this.activeEnvironment = null;
    }

    this.saveToStorage();
  }

  resolveUrl(url: string): string {
    if (!this.activeEnvironment) return url;

    let resolvedUrl = url;
    const variablePattern = /\{([^}]+)\}/g;

    resolvedUrl = resolvedUrl.replace(variablePattern, (match, variable) => {
      return this.activeEnvironment?.variables[variable] || match;
    });

    return resolvedUrl;
  }

  resolveHeaders(headers: Record<string, string>): Record<string, string> {
    if (!this.activeEnvironment) return headers;

    const resolvedHeaders: Record<string, string> = {};
    const variablePattern = /\{([^}]+)\}/g;

    for (const [key, value] of Object.entries(headers)) {
      const resolvedKey = key.replace(variablePattern, (match, variable) => {
        return this.activeEnvironment?.variables[variable] || match;
      });

      const resolvedValue = value.replace(variablePattern, (match, variable) => {
        return this.activeEnvironment?.variables[variable] || match;
      });

      resolvedHeaders[resolvedKey] = resolvedValue;
    }

    return resolvedHeaders;
  }

  resolveBody(body: string): string {
    if (!this.activeEnvironment) return body;

    const variablePattern = /\{([^}]+)\}/g;
    return body.replace(variablePattern, (match, variable) => {
      return this.activeEnvironment?.variables[variable] || match;
    });
  }
} 