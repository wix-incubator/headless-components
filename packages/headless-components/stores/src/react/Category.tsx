import React from 'react';
import * as CoreCategory from './core/Category.js';
import { type Category } from '../services/category-service.js';
import {
  type CategoryServiceConfig,
  CategoryServiceDefinition,
} from '../services/category-service.js';
import { ProductsListServiceDefinition } from '../services/products-list-service.js';
import { useService } from '@wix/services-manager-react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';

enum TestIds {
  categoryItem = 'category-item',
  categoryTrigger = 'category-trigger',
  categoryLabel = 'category-label',
  categoryId = 'category-id',
  categoryRaw = 'category-raw',
}

/**
 * Props for Category.Root component
 */
export interface CategoryRootProps {
  /** Category object to initialize the service with */
  category?: Category;
  /** Configuration for the category service */
  categoryServiceConfig?: CategoryServiceConfig;
  /** Whether the category is currently selected */
  isSelected?: boolean;
  /** Child components */
  children: React.ReactNode;
}

/**
 * Props for Category.Trigger component
 */
export interface CategoryTriggerProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    category: Category;
    isSelected: boolean;
    onSelect: () => void;
    setIsSelected: (isSelected: boolean) => void;
  }>;
  /** Callback when category is selected */
  onSelect?: (category: Category) => void;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Props for Category.Label component
 */
export interface CategoryLabelProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    name: string;
    category: Category;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Props for Category.ID component
 */
export interface CategoryIDProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    id: string;
    category: Category;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Props for Category.Raw component
 */
export interface CategoryRawProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    category: Category;
    isSelected: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root container for a single category item.
 * This component sets up the necessary services for managing category state
 * and provides category context to child components.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Category } from '@wix/headless-stores/react';
 *
 * <Category.Root categoryServiceConfig={{ category }}>
 *   <Category.Trigger />
 *   <Category.Label />
 *   <Category.ID />
 * </Category.Root>
 * ```
 */
export function Root(props: CategoryRootProps): React.ReactNode {
  const { category, categoryServiceConfig, isSelected, children } = props;

  if (!category && !categoryServiceConfig) {
    throw new Error(
      'Category.Root: category or categoryServiceConfig is required',
    );
  }

  const serviceConfig = categoryServiceConfig || {
    category: category!,
    isSelected,
  };

  return (
    <CoreCategory.Root categoryServiceConfig={serviceConfig}>
      {children}
    </CoreCategory.Root>
  );
}

/**
 * Interactive element for selecting or triggering category actions.
 * Provides category data and selection state to custom render functions.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Category.Trigger className="px-4 py-2 rounded border hover:bg-surface-hover" />
 *
 * // Custom rendering with forwardRef
 * <Category.Trigger asChild>
 *   {React.forwardRef(({category, isSelected, onSelect, ...props}, ref) => (
 *     <button
 *       ref={ref}
 *       {...props}
 *       onClick={onSelect}
 *       className={`px-4 py-2 rounded transition-colors ${
 *         isSelected
 *           ? 'bg-brand-primary text-white'
 *           : 'border border-surface-subtle hover:bg-surface-hover'
 *       }`}
 *     >
 *       {category.name}
 *     </button>
 *   ))}
 * </Category.Trigger>
 * ```
 */
export const Trigger = React.forwardRef<
  HTMLButtonElement,
  CategoryTriggerProps
>((props, ref) => {
  const { asChild, children, onSelect, className } = props;

  const categoryService = useService(CategoryServiceDefinition);
  const category = categoryService.category.get();

  // Get ProductList service for filter integration
  const productListService = useService(ProductsListServiceDefinition);

  // Read selection state from ProductList filter (source of truth)
  const currentFilter = productListService.searchOptions.get().filter || {};
  const selectedCategoryId = (currentFilter as any)[
    'allCategoriesInfo.categories'
  ]?.$matchItems?.[0]?.id?.$in?.[0];
  const isSelected = selectedCategoryId === category._id;

  const handleSelect = () => {
    // Update ProductList filter
    const currentFilter = productListService.searchOptions.get().filter || {};

    if (isSelected) {
      // Remove category filter if currently selected
      delete (currentFilter as any)['allCategoriesInfo.categories'];
      productListService.setFilter(currentFilter);
    } else {
      // Add category filter if not currently selected
      productListService.setFilter({
        ...currentFilter,
        'allCategoriesInfo.categories': {
          $matchItems: [{ id: { $in: [category._id!] } }],
        },
      });
    }

    if (onSelect) {
      onSelect(category);
    }
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      onClick={handleSelect}
      data-testid={TestIds.categoryTrigger}
      data-selected={isSelected ? 'true' : 'false'}
      customElement={children}
      customElementProps={{
        category,
        isSelected,
        onSelect: handleSelect,
      }}
      content={category.name}
    >
      <button>{category.name}</button>
    </AsChildSlot>
  );
});

