import type { APIRoute } from 'astro';
import { loadCategoriesListServiceConfig } from '@wix/headless-stores/services';

export const GET: APIRoute = async ({ url, redirect }) => {
  // Redirect to the first category (typically "All Products") for consistent URL structure
  const categoriesConfig = await loadCategoriesListServiceConfig();
  const firstCategory = categoriesConfig.categories[0];

  if (!firstCategory) {
    throw new Error('No categories found');
  }

  // Use the real category slug from Wix API
  if (!firstCategory.slug) {
    throw new Error(`Category "${firstCategory.name}" has no slug`);
  }

  const categorySlug = firstCategory.slug;
  const redirectUrl = `/category/${categorySlug}${url.search}`;
  return redirect(redirectUrl);
};
