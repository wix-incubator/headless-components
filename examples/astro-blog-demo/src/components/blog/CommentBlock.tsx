import { CommentAuthorAvatar } from "@/components/ui/blog/CommentAuthorAvatar";
import { CommentAuthorName } from "@/components/ui/blog/CommentAuthorName";
import { CommentContent } from "@/components/ui/blog/CommentContent";
import { CommentDate } from "@/components/ui/blog/CommentDate";
import { cn } from "@/lib/utils";
import { Blog } from "@wix/blog/components";
import React from "react";

const {
  Post: { Comment },
} = Blog;

interface CommentBlockProps {
  children?: React.ReactNode;
  className?: string;
  uiLocale: string;
}

export const CommentBlock = React.forwardRef<HTMLDivElement, CommentBlockProps>(
  ({ children, className, uiLocale, ...props }, ref) => {
    return (
      <article
        className={cn(
          "grid grid-cols-[auto_1fr] gap-x-3 text-foreground",
          className
        )}
        ref={ref}
        {...props}
      >
        <Comment.ParentComment>
          <div className="col-span-full mb-3 flex items-center gap-2 font-paragraph">
            <div className="-mb-1 ms-4 h-4 w-5 self-end rounded-tl border-s-2 border-t-2 border-foreground/20"></div>
            <CommentAuthorAvatar size="sm" />

            <CommentContent
              asPlainText
              className="line-clamp-1 flex-1 text-foreground/60"
            />
          </div>
        </Comment.ParentComment>
        <CommentAuthorAvatar />
        <div className="grid flex-1 gap-y-2">
          <header className="-mt-1 grid font-paragraph text-sm leading-normal">
            <div className="flex gap-2">
              <CommentAuthorName />
              <Comment.Status asChild>
                {({ status }) =>
                  status === "PENDING" ? <span>Pending</span> : null
                }
              </Comment.Status>
            </div>
            <CommentDate uiLocale={uiLocale} />
          </header>
          <CommentContent />

          {children}
        </div>
      </article>
    );
  }
);
