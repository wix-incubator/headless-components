import { categories } from '@wix/blog';
import { media } from '@wix/sdk';
import { defineService, implementService, type ServiceAPI } from '@wix/services-definitions';
import type { ReadOnlySignal } from '@wix/services-definitions/core-services/signals';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';

export interface EnhancedCategory extends Omit<categories.Category, 'coverImage'> {
  imageUrl: string | null;
  isCustom: boolean;
}

export const BlogCategoriesServiceDefinition = defineService<{
  categories: ReadOnlySignal<EnhancedCategory[]>;
}>('blogCategoriesService');

export type BlogCategoriesServiceAPI = ServiceAPI<typeof BlogCategoriesServiceDefinition>;

export type BlogCategoriesServiceConfig = {
  initialCategories?: EnhancedCategory[];
};

export const BlogCategoriesService = implementService.withConfig<BlogCategoriesServiceConfig>()(
  BlogCategoriesServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const categoriesSignal = signalsService.signal<EnhancedCategory[]>(
      config.initialCategories || [],
    );

    return {
      categories: categoriesSignal,
    };
  },
);

export async function loadBlogCategoriesServiceConfig(): Promise<BlogCategoriesServiceConfig> {
  try {
    const result = await categories
      .queryCategories()
      .gt('postCount', 0)
      .limit(100)
      .ascending('displayPosition')
      .find();

    return {
      initialCategories: enhanceCategories(result.items || []),
    };
  } catch (error) {
    console.error('Error loading blog categories service config', error);
    return {
      initialCategories: [],
    };
  }
}

export function enhanceCategories(categories: categories.Category[]): EnhancedCategory[] {
  return categories.map((category) => {
    const imageUrl = category.coverImage ? media.getImageUrl(category.coverImage).url : null;

    return {
      ...category,
      imageUrl,
      isCustom: false,
    };
  });
}
