import { CommentAuthorAvatar } from "@/components/ui/blog/CommentAuthorAvatar";
import { CommentContent } from "@/components/ui/blog/CommentContent";
import { cn } from "@/lib/utils";
import { Comment } from "@wix/blog/components";
import React from "react";

export const toScrollAnchorHtmlId = (id: string | null | undefined) =>
  id ? `comment-${id}` : undefined;

interface CommentParentQuoteProps {
  className?: string;
}

export const CommentParentQuote = ({ className }: CommentParentQuoteProps) => {
  return (
    <Comment.ParentComment asChild>
      {({ comment: parentComment }) => (
        <div
          className={cn("flex items-center gap-2 font-paragraph", className)}
        >
          <div className="-mb-1 h-4 w-5 self-end rounded-tl border-s-2 border-t-2 border-foreground/20"></div>

          <ScrollAnchor
            className="group"
            targetHtmlId={toScrollAnchorHtmlId(parentComment._id)}
          >
            <Comment.Status className="peer hidden" />
            <span className="hidden font-paragraph text-sm text-foreground/60 peer-data-[status='DELETED']:inline peer-data-[status='HIDDEN']:inline">
              Replying to a deleted comment
            </span>
            <CommentAuthorAvatar
              className="peer-data-[status='DELETED']:hidden peer-data-[status='HIDDEN']:hidden"
              size="sm"
            />
            <CommentContent
              asPlainText
              className="line-clamp-1 flex-1 font-paragraph text-sm text-foreground/60 peer-data-[status='DELETED']:hidden peer-data-[status='HIDDEN']:hidden"
            />
          </ScrollAnchor>
        </div>
      )}
    </Comment.ParentComment>
  );
};

CommentParentQuote.displayName = "CommentParentQuote";

/**
 * Internal component that creates a clickable link to scroll to a parent comment.
 * Adds a smooth scroll animation and visual highlight effect when clicked.
 */
function ScrollAnchor({
  className,
  targetHtmlId,
  children,
  ...otherProps
}: {
  className?: string;
  targetHtmlId: string | null | undefined;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLAnchorElement>, "href" | "onClick">) {
  const scrollToComment = React.useCallback(() => {
    if (!targetHtmlId) return;

    const targetElement = document.getElementById(targetHtmlId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      targetElement.getAnimations().forEach((animation) => animation.cancel());
      targetElement
        .animate(
          [
            { outline: "2px solid transparent" },
            { outline: "2px solid currentColor" },
            { outline: "2px solid transparent" },
          ],
          {
            duration: 2000,
            delay: 200,
            easing: "cubic-bezier(0, 0, 0.2, 1)",
          }
        )
        .play();
    }
  }, [targetHtmlId]);

  return (
    <a
      className={cn("contents cursor-pointer", className)}
      onClick={(e) => {
        e.preventDefault();
        scrollToComment();
      }}
      href={`#${targetHtmlId}`}
      {...otherProps}
    >
      {children}
    </a>
  );
}
