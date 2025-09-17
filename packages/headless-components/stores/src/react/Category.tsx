import React from 'react';
import { categories } from '@wix/categories';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import * as CoreProductListFilters from './core/ProductListFilters.js';

export type Category = categories.Category;

// Context to provide category data and filter functions to child components
interface CategoryContextValue
  extends CoreProductListFilters.CategoryFilterRenderProps {
  category: Category;
  isSelected: boolean;
}

const CategoryContext = React.createContext<CategoryContextValue | null>(null);

function useCategoryContext(): CategoryContextValue {
  const context = React.useContext(CategoryContext);
  if (!context) {
    throw new Error(
      'useCategoryContext must be used within a Category.Root component',
    );
  }
  return context;
}

enum DataComponentTags {
  categoryRoot = 'stores.category-root',
}

enum TestIds {
  categoryRoot = 'category-root',
  categoryItem = 'category-item',
  categoryTrigger = 'category-trigger',
  categoryLabel = 'category-label',
  categoryId = 'category-id',
  categoryRaw = 'category-raw',
  categoryFilter = 'category-filter',
}

/**
 * Props for Category.Root component
 */
export interface CategoryRootProps {
  /** Category data */
  category: Category;
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
 * Props for CategoryFilter component
 */
export interface CategoryFilterProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    selectedCategory: Category | null;
    setSelectedCategory: (category: Category | null) => void;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Label for the selected category display */
  label?: string;
}

/**
 * Root container for a single category item.
 * This component sets up the necessary services for managing category state
 * and provides category context to child components.
 * Automatically injects data-component-tag into the first child DOM element.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Category } from '@wix/headless-stores/react';
 *
 * <Category.Root category={category}>
 *     <Category.Trigger />
 *     <Category.Label />
 *     <Category.ID />
 * </Category.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, CategoryRootProps>(
  (props, ref) => {
    const { category, children } = props;

    return (
      <CoreProductListFilters.CategoryFilter>
        {({ selectedCategory, setSelectedCategory }) => {
          // Determine if this category is selected by comparing with selectedCategory
          const isSelected = selectedCategory?._id === category._id;

          const contextValue: CategoryContextValue = {
            category,
            isSelected,
            selectedCategory,
            setSelectedCategory,
          };

          return (
            <CategoryContext.Provider value={contextValue}>
              <AsChildSlot
                ref={ref}
                data-component-tag={DataComponentTags.categoryRoot}
                data-testid={TestIds.categoryRoot}
              >
                {children}
              </AsChildSlot>
            </CategoryContext.Provider>
          );
        }}
      </CoreProductListFilters.CategoryFilter>
    );
  }
);

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
  const { asChild, children, onSelect, className, ...otherProps } = props;

  const { category, isSelected, setSelectedCategory } = useCategoryContext();

  const handleSelect = () => {
    // Use CategoryFilter's setSelectedCategory function
    if (isSelected) {
      // Deselect by passing null
      setSelectedCategory(null);
    } else {
      // Select this category
      setSelectedCategory(category);
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
      {...otherProps}
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

    const { category, isSelected } = useCategoryContext();

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.categoryLabel}
        data-selected={isSelected ? 'true' : 'false'}
        customElement={children}
        customElementProps={{ name: category.name!, category }}
        content={category.name!}
      >
        <span>{category.name}</span>
      </AsChildSlot>
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

    const { category, isSelected } = useCategoryContext();
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

    const { category, isSelected } = useCategoryContext();

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

/**
 * Category filter component that provides category selection functionality.
 * Provides selected category state and selection controls to custom render functions.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <CategoryFilter className="category-filter" />
 *
 * // With custom label
 * <CategoryFilter label="Current Category:" />
 *
 * // Custom rendering with forwardRef
 * <CategoryFilter asChild>
 *   {React.forwardRef(({selectedCategory, setSelectedCategory, ...props}, ref) => (
 *     <div ref={ref} {...props} className="custom-category-filter">
 *       {selectedCategory && (
 *         <span>Selected: {selectedCategory.name}</span>
 *       )}
 *       <button onClick={() => setSelectedCategory(null)}>
 *         Clear Selection
 *       </button>
 *     </div>
 *   ))}
 * </CategoryFilter>
 * ```
 */
export const CategoryFilter = React.forwardRef<
  HTMLElement,
  CategoryFilterProps
>((props, ref) => {
  const { asChild, children, className } = props;

  const label = props.label || 'Selected:';

  return (
    <CoreProductListFilters.CategoryFilter>
      {({ selectedCategory, setSelectedCategory }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.categoryFilter}
            data-selected={selectedCategory ? 'true' : 'false'}
            customElement={children}
            customElementProps={{
              selectedCategory,
              setSelectedCategory,
            }}
          >
            <div>
              {selectedCategory && (
                <span>
                  {label} {selectedCategory.name}
                </span>
              )}
            </div>
          </AsChildSlot>
        );
      }}
    </CoreProductListFilters.CategoryFilter>
  );
});

CategoryFilter.displayName = 'CategoryFilter';
