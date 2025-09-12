import { Separator } from '@/components/ui/separator';
import { Blog } from '@wix/headless-blog/react';
import { type BlogFeedServiceConfig } from '@wix/headless-blog/services';
import { BlogFeedCardEditorial } from './BlogFeedCard';

interface RecentPostsSectionProps {
  /** Loaded result of `loadBlogFeedServiceConfig`, to be used for the recent posts section */
  recentPostsServiceConfig: BlogFeedServiceConfig;
  /** The base url of the post page, commonly end with trailing slash, e.g. "/post/" */
  postPageBaseUrl: string;
  /** The base url of the category page, commonly end with trailing slash, e.g. "/category/" */
  categoryPageBaseUrl: string;
  /** The date locale to use for the dates */
  dateLocale: string;
}

/**
 * A section component that displays recent blog posts in a grid layout.
 * Features a section title, separator, and editorial-style post cards.
 *
 * @example
 * ```tsx
 * <RecentPostsSection
 *   recentPostsServiceConfig={recentPostsConfig}
 *   postPageBaseUrl="/post/"
 *   categoryPageBaseUrl="/category/"
 *   dateLocale="en-US"
 * />
 * ```
 */
export default function RecentPostsSection({
  recentPostsServiceConfig,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
}: RecentPostsSectionProps) {
  return (
    <Blog.Feed.Root blogFeedServiceConfig={recentPostsServiceConfig}>
      <Blog.Feed.PostItems>
        <section className="mx-auto max-w-4xl space-y-6">
          <h2 className="text-foreground text-2xl leading-tight font-semibold">
            Recent posts
          </h2>

          <Separator />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Blog.Feed.PostItemRepeater>
              <BlogFeedCardEditorial
                postPageBaseUrl={postPageBaseUrl}
                categoryPageBaseUrl={categoryPageBaseUrl}
                dateLocale={dateLocale}
              />
            </Blog.Feed.PostItemRepeater>
          </div>
        </section>
      </Blog.Feed.PostItems>
    </Blog.Feed.Root>
  );
}
