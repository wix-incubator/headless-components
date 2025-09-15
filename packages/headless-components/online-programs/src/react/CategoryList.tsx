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

// TODO: Add example
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

// TODO: Add example
const Raw = React.forwardRef<HTMLElement, RawProps>((props, _ref) => {
  const { children } = props;

  const categoryListService = useService(CategoryListServiceDefinition);

  const categories = categoryListService.categories.get();

  return typeof children === 'function' ? children({ categories }) : children;
});

interface CategoriesProps {
  children: React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
}

// TODO: Add example
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

/**
 * Props for CategoryList.CategoryRepeater component
 */
interface CategoryRepeaterProps {
  children: React.ReactNode;
}

// TODO: Add example
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

/**
 * Compound component for CategoryList with all sub-components
 */
export const CategoryList = {
  Root,
  Raw,
  Categories,
  CategoryRepeater,
} as const;
