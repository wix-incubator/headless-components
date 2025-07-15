import { type Category } from "@wix/auto_sdk_categories_categories";
import { useService } from "@wix/services-manager-react";
import React, { type ReactNode } from "react";
import { CategoryServiceDefinition } from "../services/category-service.js";

/**
 * Props for the List headless component.
 */
export interface CategoryListProps {
  /** Function that receives category data and selection state. Use this function to render your custom category UI components with the provided category information. */
  children: (data: {
    /** Array of available product categories. Learn about [managing products and categories](https://support.wix.com/en/managing-products-and-categories). */
    categories: Category[];
    /** ID of the currently selected category, or null if no category is selected. */
    selectedCategory: string | null;
    /** Function to change the selected category. Pass null to show all products or a category ID to filter by that category. */
    setSelectedCategory: (categoryId: string | null) => void;
  }) => ReactNode;
}

/**
 * <blockquote class="caution">
 *
 * **Developer Preview**
 *
 * This API is subject to change. Bug fixes and new features will be released based on developer feedback throughout the preview period.
 *
 * </blockquote>
 *
 * Headless component for displaying and managing product categories.
 * Provides category selection functionality with real-time state management for filtering products by category.
 * Handles category data retrieval and maintains the current selection state.
 *
 * Headless components provide ready-to-use business logic and state management for common scenarios, while giving you complete control over the UI, so you can build custom experiences faster without maintaining the underlying logic yourself.
 *
 * > **Note:** This component is only relevant for [Wix Vibe](https://support.wix.com/en/article/wix-vibe-an-overview) and [Wix Headless](https://dev.wix.com/docs/go-headless/get-started/about-headless/about-wix-headless) developers.
 *
 * @example
 * import { List } from "@wix/stores/components";
 *
 * <List>
 *   {({ categories, selectedCategory, setSelectedCategory }) => (
 *     <div className="category-filter">
 *       <h3>Shop by Category</h3>
 *       <div className="category-list">
 *         <button
 *           className={selectedCategory === null ? 'active' : ''}
 *           onClick={() => setSelectedCategory(null)}
 *         >
 *           All Products
 *         </button>
 *         {categories.map(category => (
 *           <button
 *             key={category._id}
 *             className={selectedCategory === category._id ? 'active' : ''}
 *             onClick={() => setSelectedCategory(category._id)}
 *           >
 *             {category.name}
 *           </button>
 *         ))}
 *       </div>
 *     </div>
 *   )}
 * </List>
 *
 * @component
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
