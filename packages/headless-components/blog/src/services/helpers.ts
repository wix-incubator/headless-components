import type { EnhancedCategory } from './blog-categories-service.js';

/**
 * Helper function to create custom categories (e.g., "All posts").
 * Custom categories are typically used for navigation purposes and don't correspond to actual blog categories.
 *
 * @param label - Display name for the category
 * @param slug - URL slug for the category (can be a full path like "/" for home)
 * @param customCategory - Optional category properties (description, imageUrl)
 * @returns Enhanced category object that can be used with Blog.Categories.Root
 *
 * @example
 * ```tsx
 * import { Blog, createCustomCategory } from '@wix/headless-blog/react';
 *
 * const customCategories = [
 *   createCustomCategory('All Posts', '/', {
 *     description: 'View all blog posts across all categories'
 *   })
 * ];
 *
 * <Blog.Categories.Root customCategories={customCategories}>
 *   <Blog.Categories.CategoryItems>
 *     <Blog.Categories.CategoryItemRepeater>
 *       <Blog.Categories.Link baseUrl="/category/" />
 *     </Blog.Categories.CategoryItemRepeater>
 *   </Blog.Categories.CategoryItems>
 * </Blog.Categories.Root>
 * ```
 */
export function createCustomCategory(
  customCategory: Partial<
    Pick<EnhancedCategory, 'label' | 'slug' | 'description' | 'imageUrl'>
  > = {},
): EnhancedCategory {
  return {
    _id: `custom-${customCategory.slug}`,
    label: customCategory.label,
    slug: customCategory.slug,
    imageUrl: customCategory.imageUrl ?? null,
    description: customCategory.description ?? null,
    isCustom: true,
  };
}
