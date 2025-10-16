import { MemberAvatar } from "@/components/ui/blog/MemberAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useMember } from "@/integrations/members";
import { cn } from "@/lib/utils";
import { Blog } from "@wix/blog/components";
import { Loader2Icon, LogOutIcon } from "lucide-react";

interface CommentFormProps {
  reply?: boolean;
  onCommentAdded?: () => void;
  onCancelClick?: () => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;
  withMemberActions?: boolean;
}

/**
 * Unified form component for creating both top-level comments and replies.
 * Displays member avatar and provides submit/cancel actions.
 * Switches between CreateCommentForm and CommentReplyForm based on the reply prop.
 */
export function CommentForm({
  reply,
  onCommentAdded,
  onCancelClick,
  textareaRef,
  withMemberActions,
}: CommentFormProps) {
  const { isAuthenticated, member, actions } = useMember();

  const Form = reply
    ? Blog.Post.Comment.CommentReplyForm
    : Blog.Post.Comments.CommentCreateForm;

  const avatar = isAuthenticated ? <MemberAvatar member={member} /> : null;

  const avatarWithMemberActions = isAuthenticated ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-fit w-fit cursor-pointer rounded-full hover:opacity-80"
          title="Member actions"
        >
          {avatar}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent sideOffset={12}>
          <DropdownMenuItem onClick={actions.logout}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  ) : null;

  return (
    <Form.Root onCommentAdded={onCommentAdded}>
      <div className="flex gap-3">
        {withMemberActions ? avatarWithMemberActions : avatar}
        <div className="grid flex-1 gap-3">
          <Form.Label className="sr-only">Comment</Form.Label>
          <div className="grid items-baseline gap-3 sm:grid-cols-2">
            <Form.Input ref={textareaRef} asChild>
              <Textarea
                placeholder="Write a comment"
                name="comment"
                rows={3}
                className={cn(
                  "peer col-span-full min-h-[calc(1.5em+24px)] border-none bg-foreground/5 p-3 font-paragraph leading-normal hover:bg-foreground/10 md:text-base [&:not(:focus-visible)]:cursor-pointer",
                  {
                    "[&:not(:focus-visible)]:empty:max-h-[1em]": !reply,
                  }
                )}
              />
            </Form.Input>
            <Form.Message className="font-paragraph text-sm text-red-700" />
            <div
              className={cn("flex flex-row-reverse gap-2 sm:col-start-2", {
                "peer-invalid:hidden peer-[&:not(:focus-visible)]:peer-empty:hidden":
                  !reply,
              })}
            >
              <Form.SubmitButton
                loadingState={
                  <>
                    <Loader2Icon className="animate-spin" />
                    {reply ? "Posting..." : "Posting..."}
                  </>
                }
                asChild
              >
                <Button>{reply ? "Send reply" : "Comment"}</Button>
              </Form.SubmitButton>
              <Form.CancelButton asChild>
                {({ handleCancel }) => (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (onCancelClick) {
                        onCancelClick();
                      } else {
                        handleCancel();
                      }
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Form.CancelButton>
            </div>
          </div>
        </div>
      </div>
    </Form.Root>
  );
}
