import { type Category } from "@wix/auto_sdk_categories_categories";
import { useService, WixServices } from "@wix/services-manager-react";
import React, { type ReactNode } from "react";
import {
  CategoryServiceDefinition,
  CategoryService,
  type CategoryServiceConfig,
} from "../services/category-service.js";
import { createServicesMap } from "@wix/services-manager";
import type { PropsWithChildren } from "react";

// Create navigation handler for category URLs
const handleCategoryChange = (categoryId: string | null, category: any) => {
  if (typeof window !== "undefined") {
    let newPath: string = "/category";

    if (categoryId !== null) {
      // Use category slug for URL
      if (!category?.slug) {
        console.warn(
          `Category ${categoryId} has no slug, using category ID as fallback`,
        );
      }
      const categorySlug = category?.slug || categoryId;
      newPath = `/category/${categorySlug}`;
    }

    window.history.pushState(
      null,
      "Showing Category " + category?.name,
      newPath,
    );
  }
};

/**
 * Root component that provides the Category service context to its children.
 * This component sets up the necessary services for managing category functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Category } from '@wix/stores/components';
 *
 * function CategoryNavigation({ categories }) {
 *   return (
 *     <Category.Root categoryServiceConfig={{ categories }}>
 *       <div>
 *         <Category.List>
 *           {({ categories, selectedCategory, setSelectedCategory }) => (
 *             <nav>
 *               <button
 *                 onClick={() => setSelectedCategory(null)}
 *                 className={selectedCategory === null ? 'active' : ''}
 *               >
 *                 All Categories
 *               </button>
 *               {categories.map(category => (
 *                 <button
 *                   key={category.id}
 *                   onClick={() => setSelectedCategory(category.id)}
 *                   className={selectedCategory === category.id ? 'active' : ''}
 *                 >
 *                   {category.name}
 *                 </button>
 *               ))}
 *             </nav>
 *           )}
 *         </Category.List>
 *       </div>
 *     </Category.Root>
 *   );
 * }
 * ```
 */
export function Root(
  props: PropsWithChildren<{
    categoryServiceConfig?: CategoryServiceConfig;
  }>,
) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        CategoryServiceDefinition,
        CategoryService,
        {
          ...(props.categoryServiceConfig ?? {
            categories: [],
            initialCategoryId: null,
          }),
          onCategoryChange: handleCategoryChange,
        }, // TODO - should we call loadCategoriesConfig ?
      )}
    >
      {props.children}
    </WixServices>
  );
}

// Grid component for displaying filtered products
export interface CategoryListProps {
  children: (data: {
    categories: Category[];
    selectedCategory: string | null;
    setSelectedCategory: (categoryId: string | null) => void;
  }) => ReactNode;
}

/**
 * Headless component for displaying a list of categories
 *
 * @component
 * @example
 * ```tsx
 * import { Category } from '@wix/stores/components';
 *
 * function CategoryNavigation() {
 *   return (
 *     <Category.List>
 *       {({ categories, selectedCategory, setSelectedCategory }) => (
 *         <nav>
 *           <button
 *             onClick={() => setSelectedCategory(null)}
 *             className={selectedCategory === null ? 'active' : ''}
 *           >
 *             All Categories
 *           </button>
 *           {categories.map(category => (
 *             <button
 *               key={category.id}
 *               onClick={() => setSelectedCategory(category.id)}
 *               className={selectedCategory === category.id ? 'active' : ''}
 *             >
 *               {category.name}
 *             </button>
 *           ))}
 *         </nav>
 *       )}
 *     </Category.List>
 *   );
 * }
 * ```
 */
export const List: React.FC<CategoryListProps> = ({ children }) => {
  const service = useService(CategoryServiceDefinition);

  const categories = service.categories.get();
  const selectedCategory = service.selectedCategory.get();

  return (
    <>
      {children({
        selectedCategory,
        categories,
        setSelectedCategory: service.setSelectedCategory,
      })}
    </>
  );
};
