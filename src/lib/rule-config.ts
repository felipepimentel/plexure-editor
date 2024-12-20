import { RuleConfig, ValidationSeverity } from './custom-rules';

export interface RuleConfigFile {
  version: string;
  rules: Record<string, RuleConfig>;
  extends?: string[];
}

export class RuleConfigManager {
  private config: Record<string, RuleConfig> = {};
  private configFile: string | null = null;

  constructor(configFile?: string) {
    this.configFile = configFile || null;
    this.loadConfig();
  }

  private loadConfig() {
    if (!this.configFile) {
      this.loadDefaultConfig();
      return;
    }

    try {
      // In a real implementation, this would load from a file
      // For now, we'll use default config
      this.loadDefaultConfig();
    } catch (error) {
      console.error('Failed to load rule config:', error);
      this.loadDefaultConfig();
    }
  }

  private loadDefaultConfig() {
    this.config = {
      'naming/pascal-case-schemas': {
        enabled: true,
        severity: 'warning',
        options: {
          ignorePatterns: [],
          allowedPrefixes: []
        }
      },
      'security/require-auth': {
        enabled: true,
        severity: 'error',
        options: {
          allowedPublicPaths: ['/health', '/metrics', '/docs'],
          publicTag: 'public',
          requiredScopes: []
        }
      },
      'docs/require-description': {
        enabled: true,
        severity: 'warning',
        options: {
          minDescriptionLength: 10,
          requireSummary: true
        }
      },
      'structure/consistent-response': {
        enabled: true,
        severity: 'warning',
        options: {
          responseTemplate: {
            type: 'object',
            required: ['data', 'metadata'],
            properties: {
              data: { type: 'object' },
              metadata: {
                type: 'object',
                properties: {
                  timestamp: { type: 'string', format: 'date-time' },
                  requestId: { type: 'string' }
                }
              }
            }
          }
        }
      }
    };
  }

  getRuleConfig(ruleId: string): RuleConfig | undefined {
    return this.config[ruleId];
  }

  updateRuleConfig(ruleId: string, config: Partial<RuleConfig>) {
    const currentConfig = this.config[ruleId] || { enabled: true, options: {} };
    this.config[ruleId] = {
      ...currentConfig,
      ...config,
      options: {
        ...currentConfig.options,
        ...config.options
      }
    };
  }

  setRuleSeverity(ruleId: string, severity: ValidationSeverity) {
    const config = this.config[ruleId];
    if (config) {
      config.severity = severity;
    }
  }

  enableRule(ruleId: string) {
    const config = this.config[ruleId];
    if (config) {
      config.enabled = true;
    }
  }

  disableRule(ruleId: string) {
    const config = this.config[ruleId];
    if (config) {
      config.enabled = false;
    }
  }

  getAllConfigs(): Record<string, RuleConfig> {
    return { ...this.config };
  }

  exportConfig(): string {
    const configFile: RuleConfigFile = {
      version: '1.0.0',
      rules: this.config
    };
    return JSON.stringify(configFile, null, 2);
  }

  importConfig(configJson: string) {
    try {
      const configFile = JSON.parse(configJson) as RuleConfigFile;
      // In a real implementation, we would validate the config format
      this.config = configFile.rules;
    } catch (error) {
      throw new Error(`Failed to import rule config: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 