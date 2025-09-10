import { useNavigation } from '@/components/NavigationContext';
import { Chip } from '@/components/ui/blog/Chip';
import { EmptyState } from '@/components/ui/blog/EmptyState';
import { PostAuthorAvatar } from '@/components/ui/blog/PostAuthorAvatar';
import { PostCategories } from '@/components/ui/blog/PostCategories';
import { PostContent } from '@/components/ui/blog/PostContent';
import { PostTitle } from '@/components/ui/blog/PostTitle';
import { SeparatedItems } from '@/components/ui/blog/SeparatedItems';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { Blog } from '@wix/headless-blog/react';
import { type BlogPostServiceConfig } from '@wix/headless-blog/services';
import { SharePostActions } from './SharePostActions';

interface PostPageProps {
  /** Loaded result of `loadBlogPostServiceConfig` */
  blogPostServiceConfig: BlogPostServiceConfig;
  /** Full href of the post page, used for social sharing */
  href: string;
  /** The href of the feed page, used for the "Back to Blog" link */
  feedPageHref: string;
  /** The base url of the category page, commonly end with trailing slash, e.g. "/category/" */
  categoryPageBaseUrl: string;
  /** The date locale to use for the dates */
  dateLocale: string;
}

export default function PostPage({
  blogPostServiceConfig,
  href,
  feedPageHref,
  categoryPageBaseUrl,
  dateLocale,
}: PostPageProps) {
  const Navigation = useNavigation();

  return (
    <Blog.Post.Root
      blogPostServiceConfig={blogPostServiceConfig}
      emptyState={<EmptyState title="Post not found" />}
    >
      <article className="space-y-4">
        <header className="mb-8 space-y-6">
          <Button asChild variant="outline">
            <Navigation route={feedPageHref}>
              <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
              Back to Blog
            </Navigation>
          </Button>

          <PostCategories className="mb-4" baseUrl={categoryPageBaseUrl} />

          <PostTitle variant="xl" />

          <SeparatedItems className="text-content-secondary text-sm">
            <div className="flex items-center gap-2">
              <PostAuthorAvatar avatarSize="md" />
              <Blog.Post.AuthorName />
            </div>

            <Blog.Post.PublishDate locale={dateLocale} />

            <Blog.Post.ReadingTime asChild>
              {({ readingTime }) => <span>{readingTime} min read</span>}
            </Blog.Post.ReadingTime>
          </SeparatedItems>
        </header>
        <PostContent />

        <Blog.Post.TagItems className="flex flex-wrap gap-2">
          <Blog.Post.TagItemRepeater>
            <Chip asChild>
              <Blog.Tag.Label />
            </Chip>
          </Blog.Post.TagItemRepeater>
        </Blog.Post.TagItems>
        <section>
          <SharePostActions href={href} />
        </section>
      </article>
    </Blog.Post.Root>
  );
}
