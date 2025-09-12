import { useNavigation } from '@/components/NavigationContext';
import { PostCategories } from '@/components/ui/blog/PostCategories';
import { PostExcerpt } from '@/components/ui/blog/PostExcerpt';
import { PostTitle } from '@/components/ui/blog/PostTitle';
import { SeparatedItems } from '@/components/ui/blog/SeparatedItems';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { Blog } from '@wix/headless-blog/react';

interface BlogFeedCardProps {
  className?: string;
  postPageBaseUrl: string;
  /** Categories will link to category pages if provided, otherwise they will be displayed as labels. */
  categoryPageBaseUrl?: string;
  dateLocale: string;
  readMoreText?: string;
}

export function BlogFeedCardSideBySide({
  className,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
  readMoreText,
}: BlogFeedCardProps) {
  const Navigation = useNavigation();

  return (
    <article
      className={cn(
        'bg-surface-card grid auto-cols-fr grid-flow-col overflow-hidden rounded-xl',
        className,
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

        <SeparatedItems className="text-content-secondary text-sm">
          <Blog.Post.PublishDate locale={dateLocale} />

          <Blog.Post.ReadingTime asChild>
            {({ readingTime }) => <span>{readingTime} min read</span>}
          </Blog.Post.ReadingTime>
        </SeparatedItems>

        <div className="mt-auto mb-0"></div>

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

export function BlogFeedCardEditorial({
  className,
  postPageBaseUrl,
  categoryPageBaseUrl,
  dateLocale,
  readMoreText,
}: BlogFeedCardProps) {
  const Navigation = useNavigation();

  return (
    <article className={cn('flex flex-col', className)}>
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

      <div className="mt-auto mb-0"></div>

      <SeparatedItems className="text-content-secondary text-sm">
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
