import { Chip } from "@/components/ui/blog/Chip";
import { EmptyState } from "@/components/ui/blog/EmptyState";
import { PostAuthorAvatar } from "@/components/ui/blog/PostAuthorAvatar";
import { PostAuthorName } from "@/components/ui/blog/PostAuthorName";
import { PostCategories } from "@/components/ui/blog/PostCategories";
import { PostContent } from "@/components/ui/blog/PostContent";
import { PostPublishDate } from "@/components/ui/blog/PostPublishDate";
import { PostReadingTime } from "@/components/ui/blog/PostReadingTime";
import { PostTitle } from "@/components/ui/blog/PostTitle";
import { SeparatedItems } from "@/components/ui/blog/SeparatedItems";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Blog } from "@wix/blog/components";
import { type BlogPostServiceConfig } from "@wix/blog/services";
import { useNavigation } from "./NavigationContext";
import PostSiblingsNav from "./PostSiblingsNav";
import { SharePostActions } from "./SharePostActions";

interface PostPageProps {
  /** Loaded result of `loadBlogPostServiceConfig` */
  blogPostServiceConfig: BlogPostServiceConfig;
  /** The href of the feed page, used for the "Back to Blog" link */
  feedPageHref: string;
  /** The base url of the category page, commonly end with trailing slash, e.g. "/category/" */
  categoryPageBaseUrl: string;
  /** The base url of the post page, commonly end with trailing slash, e.g. "/post/" */
  postPageBaseUrl: string;
  /** The date locale to use for the dates */
  uiLocale: string;
}

/**
 * A complete blog post page component that displays a single blog post with full content.
 * Features a back navigation button, post header with metadata, rich content display,
 * post tags, and social sharing actions.
 *
 * @example
 * ```tsx
 * <PostPage
 *   blogPostServiceConfig={postConfig}
 *   href="https://example.com/post/my-post"
 *   feedPageHref="/blog"
 *   postPageBaseUrl="/post/"
 *   categoryPageBaseUrl="/category/"
 *   uiLocale="en-US"
 * />
 * ```
 */
export default function PostPage({
  blogPostServiceConfig,
  feedPageHref,
  categoryPageBaseUrl,
  postPageBaseUrl,
  uiLocale,
}: PostPageProps) {
  const Navigation = useNavigation();

  return (
    <Blog.Post.Root
      blogPostServiceConfig={blogPostServiceConfig}
      emptyState={<EmptyState title="Post not found" />}
    >
      <article className="space-y-4">
        <header className="mb-8 space-y-3">
          <Button asChild variant="link" className="p-0">
            <Navigation route={feedPageHref}>
              <ChevronLeftIcon strokeWidth={2} className="h-4 w-4" />
              Back to Blog
            </Navigation>
          </Button>

          <div className="grid gap-5">
            <PostCategories className="mb-4" baseUrl={categoryPageBaseUrl} />
            <PostTitle variant="xl" />

            <div className="text-sm text-foreground/80">
              <SeparatedItems className="hidden font-paragraph text-foreground/80 sm:flex">
                <div className="flex items-center gap-x-2">
                  <PostAuthorAvatar />
                  <PostAuthorName />
                </div>

                <PostPublishDate uiLocale={uiLocale} />
                <PostReadingTime />
              </SeparatedItems>
              <div className="grid grid-cols-[auto_1fr] grid-rows-2 items-center gap-x-2 sm:hidden">
                <PostAuthorAvatar className="row-span-2" />
                <PostAuthorName />
                <SeparatedItems className="text-sm text-foreground/80">
                  <PostPublishDate uiLocale={uiLocale} />
                  <PostReadingTime />
                </SeparatedItems>
              </div>
            </div>

            <section className="-ms-2 -mt-2">
              <SharePostActions />
            </section>
          </div>
        </header>
        <PostContent uiLocale={uiLocale} />

        <Blog.Post.TagItems className="flex flex-wrap gap-2">
          <Blog.Post.TagItemRepeater>
            <Chip size="sm" asChild>
              <Blog.Tag.Label />
            </Chip>
          </Blog.Post.TagItemRepeater>
        </Blog.Post.TagItems>

        <Separator />

        <section className="-ms-2">
          <SharePostActions />
        </section>

        <PostSiblingsNav postPageBaseUrl={postPageBaseUrl} />
      </article>
    </Blog.Post.Root>
  );
}
