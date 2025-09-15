import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { categories } from '@wix/online-programs';

/**
 * Configuration interface for the Category List service.
 * Contains the initial categories data that will be loaded into the service.
 *
 * @interface CategoryListServiceConfig
 */
export type CategoryListServiceConfig = {
  /** Array of category objects to initialize the service with */
  categories: categories.Category[];
};

/**
 * Service definition for the Category List service.
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

// TODO: Add example
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

// TODO: Add example
export async function loadCategoryListServiceConfig(): Promise<CategoryListServiceConfig> {
  // TODO: Improve data fetching approach
  const categoriesResponse = await categories.listCategories();

  const fetchedCategories = categoriesResponse.categories || [];

  return {
    categories: fetchedCategories,
  };
}