/**
 * Displays the category name or label.
 * Provides category name and full category data to custom render functions.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Category.Label className="text-lg font-medium text-content-primary" />
 *
 * // Custom rendering with forwardRef
 * <Category.Label asChild>
 *   {React.forwardRef(({name, category, ...props}, ref) => (
 *     <span ref={ref} {...props} className="text-lg font-medium text-content-primary">
 *       {name}
 *       {category.numberOfProducts > 0 && (
 *         <span className="text-sm text-content-muted ml-2">
 *           ({category.numberOfProducts})
 *         </span>
 *       )}
 *     </span>
 *   ))}
 * </Category.Label>
 * ```
 */
export const Label = React.forwardRef<HTMLElement, CategoryLabelProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const categoryService = useService(CategoryServiceDefinition);
    const category = categoryService.category.get();

    // Get ProductList service to read selection state from filter
    const productListService = useService(ProductsListServiceDefinition);

    // Read selection state from ProductList filter (source of truth)
    const currentFilter = productListService.searchOptions.get().filter || {};
    const selectedCategoryId = (currentFilter as any)[
      'allCategoriesInfo.categories'
    ]?.$matchItems?.[0]?.id?.$in?.[0];
    const isSelected = selectedCategoryId === category._id;

    return (
      <CoreCategory.Name>
        {({ name }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.categoryLabel}
              data-selected={isSelected ? 'true' : 'false'}
              customElement={children}
              customElementProps={{ name, category }}
              content={name}
            >
              <span>{name}</span>
            </AsChildSlot>
          );
        }}
      </CoreCategory.Name>
    );
  },
);

/**
 * Provides access to the category ID for advanced use cases.
 * Typically used for tracking, analytics, or hidden form fields.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage (hidden by default)
 * <Category.ID className="hidden" />
 *
 * // Custom rendering with forwardRef
 * <Category.ID asChild>
 *   {React.forwardRef(({id, category, ...props}, ref) => (
 *     <span
 *       ref={ref}
 *       {...props}
 *       data-category-id={id}
 *       className="sr-only"
 *     >
 *       Category ID: {id}
 *     </span>
 *   ))}
 * </Category.ID>
 * ```
 */
export const ID = React.forwardRef<HTMLElement, CategoryIDProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const categoryService = useService(CategoryServiceDefinition);
    const category = categoryService.category.get();
    const isSelected = categoryService.isSelected.get();
    const id = category._id || '';

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className || 'sr-only'}
        data-testid={TestIds.categoryId}
        data-selected={isSelected ? 'true' : 'false'}
        customElement={children}
        customElementProps={{ id, category }}
        content={id}
      >
        <span>{id}</span>
      </AsChildSlot>
    );
  },
);

/**
 * Provides access to the full category data for advanced use cases.
 * Useful for custom implementations that need access to all category properties.
 *
 * @component
 * @example
 * ```tsx
 * // Custom rendering with forwardRef
 * <Category.Raw asChild>
 *   {React.forwardRef(({category, ...props}, ref) => (
 *     <div
 *       ref={ref}
 *       {...props}
 *       data-category-id={category._id}
 *       className="category-raw-data"
 *     >
 *       <pre>{JSON.stringify(category, null, 2)}</pre>
 *     </div>
 *   ))}
 * </Category.Raw>
 * ```
 */
export const Raw = React.forwardRef<HTMLElement, CategoryRawProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const categoryService = useService(CategoryServiceDefinition);
    const category = categoryService.category.get();
    const isSelected = categoryService.isSelected.get();

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className || 'sr-only'}
        data-testid={TestIds.categoryRaw}
        data-selected={isSelected ? 'true' : 'false'}
        customElement={children}
        customElementProps={{ category, isSelected }}
      >
        <span>{JSON.stringify(category)}</span>
      </AsChildSlot>
    );
  },
);
