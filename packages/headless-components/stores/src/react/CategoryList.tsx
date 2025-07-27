import { useService, WixServices } from "@wix/services-manager-react";
import { createServicesMap } from "@wix/services-manager";
import {
  CategoriesListService,
  CategoriesListServiceDefinition,
  type CategoriesListServiceConfig,
} from "../services/categories-list-service.js";
import type { PropsWithChildren, ReactNode } from "react";
import { categories } from "@wix/categories";
import { Root as CategoryRoot } from "./Category.js";

/**
 * Root component that provides the CategoryList service context to its children.
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
 *     <CategoryList.Root categoriesListConfig={{ collectionId: 'my-collection' }}>
 *       <CategoryList.ItemContent>
 *         {({ category }) => (
 *           <div key={category._id}>
 *             <h2>{category.name}</h2>
 *           </div>
 *         )}
 *       </CategoryList.ItemContent>
 *     </CategoryList.Root>
 *   );
 * }
 * ```
 */
export function Root(
  props: PropsWithChildren<{
    categoriesListConfig: CategoriesListServiceConfig;
  }>,
) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        CategoriesListServiceDefinition,
        CategoriesListService,
        props.categoriesListConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for EmptyState headless component
 */
export interface EmptyStateProps {
  /** Content to display when categories list is empty (can be a render function or ReactNode) */
  children: ((props: EmptyStateRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for EmptyState component
 */
export interface EmptyStateRenderProps {}

/**
 * Component that renders content when the categories list is empty.
 * Only displays its children when there are no categories, no loading state, and no errors.
 *
 * @component
 * @example
 * ```tsx
 * import { CategoryList } from '@wix/stores/components';
 *
 * function EmptyCategoriesMessage() {
 *   return (
 *     <CategoryList.EmptyState>
 *       {() => (
 *         <div className="empty-state">
 *           <h3>No categories found</h3>
 *           <p>Categories will appear here once they are created</p>
 *         </div>
 *       )}
 *     </CategoryList.EmptyState>
 *   );
 * }
 * ```
 */
export function EmptyState(props: EmptyStateProps) {
  const { isLoading, error, categories } = useService(
    CategoriesListServiceDefinition,
  );
  const isLoadingValue = isLoading.get();
  const errorValue = error.get();
  const categoriesValue = categories.get();

  if (!isLoadingValue && !errorValue && categoriesValue.length === 0) {
    return typeof props.children === "function"
      ? props.children({})
      : props.children;
  }

  return null;
}

/**
 * Props for Loading headless component
 */
export interface LoadingProps {
  /** Content to display during loading (can be a render function or ReactNode) */
  children: ((props: LoadingRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for Loading component
 */
export interface LoadingRenderProps {}

/**
 * Component that renders content during loading state.
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
 *       {() => (
 *         <div className="loading-spinner">
 *           <div>Loading categories...</div>
 *           <div className="spinner"></div>
 *         </div>
 *       )}
 *     </CategoryList.Loading>
 *   );
 * }
 * ```
 */
export function Loading(props: LoadingProps) {
  const { isLoading } = useService(CategoriesListServiceDefinition);
  const isLoadingValue = isLoading.get();

  if (isLoadingValue) {
    return typeof props.children === "function"
      ? props.children({})
      : props.children;
  }

  return null;
}

/**
 * Props for Error headless component
 */
export interface ErrorProps {
  /** Content to display during error state (can be a render function or ReactNode) */
  children: ((props: ErrorRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for Error component
 */
export interface ErrorRenderProps {
  /** Error message */
  error: string | null;
}

/**
 * Component that renders content when there's an error loading categories.
 * Only displays its children when an error has occurred.
 *
 * @component
 * @example
 * ```tsx
 * import { CategoryList } from '@wix/stores/components';
 *
 * function CategoriesError() {
 *   return (
 *     <CategoryList.Error>
 *       {({ error }) => (
 *         <div className="error-state">
 *           <h3>Error loading categories</h3>
 *           <p>{error}</p>
 *           <button onClick={() => window.location.reload()}>
 *             Try Again
 *           </button>
 *         </div>
 *       )}
 *     </CategoryList.Error>
 *   );
 * }
 * ```
 */
export function Error(props: ErrorProps) {
  const { error } = useService(CategoriesListServiceDefinition);
  const errorValue = error.get();

  if (errorValue) {
    return typeof props.children === "function"
      ? props.children({ error: errorValue })
      : props.children;
  }

  return null;
}

/**
 * Props for ItemContent headless component
 */
export interface ItemContentProps {
  /** Content to display for each category (can be a render function receiving category data or ReactNode) */
  children: ((props: ItemContentRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for ItemContent component
 */
export interface ItemContentRenderProps {
  /** Category data */
  category: categories.Category;
}

/**
 * Component that renders content for each category in the list.
 * Maps over all categories and provides each category through a service context.
 * Only renders when categories are successfully loaded (not loading, no error, and has categories).
 *
 * @component
 * @example
 * ```tsx
 * import { CategoryList } from '@wix/stores/components';
 *
 * function CategoriesGrid() {
 *   return (
 *     <CategoryList.ItemContent>
 *       {({ category }) => (
 *         <div className="category-card">
 *           <h3>{category.name}</h3>
 *           <p>{category.description}</p>
 *           <a href={`/categories/${category.slug}`}>View Category</a>
 *         </div>
 *       )}
 *     </CategoryList.ItemContent>
 *   );
 * }
 * ```
 */
export function ItemContent(props: ItemContentProps) {
  const { categories, isLoading, error } = useService(
    CategoriesListServiceDefinition,
  );
  const categoriesValue = categories.get();

  if (isLoading.get() || error.get() || categoriesValue.length === 0) {
    return null;
  }

  return categoriesValue.map((category: categories.Category) => (
    <CategoryRoot key={category._id} categoryServiceConfig={{ category }}>
      {typeof props.children === "function"
        ? props.children({
            category,
          })
        : props.children}
    </CategoryRoot>
  ));
}
