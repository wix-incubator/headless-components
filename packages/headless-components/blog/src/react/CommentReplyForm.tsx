import type { comments } from '@wix/comments';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';
import type { CommentWithResolvedFields } from '../services/blog-post-comments-service.js';
import { useCommentContext } from './Comment.js';
import * as CoreComments from './core/Comments.js';
import { isValidChildren } from './helpers.js';

const enum TestIds {
  blogPostCommentCreateReply = 'blog-post-comment-create-reply',
  blogPostCommentsCreateReplyMessage = 'blog-post-comments-create-reply-message',
  blogPostCommentsCreateReplyCancel = 'blog-post-comments-create-reply-cancel',
  blogPostCommentsCreateReplySubmit = 'blog-post-comments-create-reply-submit',
  blogPostCommentsCreateReplyLabel = 'blog-post-comments-create-reply-label',
  blogPostCommentsCreateReplyInput = 'blog-post-comments-create-reply-input',
}

/**
 * Context for sharing form state between CreateReplyForm components
 */
interface CreateReplyFormContextValue {
  replyText: string;
  setReplyText: (text: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  createReply: (content: comments.CommentContent) => Promise<CommentWithResolvedFields | null>;
  isLoading: boolean;
  replyError: string | null;
  maxLength: number;
  htmlId: string;
}

const CreateReplyFormContext = React.createContext<CreateReplyFormContextValue | null>(null);

CreateReplyFormContext.displayName = 'Blog.Post.Comment.CommentReplyFormContext';

function useCreateReplyFormContext(): CreateReplyFormContextValue {
  const context = React.useContext(CreateReplyFormContext);
  if (!context) {
    throw new Error(
      'useCreateReplyFormContext must be used within a Blog.Post.Comment.CommentReplyForm.Root component',
    );
  }
  return context;
}

export interface RootProps {
  asChild?: boolean;
  className?: string;
  maxLength?: number;
  onCommentAdded?: () => void;
  children?:
    | AsChildChildren<{
        createReply: (
          content: comments.CommentContent,
        ) => Promise<CommentWithResolvedFields | null>;
        isLoading: boolean;
        replyError: string | null;
        replyText: string;
        setReplyText: (text: string) => void;
        isSubmitting: boolean;
        handleSubmit: (e: React.FormEvent) => Promise<void>;
      }>
    | React.ReactNode;
}

/**
 * Form component for creating replies to comments.
 * Provides context for sub-components to share form state.
 * Must contain composable sub-components as children.
 *
 * @component
 * @example
 * ```tsx
 * // Composable form with sub-components
 * <Blog.Post.Comment.CommentReplyForm className="space-y-3">
 *   <Blog.Post.Comment.CommentReplyForm.Field
 *     className="w-full border rounded-lg p-3"
 *     placeholder="Write your reply..."
 *   />
 *   <Blog.Post.Comment.CommentReplyForm.Message className="text-red-600" />
 *   <Blog.Post.Comment.CommentReplyForm.SubmitButton className="btn-primary" />
 * </Blog.Post.Comment.CommentReplyForm>
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comment.CommentReplyForm asChild>
 *   {({ createReply, isLoading, replyError, replyText, handleSubmit }) => (
 *     <CustomReplyForm
 *       onSubmit={handleSubmit}
 *       loading={isLoading}
 *       error={replyError}
 *       value={replyText}
 *     />
 *   )}
 * </Blog.Post.Comment.CommentReplyForm>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { asChild, children, className, maxLength = 500, onCommentAdded } = props;

  const topLevelComment = CoreComments.useTopLevelCommentContext();
  const parentComment = useCommentContext().comment;

  return (
    <CoreComments.CreateReply
      parentCommentId={parentComment._id ?? ''}
      topCommentId={topLevelComment._id ?? ''}
    >
      {({ createReply, isLoading, replyError }) => {
        const [replyText, setReplyText] = React.useState('');
        const htmlId = `reply-text-field-${React.useId()}`;

        const handleSubmit = React.useCallback(
          async (e: React.FormEvent) => {
            e.preventDefault();

            const text = replyText.trim();
            if (!text || isLoading) {
              return;
            }

            try {
              // Create reply content structure for Wix Comments API
              const result = await createReply({
                richContent: {
                  nodes: [{ type: 'PARAGRAPH', nodes: [{ type: 'TEXT', textData: { text } }] }],
                },
              });

              if (result) {
                // Clear form on success
                setReplyText('');
                onCommentAdded?.();
              }
            } catch (err) {
              // Error is handled by the service
              console.error('Failed to create reply:', err);
            }
          },
          [replyText, createReply, isLoading],
        );

        const contextValue: CreateReplyFormContextValue = {
          replyText,
          setReplyText,
          handleSubmit,
          createReply,
          isLoading,
          replyError,
          maxLength,
          htmlId,
        };

        const attributes = {
          'data-testid': TestIds.blogPostCommentCreateReply,
          'data-loading': isLoading,
        };

        return (
          <CreateReplyFormContext.Provider value={contextValue}>
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              {...attributes}
              customElement={children}
              customElementProps={{
                createReply,
                isLoading,
                replyError,
                replyText,
                setReplyText,
                handleSubmit,
              }}
            >
              {isValidChildren(children) ? (
                <form onSubmit={handleSubmit}>{children}</form>
              ) : (
                children
              )}
            </AsChildSlot>
          </CreateReplyFormContext.Provider>
        );
      }}
    </CoreComments.CreateReply>
  );
});

export interface LabelProps {
  asChild?: boolean;
  className?: string;
  children?:
    | AsChildChildren<{
        htmlFor: string;
        labelText: string;
      }>
    | React.ReactNode;
}

/**
 * Label component for reply form input.
 *
 * @component
 * @example
 * ```tsx
 * // Default label
 * <Blog.Post.Comment.CommentReplyForm.Label />
 *
 * // Custom styling
 * <Blog.Post.Comment.CommentReplyForm.Label className="text-gray-700 font-medium mb-2" />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comment.CommentReplyForm.Label asChild>
 *   {({ htmlFor, labelText }) => (
 *     <label htmlFor={htmlFor} className="custom-label">
 *       {labelText}
 *     </label>
 *   )}
 * </Blog.Post.Comment.CommentReplyForm.Label>
 * ```
 */
export const Label = React.forwardRef<HTMLElement, LabelProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { htmlId } = useCreateReplyFormContext();

