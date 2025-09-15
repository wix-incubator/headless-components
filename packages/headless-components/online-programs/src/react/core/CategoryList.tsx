import { WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';

import {
  CategoryListService,
  CategoryListServiceConfig,
  CategoryListServiceDefinition,
} from '../../services/category-list-service.js';

/**
 * Props for Root headless component
 */
export interface RootProps {
  children: React.ReactNode;
  categoryListConfig: CategoryListServiceConfig;
}

// TODO: Add example
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        CategoryListServiceDefinition,
        CategoryListService,
        props.categoryListConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}
