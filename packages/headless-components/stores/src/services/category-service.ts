import { defineService, implementService } from '@wix/services-definitions';
import { categories } from '@wix/categories';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';

/**
 * Type representing a category from the Wix Categories API.
 * This type is used to define the structure of category objects in the service.
 *
 * @type Category
 */
export type Category = categories.Category;

export interface CategoryServiceAPI {
  /** Reactive signal containing the current category data */
  category: Signal<Category>;
  /** Reactive signal indicating if a category is currently selected */
  isSelected: Signal<boolean>;
}

/**
 * Service definition for the Category service.
 * This defines the reactive API contract for managing a single product category.
 *
 * @constant
 */
export const CategoryServiceDefinition =
  defineService<CategoryServiceAPI>('category');

/**
 * Configuration interface for the Category service.
 * Contains the initial category data that will be loaded into the service.
 *
 * @interface CategoryServiceConfig
 */
export type CategoryServiceConfig = {
  /** The category object to initialize the service with */
  category: Category;
  /** Whether the category is currently selected */
  isSelected?: boolean;
};

/**
 * Implementation of the Category service that manages reactive category data.
 * This service provides a signal for category data and maintains it in a reactive state.
 * The service is initialized with pre-loaded category data.
 *
 * @example
 * ```tsx
 * import { CategoryService, CategoryServiceDefinition } from '@wix/stores/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function CategoryComponent({ categoryConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [CategoryServiceDefinition, CategoryService.withConfig(categoryConfig)]
 *     ])}>
 *       <CategoryDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function CategoryDisplay() {
 *   const categoryService = useService(CategoryServiceDefinition);
 *   const category = categoryService.category.get();
 *
 *   return (
 *     <div>
 *       <h1>{category.name}</h1>
 *       <p>{category.description}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const CategoryService =
  implementService.withConfig<CategoryServiceConfig>()(
    CategoryServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const categorySignal = signalsService.signal(config.category);
      const isSelectedSignal = signalsService.signal(
        config.isSelected ?? false,
      );

      return {
        category: categorySignal,
        isSelected: isSelectedSignal,
      };
    },
  );

/**
 * Loads category service configuration from the Wix Categories API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * a specific category by slug that will be used to configure the CategoryService.
 *
 * @param {string} slug - The category slug to load
 * @returns {Promise} Promise that resolves to either success with config or not-found result
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/category/[slug].astro
 * import { loadCategoryServiceConfig } from '@wix/stores/services';
 * import { Category } from '@wix/stores/components';
 *
 * // Get category slug from URL params
 * const { slug } = Astro.params;
 *
 * // Load category data during SSR
 * const categoryResult = await loadCategoryServiceConfig(slug);
 *
 * // Handle not found case
 * if (categoryResult.type === 'not-found') {
 *   return Astro.redirect('/404');
 * }
 * ---
 *
 * <Category.Root categoryConfig={categoryResult.config}>
 *   <Category.Name>
 *     {({ name }) => <h1>{name}</h1>}
 *   </Category.Name>
 * </Category.Root>
 * ```
 *
 * @example
 * ```tsx
 * // Next.js page example - pages/category/[slug].tsx
 * import { GetServerSideProps } from 'next';
 * import { loadCategoryServiceConfig } from '@wix/stores/services';
 * import { Category } from '@wix/stores/components';
 *
 * interface CategoryPageProps {
 *   categoryConfig: Awaited<ReturnType<typeof loadCategoryServiceConfig>>['config'];
 * }
 *
 * export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async ({ params }) => {
 *   const slug = params?.slug as string;
 *
 *   // Load category data during SSR
 *   const categoryResult = await loadCategoryServiceConfig(slug);
 *
 *   // Handle not found case
 *   if (categoryResult.type === 'not-found') {
 *     return {
 *       notFound: true,
 *     };
 *   }
 *
 *   return {
 *     props: {
 *       categoryConfig: categoryResult.config,
 *     },
 *   };
 * };
 *
 * export default function CategoryPage({ categoryConfig }: CategoryPageProps) {
 *   return (
 *     <Category.Root categoryConfig={categoryConfig}>
 *       <Category.Name>
 *         {({ name }) => <h1>{name}</h1>}
 *       </Category.Name>
 *     </Category.Root>
 *   );
 * }
 * ```
 */
export async function loadCategoryServiceConfig(slug: string): Promise<
  | {
      /** Type "success" means that the category was found and the config is valid */
      type: 'success';
      /** The category config containing the loaded category data */
      config: CategoryServiceConfig;
    }
  | {
      /** Type "not-found" means that the category was not found */
      type: 'not-found';
    }
> {
  const category = await categories
    .queryCategories({
      treeReference: {
        appNamespace: '@wix/stores',
      },
    })
    .eq('slug', slug)
    .find();

  if (category.items.length === 0) {
    return {
      type: 'not-found',
    };
  }

  return {
    type: 'success',
    config: {
      category: category.items[0]!,
    },
  };
}
