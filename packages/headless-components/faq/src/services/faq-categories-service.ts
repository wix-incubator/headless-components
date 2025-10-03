import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { category } from '@wix/faq';

// Enhanced FAQ category interface based on the actual API structure
export interface FaqCategory {
  _id?: string | null;
  title?: string | null;
  description?: string | null;
  sortOrder?: number | null;
  visible?: boolean;
}

/**
 * Configuration interface for the FAQ Categories service.
 * Contains the initial FAQ categories data that will be loaded into the service.
 *
 * @interface FaqCategoriesServiceConfig
 */
export type FaqCategoriesServiceConfig = {
  /** Array of FAQ category objects to initialize the service with */
  categories: FaqCategory[];
};

/**
 * Service definition for the FAQ Categories service.
 * This defines the reactive API contract for managing a list of FAQ categories.
 *
 * @constant
 */
export const FaqCategoriesServiceDefinition = defineService<
  {
    /** Reactive signal containing the list of FAQ categories */
    categories: Signal<FaqCategory[]>;
    /** Reactive signal indicating if categories are currently being loaded */
    isLoading: Signal<boolean>;
    /** Reactive signal containing any error message, or null if no error */
    error: Signal<string | null>;
    /** Reactive signal indicating if there are categories to display */
    hasCategories: Signal<boolean>;
  },
  FaqCategoriesServiceConfig
>('faq-categories');

/**
 * Implementation of the FAQ Categories service that manages reactive FAQ categories data.
 * This service provides signals for categories data, loading state, and error handling.
 * The service is initialized with pre-loaded categories and maintains them in reactive signals.
 *
 * @example
 * ```tsx
 * import { FaqCategoriesService, FaqCategoriesServiceDefinition } from '@wix/faq/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function FaqCategoriesComponent({ categoriesConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [FaqCategoriesServiceDefinition, FaqCategoriesService.withConfig(categoriesConfig)]
 *     ])}>
 *       <FaqCategoriesDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function FaqCategoriesDisplay() {
 *   const categoriesService = useService(FaqCategoriesServiceDefinition);
 *   const categories = categoriesService.categories.get();
 *   const isLoading = categoriesService.isLoading.get();
 *   const error = categoriesService.error.get();
 *   const hasCategories = categoriesService.hasCategories.get();
 *
 *   if (isLoading) return <div>Loading FAQ categories...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *   if (!hasCategories) return <div>No FAQ categories found.</div>;
 *
 *   return (
 *     <ul>
 *       {categories.map(category => (
 *         <li key={category._id}>{category.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const FaqCategoriesService =
  implementService.withConfig<FaqCategoriesServiceConfig>()(
    FaqCategoriesServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const categoriesSignal = signalsService.signal<FaqCategory[]>(
        config.categories,
      );
      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);
      const hasCategoriesSignal = signalsService.signal<boolean>(
        config.categories.length > 0,
      );

      return {
        categories: categoriesSignal,
        isLoading: isLoadingSignal,
        error: errorSignal,
        hasCategories: hasCategoriesSignal,
      };
    },
  );

/**
 * Loads FAQ categories service configuration from the Wix FAQ API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * all visible FAQ categories.
 *
 * @returns {Promise<FaqCategoriesServiceConfig>} Promise that resolves to the FAQ categories configuration
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/faq.astro
 * import { loadFaqCategoriesServiceConfig } from '@wix/faq/services';
 * import { FaqCategories } from '@wix/faq/react';
 *
 * // Load FAQ categories data during SSR
 * const faqCategoriesConfig = await loadFaqCategoriesServiceConfig();
 * ---
 *
 * <FaqCategories.Root faqCategoriesConfig={faqCategoriesConfig}>
 *   <FaqCategories.Categories>
 *     <FaqCategories.CategoryRepeater>
 *       <FaqCategory.Name />
 *       <FaqCategory.Faqs>
 *         <FaqCategory.FaqRepeater>
 *           <Faq.Name />
 *           <Faq.Answer />
 *         </FaqCategory.FaqRepeater>
 *       </FaqCategory.Faqs>
 *     </FaqCategories.CategoryRepeater>
 *   </FaqCategories.Categories>
 * </FaqCategories.Root>
 * ```
 */
export async function loadFaqCategoriesServiceConfig(): Promise<FaqCategoriesServiceConfig> {
  try {
    // Use query-based approach like the reference
    let categoryQuery = category.queryCategories();
    const categoryResult = await categoryQuery.find();
    const categoriesRaw = categoryResult.items || [];

    // Transform and sort categories by sort order
    const transformedCategories: FaqCategory[] = categoriesRaw
      .map((cat: any) => ({
        _id: cat._id,
        title: cat.title,
        description: cat.description,
        sortOrder: cat.sortOrder,
        visible: cat.visible !== false, // Default to true if not specified
      }))
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return {
      categories: transformedCategories,
    };
  } catch (error) {
    console.warn('Failed to load FAQ categories:', error);
    // Return empty categories in case of error - graceful fallback
    return {
      categories: [],
    };
  }
}
