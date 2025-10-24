import { Button } from "@/components/ui/button";
import { Comment } from "@wix/blog/components";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareReplyIcon,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { CommentBlock } from "./CommentBlock";
import { CommentForm } from "./CommentForm";
import LoginGuard from "./LoginGuard";

interface CommentReplyActionProps {
  onCommentAdded?: () => void;
}

/**
 * Manages the display of comment replies with expand/collapse functionality.
 * Handles loading more replies and provides a reply action button.
 */
export function CommentReplies({ uiLocale }: { uiLocale: string }) {
  const { replies } = Comment.useCommentContext();
  const hasReplies = useMemo(() => replies.length > 0, [replies]);
  const [isOpen, setIsOpen] = useState(hasReplies);

  return (
    <>
      <ReplyAction onCommentAdded={() => setIsOpen(true)} />
      {isOpen && (
        <>
          <div className="mb-4">
            <Button
              className="h-auto p-0"
              variant="link"
              onClick={() => setIsOpen(false)}
            >
              Hide all replies <ChevronUpIcon />
            </Button>
          </div>
          <Comment.ReplyItems>
            <div className="space-y-6">
              <Comment.ReplyItemRepeater>
                <CommentBlock uiLocale={uiLocale}>
                  <ReplyAction />
                </CommentBlock>
              </Comment.ReplyItemRepeater>
            </div>
          </Comment.ReplyItems>
        </>
      )}
      <Comment.LoadMoreReplies asChild>
        {({ loadNextPage, isLoading, hasNextPage }) => {
          if (!hasNextPage && hasReplies && isOpen) {
            return null;
          }

          const loadingText = isLoading ? "Loading..." : undefined;
          const buttonText = isOpen ? "Load more replies" : "Show more replies";

          return (
            <div>
              <Button
                className="h-auto p-0"
                variant="link"
                onClick={() => {
                  if (hasReplies && !isOpen) {
                    // Should only expand
                    setIsOpen(true);
                    return;
                  }

                  // Has more replies, load them and open
                  loadNextPage().then(() => {
                    setIsOpen(true);
                  });
                }}
              >
                {loadingText ?? buttonText}
                {isOpen ? null : <ChevronDownIcon />}
              </Button>
            </div>
          );
        }}
      </Comment.LoadMoreReplies>
    </>
  );
}

/**
 * Internal component that renders a reply button and the reply form.
 * Toggles the reply form visibility and auto-focuses the textarea when opened.
 */
function ReplyAction({ onCommentAdded }: CommentReplyActionProps) {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = () => {
    const nextState = !isReplyOpen;
    setIsReplyOpen(nextState);

    if (nextState === true) {
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
  };

  return (
    <>
      <Comment.Status className="peer hidden" />
      <div className="hidden space-y-3 peer-data-[status='PUBLISHED']:block">
        <LoginGuard>
          <Button
            variant="link"
            className="h-auto place-self-start p-0"
            onClick={handleClick}
          >
            <MessageSquareReplyIcon />
            Reply
          </Button>
          {isReplyOpen && (
            <CommentForm
              isReply
              textareaRef={textareaRef}
              onCommentAdded={() => {
                setIsReplyOpen(false);
                onCommentAdded?.();
              }}
              onCancelClick={() => setIsReplyOpen(false)}
            />
          )}
        </LoginGuard>
      </div>
    </>
  );
}
