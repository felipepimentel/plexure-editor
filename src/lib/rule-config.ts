import { RuleCategory, RuleConfig, ValidationSeverity } from './custom-rules';

export interface RuleOption {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  default?: any;
  enum?: any[];
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    items?: RuleOption;
  };
}

export interface RuleConfigFile {
  version: string;
  rules: Record<string, RuleConfig>;
  extends?: string[];
  presets?: Record<string, {
    description: string;
    rules: Record<string, Partial<RuleConfig>>;
  }>;
  categories?: Record<RuleCategory, {
    enabled: boolean;
    severity: ValidationSeverity;
  }>;
}

export class RuleConfigManager {
  private config: RuleConfigFile;
  private presets: Map<string, RuleConfigFile> = new Map();

  constructor(private configFile?: string) {
    this.config = this.loadConfig();
  }

  private loadConfig(): RuleConfigFile {
    // Default configuration
    return {
      version: '1.0.0',
      rules: {},
      presets: {
        strict: {
          description: 'Strict validation rules for production APIs',
          rules: {
            'naming/pascal-case-schemas': { severity: 'error' },
            'security/require-auth': { severity: 'error' },
            'documentation/response-examples': { severity: 'error' }
          }
        },
        recommended: {
          description: 'Recommended validation rules for development',
          rules: {
            'naming/pascal-case-schemas': { severity: 'warning' },
            'security/require-auth': { severity: 'error' },
            'documentation/response-examples': { severity: 'warning' }
          }
        }
      },
      categories: {
        naming: { enabled: true, severity: 'warning' },
        security: { enabled: true, severity: 'error' },
        documentation: { enabled: true, severity: 'warning' },
        structure: { enabled: true, severity: 'warning' },
        governance: { enabled: true, severity: 'warning' },
        custom: { enabled: true, severity: 'warning' }
      }
    };
  }

  applyPreset(presetName: string) {
    const preset = this.config.presets?.[presetName];
    if (!preset) {
      throw new Error(`Preset "${presetName}" not found`);
    }

    Object.entries(preset.rules).forEach(([ruleId, config]) => {
      this.updateRuleConfig(ruleId, config);
    });
  }

  getRuleConfig(ruleId: string): RuleConfig | undefined {
    return this.config.rules[ruleId];
  }

  updateRuleConfig(ruleId: string, config: Partial<RuleConfig>) {
    const existingConfig = this.config.rules[ruleId] || { enabled: true, options: {} };
    this.config.rules[ruleId] = {
      ...existingConfig,
      ...config
    };
  }

  updateCategoryConfig(category: RuleCategory, config: { enabled: boolean; severity: ValidationSeverity }) {
    if (this.config.categories) {
      this.config.categories[category] = {
        ...this.config.categories[category],
        ...config
      };
    }
  }

  validateOption(option: RuleOption, value: any): boolean {
    if (option.required && (value === undefined || value === null)) {
      return false;
    }

    if (value === undefined || value === null) {
      return true;
    }

    switch (option.type) {
      case 'string':
        if (typeof value !== 'string') return false;
        if (option.validation?.pattern && !new RegExp(option.validation.pattern).test(value)) {
          return false;
        }
        break;

      case 'number':
        if (typeof value !== 'number') return false;
        if (option.validation?.min !== undefined && value < option.validation.min) {
          return false;
        }
        if (option.validation?.max !== undefined && value > option.validation.max) {
          return false;
        }
        break;

      case 'array':
        if (!Array.isArray(value)) return false;
        if (option.validation?.items) {
          return value.every(item => this.validateOption(option.validation!.items!, item));
        }
        break;

      case 'object':
        return typeof value === 'object' && value !== null;
    }

    return true;
  }

  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  importConfig(configStr: string) {
    try {
      const newConfig = JSON.parse(configStr);
      // Validate the imported config structure
      if (!newConfig.version || !newConfig.rules) {
        throw new Error('Invalid configuration format');
      }
      this.config = newConfig;
    } catch (error) {
      throw new Error(`Failed to import configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 