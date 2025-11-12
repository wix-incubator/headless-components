import type { EnhancedCategory } from '../../services/blog-categories-service.js';

const trimSlashes = (path: string) => path.replace(/^\/+|\/+$/g, '');

export function isActiveCategory(
  currentPathname: string | undefined,
  categoryPageBaseUrl: string,
  category: EnhancedCategory,
) {
  if (!currentPathname) return false;

  const isCustom = category.isCustom ?? false;
  const slug = category.slug ?? '';
  const currentPathWithTrimmedSlash = trimSlashes(currentPathname);
  const categoryPathWithTrimmedSlash = trimSlashes(
    isCustom ? slug : `${categoryPageBaseUrl}${slug}`,
  );

  return currentPathWithTrimmedSlash === categoryPathWithTrimmedSlash;
}
