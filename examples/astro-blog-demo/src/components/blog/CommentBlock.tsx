import { CommentAuthorAvatar } from "@/components/ui/blog/CommentAuthorAvatar";
import { CommentAuthorName } from "@/components/ui/blog/CommentAuthorName";
import { CommentContent } from "@/components/ui/blog/CommentContent";
import { CommentDate } from "@/components/ui/blog/CommentDate";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMember } from "@/integrations/members";
import { cn } from "@/lib/utils";
import { Comment } from "@wix/blog/components";
import { ClockIcon, EllipsisVerticalIcon, TrashIcon } from "lucide-react";
import React from "react";
import { Chip } from "../ui/blog/Chip";

interface CommentBlockProps {
  children?: React.ReactNode;
  className?: string;
  uiLocale: string;
}

/**
 * Displays a single comment with author information, content, date, and actions.
 * Handles nested replies and shows parent comment context when replying to a reply.
 * Includes delete functionality for comment owners.
 */
export const CommentBlock = React.forwardRef<HTMLDivElement, CommentBlockProps>(
  ({ children, className, uiLocale, ...props }, ref) => {
    const { isAuthenticated, member } = useMember();
    const { deleteComment, comment } = Comment.useCommentContext();
    // @ts-expect-error TODO -- Make this cleaner
    const isOwner = comment.author?.memberId === member?._id;

    return (
      <article
        className={cn(
          "grid grid-cols-[auto_1fr] gap-x-3 rounded text-foreground outline-2 outline-offset-[12px]",
          className
        )}
        id={comment._id ?? undefined}
        ref={ref}
        {...props}
      >
        <Comment.ParentComment asChild>
          {({ comment: parentComment }) => (
            <div className="col-span-full mb-3 flex items-center gap-2 font-paragraph">
              <div className="-mb-1 ms-4 h-4 w-5 self-end rounded-tl border-s-2 border-t-2 border-foreground/20"></div>

              <ScrollAnchor targetHtmlId={parentComment._id}>
                <Comment.Status asChild>
                  {({ status }) =>
                    status === "DELETED" || status === "HIDDEN" ? (
                      <span className="font-paragraph text-sm text-foreground/60">
                        Replying to a deleted comment
                      </span>
                    ) : (
                      <>
                        <CommentAuthorAvatar size="sm" />
                        <CommentContent
                          asPlainText
                          className="line-clamp-1 flex-1 font-paragraph text-sm text-foreground/60"
                        />
                      </>
                    )
                  }
                </Comment.Status>
              </ScrollAnchor>
            </div>
          )}
        </Comment.ParentComment>
        <CommentAuthorAvatar />
        <div className="grid flex-1 gap-y-3">
          <Comment.Status asChild>
            {({ status }) => {
              switch (status) {
                case "HIDDEN":
                case "DELETED":
                  return (
                    <div className="grid min-h-8 items-center">
                      <span className="font-paragraph text-foreground/60">
                        This comment has been deleted
                      </span>
                    </div>
                  );
                default:
                  return (
                    <>
                      <div className="-mt-1 flex items-center gap-2">
                        <header className="grid flex-grow font-paragraph text-sm leading-normal">
                          <div className="flex gap-2">
                            <CommentAuthorName />
                          </div>
                          <CommentDate
                            className="text-foreground/80"
                            uiLocale={uiLocale}
                          />
                        </header>
                        {isAuthenticated && isOwner ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <EllipsisVerticalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (
                                      confirm(
                                        "Are you sure you want to delete this comment?"
                                      )
                                    ) {
                                      deleteComment();
                                    }
                                  }}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenuPortal>
                          </DropdownMenu>
                        ) : null}
                      </div>
                      {status === "PENDING" ? (
                        <div>
                          <Chip variant="secondary">
                            <ClockIcon className="h-4 w-4 me-0.5" />
                            Pending
                          </Chip>
                        </div>
                      ) : null}
                      <CommentContent />
                    </>
                  );
              }
            }}
          </Comment.Status>

          {children}
        </div>
      </article>
    );
  }
);

/**
 * Internal component that creates a clickable link to scroll to a parent comment.
 * Adds a smooth scroll animation and visual highlight effect when clicked.
 */
function ScrollAnchor({
  targetHtmlId,
  children,
}: {
  targetHtmlId: string | null | undefined;
  children: React.ReactNode;
}) {
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
      className="contents cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        scrollToComment();
      }}
      href={`#${targetHtmlId}`}
    >
      {children}
    </a>
  );
}
