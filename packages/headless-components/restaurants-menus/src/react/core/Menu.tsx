import React, { createContext, useContext } from 'react';
import type { Menu } from '../../services/types';

export interface MenuProps {
  children: React.ReactNode;
  menu: Menu;
}

interface MenuContextValue {
  menu: Menu;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export function Menu(props: MenuProps) {
  const contextValue: MenuContextValue = {
    menu: props.menu,
  };

  return (
    <MenuContext.Provider value={contextValue}>
      {props.children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within Menu');
  }
  return context;
}

export interface MenuNameProps {
  children: (props: { name: string }) => React.ReactNode;
}

export interface MenuDescriptionProps {
  children: (props: { description: string }) => React.ReactNode;
}

export function Name(props: MenuNameProps) {
  const { menu } = useMenuContext();

  return props.children({ name: menu.name ?? '' });
}

export function Description(props: MenuDescriptionProps) {
  const { menu } = useMenuContext();

  return props.children({ description: menu.description ?? '' });
}
