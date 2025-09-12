import { EmptyState } from '@/components/ui/blog/EmptyState';
import { Button } from '@/components/ui/button';
import { Blog } from '@wix/headless-blog/react';
import { type BlogFeedServiceConfig } from '@wix/headless-blog/services';
import { Loader2Icon } from 'lucide-react';
import { BlogFeedCardEditorial, BlogFeedCardSideBySide } from './BlogFeedCard';

interface FeedPageProps {
  /** Loaded result of `loadBlogFeedServiceConfig` */
  blogFeedServiceConfig: BlogFeedServiceConfig;
  /** The base url of the post page, commonly end with trailing slash, e.g. "/post/" */
  postPageBaseUrl: string;
  /** The base url of the category page, commonly end with trailing slash, e.g. "/category/" */
  categoryPageBaseUrl?: string;
  /** The date locale to use for the dates */
  dateLocale: string;
}

/**
 * A complete blog feed page component that displays blog posts in a grid layout.
 * Features sorting controls, different card layouts for the first post vs others,
 * empty state handling, and load more functionality.
 *
 * @example
 * ```tsx
 * <FeedPage
 *   blogFeedServiceConfig={feedConfig}
 *   postPageBaseUrl="/post/"
 *   categoryPageBaseUrl="/category/"
 *   dateLocale="en-US"
 * />
 * ```
 */
export default function FeedPage({
  blogFeedServiceConfig,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
}: FeedPageProps) {
  return (
    <Blog.Feed.Root blogFeedServiceConfig={blogFeedServiceConfig}>
      <Blog.Feed.Sort className="text-foreground mb-4" />
      <Blog.Feed.PostItems
        className="grid gap-x-8 gap-y-12 lg:grid-cols-2 xl:grid-cols-3"
        emptyState={
          <EmptyState
            title="No Posts Found"
            subtitle="There are no blog posts available at the moment. Check back later for new content!"
          />
        }
      >
        <Blog.Feed.PostItemRepeater offset={0} limit={1}>
          <BlogFeedCardSideBySide
            className="col-span-full"
            dateLocale={dateLocale}
            postPageBaseUrl={postPageBaseUrl}
            categoryPageBaseUrl={categoryPageBaseUrl}
            readMoreText="Read more"
          />
        </Blog.Feed.PostItemRepeater>
        <Blog.Feed.PostItemRepeater offset={1}>
          <BlogFeedCardEditorial
            dateLocale={dateLocale}
            postPageBaseUrl={postPageBaseUrl}
            categoryPageBaseUrl={categoryPageBaseUrl}
            readMoreText="Read more"
          />
        </Blog.Feed.PostItemRepeater>

        {/* Load More Button */}
        <div className="col-span-full mt-12 text-center">
          <Blog.Feed.LoadMore
            asChild
            loadingState={
              <>
                <Loader2Icon className="animate-spin" />
                Loading...
              </>
            }
          >
            <Button variant="outline">Load More Posts</Button>
          </Blog.Feed.LoadMore>
        </div>
      </Blog.Feed.PostItems>
    </Blog.Feed.Root>
  );
}
