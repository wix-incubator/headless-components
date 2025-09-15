import React from 'react';
import {
  ServicesManagerProvider,
  useService,
} from '@wix/services-manager-react';
import {
  MenusService,
  MenusServiceConfig,
  MenusServiceDefinition,
} from '../../services/index.js';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';

export interface AppProps {
  children: React.ReactNode;
  config: MenusServiceConfig;
}

export function Menus(props: AppProps) {
  return (
    <ServicesManagerProvider
      servicesManager={createServicesManager(
        createServicesMap().addService(
          MenusServiceDefinition,
          MenusService,
          props.config,
        ),
      )}
    >
      {props.children}
    </ServicesManagerProvider>
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
