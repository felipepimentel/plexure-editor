import { useState } from 'react';
import { OpenAPI } from 'openapi-types';

export type NavigationSection = 'specification' | 'collaboration' | 'documentation';
export type NavigationItem = 'spec' | 'explorer' | 'history' | 'team' | 'branches' | 'sharing' | 'docs';

interface NavigationState {
  activeSection: NavigationSection;
  activeItem: NavigationItem;
  spec: OpenAPI.Document | null;
}

export function useNavigation(initialSpec: OpenAPI.Document | null = null) {
  const [state, setState] = useState<NavigationState>({
    activeSection: 'specification',
    activeItem: 'spec',
    spec: initialSpec
  });

  const handleItemSelect = (item: NavigationItem) => {
    let section: NavigationSection = 'specification';
    
    // Determine section based on item
    if (['history', 'team', 'branches', 'sharing'].includes(item)) {
      section = 'collaboration';
    } else if (['docs'].includes(item)) {
      section = 'documentation';
    }

    setState(prev => ({
      ...prev,
      activeSection: section,
      activeItem: item
    }));
  };

  const updateSpec = (newSpec: OpenAPI.Document | null) => {
    setState(prev => ({
      ...prev,
      spec: newSpec
    }));
  };

  return {
    activeSection: state.activeSection,
    activeItem: state.activeItem,
    spec: state.spec,
    handleItemSelect,
    updateSpec
  };
} 