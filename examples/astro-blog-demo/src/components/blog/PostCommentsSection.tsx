import { SortSelect } from "@/components/ui/blog/SortSelect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMember } from "@/integrations/members";
import { Blog, Comments } from "@wix/blog/components";
import type { BlogPostServiceConfig } from "@wix/blog/services";
import { Loader2Icon } from "lucide-react";
import { CommentBlock } from "./CommentBlock";
import { CommentForm } from "./CommentForm";
import { CommentReplies } from "./CommentReplies";
import LoginGuard from "./LoginGuard";

type PostCommentsSectionProps = {
  blogPostServiceConfig: BlogPostServiceConfig;
  uiLocale: string;
};

/**
 * Main comments section component that displays all comments for a blog post.
 * Includes sort controls, comment creation form, and load more functionality.
 */
export default function PostCommentsSection({
  blogPostServiceConfig,
  uiLocale,
}: PostCommentsSectionProps) {
  const { member } = useMember();

  return (
    <Blog.Post.Root blogPostServiceConfig={blogPostServiceConfig}>
      <Blog.Post.Comments currentMember={member}>
        <section className="mt-16 grid gap-y-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-heading text-xl font-semibold text-foreground">
              Comments
            </h3>

            <SortSelect sortComponent={Comments.Sort} />
          </div>

          <Separator className="-mt-1" />

          <LoginGuard>
            <CommentForm />
          </LoginGuard>

          <Comments.CommentItems
            loadingState={
              <p className="font-paragraph text-foreground/80">
                Loading comments...
              </p>
            }
            emptyState={
              <p className="font-paragraph text-foreground/80">
                No comments yet. Be the first to comment!
              </p>
            }
            className="space-y-6"
          >
            <Comments.CommentItemRepeater>
              <CommentBlock uiLocale={uiLocale}>
                <CommentReplies uiLocale={uiLocale} />
              </CommentBlock>
            </Comments.CommentItemRepeater>

            <Comments.LoadMore
              asChild
              loadingState={
                <>
                  <Loader2Icon className="animate-spin" />
                  Loading...
                </>
              }
            >
              <Button className="w-full" variant="outline">
                Load More
              </Button>
            </Comments.LoadMore>
          </Comments.CommentItems>
        </section>
      </Blog.Post.Comments>
    </Blog.Post.Root>
  );
}
