import { NavigationProvider } from '@/components/NavigationContext';
import React from 'react';

interface KitchensinkLayoutProps {
  children: React.ReactNode;
}

export const KitchensinkLayout = ({ children }: KitchensinkLayoutProps) => {
  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        {children}
      </div>
    </NavigationProvider>
  );
};
