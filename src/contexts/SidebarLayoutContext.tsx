import React, { createContext, useContext, useState } from 'react';

interface SidebarLayoutState {
  leftSidebarExpanded: boolean;
  rightSidebarExpanded: boolean;
  leftActivityBarExpanded: boolean;
  rightActivityBarExpanded: boolean;
  leftPanelExpanded: boolean;
  rightPanelExpanded: boolean;
}

interface SidebarLayoutContextType extends SidebarLayoutState {
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleLeftActivityBar: () => void;
  toggleRightActivityBar: () => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  setLeftSidebarExpanded: (expanded: boolean) => void;
  setRightSidebarExpanded: (expanded: boolean) => void;
  setLeftActivityBarExpanded: (expanded: boolean) => void;
  setRightActivityBarExpanded: (expanded: boolean) => void;
  setLeftPanelExpanded: (expanded: boolean) => void;
  setRightPanelExpanded: (expanded: boolean) => void;
}

const SidebarLayoutContext = createContext<SidebarLayoutContextType | undefined>(undefined);

export function SidebarLayoutProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SidebarLayoutState>({
    leftSidebarExpanded: true,
    rightSidebarExpanded: true,
    leftActivityBarExpanded: true,
    rightActivityBarExpanded: true,
    leftPanelExpanded: true,
    rightPanelExpanded: true,
  });

  const toggleLeftSidebar = () => {
    setState(prev => ({
      ...prev,
      leftSidebarExpanded: !prev.leftSidebarExpanded,
    }));
  };

  const toggleRightSidebar = () => {
    setState(prev => ({
      ...prev,
      rightSidebarExpanded: !prev.rightSidebarExpanded,
    }));
  };

  const toggleLeftActivityBar = () => {
    setState(prev => ({
      ...prev,
      leftActivityBarExpanded: !prev.leftActivityBarExpanded,
    }));
  };

  const toggleRightActivityBar = () => {
    setState(prev => ({
      ...prev,
      rightActivityBarExpanded: !prev.rightActivityBarExpanded,
    }));
  };

  const toggleLeftPanel = () => {
    setState(prev => ({
      ...prev,
      leftPanelExpanded: !prev.leftPanelExpanded,
    }));
  };

  const toggleRightPanel = () => {
    setState(prev => ({
      ...prev,
      rightPanelExpanded: !prev.rightPanelExpanded,
    }));
  };

  const setLeftSidebarExpanded = (expanded: boolean) => {
    setState(prev => ({
      ...prev,
      leftSidebarExpanded: expanded,
    }));
  };

  const setRightSidebarExpanded = (expanded: boolean) => {
    setState(prev => ({
      ...prev,
      rightSidebarExpanded: expanded,
    }));
  };

  const setLeftActivityBarExpanded = (expanded: boolean) => {
    setState(prev => ({
      ...prev,
      leftActivityBarExpanded: expanded,
    }));
  };

  const setRightActivityBarExpanded = (expanded: boolean) => {
    setState(prev => ({
      ...prev,
      rightActivityBarExpanded: expanded,
    }));
  };

  const setLeftPanelExpanded = (expanded: boolean) => {
    setState(prev => ({
      ...prev,
      leftPanelExpanded: expanded,
    }));
  };

  const setRightPanelExpanded = (expanded: boolean) => {
    setState(prev => ({
      ...prev,
      rightPanelExpanded: expanded,
    }));
  };

  return (
    <SidebarLayoutContext.Provider
      value={{
        ...state,
        toggleLeftSidebar,
        toggleRightSidebar,
        toggleLeftActivityBar,
        toggleRightActivityBar,
        toggleLeftPanel,
        toggleRightPanel,
        setLeftSidebarExpanded,
        setRightSidebarExpanded,
        setLeftActivityBarExpanded,
        setRightActivityBarExpanded,
        setLeftPanelExpanded,
        setRightPanelExpanded,
      }}
    >
      {children}
    </SidebarLayoutContext.Provider>
  );
}

export function useSidebarLayout() {
  const context = useContext(SidebarLayoutContext);
  if (context === undefined) {
    throw new Error('useSidebarLayout must be used within a SidebarLayoutProvider');
  }
  return context;
} 