  const attributes = {
    'data-testid': TestIds.blogPostCommentsCreateReplyLabel,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{
        htmlFor: htmlId,
        labelText: 'Reply',
      }}
    >
      <label htmlFor={htmlId}>Reply</label>
    </AsChildSlot>
  );
});

Label.displayName = 'Blog.Post.Comment.CommentReplyForm.Label';

export interface InputProps {
  asChild?: boolean;
  className?: string;
  placeholder?: string;
  rows?: number;
  children?:
    | AsChildChildren<{
        value: string;
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
        disabled: boolean;
        placeholder?: string;
        maxLength: number;
        id: string;
      }>
    | React.ReactNode;
}

/**
 * Input component for reply form textarea.
 *
 * @component
 * @example
 * ```tsx
 * // Default textarea
 * <Blog.Post.Comment.CommentReplyForm.Input placeholder="Write your reply..." />
 *
 * // Custom styling
 * <Blog.Post.Comment.CommentReplyForm.Input
 *   className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
 *   placeholder="What's your reply?"
 *   rows={3}
 * />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comment.CommentReplyForm.Input asChild>
 *   {({ value, onChange, disabled, placeholder, maxLength, id }) => (
 *     <RichTextEditor
 *       id={id}
 *       value={value}
 *       onChange={onChange}
 *       disabled={disabled}
 *       placeholder={placeholder}
 *       maxLength={maxLength}
 *     />
 *   )}
 * </Blog.Post.Comment.CommentReplyForm.Input>
 * ```
 */
export const Input = React.forwardRef<HTMLElement, InputProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { replyText, setReplyText, isLoading, maxLength, htmlId } = useCreateReplyFormContext();

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setReplyText(e.target.value);
    },
    [setReplyText],
  );

  const inputAttributes: React.ComponentProps<'textarea'> = {
    value: replyText,
    onChange: handleChange,
    minLength: 1,
    disabled: isLoading,
    maxLength,
    id: htmlId,
  };
  const dataAttributes = {
    'data-testid': TestIds.blogPostCommentsCreateReplyInput,
    'data-loading': isLoading,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...dataAttributes}
      {...inputAttributes}
      customElement={children}
      customElementProps={inputAttributes}
    >
      <textarea />
    </AsChildSlot>
  );
});

Input.displayName = 'Blog.Post.Comment.CommentReplyForm.Input';

