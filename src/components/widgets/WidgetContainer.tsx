import React from 'react';

interface WidgetContainerProps {
  children: React.ReactNode;
  darkMode: boolean;
}

export function WidgetContainer({ children, darkMode }: WidgetContainerProps) {
  return (
    <div className="h-full flex flex-1 overflow-hidden">
      {children}
    </div>
  );
}