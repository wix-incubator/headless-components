import React from 'react';
import { useService } from '@wix/services-manager-react';
import { categories } from '@wix/online-programs';

import {
  CategoryListServiceConfig,
  CategoryListServiceDefinition,
} from '../services/category-list-service.js';
import * as CoreCategoryList from './core/CategoryList.js';
import { Category } from './Category.js';

enum TestIds {
  categoryListItems = 'program-category-list-items',
  categoryListItem = 'program-category-list-item',
}

/**
 * Props for the CategoryList.Root component
 */
interface CategoryListRootProps {
  children: React.ReactNode;
  categoryListConfig?: CategoryListServiceConfig;
}

/**
 * Root component that provides the CategoryList service for rendering category lists.
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
 *   return (
 *     <CategoryList.Root categoryListConfig={{ categories }}>
 *       <CategoryList.Categories>
 *         <CategoryList.CategoryRepeater>
 *           <Category.Label />
 *           <Category.Id />
 *         </CategoryList.CategoryRepeater>
 *       </CategoryList.Categories>
 *     </CategoryList.Root>
 *   );
 * }
 * ```
 */
function Root(props: CategoryListRootProps) {
  const { children, categoryListConfig } = props;

  const serviceConfig = categoryListConfig || {
    categories: [],
  };

  return (
    <CoreCategoryList.Root categoryListConfig={serviceConfig}>
      {children}
    </CoreCategoryList.Root>
  );
}

Root.displayName = 'CategoryList.Root';

/**
 * Props for CategoryList.Raw component
 */
interface RawProps {
  children: ((props: RawRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for CategoryList.Raw component
 */
interface RawRenderProps {
  categories: categories.Category[];
}

/**
 * Raw component that provides direct access to category list data.
 * Should only be used when you need custom access to list data.
 *
 * @component
 * @example
 * ```tsx
 * <CategoryList.Root categoryListConfig={{ categories }}>
 *  <CategoryList.Raw>
 *    {({ categories }) => (
 *      <div>
 *        {categories.map((category) => (
 *          <div key={category._id}>{category.label}</div>
 *        ))}
 *      </div>
 *    )}
 *  </CategoryList.Raw>
 * </CategoryList.Root>
 * ```
 */
const Raw = React.forwardRef<HTMLElement, RawProps>((props, _ref) => {
  const { children } = props;

  const categoryListService = useService(CategoryListServiceDefinition);

  const categories = categoryListService.categories.get();

  return typeof children === 'function' ? children({ categories }) : children;
});

Raw.displayName = 'CategoryList.Raw';

interface CategoriesProps {
  children: React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
}

/**
 * Container for the category list with empty state support.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <CategoryList.Categories emptyState={<div>No categories found</div>}>
 *   <CategoryList.CategoryRepeater>
 *     <Category.Label />
 *     <Category.Id />
 *   </CategoryList.CategoryRepeater>
 * </CategoryList.Categories>
 * ```
 */
const Categories = React.forwardRef<HTMLElement, CategoriesProps>(
  (props, ref) => {
    const { children, className, emptyState } = props;

    const categoryListService = useService(CategoryListServiceDefinition);

    const categories = categoryListService.categories.get();
    const hasCategories = categories.length > 0;

    if (!hasCategories) {
      return emptyState || null;
    }

    const attributes = {
      'data-testid': TestIds.categoryListItems,
    };

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={className}
        {...attributes}
      >
        {children as React.ReactNode}
      </div>
    );
  },
);

Categories.displayName = 'CategoryList.Categories';

/**
 * Props for CategoryList.CategoryRepeater component
 */
interface CategoryRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders Category.Root for each category.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <CategoryList.CategoryRepeater>
 *   <Category.Label />
 *   <Category.Id />
 * </CategoryList.CategoryRepeater>
 * ```
 */
const CategoryRepeater = React.forwardRef<HTMLElement, CategoryRepeaterProps>(
  (props, _ref) => {
    const { children } = props;

    const categoryListService = useService(CategoryListServiceDefinition);

    const categories = categoryListService.categories.get();

    return (
      <>
        {categories.map((category: categories.Category) => (
          <Category.Root
            key={category._id}
            category={category}
            // ? How this data-testid should be passed?
            data-testid={TestIds.categoryListItem}
          >
            {children}
          </Category.Root>
        ))}
      </>
    );
  },
);

CategoryRepeater.displayName = 'CategoryList.CategoryRepeater';

/**
 * Compound component for CategoryList with all sub-components
 */
export const CategoryList = {
  Root,
  Raw,
  Categories,
  CategoryRepeater,
} as const;
