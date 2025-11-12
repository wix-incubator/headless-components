import PostPaywall from "@/components/blog/PostPaywall";
import { cn } from "@/lib/utils";
import { Blog } from "@wix/blog/components";
import React from "react";
import { RicosViewer } from "./RicosViewer";

export interface PostContentProps extends React.HTMLAttributes<HTMLDivElement> {
  uiLocale: string;
}

/**
 * Renders the rich content of a blog post.
 *
 * @example
 * ```tsx
 * <PostContent />
 * ```
 */
export const PostContent = React.forwardRef<HTMLDivElement, PostContentProps>(
  ({ className, uiLocale, ...props }, ref) => {
    return (
      <Blog.Post.Content className={cn(className)} ref={ref} {...props}>
        {({ content, pricingPlanIds }) => {
          return (
            <>
              <div className="min-h-32">
                <RicosViewer content={content} />
              </div>
              {pricingPlanIds.length > 0 ? (
                <PostPaywall
                  pricingPlanIds={pricingPlanIds}
                  uiLocale={uiLocale}
                />
              ) : null}
            </>
          );
        }}
      </Blog.Post.Content>
    );
  }
);

PostContent.displayName = "PostContent";
