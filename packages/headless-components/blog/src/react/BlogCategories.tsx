import React from 'react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import * as CoreBlogCategories from './core/BlogCategories.js';
import type {
  EnhancedCategory,
  BlogCategoriesServiceConfig,
} from '../services/blog-categories-service.js';
import { isValidChildren } from './helpers.js';

interface CategoriesContextValue {
  categories: EnhancedCategory[];
  hasCategories: boolean;
}

const CategoriesContext = React.createContext<CategoriesContextValue | null>(
  null,
);

export function useCategoriesContext(): CategoriesContextValue {
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
  blogCategoryLabel = 'blog-category-label',
  blogCategoryLink = 'blog-category-link',
  blogCategoryImageUrl = 'blog-category-image-url',
  blogCategoryDescription = 'blog-category-description',
  blogActiveCategory = 'blog-active-category',
}

export interface BlogCategoriesRootProps {
  asChild?: boolean;
  className?: string;
  children: AsChildChildren<{ hasCategories: boolean }> | React.ReactNode;
  blogCategoriesConfig?: BlogCategoriesServiceConfig;
  /** Custom categories to prepend to the real categories (e.g., "All posts"). @see {@link createCustomCategory} */
  customCategories?: EnhancedCategory[];
}

/**
 * Root container for blog categories that provides categories context to all child components.
 * Supports both real categories from the service and custom categories.
 * Follows Container Level pattern from architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * import { BlogCategories } from '@wix/headless-blog/react';
 *
 * function CategoryNavigation() {
 *   return (
 *     <BlogCategories.Root customCategories={[createCustomCategory('All', '/')]}>
 *       <BlogCategories.Categories emptyState={<div>No categories found</div>}>
 *         <BlogCategories.CategoryRepeater>
 *           <BlogCategories.CategoryLink baseUrl="/category/">
 *             <BlogCategories.CategoryLabel />
 *           </BlogCategories.CategoryLink>
 *         </BlogCategories.CategoryRepeater>
 *       </BlogCategories.Categories>
 *     </BlogCategories.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, BlogCategoriesRootProps>(
  (props, ref) => {
    const { asChild, children, className, customCategories = [] } = props;

    return (
      <CoreBlogCategories.Categories>
        {({ categories: realCategories, hasCategories: hasRealCategories }) => {
          const allCategories: EnhancedCategory[] = [
            ...customCategories,
            ...realCategories,
          ];

          const hasCategories = hasRealCategories;

          const contextValue: CategoriesContextValue = {
            categories: allCategories,
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
        }}
      </CoreBlogCategories.Categories>
    );
  },
);

export interface CategoriesProps {
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
 * <BlogCategories.Categories emptyState={<div>No categories found</div>}>
 *   <BlogCategories.CategoryRepeater>
 *     <BlogCategories.CategoryLabel />
 *   </BlogCategories.CategoryRepeater>
 * </BlogCategories.Categories>
 * ```
 */
export const Categories = React.forwardRef<HTMLElement, CategoriesProps>(
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

export interface CategoryRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders Category for each category.
 * Follows Repeater Level pattern from architecture rules.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <BlogCategories.CategoryRepeater>
 *   <BlogCategories.CategoryLink baseUrl="/category/">
 *     <BlogCategories.CategoryLabel />
 *   </BlogCategories.CategoryLink>
 * </BlogCategories.CategoryRepeater>
 * ```
 */
export const CategoryRepeater = React.forwardRef<
  HTMLElement,
  CategoryRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const { categories } = useCategoriesContext();

  return (
    <>
      {categories.map((category) => {
        const contextValue: CategoryContextValue = {
          category,
        };

        return (
          <CategoryContext.Provider key={category._id} value={contextValue}>
            {children}
          </CategoryContext.Provider>
        );
      })}
    </>
  );
});

interface CategoryContextValue {
  category: EnhancedCategory;
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

export interface CategoryLabelProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ label: string }> | React.ReactNode;
}

/**
 * Displays the category label with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <BlogCategories.CategoryLabel />
 *
 * // Custom styling
 * <BlogCategories.CategoryLabel className="text-lg font-bold" />
 *
 * // Custom rendering with asChild
 * <BlogCategories.CategoryLabel asChild>
 *   {({ label }) => <h2 className="category-title">{label}</h2>}
 * </BlogCategories.CategoryLabel>
 * ```
 */
export const CategoryLabel = React.forwardRef<HTMLElement, CategoryLabelProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { category } = useCategoryContext();

    if (!category?.label) return null;

    const label = category.label;
    const attributes = {
      'data-testid': TestIds.blogCategoryLabel,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ label }}
        content={label}
      >
        <span>{label}</span>
      </AsChildSlot>
    );
  },
);

export interface CategoryDescriptionProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ description: string }> | React.ReactNode;
}

/**
 * Displays the category description with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <BlogCategories.CategoryDescription />
 *
 * // Custom styling
 * <BlogCategories.CategoryDescription className="text-gray-600" />
 *
 * // Custom rendering with asChild
 * <BlogCategories.CategoryDescription asChild>
 *   {({ description }) => <div>{description}</div>}
 * </BlogCategories.CategoryDescription>
 * ```
 */
export const CategoryDescription = React.forwardRef<
  HTMLElement,
  CategoryDescriptionProps
