import React, { createContext, useContext, useState } from 'react';

interface NavigationItem {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: NavigationItem[];
}

interface NavigationContextType {
  items: Record<string, NavigationItem>;
  addItem: (parentId: string, item: NavigationItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, item: Partial<NavigationItem>) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<string, NavigationItem>>({
    root: {
      name: 'root',
      type: 'directory',
      path: '/',
      children: [],
    },
  });

  const addItem = (parentId: string, item: NavigationItem) => {
    setItems((prev) => {
      const parent = prev[parentId];
      if (!parent) return prev;

      const newItems = { ...prev };
      newItems[item.path] = item;

      if (parent.children) {
        parent.children.push(item);
      } else {
        parent.children = [item];
      }

      return newItems;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const newItems = { ...prev };
      delete newItems[id];
      return newItems;
    });
  };

  const updateItem = (id: string, item: Partial<NavigationItem>) => {
    setItems((prev) => {
      const existingItem = prev[id];
      if (!existingItem) return prev;

      return {
        ...prev,
        [id]: {
          ...existingItem,
          ...item,
        },
      };
    });
  };

  return (
    <NavigationContext.Provider value={{ items, addItem, removeItem, updateItem }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
} 