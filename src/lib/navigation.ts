import React from 'react';

type TabType = 'chat' | 'history' | 'collections' | 'environments';

export const createNavigationHandlers = (setActiveTab: React.Dispatch<React.SetStateAction<TabType>>) => ({
  handleShowChat: () => setActiveTab('chat'),
  handleShowHistory: () => setActiveTab('history'),
  handleShowEnvironments: () => setActiveTab('environments'),
}); 