export interface MessageProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ error: string; hasError: boolean }> | React.ReactNode;
}

/**
 * Error message display component for reply form.
 *
 * @component
 * @example
 * ```tsx
 * // Default error display
 * <Blog.Post.Comment.CommentReplyForm.Message />
 *
 * // Custom styling
 * <Blog.Post.Comment.CommentReplyForm.Message className="text-red-600 text-sm bg-red-50 p-2 rounded" />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comment.CommentReplyForm.Message asChild>
 *   {({ error, hasError }) => (
 *     hasError && <CustomErrorAlert message={error} />
 *   )}
 * </Blog.Post.Comment.CommentReplyForm.Message>
 * ```
 */
export const Message = React.forwardRef<HTMLElement, MessageProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { replyError } = useCreateReplyFormContext();

  const hasError = Boolean(replyError);

  if (!hasError) return null;

  const attributes = {
    'data-testid': TestIds.blogPostCommentsCreateReplyMessage,
    'data-has-error': hasError,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ error: replyError!, hasError }}
    >
      <div>{replyError}</div>
    </AsChildSlot>
  );
});

Message.displayName = 'Blog.Post.Comment.CommentReplyForm.Message';

export interface CancelButtonProps {
  asChild?: boolean;
  className?: string;
  children?:
    | AsChildChildren<{
        isDisabled: boolean;
        isLoading: boolean;
        handleCancel: () => void;
      }>
    | React.ReactNode;
}

/**
 * Cancel button for the reply form.
 * Clears the form input when clicked.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Post.Comment.CommentReplyForm.CancelButton />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comment.CommentReplyForm.CancelButton asChild>
 *   {({ handleCancel }) => (
 *     <Button variant="ghost" onClick={handleCancel}>
 *       Cancel
 *     </Button>
 *   )}
 * </Blog.Post.Comment.CommentReplyForm.CancelButton>
 * ```
 */
export const CancelButton = React.forwardRef<HTMLElement, CancelButtonProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { replyText, isLoading, setReplyText } = useCreateReplyFormContext();

  const isDisabled = !replyText.trim();

  const handleCancel = () => {
    setReplyText('');
  };

  const buttonAttributes: React.ComponentProps<'button'> = {
    type: 'reset',
    onClick: handleCancel,
  };

  const dataAttributes = {
    'data-testid': TestIds.blogPostCommentsCreateReplyCancel,
    'data-disabled': isDisabled,
    'data-loading': isLoading,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...dataAttributes}
      {...buttonAttributes}
      customElement={children}
      customElementProps={{
        isDisabled,
        isLoading,
        handleCancel,
      }}
    >
      <button>Cancel</button>
    </AsChildSlot>
  );
});

CancelButton.displayName = 'Blog.Post.Comment.CommentReplyForm.CancelButton';

export interface SubmitButtonProps {
  asChild?: boolean;
  className?: string;
  loadingState?: React.ReactNode;
  children?:
    | AsChildChildren<{
        isDisabled: boolean;
        isLoading: boolean;
        onClick: (e: React.FormEvent) => Promise<void>;
      }>
    | React.ReactNode;
}

/**
 * Submit button for the reply form.
 * Automatically disabled when the form is empty or submitting.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Post.Comment.CommentReplyForm.SubmitButton />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comment.CommentReplyForm.SubmitButton asChild>
 *   <Button>Post reply</Button>
 * </Blog.Post.Comment.CommentReplyForm.SubmitButton>
 * ```
 */
export const SubmitButton = React.forwardRef<HTMLElement, SubmitButtonProps>((props, ref) => {
  const { asChild, children, className, loadingState } = props;
  const { replyText, isLoading } = useCreateReplyFormContext();

  const isDisabled = !replyText.trim();

  const buttonAttributes: React.ComponentProps<'button'> = {
    type: 'submit',
    disabled: isDisabled,
  };

  const dataAttributes = {
    'data-testid': TestIds.blogPostCommentsCreateReplySubmit,
    'data-disabled': isDisabled,
    'data-loading': isLoading,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...dataAttributes}
      {...buttonAttributes}
      customElement={children}
      customElementProps={{
        isDisabled,
        isLoading,
      }}
      content={isLoading && loadingState ? loadingState : undefined}
    >
      <button>Post reply</button>
    </AsChildSlot>
  );
});

SubmitButton.displayName = 'Blog.Post.Comment.CommentReplyForm.SubmitButton';
