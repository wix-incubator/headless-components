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
}

export function MenuSelector(props: MenuSelectorProps) {
  const menusService = useService(MenusServiceDefinition);

  const menus = menusService.menus.get();
  const selectedMenu = menusService.selectedMenu.get();

  const onMenuSelect = (menu: Menu) => {
    menusService.selectedMenu.set(menu);
  };

  return props.children({ menus, selectedMenu, onMenuSelect });
}

export interface LocationSelectorProps {
  children: (props: {
    locations: Location[];
    selectedLocation: string | null;
    onLocationSelect: (location: string) => void;
  }) => React.ReactNode;
}

export function LocationSelector(props: LocationSelectorProps) {
  const menusService = useService(MenusServiceDefinition);

  const locations = menusService.locations.get();
  const selectedLocation = menusService.selectedLocation.get();

  const onLocationSelect = (location: string) => {
    menusService.selectedLocation.set(location);
  };

  return props.children({ locations, selectedLocation, onLocationSelect });
}
