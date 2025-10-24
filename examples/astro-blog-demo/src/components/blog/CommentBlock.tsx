import { Chip } from "@/components/ui/blog/Chip";
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
import { cn } from "@/lib/utils";
import { Comment } from "@wix/blog/components";
import { ClockIcon, EllipsisVerticalIcon, TrashIcon } from "lucide-react";
import React from "react";
import { CommentParentQuote, toScrollAnchorHtmlId } from "./CommentParentQuote";

interface CommentBlockProps {
  children?: React.ReactNode;
  className?: string;
  uiLocale: string;
}

const confirmDelete = () =>
  confirm("Are you sure you want to delete this comment?");

/**
 * Displays a single comment with author information, content, date, and actions.
 * Handles nested replies and shows parent comment context when replying to a reply.
 * Includes delete functionality for comment owners.
 */
export const CommentBlock = React.forwardRef<HTMLDivElement, CommentBlockProps>(
  ({ children, className, uiLocale, ...props }, ref) => {
    const { comment } = Comment.useCommentContext();

    return (
      <article
        className={cn(
          "grid grid-cols-[auto_1fr] gap-x-3 rounded text-foreground outline-2 outline-offset-[12px] scroll-mt-32",
          className
        )}
        id={toScrollAnchorHtmlId(comment._id)}
        ref={ref}
        {...props}
      >
        <CommentParentQuote className="col-span-full mb-3 ms-4" />
        <CommentAuthorAvatar />
        <div className="grid flex-1 gap-y-3">
          <Comment.Status className="peer hidden" />
          <div className="hidden min-h-8 items-center peer-data-[status='DELETED']:grid peer-data-[status='HIDDEN']:grid">
            <span className="font-paragraph text-foreground/60">
              This comment has been deleted
            </span>
          </div>
          <div className="-mt-1 flex items-center gap-2 peer-data-[status='DELETED']:hidden peer-data-[status='HIDDEN']:hidden">
            <header className="grid flex-grow font-paragraph text-sm leading-normal">
              <div className="flex gap-2">
                <CommentAuthorName />
              </div>
              <CommentDate className="text-foreground/80" uiLocale={uiLocale} />
            </header>
            <Comment.Owner>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent>
                    <Comment.Action.Delete onDelete={confirmDelete}>
                      <DropdownMenuItem>
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </Comment.Action.Delete>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            </Comment.Owner>
          </div>
          <div className="hidden peer-data-[status='PENDING']:block">
            <Chip variant="secondary">
              <ClockIcon className="me-0.5 h-4 w-4" />
              Pending
            </Chip>
          </div>
          <CommentContent className="hidden peer-data-[status='PUBLISHED']:block" />
          {children}
        </div>
      </article>
    );
  }
);
