import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Blog } from "@wix/blog/components";
import {
  createCustomCategory,
  type BlogCategoriesServiceConfig,
} from "@wix/blog/services";
import { useNavigation } from "./NavigationContext";

interface BlogCategoriesSectionProps {
  className?: string;
  /** The pathname of the current page */
  pathname: string;
  /** The base url of the category page, commonly end with trailing slash, e.g. "/category/" */
  categoryPageBaseUrl: string;
  /** Loaded result of `loadBlogCategoriesServiceConfig` */
  blogCategoriesServiceConfig: BlogCategoriesServiceConfig;
  /** Custom categories to prepend to the real categories (e.g., "All posts"). Use `createCustomCategory` to create them from "@wix/blog/services" */
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
      className={cn("mb-8", className)}
      blogCategoriesServiceConfig={blogCategoriesServiceConfig}
      customCategoriesToPrepend={customCategoriesToPrepend}
    >
      <Blog.Categories.CategoryItems>
        <Blog.Categories.ActiveCategory
          baseUrl={categoryPageBaseUrl}
          asChild
          pathname={pathname}
        >
          <section className="group relative grid min-h-[182px] place-items-center gap-6 overflow-hidden rounded-xl bg-foreground/5 p-9 text-center">
            <figure className="absolute inset-0 after:absolute after:inset-0 empty:hidden group-data-[has-image=true]:after:bg-background/80">
              <Blog.Category.Image className="h-full w-full object-cover" />
            </figure>
            <div className="isolate mx-auto flex max-w-4xl flex-col justify-center gap-3">
              <Blog.Category.Label className="font-heading text-5xl text-foreground" />
              <Blog.Category.Description className="text-balance font-paragraph text-lg text-foreground/80" />
            </div>
            <div className="isolate">
              <div className="flex flex-wrap justify-center gap-3">
                <Blog.Categories.CategoryItemRepeater>
                  <Blog.Category.Link
                    baseUrl={categoryPageBaseUrl}
                    pathname={pathname}
                    asChild
                  >
                    {({ href, isActive }) => {
                      return (
                        <Button
                          asChild
                          variant={isActive ? "default" : "outline"}
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
