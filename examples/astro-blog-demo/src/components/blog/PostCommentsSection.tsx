import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Blog } from "@wix/blog/components";
import type { BlogPostServiceConfig } from "@wix/blog/services";
import { Loader2Icon } from "lucide-react";
import { SortSelect } from "../ui/blog/SortSelect";
import { CommentBlock } from "./CommentBlock";
import { CommentForm } from "./CommentForm";
import { CommentReplies } from "./CommentReplies";
import LoginGuard from "./LoginGuard";

const {
  Post: { Comments, Comment },
} = Blog;

type PostCommentsSectionProps = {
  blogPostServiceConfig: BlogPostServiceConfig;
  uiLocale: string;
};

export default function PostCommentsSection({
  blogPostServiceConfig,
  uiLocale,
}: PostCommentsSectionProps) {
  return (
    <Blog.Post.Root blogPostServiceConfig={blogPostServiceConfig}>
      <Comments.Root className="space-y-4">
        <section className="mt-16 grid gap-y-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-heading text-xl font-semibold text-foreground">
              Comments
            </h3>

            <SortSelect sortComponent={Comments.Sort} />
          </div>

          <Separator className="-mt-1" />

          <LoginGuard>
            <CommentForm withMemberActions />
          </LoginGuard>

          <Comments.Comments
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
            <Comments.CommentRepeater>
              <CommentBlock uiLocale={uiLocale}>
                <CommentReplies uiLocale={uiLocale} />
              </CommentBlock>
            </Comments.CommentRepeater>

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
          </Comments.Comments>
        </section>
      </Comments.Root>
    </Blog.Post.Root>
  );
}
