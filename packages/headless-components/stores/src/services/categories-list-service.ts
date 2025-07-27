import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import { categories } from "@wix/categories";

/**
 * Configuration interface for the Categories List service.
 * Contains the initial categories data that will be loaded into the service.
 *
 * @interface CategoriesListServiceConfig
 */
export type CategoriesListServiceConfig = {
  /** Array of category objects to initialize the service with */
  categories: categories.Category[];
};

/**
 * Service definition for the Categories List service.
 * This defines the reactive API contract for managing a list of product categories.
 *
 * @constant
 */
export const CategoriesListServiceDefinition = defineService<
  {
    /** Reactive signal containing the list of categories */
    categories: Signal<categories.Category[]>;
    /** Reactive signal indicating if categories are currently being loaded */
    isLoading: Signal<boolean>;
    /** Reactive signal containing any error message, or null if no error */
    error: Signal<string | null>;
  },
  CategoriesListServiceConfig
>("categories-list");

/**
 * Implementation of the Categories List service that manages reactive categories data.
 * This service provides signals for categories data, loading state, and error handling.
 * The service is initialized with pre-loaded categories and maintains them in reactive signals.
 *
 * @example
 * ```tsx
 * import { CategoriesListService, CategoriesListServiceDefinition } from '@wix/stores/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function CategoriesComponent({ categoriesConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [CategoriesListServiceDefinition, CategoriesListService.withConfig(categoriesConfig)]
 *     ])}>
 *       <CategoriesDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function CategoriesDisplay() {
 *   const categoriesService = useService(CategoriesListServiceDefinition);
 *   const categories = categoriesService.categories.get();
 *   const isLoading = categoriesService.isLoading.get();
 *   const error = categoriesService.error.get();
 *
 *   if (isLoading) return <div>Loading categories...</div>;
 *   if (error) return <div>Error: {error}</div>;
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
export const CategoriesListService =
  implementService.withConfig<CategoriesListServiceConfig>()(
    CategoriesListServiceDefinition,
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
 * Loads categories list service configuration from the Wix Categories API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * all visible product categories. The "all-products" category is automatically moved to the front of the list.
 *
 * @returns {Promise<CategoriesListServiceConfig>} Promise that resolves to the categories configuration
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/categories.astro
 * import { loadCategoriesListServiceConfig } from '@wix/stores/services';
 * import { CategoriesList } from '@wix/stores/components';
 *
 * // Load categories data during SSR
 * const categoriesConfig = await loadCategoriesListServiceConfig();
 * ---
 *
 * <CategoriesList.Root categoriesConfig={categoriesConfig}>
 *   <CategoriesList.ItemContent>
 *     {({ category }) => (
 *       <div>
 *         <h3>{category.name}</h3>
 *         <p>{category.description}</p>
 *       </div>
 *     )}
 *   </CategoriesList.ItemContent>
 * </CategoriesList.Root>
 * ```
 *
 * @example
 * ```tsx
 * // Next.js page example - pages/categories.tsx
 * import { GetServerSideProps } from 'next';
 * import { loadCategoriesListServiceConfig } from '@wix/stores/services';
 * import { CategoriesList } from '@wix/stores/components';
 *
 * interface CategoriesPageProps {
 *   categoriesConfig: Awaited<ReturnType<typeof loadCategoriesListServiceConfig>>;
 * }
 *
 * export const getServerSideProps: GetServerSideProps<CategoriesPageProps> = async () => {
 *   const categoriesConfig = await loadCategoriesListServiceConfig();
 *
 *   return {
 *     props: {
 *       categoriesConfig,
 *     },
 *   };
 * };
 *
 * export default function CategoriesPage({ categoriesConfig }: CategoriesPageProps) {
 *   return (
 *     <CategoriesList.Root categoriesConfig={categoriesConfig}>
 *       <CategoriesList.ItemContent>
 *         {({ category }) => (
 *           <div>
 *             <h3>{category.name}</h3>
 *             <p>{category.description}</p>
 *           </div>
 *         )}
 *       </CategoriesList.ItemContent>
 *     </CategoriesList.Root>
 *   );
 * }
 * ```
 */
export async function loadCategoriesListServiceConfig(): Promise<CategoriesListServiceConfig> {
  const categoriesResponse = await categories
    .queryCategories({
      treeReference: {
        appNamespace: "@wix/stores",
        treeKey: null,
      },
    })
    .eq("visible", true)
    .find();

  const fetchedCategories = categoriesResponse.items || [];

  // Sort categories to put "all-products" first, keep the rest in original order
  const allProductsCategory = fetchedCategories.find(
    (cat) => cat.slug === "all-products",
  );
  const otherCategories = fetchedCategories.filter(
    (cat) => cat.slug !== "all-products",
  );

  const allCategories = allProductsCategory
    ? [allProductsCategory, ...otherCategories]
    : fetchedCategories;

  return {
    categories: allCategories,
  };
}
