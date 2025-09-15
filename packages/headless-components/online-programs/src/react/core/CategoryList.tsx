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

/**
 * Root component that provides CategoryList service to its children.
 * This component sets up the necessary service for managing category list.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { CategoryList } from '@wix/online-programs/components';
 *
 * function CategoryListPage(props) {
 *  const { categories } = props;
 *
 *  return (
 *    <CategoryList.Root categoryListConfig={{ categories }}>
 *      <CategoryList.Categories>
 *        <CategoryList.CategoryRepeater>
 *          <Category.Label />
 *          <Category.ID />
 *        </CategoryList.CategoryRepeater>
 *      </CategoryList.Categories>
 *    </CategoryList.Root>
 *  );
 * }
 * ```
 */
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
