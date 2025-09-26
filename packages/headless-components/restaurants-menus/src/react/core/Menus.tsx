import React from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import {
  MenusService,
  MenusServiceConfig,
  MenusServiceDefinition,
} from '../../services/index.js';
import { createServicesMap } from '@wix/services-manager';
import type { Menu, Location } from '../../services/types.js';

export interface AppProps {
  children: React.ReactNode;
  config: MenusServiceConfig;
}

export function Menus(props: AppProps) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        MenusServiceDefinition,
        MenusService,
        props.config,
      )}
    >
      {props.children}
    </WixServices>
  );
}

export interface LoadingProps {
  children: (props: { loading: boolean }) => React.ReactNode;
}

export interface ErrorStateProps {
  children: (props: { error: string | null }) => React.ReactNode;
}

export function Loading(props: LoadingProps) {
  const menusService = useService(MenusServiceDefinition);

  const loading = menusService.loading.get();

  return props.children({ loading });
}

export function ErrorState(props: ErrorStateProps) {
  const menusService = useService(MenusServiceDefinition);

  const error = menusService.error.get();

  return props.children({ error });
}

export interface MenuSelectorProps {
  children: (props: {
    menus: Menu[];
    selectedMenu: Menu | null;
    onMenuSelect: (menu: Menu) => void;
  }) => React.ReactNode;
  /** Text for the "all" option */
  allText?: string;
  /** Whether to show the "all" option */
  showAll?: boolean;
}

export function MenuSelector(props: MenuSelectorProps) {
  const { allText, showAll = true } = props;
  const menusService = useService(MenusServiceDefinition);

  const filteredMenus = menusService.filteredMenus.get();
  // Add "All" option at the beginning if showAll is true
  const menus = showAll
    ? [{ _id: 'all', name: allText || 'All' } as Menu, ...filteredMenus]
    : filteredMenus;
  const selectedMenu = menusService.selectedMenu.get();

  const onMenuSelect = (menu: Menu) => {
    if (menu._id === 'all') {
      menusService.selectedMenu.set(null); // Clear selection to show all
    } else {
      menusService.selectedMenu.set(menu);
    }
  };

  return props.children({ menus, selectedMenu, onMenuSelect });
}

export interface LocationSelectorProps {
  children: (props: {
    locations: Location[];
    selectedLocation: string | null;
    onLocationSelect: (location: string) => void;
  }) => React.ReactNode;
  /** Text for the "all" option */
  allText?: string;
  /** Whether to show the "all" option */
  showAll?: boolean;
}

export function LocationSelector(props: LocationSelectorProps) {
  const { allText, showAll = true } = props;
  const menusService = useService(MenusServiceDefinition);

  const allLocations = menusService.locations.get();
  // Add "All" option at the beginning if showAll is true
  const locations = showAll
    ? [{ id: 'all', name: allText || 'All' }, ...allLocations]
    : allLocations;
  const selectedLocation = menusService.selectedLocation.get();

  const onLocationSelect = (location: string) => {
    if (location === 'all') {
      menusService.selectedLocation.set(null); // Clear selection to show all
    } else {
      menusService.selectedLocation.set(location);
    }
  };

  return props.children({ locations, selectedLocation, onLocationSelect });
}
