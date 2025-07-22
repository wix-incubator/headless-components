import { type Category } from "@wix/auto_sdk_categories_categories";
import { useService } from "@wix/services-manager-react";
import React, { type ReactNode } from "react";
import { CategoryServiceDefinition } from "../services/category-service.js";

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