>((props, ref) => {
  const { asChild, children, className } = props;
  const { category } = useCategoryContext();

  if (!category?.description) return null;

  const description = category.description;
  const attributes = {
    'data-testid': TestIds.blogCategoryDescription,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ description }}
      content={description}
    >
      <p>{description}</p>
    </AsChildSlot>
  );
});

export interface CategoryLinkProps {
  asChild?: boolean;
  className?: string;
  baseUrl?: string;
  children?: AsChildChildren<{ href: string }> | React.ReactNode;
}

/**
 * Creates a link to the category page with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default link
 * <BlogCategories.CategoryLink baseUrl="/category/" />
 *
 * // Custom styling
 * <BlogCategories.CategoryLink
 *   baseUrl="/blog/category/"
 *   className="text-blue-600 hover:underline"
 * />
 *
 * // Custom rendering with asChild
 * <BlogCategories.CategoryLink baseUrl="/category/" asChild>
 *   {({ href }) => (
 *     <Link to={href} className="custom-link">
 *       <BlogCategories.CategoryLabel />
 *     </Link>
 *   )}
 * </BlogCategories.CategoryLink>
 * ```
 */
export const CategoryLink = React.forwardRef<HTMLElement, CategoryLinkProps>(
  (props, ref) => {
    const { asChild, children, className, baseUrl = '' } = props;
    const { category } = useCategoryContext();

    const href = category.isCustom
      ? category.slug
      : `${baseUrl}${category.slug}`;
    const attributes = {
      'data-testid': TestIds.blogCategoryLink,
      'data-href': href,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ href }}
        content={href}
      >
        <a href={href}>{category.label}</a>
      </AsChildSlot>
    );
  },
);

export interface CategoryImageProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ imageUrl: string }> | React.ReactNode;
}

/**
 * Displays the category image with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default image
 * <BlogCategories.CategoryImage />
 *
 * // Custom styling
 * <BlogCategories.CategoryImage className="w-full h-48 object-cover rounded-lg" />
 *
 * // Custom rendering with asChild
 * <BlogCategories.CategoryImage asChild>
 *   {({ imageUrl }) => (
 *     <div className="relative">
 *       <img src={imageUrl} alt="Category" className="w-full h-32" />
 *       <div className="absolute inset-0 bg-black/30" />
 *     </div>
 *   )}
 * </BlogCategories.CategoryImage>
 * ```
 */
export const CategoryImage = React.forwardRef<HTMLElement, CategoryImageProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { category } = useCategoryContext();

    if (!category?.imageUrl) return null;

    const imageUrl = category.imageUrl;
    const attributes = {
      'data-testid': TestIds.blogCategoryImageUrl,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ imageUrl }}
        content={imageUrl}
      >
        <img src={imageUrl} alt={category.label} />
      </AsChildSlot>
    );
  },
);

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
 * <BlogCategories.ActiveCategory currentPath={location.pathname} baseUrl="/category/">
 *   {({ category }) => (
 *     <div className="hero-section">
 *       <BlogCategories.CategoryImage />
 *       <div className="overlay">
 *         <BlogCategories.CategoryLabel className="text-white text-3xl" />
 *         <BlogCategories.CategoryDescription className="text-white/90" />
 *       </div>
 *     </div>
 *   )}
 * </BlogCategories.ActiveCategory>
 * ```
 */
export const ActiveCategory = React.forwardRef<
  HTMLElement,
  ActiveCategoryProps
>((props, ref) => {
  const { asChild, className, currentPath, baseUrl = '', children } = props;
  const { categories } = useCategoriesContext();

  const activeCategory = categories.find(
    (category) =>
      currentPath ===
      (category.isCustom ? category.slug : `${baseUrl}${category.slug}`),
  );

  if (!activeCategory) return null;

  const contextValue: CategoryContextValue = {
    category: activeCategory,
  };

  const attributes = {
    'data-testid': TestIds.blogActiveCategory,
  };

  return (
    <CategoryContext.Provider value={contextValue}>
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
    </CategoryContext.Provider>
  );
});

/**
 * Helper function to create custom categories (e.g., "All posts").
 * Custom categories are typically used for navigation purposes and don't correspond to actual blog categories.
 *
 * @param label - Display name for the category
 * @param slug - URL slug for the category (can be a full path like "/" for home)
 * @param options - Optional category properties (description, imageUrl)
 * @returns Enhanced category object that can be used with BlogCategories.Root
 *
 * @example
 * ```tsx
 * import { BlogCategories, createCustomCategory } from '@wix/headless-blog/react';
 *
 * const customCategories = [
 *   createCustomCategory('All Posts', '/', {
 *     description: 'View all blog posts across all categories'
 *   })
 * ];
 *
 * <BlogCategories.Root customCategories={customCategories}>
 *   <BlogCategories.Categories>
 *     <BlogCategories.CategoryRepeater>
 *       <BlogCategories.CategoryLink baseUrl="/category/" />
 *     </BlogCategories.CategoryRepeater>
 *   </BlogCategories.Categories>
 * </BlogCategories.Root>
 * ```
 */
export function createCustomCategory(
  label: string,
  slug: string,
  options: Partial<Pick<EnhancedCategory, 'description' | 'imageUrl'>> = {},
): EnhancedCategory {
  return {
    _id: `custom-${slug}`,
    label,
    slug,
    isCustom: true,
    imageUrl: null,
    ...options,
  };
}
