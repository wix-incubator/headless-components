import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import * as categories from "@wix/auto_sdk_categories_categories";

export interface CategoryServiceAPI {
  selectedCategory: Signal<string | null>;
  categories: Signal<categories.Category[]>;
  setSelectedCategory: (categoryId: string | null) => void;
  loadCategories: () => Promise<void>;
}

export const CategoryServiceDefinition =
  defineService<CategoryServiceAPI>("category-service");

export interface CategoryServiceConfig {
  categories: categories.Category[];
  initialCategoryId?: string | null;
  onCategoryChange?: (
    categoryId: string | null,
    category: categories.Category | null,
  ) => void;
}

export const CategoryService =
  implementService.withConfig<CategoryServiceConfig>()(
    CategoryServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const selectedCategory: Signal<string | null> = signalsService.signal(
        (config?.initialCategoryId || null) as any,
      );
      const categories: Signal<categories.Category[]> = signalsService.signal(
        config?.categories as any,
      );

      const loadCategories = async () => {
        const { categories: loadedCategories } = await loadCategoriesConfig();
        categories.set(loadedCategories);
      };

      // Track if this is the initial load to prevent navigation on service creation
      let isInitialLoad = true;

      const setSelectedCategory = (categoryId: string | null) => {
        selectedCategory.set(categoryId);
      };

      // Subscribe to category changes and handle navigation as a side effect
      signalsService.effect(() => {
        const categoryId = selectedCategory.get();
        // Skip navigation on initial load (when service is first created)
        if (isInitialLoad) {
          isInitialLoad = false;
          return;
        }

        // If a navigation handler is provided, use it
        if (config?.onCategoryChange) {
          const category = categoryId
            ? config?.categories.find((cat) => cat._id === categoryId) || null
            : null;

          config.onCategoryChange(categoryId, category);
        }
      });

      return {
        selectedCategory,
        categories,
        setSelectedCategory,
        loadCategories,
      };
    },
  );

/**
 * Loads categories configuration from the Wix Categories API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * initial categories data that will be passed to the Category.Root component.
 * Fetches all visible categories and sorts them with "all-products" category first.
 *
 * @returns Promise that resolves to an object containing categories array
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/categories.astro
 * import { loadCategoriesConfig } from '@wix/stores/services';
 * import { Category } from '@wix/stores/components';
 *
 * // Load categories data during SSR
 * const categoryConfig = await loadCategoriesConfig();
 * ---
 *
 * <Category.Root categoryConfig={categoryConfig}>
 *   <Category.List>
 *     {({ categories, selectedCategory, setSelectedCategory }) => (
 *       <nav className="category-nav">
 *         <h2>Shop by Category</h2>
 *         {categories.map(category => (
 *           <button
 *             key={category.id}
 *             onClick={() => setSelectedCategory(category.id)}
 *             className={selectedCategory === category.id ? 'active' : ''}
 *           >
 *             {category.name}
 *           </button>
 *         ))}
 *       </nav>
 *     )}
 *   </Category.List>
 * </Category.Root>
 * ```
 *
 * @example
 * ```tsx
 * // Next.js page example - pages/categories.tsx
 * import { GetServerSideProps } from 'next';
 * import { loadCategoriesConfig } from '@wix/stores/services';
 * import { Category } from '@wix/stores/components';
 *
 * interface CategoryPageProps {
 *   categoryConfig: Awaited<ReturnType<typeof loadCategoriesConfig>>;
 * }
 *
 * export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async () => {
 *   // Load categories data during SSR
 *   const categoryConfig = await loadCategoriesConfig();
 *
 *   return {
 *     props: {
 *       categoryConfig,
 *     },
 *   };
 * };
 *
 * export default function CategoryPage({ categoryConfig }: CategoryPageProps) {
 *   return (
 *     <div>
 *       <h1>Product Categories</h1>
 *       <Category.Root categoryConfig={categoryConfig}>
 *         <Category.List>
 *           {({ categories, selectedCategory, setSelectedCategory }) => (
 *             <nav className="category-nav">
 *               {categories.map(category => (
 *                 <button
 *                   key={category.id}
 *                   onClick={() => setSelectedCategory(category.id)}
 *                   className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
 *                 >
 *                   {category.name}
 *                 </button>
 *               ))}
 *             </nav>
 *           )}
 *         </Category.List>
 *       </Category.Root>
 *     </div>
 *   );
 * }
 * ```
 */
export async function loadCategoriesConfig() {
  try {
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
  } catch (error) {
    console.warn("Failed to load categories:", error);
    return {
      categories: [],
    };
  }
}
