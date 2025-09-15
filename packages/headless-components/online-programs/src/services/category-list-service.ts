import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { categories } from '@wix/online-programs';

/**
 * Configuration interface for the Program Category List service.
 * Contains the initial categories data that will be loaded into the service.
 *
 * @interface CategoryListServiceConfig
 */
export type CategoryListServiceConfig = {
  /** Array of category objects to initialize the service with */
  categories: categories.Category[];
};

/**
 * Service definition for the Program Category List service.
 * This defines the reactive API contract for managing a list of categories.
 *
 * @constant
 */
export const CategoryListServiceDefinition = defineService<
  {
    /** Reactive signal containing the list of categories */
    categories: Signal<categories.Category[]>;
    /** Reactive signal indicating if categories are currently being loaded */
    isLoading: Signal<boolean>;
    /** Reactive signal containing any error message, or null if no error */
    error: Signal<string | null>;
  },
  CategoryListServiceConfig
>('program-category-list');

/**
 * Implementation of the Program Category List service that manages reactive program categories data.
 * This service provides signals for categories data, loading state, and error handling.
 *
 * @example
 * ```tsx
 * import { CategoryListService, CategoryListServiceDefinition } from '@wix/online-programs/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function CategoriesComponent({ categoryListConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [CategoryListServiceDefinition, CategoryListService.withConfig(categoryListConfig)]
 *     ])}>
 *       <CategoriesDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function CategoriesDisplay() {
 *   const categoryListService = useService(CategoryListServiceDefinition);
 *
 *   const categories = categoryListService.categories.get();
 *   const isLoading = categoryListService.isLoading.get();
 *   const error = categoryListService.error.get();
 *
 *   if (isLoading) {
 *     return <div>Loading categories...</div>;
 *   }
 *
 *   if (error) {
 *     return <div>Error: {error}</div>;
 *   }
 *
 *   return (
 *     <div>
 *       {categories.map(category => (
 *         <div key={category._id}>
 *           <span>{category.id}</span>
 *           <span>{category.label}</span>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const CategoryListService =
  implementService.withConfig<CategoryListServiceConfig>()(
    CategoryListServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const categoriesSignal = signalsService.signal<categories.Category[]>(
        config.categories,
      );
      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      return {
        categories: categoriesSignal,
        isLoading: isLoadingSignal,
        error: errorSignal,
      };
    },
  );

/**
 * Loads category list service configuration from the Wix Programs API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * all visible categories.
 *
 * @returns {Promise<CategoryListServiceConfig>} Promise that resolves to the category list configuration
 *
 * @example
 * ```astro
 * ---
 * import { loadProgramListServiceConfig } from '@wix/stores/services';
 * import { CategoryList } from '@wix/stores/components/react';
 *
 * // Load categories data during SSR
 * const categoryListConfig = await loadCategoryListServiceConfig();
 * ---
 *
 * <CategoryList.Root categoryListConfig={categoryListConfig}>
 *   <CategoryList.Categories>
 *     <CategoryList.CategoryRepeater>
 *       <Category.Id />
 *       <Category.Label />
 *     </CategoryList.CategoryRepeater>
 *   </CategoryList.Categories>
 * </CategoryList.Root>
 * ```
 */
export async function loadCategoryListServiceConfig(): Promise<CategoryListServiceConfig> {
  try {
    // TODO: Improve data fetching approach
    const categoriesResponse = await categories.listCategories();

    const fetchedCategories = categoriesResponse.categories || [];

    return {
      categories: fetchedCategories,
    };
  } catch (error) {
    console.error('Failed to load category list:', error);

    return {
      categories: [],
    };
  }
}
