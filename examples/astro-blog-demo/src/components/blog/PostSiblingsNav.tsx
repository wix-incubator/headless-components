import { PostTitle } from "@/components/ui/blog/PostTitle";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Blog } from "@wix/headless-blog/react";
import { useNavigation } from "./NavigationContext";

export interface PostSiblingsNavProps {
  /** The base url of the post page, commonly end with trailing slash, e.g. "/post/" */
  postPageBaseUrl: string;
}

/** Displays the previous and next posts in the blog. Must be inside a `Blog.Post.Root` component. */
export default function PostSiblingsNav({
  postPageBaseUrl,
}: PostSiblingsNavProps) {
  return (
    <Blog.Post.SiblingPosts.Root>
      <nav className="mt-10 space-y-4">
        <h2 className="font-heading text-xl text-foreground/80">
          Continue reading
        </h2>

        <div className="grid rounded-2xl border border-foreground/15 p-3 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
          <Blog.Post.SiblingPosts.Older>
            <SiblingPostLink
              label="Previous"
              postPageBaseUrl={postPageBaseUrl}
              className="text-start"
            />
          </Blog.Post.SiblingPosts.Older>
          <Separator className="my-2 md:hidden first:hidden last:hidden" />
          <Blog.Post.SiblingPosts.Newer>
            <SiblingPostLink
              label="Next"
              postPageBaseUrl={postPageBaseUrl}
              className="text-end"
            />
          </Blog.Post.SiblingPosts.Newer>
        </div>
      </nav>
    </Blog.Post.SiblingPosts.Root>
  );
}

function SiblingPostLink({
  className,
  label,
  postPageBaseUrl,
}: {
  className?: string;
  label: string;
  postPageBaseUrl: string;
}) {
  const Navigation = useNavigation();

  return (
    <Blog.Post.Link
      baseUrl={postPageBaseUrl}
      asChild
      className={cn("rounded-xl p-4 hover:bg-foreground/5", className)}
    >
      {({ href }) => (
        <Navigation route={href}>
          <span className="font-paragraph text-sm text-foreground/80">
            {label}
          </span>
          <PostTitle className="group-hover:underline" />
        </Navigation>
      )}
    </Blog.Post.Link>
  );
}
