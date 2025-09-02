import { Button } from "@/components/ui/button";
import { Blog } from "@wix/blog/components";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareReplyIcon,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { CommentBlock } from "./CommentBlock";
import { CommentForm } from "./CommentForm";
import LoginGuard from "./LoginGuard";

const {
  Post: { Comment },
} = Blog;

interface CommentReplyActionProps {
  onCommentAdded?: () => void;
}

export function CommentReplies({ uiLocale }: { uiLocale: string }) {
  const { replies } = Comment.useCommentContext();
  const hasReplies = useMemo(() => replies.length > 0, [replies]);
  const [isOpen, setIsOpen] = useState(hasReplies);

  return (
    <>
      <LoginGuard>
        <ReplyAction onCommentAdded={() => setIsOpen(true)} />
      </LoginGuard>
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
          <Comment.Replies>
            <div className="space-y-6">
              <Comment.ReplyRepeater>
                <CommentBlock uiLocale={uiLocale}>
                  <LoginGuard>
                    <ReplyAction />
                  </LoginGuard>
                </CommentBlock>
              </Comment.ReplyRepeater>
            </div>
          </Comment.Replies>
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
      <Button variant="link" className="place-self-start h-auto p-0" onClick={handleClick}>
        <MessageSquareReplyIcon />
        Reply
      </Button>
      {isReplyOpen && (
        <CommentForm
          reply
          textareaRef={textareaRef}
          onCommentAdded={() => {
            setIsReplyOpen(false);
            onCommentAdded?.();
          }}
          onCancelClick={() => setIsReplyOpen(false)}
        />
      )}
    </>
  );
}
