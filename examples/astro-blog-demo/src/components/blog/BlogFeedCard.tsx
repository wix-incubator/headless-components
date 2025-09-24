import { PostCategories } from "@/components/ui/blog/PostCategories";
import { PostExcerpt } from "@/components/ui/blog/PostExcerpt";
import { PostTitle } from "@/components/ui/blog/PostTitle";
import { SeparatedItems } from "@/components/ui/blog/SeparatedItems";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Blog } from "@wix/blog/components";
import { useNavigation } from "./NavigationContext";

interface BlogFeedCardProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  postPageBaseUrl: string;
  /** Categories will link to category pages if provided, otherwise they will be displayed as labels. */
  categoryPageBaseUrl?: string;
  dateLocale: string;
  readMoreText?: string;
}

/**
 * A side-by-side blog feed card layout with the cover image on the left and content on the right.
 * Displays post categories, title, excerpt, publish date, reading time, and optional read more button.
 *
 * @example
 * ```tsx
 * <BlogFeedCardSideBySide
 *   postPageBaseUrl="/post/"
 *   categoryPageBaseUrl="/category/"
 *   dateLocale="en-US"
 *   readMoreText="Read more"
 * />
 * ```
 */
export function BlogFeedCardSideBySide({
  className,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
  readMoreText,
  ...attributes
}: BlogFeedCardProps) {
  const Navigation = useNavigation();

  return (
    <article
      {...attributes}
      className={cn(
        "group grid auto-cols-fr overflow-hidden rounded-xl bg-foreground/5 lg:grid-flow-col",
        className
      )}
    >
      <Blog.Post.CoverImage className="mb-6 aspect-video h-full w-full object-cover" />
      <div className="flex grow flex-col p-8">
        <PostCategories className="mb-4" baseUrl={categoryPageBaseUrl} />

        <Blog.Post.Link
          baseUrl={postPageBaseUrl}
          className="-mt-1 mb-3 block"
          asChild
        >
          {({ href }) => (
            <Navigation route={href}>
              <PostTitle variant="lg" />
            </Navigation>
          )}
        </Blog.Post.Link>

        <PostExcerpt className="mb-4" />

        <SeparatedItems className="font-paragraph text-sm text-foreground/80">
          <Blog.Post.PublishDate locale={dateLocale} />

          <Blog.Post.ReadingTime asChild>
            {({ readingTime }) => <span>{readingTime} min read</span>}
          </Blog.Post.ReadingTime>
        </SeparatedItems>

        <div className="mb-0 mt-auto"></div>

        {readMoreText && (
          <Button className="mt-4 w-fit" asChild>
            <Blog.Post.Link baseUrl={postPageBaseUrl} asChild>
              {({ href }) => (
                <Navigation route={href}>
                  {readMoreText}
                  <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
                </Navigation>
              )}
            </Blog.Post.Link>
          </Button>
        )}
      </div>
    </article>
  );
}

/**
 * An editorial-style blog feed card layout with a vertical stack layout.
 * Displays post categories, title, excerpt, publish date, reading time, and optional read more button.
 *
 * @example
 * ```tsx
 * <BlogFeedCardEditorial
 *   postPageBaseUrl="/post/"
 *   categoryPageBaseUrl="/category/"
 *   dateLocale="en-US"
 *   readMoreText="Read more"
 * />
 * ```
 */
export function BlogFeedCardEditorial({
  className,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
  readMoreText,
  ...attributes
}: BlogFeedCardProps) {
  const Navigation = useNavigation();

  return (
    <article className={cn("group flex flex-col", className)} {...attributes}>
      <Blog.Post.CoverImage className="mb-6 aspect-[250/200] w-full rounded-xl object-cover" />
      <PostCategories className="mb-4" baseUrl={categoryPageBaseUrl} />

      <Blog.Post.Link
        baseUrl={postPageBaseUrl}
        className="-mt-1 mb-3 block"
        asChild
      >
        {({ href }) => (
          <Navigation route={href}>
            <PostTitle variant="lg" />
          </Navigation>
        )}
      </Blog.Post.Link>

      <PostExcerpt className="mb-4" />

      <div className="mb-0 mt-auto"></div>

      <SeparatedItems className="font-paragraph text-sm text-foreground/80">
        <Blog.Post.PublishDate locale={dateLocale} />

        <Blog.Post.ReadingTime asChild>
          {({ readingTime }) => <span>{readingTime} min read</span>}
        </Blog.Post.ReadingTime>
      </SeparatedItems>

      {readMoreText && (
        <Button className="mt-4 w-fit" asChild>
          <Blog.Post.Link baseUrl={postPageBaseUrl} asChild>
            {({ href }) => (
              <Navigation route={href}>
                {readMoreText}
                <ChevronRightIcon strokeWidth={2} className="h-4 w-4" />
              </Navigation>
            )}
          </Blog.Post.Link>
        </Button>
      )}
    </article>
  );
}
