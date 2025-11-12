import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  FaqCategoriesServiceDefinition,
  FaqCategoriesService,
  type FaqCategoriesServiceConfig,
  type FaqCategory,
} from '../../services/index.js';

export interface RootProps {
  children: React.ReactNode;
  faqCategoriesServiceConfig: FaqCategoriesServiceConfig;
}

/**
 * Root component that provides the FAQ Categories service context to its children.
 * This component sets up the necessary services for rendering and managing FAQ categories data.
 *
 * @component
 * @example
 * ```tsx
 * import { FaqCategories } from '@wix/faq/components';
 *
 * function FaqCategoriesPage() {
 *   return (
 *     <FaqCategories.Root faqCategoriesServiceConfig={{ categories: myCategories }}>
 *       <FaqCategories.Categories>
 *         {({ hasCategories, categories }) => (
 *           <div>{hasCategories ? `${categories.length} categories` : 'No categories'}</div>
 *         )}
 *       </FaqCategories.Categories>
 *     </FaqCategories.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        FaqCategoriesServiceDefinition,
        FaqCategoriesService,
        props.faqCategoriesServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for FaqCategoriesList headless component
 */
export interface FaqCategoriesListProps {
  /** Render prop function that receives FAQ categories data */
  children: (props: FaqCategoriesListRenderProps) => React.ReactNode;
}

/**
 * Render props for FaqCategoriesList component
 */
export interface FaqCategoriesListRenderProps {
  /** Whether there are categories to display */
  hasCategories: boolean;
  /** Array of FAQ categories */
  categories: FaqCategory[];
}

/**
 * Headless component for FAQ categories list display
 *
 * @component
 * @example
 * ```tsx
 * import { FaqCategories } from '@wix/faq/components';
 *
 * function FaqCategoriesList() {
 *   return (
 *     <FaqCategories.Categories>
 *       {({ hasCategories, categories }) => (
 *         <div>
 *           {hasCategories ? (
 *             <ul>
 *               {categories.map(category => (
 *                 <li key={category._id}>{category.title}</li>
 *               ))}
 *             </ul>
 *           ) : (
 *             <p>No categories found</p>
 *           )}
 *         </div>
 *       )}
 *     </FaqCategories.Categories>
 *   );
 * }
 * ```
 */
export function Categories(props: FaqCategoriesListProps) {
  const service = useService(FaqCategoriesServiceDefinition) as ServiceAPI<
    typeof FaqCategoriesServiceDefinition
  >;

  const categories = service.categories.get();
  const hasCategories = categories.length > 0;

  return props.children({
    hasCategories,
    categories,
  });
}
