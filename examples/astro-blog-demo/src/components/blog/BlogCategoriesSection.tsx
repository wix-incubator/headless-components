import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Blog } from '@wix/headless-blog/react';
import {
  createCustomCategory,
  type BlogCategoriesServiceConfig,
} from '@wix/headless-blog/services';
import { useNavigation } from './NavigationContext';

interface BlogCategoriesSectionProps {
  className?: string;
  /** The pathname of the current page */
  pathname: string;
  /** The base url of the category page, commonly end with trailing slash, e.g. "/category/" */
  categoryPageBaseUrl: string;
  /** Loaded result of `loadBlogCategoriesServiceConfig` */
  blogCategoriesServiceConfig: BlogCategoriesServiceConfig;
  /** Custom categories to prepend to the real categories (e.g., "All posts"). Use `createCustomCategory` to create them from "@wix/headless-blog/services" */
  customCategoriesToPrepend?: ReturnType<typeof createCustomCategory>[];
}

/**
 * Displays a section with blog categories, featuring an active category with image background
 * and navigation buttons for all available categories.
 *
 * @example
 * ```tsx
 * <BlogCategoriesSection
 *   pathname="/category/tech"
 *   categoryPageBaseUrl="/category/"
 *   blogCategoriesServiceConfig={categoriesConfig}
 *   customCategoriesToPrepend={[createCustomCategory("All", "/blog")]}
 * />
 * ```
 */
export default function BlogCategoriesSection({
  className,
  pathname,
  categoryPageBaseUrl,
  blogCategoriesServiceConfig,
  customCategoriesToPrepend = [],
}: BlogCategoriesSectionProps) {
  const Navigation = useNavigation();

  return (
    <Blog.Categories.Root
      className={cn('mb-8', className)}
      blogCategoriesServiceConfig={blogCategoriesServiceConfig}
      customCategoriesToPrepend={customCategoriesToPrepend}
    >
      <Blog.Categories.CategoryItems>
        <Blog.Categories.ActiveCategory
          baseUrl={categoryPageBaseUrl}
          asChild
          currentPath={pathname}
        >
          <section className="bg-surface-card border-surface-primary data-[has-image=true]:[&>figure]:after:bg-background/70 relative grid min-h-[182px] place-items-center gap-6 overflow-hidden rounded-xl border p-9 text-center">
            <figure className="absolute inset-0 after:absolute after:inset-0 empty:hidden">
              <Blog.Category.Image className="h-full w-full object-cover" />
            </figure>
            <div className="isolate mx-auto flex max-w-4xl flex-col justify-center gap-3">
              <Blog.Category.Label className="text-foreground text-5xl tracking-tight" />
              <Blog.Category.Description className="text-foreground text-lg text-balance" />
            </div>
            <div className="isolate">
              <div className="flex flex-wrap justify-center gap-3">
                <Blog.Categories.CategoryItemRepeater>
                  <Blog.Category.Link baseUrl={categoryPageBaseUrl} asChild>
                    {({ href }) => {
                      const isActive = pathname === href;

                      return (
                        <Button
                          asChild
                          aria-current={isActive}
                          variant={isActive ? 'default' : 'outline'}
                        >
                          <Navigation route={href}>
                            <Blog.Category.Label />
                          </Navigation>
                        </Button>
                      );
                    }}
                  </Blog.Category.Link>
                </Blog.Categories.CategoryItemRepeater>
              </div>
            </div>
          </section>
        </Blog.Categories.ActiveCategory>
      </Blog.Categories.CategoryItems>
    </Blog.Categories.Root>
  );
}
