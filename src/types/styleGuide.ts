import { z } from 'zod';

export const StyleRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(['naming', 'structure', 'content', 'custom']),
  severity: z.enum(['error', 'warning', 'info']),
  enabled: z.boolean().default(true),
  group: z.string().optional(),
  tags: z.array(z.string()).default([]),
  validator: z.function()
    .args(z.any())
    .returns(z.object({
      valid: z.boolean(),
      message: z.string().optional(),
      suggestions: z.array(z.string()).optional()
    }))
});

export type StyleRule = z.infer<typeof StyleRuleSchema>;

export const StyleGuideSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  version: z.string(),
  rules: z.array(StyleRuleSchema),
  metadata: z.object({
    lastModified: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([])
  }).optional()
});

export type StyleGuide = z.infer<typeof StyleGuideSchema>;

export interface ValidationResult {
  valid: boolean;
  rule: StyleRule;
  message?: string;
  path?: string;
  suggestions?: string[];
  fixes?: {
    description: string;
    action: () => void;
  }[];
}

export interface RuleGroup {
  id: string;
  name: string;
  description?: string;
  rules: string[]; // Array of rule IDs
}