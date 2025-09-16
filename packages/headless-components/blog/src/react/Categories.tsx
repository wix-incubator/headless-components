import type { categories } from '@wix/blog';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { createServicesMap } from '@wix/services-manager';
import { WixServices } from '@wix/services-manager-react';
import React from 'react';
import {
  BlogCategoriesService,
  BlogCategoriesServiceDefinition,
  enhanceCategories,
  type BlogCategoriesServiceConfig,
  type EnhancedCategory,
} from '../services/blog-categories-service.js';
import type { createCustomCategory } from '../services/helpers.js';
import * as CoreCategories from './core/Categories.js';
import { isValidChildren } from './helpers.js';

interface CategoriesContextValue {
  categories: EnhancedCategory[];
  hasCategories: boolean;
  fallbackImageUrl?: string;
}

const CategoriesContext = React.createContext<CategoriesContextValue | null>(
  null,
);

CategoriesContext.displayName = 'Blog.Categories.Context';

function useCategoriesContext(): CategoriesContextValue {
  const context = React.useContext(CategoriesContext);
  if (!context) {
    throw new Error(
      'useCategoriesContext must be used within a BlogCategories.Root component',
    );
  }
  return context;
}

const enum TestIds {
  blogCategoriesRoot = 'blog-categories-root',
  blogCategories = 'blog-categories',
  blogActiveCategory = 'blog-active-category',
}

export interface BlogCategoriesRootProps {
  asChild?: boolean;
  className?: string;
  children: AsChildChildren<{ hasCategories: boolean }> | React.ReactNode;

  /** Loaded result of `loadBlogCategoriesServiceConfig` */
  blogCategoriesServiceConfig?: BlogCategoriesServiceConfig;
  /** Categories to use instead of loading from the service */
  categories?: categories.Category[];
  /** Custom categories to prepend to the real categories (e.g., "All posts"). @see {@link createCustomCategory} */
  customCategoriesToPrepend?: ReturnType<typeof createCustomCategory>[];
  /** Fallback image url to use when the category image is not available */
  fallbackImageUrl?: string;
}

/**
 * Root container for blog categories that provides categories context to all child components.
 * Supports both real categories from the service and custom categories.
 * Follows Container Level pattern from architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * import { Blog } from '@wix/blog/components';
 *
 * function CategoryNavigation() {
 *   return (
 *     <Blog.Categories.Root customCategories={[createCustomCategory('All', '/')]}>
 *       <Blog.Categories.CategoryItems emptyState={<div>No categories found</div>}>
 *         <Blog.Categories.CategoryItemRepeater>
 *           <Blog.Category.Link baseUrl="/category/">
 *             <Blog.Category.Label />
 *           </Blog.Category.Link>
 *         </Blog.Categories.CategoryItemRepeater>
 *       </Blog.Categories.CategoryItems>
 *     </Blog.Categories.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, BlogCategoriesRootProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      className,
      categories: categoriesProp,
      customCategoriesToPrepend = [],
      blogCategoriesServiceConfig,
      fallbackImageUrl,
    } = props;

    const renderRoot = (
      categories: EnhancedCategory[],
      hasCategories: boolean,
    ) => {
      const contextValue: CategoriesContextValue = {
        categories,
        fallbackImageUrl,
        hasCategories,
      };

      const attributes = {
        'data-testid': TestIds.blogCategoriesRoot,
        'data-has-categories': hasCategories,
      };

      return (
        <CategoriesContext.Provider value={contextValue}>
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            {...attributes}
            customElement={children}
            customElementProps={{ hasCategories }}
          >
            <div>{isValidChildren(children) ? children : null}</div>
          </AsChildSlot>
        </CategoriesContext.Provider>
      );
    };

    if (categoriesProp) {
      return renderRoot(
        enhanceCategories(categoriesProp),
        categoriesProp.length > 0,
      );
    }

    return (
      <WixServices
        servicesMap={createServicesMap().addService(
          BlogCategoriesServiceDefinition,
          BlogCategoriesService,
          blogCategoriesServiceConfig,
        )}
      >
        <CoreCategories.Categories>
          {({
            categories: realCategories,
            hasCategories: hasRealCategories,
          }) => {
            const allCategories: EnhancedCategory[] = [
              ...customCategoriesToPrepend,
              ...realCategories,
            ];

            const hasCategories = hasRealCategories;

            return renderRoot(allCategories, hasCategories);
          }}
        </CoreCategories.Categories>
      </WixServices>
    );
  },
);

Root.displayName = 'Blog.Categories.Root';

export interface CategoryItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * Container for the categories list with empty state support.
 * Follows List Container Level pattern from architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Categories.CategoryItems emptyState={<div>No categories found</div>}>
 *   <Blog.Categories.CategoryItemRepeater>
 *     <Blog.Category.Label />
 *   </Blog.Categories.CategoryItemRepeater>
 * </Blog.Categories.CategoryItems>
 * ```
 */
