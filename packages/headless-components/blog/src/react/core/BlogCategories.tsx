import { useService } from '@wix/services-manager-react';
import type {
  BlogCategoriesServiceAPI,
  BlogCategoriesServiceConfig,
} from '../../services/blog-categories-service.js';
import { BlogCategoriesServiceDefinition } from '../../services/blog-categories-service.js';
import React from 'react';

/**
 * Props for BlogCategories Root core component
 */
export interface RootProps {
  children: React.ReactNode;
  blogCategoriesConfig?: BlogCategoriesServiceConfig;
}

/**
 * Core BlogCategories Root component that provides BlogCategories service context.
 * This is the service-connected component that should be wrapped by the public API.
 *
 * @component
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { children } = props;

  return <div ref={ref as React.Ref<HTMLDivElement>}>{children}</div>;
});

/**
 * Props for BlogCategories Categories core component
 */
export interface CategoriesProps {
  children: (props: CategoriesRenderProps) => React.ReactNode;
}

export interface CategoriesRenderProps {
  categories: ReturnType<BlogCategoriesServiceAPI['categories']['get']>;
  hasCategories: boolean;
}

/**
 * Core Categories component that provides categories data access
 */
export const Categories = (props: CategoriesProps) => {
  const service = useService(BlogCategoriesServiceDefinition);
  const categories = service.categories.get();
  const hasCategories = categories && categories.length > 0;

  return props.children({
    categories,
    hasCategories,
  });
};
