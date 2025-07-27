import { createServicesMap } from "@wix/services-manager";
import { useService, WixServices } from "@wix/services-manager-react";
import type { PropsWithChildren, ReactNode } from "react";
import {
  CategoryService,
  CategoryServiceDefinition,
  type CategoryServiceConfig,
} from "../services/category-service.js";

/**
 * Root component that provides the Category service context to its children.
 * This component sets up the necessary services for managing category state.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Category } from '@wix/stores/components';
 *
 * function CategoryPage() {
 *   return (
 *     <Category.Root categoryServiceConfig={{ category: myCategory }}>
 *       <Category.Name>
 *         {({ name }) => <h1>{name}</h1>}
 *       </Category.Name>
 *       <Category.Slug>
 *         {({ slug }) => <p>Slug: {slug}</p>}
 *       </Category.Slug>
 *     </Category.Root>
 *   );
 * }
 * ```
 */
export function Root(
  props: PropsWithChildren<{ categoryServiceConfig: CategoryServiceConfig }>,
) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        CategoryServiceDefinition,
        CategoryService,
        props.categoryServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for Name headless component
 */
export interface NameProps {
  /** Content to display (can be a render function receiving name data or ReactNode) */
  children: ((props: NameRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for Name component
 */
export interface NameRenderProps {
  /** Category name */
  name: string;
}

/**
 * Headless component for category name display
 *
 * @component
 * @example
 * ```tsx
 * import { Category } from '@wix/stores/components';
 *
 * function CategoryHeader() {
 *   return (
 *     <Category.Name>
 *       {({ name }) => (
 *         <h1 className="category-title">{name}</h1>
 *       )}
 *     </Category.Name>
 *   );
 * }
 * ```
 */
export function Name(props: NameProps) {
  const categoryService = useService(CategoryServiceDefinition);

  return typeof props.children === "function"
    ? props.children({ name: categoryService.category.get().name! })
    : props.children;
}

/**
 * Props for Slug headless component
 */
export interface SlugProps {
  /** Content to display (can be a render function receiving slug data or ReactNode) */
  children: ((props: SlugRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for Slug component
 */
export interface SlugRenderProps {
  /** Category slug */
  slug: string;
}

/**
 * Headless component for category slug display
 *
 * @component
 * @example
 * ```tsx
 * import { Category } from '@wix/stores/components';
 *
 * function CategoryInfo() {
 *   return (
 *     <Category.Slug>
 *       {({ slug }) => (
 *         <p className="category-slug">Category slug: {slug}</p>
 *       )}
 *     </Category.Slug>
 *   );
 * }
 * ```
 */
export function Slug(props: SlugProps) {
  const categoryService = useService(CategoryServiceDefinition);

  return typeof props.children === "function"
    ? props.children({ slug: categoryService.category.get().slug! })
    : props.children;
}
