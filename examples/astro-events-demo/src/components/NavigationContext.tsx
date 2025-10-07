import React, { createContext, useContext, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface NavigationProps {
  route: string;
  children: ReactNode;
  [key: string]: any;
}

export type NavigationComponent = React.ComponentType<NavigationProps>;

const NavigationContext = createContext<NavigationComponent | null>(null);

const DefaultNavigationComponent: NavigationComponent = ({
  route,
  children,
  ...props
}) => {
  return (
    <Link to={route} {...props}>
      {children}
    </Link>
  );
};

export interface NavigationProviderProps {
  children: ReactNode;
  navigationComponent?: NavigationComponent;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  navigationComponent = DefaultNavigationComponent,
}) => {
  return (
    <NavigationContext.Provider value={navigationComponent}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationComponent => {
  const navigationComponent = useContext(NavigationContext);

  return navigationComponent || DefaultNavigationComponent;
};
