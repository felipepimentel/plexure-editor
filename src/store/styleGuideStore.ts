import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StyleGuide, StyleRule, RuleGroup } from '../types/styleGuide';
import { defaultStyleGuide } from '../utils/defaultStyleGuide';

interface StyleGuideState {
  activeGuide: StyleGuide;
  customRules: StyleRule[];
  ruleGroups: RuleGroup[];
  selectedGroup: string | null;
  setActiveGuide: (guide: StyleGuide) => void;
  addCustomRule: (rule: StyleRule) => void;
  removeCustomRule: (ruleId: string) => void;
  updateCustomRule: (ruleId: string, updates: Partial<StyleRule>) => void;
  toggleRuleEnabled: (ruleId: string) => void;
  addRuleGroup: (group: RuleGroup) => void;
  removeRuleGroup: (groupId: string) => void;
  updateRuleGroup: (groupId: string, updates: Partial<RuleGroup>) => void;
  moveRuleToGroup: (ruleId: string, groupId: string | null) => void;
  setSelectedGroup: (groupId: string | null) => void;
  importStyleGuide: (guide: StyleGuide) => void;
  exportStyleGuide: () => StyleGuide;
  duplicateRule: (ruleId: string) => void;
  reorderRules: (groupId: string, ruleIds: string[]) => void;
}

export const useStyleGuideStore = create<StyleGuideState>()(
  persist(
    (set, get) => ({
      activeGuide: defaultStyleGuide,
      customRules: [],
      ruleGroups: [
        { id: 'naming', name: 'Naming Conventions', rules: [] },
        { id: 'structure', name: 'API Structure', rules: [] },
        { id: 'content', name: 'Content Rules', rules: [] },
        { id: 'security', name: 'Security', rules: [] }
      ],
      selectedGroup: null,

      setActiveGuide: (guide) => set({ activeGuide: guide }),
      
      addCustomRule: (rule) =>
        set((state) => ({
          customRules: [...state.customRules, rule],
          activeGuide: {
            ...state.activeGuide,
            rules: [...state.activeGuide.rules, rule]
          }
        })),

      removeCustomRule: (ruleId) =>
        set((state) => ({
          customRules: state.customRules.filter((r) => r.id !== ruleId),
          activeGuide: {
            ...state.activeGuide,
            rules: state.activeGuide.rules.filter((r) => r.id !== ruleId)
          },
          ruleGroups: state.ruleGroups.map(group => ({
            ...group,
            rules: group.rules.filter(id => id !== ruleId)
          }))
        })),

      updateCustomRule: (ruleId, updates) =>
        set((state) => ({
          customRules: state.customRules.map((rule) =>
            rule.id === ruleId ? { ...rule, ...updates } : rule
          ),
          activeGuide: {
            ...state.activeGuide,
            rules: state.activeGuide.rules.map((rule) =>
              rule.id === ruleId ? { ...rule, ...updates } : rule
            )
          }
        })),

      toggleRuleEnabled: (ruleId) =>
        set((state) => ({
          activeGuide: {
            ...state.activeGuide,
            rules: state.activeGuide.rules.map((rule) =>
              rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
            )
          }
        })),

      addRuleGroup: (group) =>
        set((state) => ({
          ruleGroups: [...state.ruleGroups, group]
        })),

      removeRuleGroup: (groupId) =>
        set((state) => ({
          ruleGroups: state.ruleGroups.filter((g) => g.id !== groupId),
          activeGuide: {
            ...state.activeGuide,
            rules: state.activeGuide.rules.map(rule => 
              rule.group === groupId ? { ...rule, group: null } : rule
            )
          }
        })),

      updateRuleGroup: (groupId, updates) =>
        set((state) => ({
          ruleGroups: state.ruleGroups.map((group) =>
            group.id === groupId ? { ...group, ...updates } : group
          )
        })),

      moveRuleToGroup: (ruleId, groupId) =>
        set((state) => ({
          ruleGroups: state.ruleGroups.map(group => ({
            ...group,
            rules: groupId === group.id
              ? [...group.rules, ruleId]
              : group.rules.filter(id => id !== ruleId)
          })),
          activeGuide: {
            ...state.activeGuide,
            rules: state.activeGuide.rules.map(rule =>
              rule.id === ruleId ? { ...rule, group: groupId } : rule
            )
          }
        })),

      setSelectedGroup: (groupId) =>
        set({ selectedGroup: groupId }),

      importStyleGuide: (guide) =>
        set({ activeGuide: guide }),

      exportStyleGuide: () => {
        const state = get();
        return {
          ...state.activeGuide,
          metadata: {
            ...state.activeGuide.metadata,
            lastModified: new Date().toISOString()
          }
        };
      },

      duplicateRule: (ruleId) =>
        set((state) => {
          const rule = state.activeGuide.rules.find(r => r.id === ruleId);
          if (!rule) return state;

          const newRule = {
            ...rule,
            id: `${rule.id}-copy-${Date.now()}`,
            name: `${rule.name} (Copy)`,
          };

          return {
            activeGuide: {
              ...state.activeGuide,
              rules: [...state.activeGuide.rules, newRule]
            },
            customRules: [...state.customRules, newRule]
          };
        }),

      reorderRules: (groupId, ruleIds) =>
        set((state) => ({
          ruleGroups: state.ruleGroups.map(group =>
            group.id === groupId ? { ...group, rules: ruleIds } : group
          )
        }))
    }),
    {
      name: 'swagger-editor-style-guide'
    }
  )
);