export const CategoryItems = React.forwardRef<HTMLElement, CategoryItemsProps>(
  (props, ref) => {
    const { children, emptyState } = props;
    const { hasCategories } = useCategoriesContext();

    if (!hasCategories) {
      return emptyState || null;
    }

    const attributes = {
      'data-testid': TestIds.blogCategories,
    };

    return (
      <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
        {children}
      </div>
    );
  },
);

CategoryItems.displayName = 'Blog.Categories.CategoryItems';

export interface CategoryItemRepeaterProps {
  children: React.ReactNode;
  offset?: number;
  limit?: number;
}

/**
 * Repeater component that renders Category for each category.
 * Follows Repeater Level pattern from architecture rules.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Categories.CategoryItems>
 *   <Blog.Categories.CategoryItemRepeater>
 *     <Blog.Categories.Link baseUrl="/category/">
 *       <Blog.Categories.Label />
 *     </Blog.Categories.Link>
 *   </Blog.Categories.CategoryItemRepeater>
 * </Blog.Categories.CategoryItems>
 * ```
 */
export const CategoryItemRepeater = React.forwardRef<
  HTMLElement,
  CategoryItemRepeaterProps
>((props, _ref) => {
  const { children, offset = 0, limit = Infinity } = props;
  const { categories, fallbackImageUrl } = useCategoriesContext();

  const categoriesSlice = categories.slice(offset, offset + limit);

  return (
    <>
      {categoriesSlice.map((category) => {
        const imageUrl = category.imageUrl || fallbackImageUrl;
        const contextValue: CategoryItemRepeaterContextValue = {
          category,
          imageUrl,
        };

        return (
          <CategoryItemRepeaterContext.Provider
            key={category._id}
            value={contextValue}
          >
            {children}
          </CategoryItemRepeaterContext.Provider>
        );
      })}
    </>
  );
});

CategoryItemRepeater.displayName = 'Blog.Categories.CategoryItemRepeater';

interface CategoryItemRepeaterContextValue {
  category: EnhancedCategory;
  imageUrl?: string;
}

const CategoryItemRepeaterContext =
  React.createContext<CategoryItemRepeaterContextValue | null>(null);

CategoryItemRepeaterContext.displayName = 'Blog.Categories.CategoryContext';

export function useCategoryItemRepeaterContext(): CategoryItemRepeaterContextValue {
  const context = React.useContext(CategoryItemRepeaterContext);
  if (!context) {
    throw new Error(
      'useCategoryContext must be used within a Category.Root component',
    );
  }
  return context;
}

export interface ActiveCategoryProps {
  asChild?: boolean;
  className?: string;
  currentPath: string;
  baseUrl?: string;
  children: AsChildChildren<{ category: EnhancedCategory }> | React.ReactNode;
}

/**
 * Component that finds and displays the currently active category.
 * Provides the active category through CategoryContext to its children.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Categories.ActiveCategory currentPath={location.pathname} baseUrl="/category/">
 *   {({ category }) => (
 *     <div className="hero-section">
 *       <Blog.Categories.Image />
 *       <div className="overlay">
 *         <Blog.Categories.Label className="text-white text-3xl" />
 *         <Blog.Categories.Description className="text-white/90" />
 *       </div>
 *     </div>
 *   )}
 * </Blog.Categories.ActiveCategory>
 * ```
 */
export const ActiveCategory = React.forwardRef<
  HTMLElement,
  ActiveCategoryProps
>((props, ref) => {
  const { asChild, className, currentPath, baseUrl = '', children } = props;
  const { categories, fallbackImageUrl } = useCategoriesContext();

  const activeCategory = categories.find(
    (category) =>
      currentPath ===
      (category.isCustom ? category.slug : `${baseUrl}${category.slug}`),
  );

  if (!activeCategory) return null;

  const contextValue: CategoryItemRepeaterContextValue = {
    category: activeCategory,
    imageUrl: activeCategory.imageUrl || fallbackImageUrl,
  };

  const attributes = {
    'data-testid': TestIds.blogActiveCategory,
    'data-has-image': !!contextValue.imageUrl,
  };

  return (
    <CategoryItemRepeaterContext.Provider value={contextValue}>
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ category: activeCategory }}
      >
        <div>{isValidChildren(children) ? children : null}</div>
      </AsChildSlot>
    </CategoryItemRepeaterContext.Provider>
  );
});

ActiveCategory.displayName = 'Blog.Categories.ActiveCategory';
