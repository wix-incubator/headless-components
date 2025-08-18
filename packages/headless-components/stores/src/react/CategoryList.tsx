import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as CoreCategoryList from './core/CategoryList.js';
import * as Category from './Category.js';
import { type Category as CategoryType } from '../services/category-service.js';
import { type CategoriesListServiceConfig } from '../services/categories-list-service.js';

enum TestIds {
  categoryListRoot = 'category-list',
  categoryRepeater = 'category-repeater',
}

/**
 * Props for CategoryList.Root component
 */
export interface CategoryListRootProps {
  /** Optional categories array to initialize the service with */
  categories?: CategoryType[];
  /** Configuration for the categories list service */
  categoriesListConfig?: CategoriesListServiceConfig;
  /** Child components */
  children: React.ReactNode;
  /** Optional empty state content to display when no categories are available */
  emptyState?: React.ReactNode;
}

/**
 * Props for CategoryList.Loading component
 */
export interface CategoryListLoadingProps {
  /** Child content to display during loading */
  children?: React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Props for CategoryList.CategoryRepeater component
 */
export interface CategoryListCategoryRepeaterProps {
  /** Child components to repeat for each category */
  children: React.ReactNode;
  /** Maximum nesting depth for hierarchical categories */
  maxDepth?: number;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root container that provides category list context to all child components.
 * This component sets up the necessary services for managing categories list state.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { CategoryList } from '@wix/stores/components';
 *
 * function CategoriesPage() {
 *   return (
 *     <CategoryList.Root categoriesListConfig={categoriesListConfig}>
 *       <CategoryList.Loading>Loading...</CategoryList.Loading>
 *       <CategoryList.CategoryRepeater>
 *         <Category.Label />
 *       </CategoryList.CategoryRepeater>
 *     </CategoryList.Root>
 *   );
 * }
 * ```
 */
export function Root(props: CategoryListRootProps): React.ReactNode {
  const { categories, categoriesListConfig, children, emptyState } = props;

  // Create service config, prioritizing categoriesListConfig, then categories prop
  const serviceConfig =
    categoriesListConfig || (categories ? { categories } : { categories: [] });

  return (
    <CoreCategoryList.Root
      categoriesListConfig={serviceConfig}
      data-testid={TestIds.categoryListRoot}
    >
      {children}
      {emptyState && (
        <CoreCategoryList.EmptyState>{emptyState}</CoreCategoryList.EmptyState>
      )}
    </CoreCategoryList.Root>
  );
}

/**
 * Displays loading state while category data is being fetched.
 * Only displays its children when the categories list is currently loading.
 *
 * @component
 * @example
 * ```tsx
 * import { CategoryList } from '@wix/stores/components';
 *
 * function CategoriesLoading() {
 *   return (
 *     <CategoryList.Loading>
 *       <div className="loading-spinner">Loading categories...</div>
 *     </CategoryList.Loading>
 *   );
 * }
 * ```
 */
export const Loading = React.forwardRef<
  HTMLDivElement,
  CategoryListLoadingProps
>((props, ref) => {
  const { asChild, children, className } = props;

  const Comp = asChild && children ? Slot : 'h1';

  return (
    <CoreCategoryList.Loading>
      <Comp className={className} ref={ref}>
        Loading...
      </Comp>
    </CoreCategoryList.Loading>
  );
});

/**
 * Repeats for each category in the list, providing individual category context.
 * Maps over all categories and provides each category through a service context.
 * Only renders when categories are successfully loaded.
 *
 * @component
 * @example
 * ```tsx
 * import { CategoryList } from '@wix/stores/components';
 *
 * function CategoriesGrid() {
 *   return (
 *     <CategoryList.CategoryRepeater maxDepth={3}>
 *       <Category.Label />
 *       <Category.ID />
 *     </CategoryList.CategoryRepeater>
 *   );
 * }
 * ```
 */
export const CategoryRepeater = React.forwardRef<
  HTMLDivElement,
  CategoryListCategoryRepeaterProps
>((props) => {
  // const { children, asChild = false, className } = props;
  const { children } = props;
  // Note: maxDepth is not implemented yet as it depends on category hierarchy structure

  return (
    <CoreCategoryList.ItemContent>
      {({ category }) => {
        return (
          <Category.Root
            key={category._id}
            categoryServiceConfig={{ category }}
          >
            {children}
          </Category.Root>
        );
      }}
    </CoreCategoryList.ItemContent>
  );
});
