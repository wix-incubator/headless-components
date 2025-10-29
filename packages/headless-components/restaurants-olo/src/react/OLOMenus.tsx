import React from 'react';
import { Menus } from '@wix/headless-restaurants-menus/react';
import { type MenusServiceConfig } from '@wix/headless-restaurants-menus/services';
import * as CoreOLOMenus from './core/OLOMenus.js';

// =======================
// TestIds Enum
// =======================
enum TestIds {
  // Container Level
  menusRoot = 'menus-root',
}

// =======================
// Menus Headless Components
// =======================

/**
 * Menus.Root
 * Container for the menus context and data loading.
 * Does not render if there are no menus.
 */
export interface MenusRootProps {
  children: React.ReactNode;
  config: MenusServiceConfig;
}

export const Root = React.forwardRef<HTMLElement, MenusRootProps>((props) => {
  const { children, config } = props;
  return (
    <CoreOLOMenus.Root data-testid={TestIds.menusRoot} config={config}>
      {(updatedConfig) => (
        <Menus.Root data-testid={TestIds.menusRoot} config={updatedConfig}>
          {children}
        </Menus.Root>
      )}
    </CoreOLOMenus.Root>
  );
});

Root.displayName = 'Menus.Root';

// Compose Menus namespace
export const OLOMenus = {
  Root,
  TestIds,
};
