import { comments } from '@wix/comments';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';

import React, { useId } from 'react';
import type { CommentWithResolvedFields } from '../services/blog-post-comments-service.js';
import * as CoreComments from './core/Comments.js';
import { isValidChildren } from './helpers.js';

const enum TestIds {
  root = 'blog-post-comments-create-comment',
  message = 'blog-post-comments-create-comment-message',
  label = 'blog-post-comments-create-comment-label',
  input = 'blog-post-comments-create-comment-input',
  submit = 'blog-post-comments-create-comment-submit',
  cancel = 'blog-post-comments-create-comment-cancel',
}

/**
 * Context for sharing form state between CreateCommentForm components
 */
interface CreateCommentFormContextValue {
  commentText: string;
  setCommentText: (text: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  createComment: (content: comments.CommentContent) => Promise<CommentWithResolvedFields | null>;
  isLoading: boolean;
  error: string | null;
  maxLength: number;
  htmlId: string;
}

const CreateCommentFormContext = React.createContext<CreateCommentFormContextValue | null>(null);

function useCreateCommentFormContext(): CreateCommentFormContextValue {
  const context = React.useContext(CreateCommentFormContext);
  if (!context) {
    throw new Error(
      'useCreateCommentFormContext must be used within a CreateCommentForm component',
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
        createComment: (
          content: comments.CommentContent,
        ) => Promise<CommentWithResolvedFields | null>;
        isLoading: boolean;
        error: string | null;
        commentText: string;
        setCommentText: (text: string) => void;
        handleSubmit: (e: React.FormEvent) => Promise<void>;
      }>
    | React.ReactNode;
}

/**
 * Form component for creating new comments.
 * Provides context for sub-components to share form state.
 * Must contain composable sub-components as children.
 *
 * @component
 * @example
 * ```tsx
 * // Composable form with sub-components
 * <Blog.Post.Comments.CreateCommentForm.Root className="space-y-4">
 *   <Blog.Post.Comments.CreateCommentForm.Input
 *     className="w-full border rounded-lg p-3"
 *     placeholder="What are your thoughts?"
 *   />
 *   <Blog.Post.Comments.CreateCommentForm.ErrorMessage className="text-red-600" />
 *   <Blog.Post.Comments.CreateCommentForm.SubmitButton className="btn-primary" />
 * </BlogPostComments.CreateCommentForm>
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comments.CreateCommentForm.Root asChild>
 *   {({ createComment, isLoading, error, commentText, handleSubmit }) => (
 *     <CustomCommentForm
 *       onSubmit={handleSubmit}
 *       loading={isLoading}
 *       error={error}
 *       value={commentText}
 *     />
 *   )}
 * </Blog.Post.Comments.CreateCommentForm.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { asChild, children, className, maxLength = 1000, onCommentAdded } = props;

  return (
    <CoreComments.CreateComment>
      {({ createComment, isLoading, error }) => {
        const [commentText, setCommentText] = React.useState('');
        const htmlId = `comment-text-field-${useId()}`;

        const handleSubmit = React.useCallback(
          async (e: React.FormEvent) => {
            e.preventDefault();

            if (!commentText.trim() || isLoading) {
              return;
            }

            try {
              // Create comment content structure for Wix Comments API
              const commentContent: comments.CommentContent = {
                richContent: {
                  nodes: [
                    {
                      type: 'PARAGRAPH',
                      nodes: [
                        {
                          type: 'TEXT',
                          textData: {
                            text: commentText.trim(),
                          },
                        },
                      ],
                    },
                  ],
                },
              };

              const result = await createComment(commentContent);

              if (result) {
                // Clear form on success
                setCommentText('');
                onCommentAdded?.();
              }
            } catch (err) {
              // Error is handled by the service
              console.error('Failed to create comment:', err);
            }
          },
          [commentText, createComment, isLoading],
        );

        const contextValue: CreateCommentFormContextValue = {
          commentText,
          setCommentText,
          handleSubmit,
          createComment,
          isLoading,
          error,
          maxLength,
          htmlId,
        };

        const attributes = {
          'data-testid': TestIds.root,
          'data-loading': isLoading,
        };

        return (
          <CreateCommentFormContext.Provider value={contextValue}>
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              {...attributes}
              customElement={children}
              customElementProps={{
                isLoading,
                error,
                commentText,
                setCommentText,
                handleSubmit,
              }}
            >
              {isValidChildren(children) ? (
                <form onSubmit={handleSubmit}>{children}</form>
              ) : (
                children
              )}
            </AsChildSlot>
          </CreateCommentFormContext.Provider>
        );
      }}
    </CoreComments.CreateComment>
  );
});

Root.displayName = 'Blog.Post.Comments.CreateCommentForm.Root';

export interface CreateCommentFormLabelProps {
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
 * Label component for comment form input.
 *
 * @component
 * @example
 * ```tsx
 * // Default label
 * <Blog.Post.Comments.CommentCreateForm.Label />
 *
 * // Custom styling
 * <Blog.Post.Comments.CommentCreateForm.Label className="text-gray-700 font-medium mb-2" />
 *
 * // Custom rendering with asChild
 * <BlogPostComments.CreateCommentFormLabel asChild>
 *   {({ htmlFor, labelText }) => (
 *     <label htmlFor={htmlFor} className="custom-label">
 *       {labelText}
 *     </label>
 *   )}
 * </BlogPostComments.CreateCommentFormLabel>
 * ```
 */
export const Label = React.forwardRef<HTMLElement, CreateCommentFormLabelProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { htmlId } = useCreateCommentFormContext();

  const dataAttributes = {
    'data-testid': TestIds.label,
  };

  const labelAttributes: React.ComponentProps<'label'> = {
    htmlFor: htmlId,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...dataAttributes}
      {...labelAttributes}
      customElement={children}
      customElementProps={{
        htmlFor: htmlId,
        labelText: 'Share your thoughts',
      }}
    >
      <label>Share your thoughts</label>
    </AsChildSlot>
  );
});

Label.displayName = 'Blog.Post.Comments.CreateCommentForm.Label';

export interface CreateCommentFormInputProps {
  asChild?: boolean;
  className?: string;
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
 * Textarea input component for the comment form.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Post.Comments.CreateCommentForm.Input />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comments.CreateCommentForm.Input asChild>
 *   <Textarea placeholder="Write a comment" rows={3} />
 * </Blog.Post.Comments.CreateCommentForm.Input>
 * ```
 */
export const Input = React.forwardRef<HTMLElement, CreateCommentFormInputProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { commentText, setCommentText, isLoading, maxLength, htmlId } =
    useCreateCommentFormContext();

  const disabled = isLoading;

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setCommentText(e.target.value),
    [setCommentText],
  );

  const inputAttributes: React.ComponentProps<'input'> = {
    value: commentText,
    onInput: handleChange,
    minLength: 1,
    disabled,
    maxLength,
    id: htmlId,
  };
  const dataAttributes = {
    'data-testid': TestIds.input,
    'data-disabled': disabled,
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

Input.displayName = 'Blog.Post.Comments.CreateCommentForm.Input';

export interface MessageProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ error: string; hasError: boolean }> | React.ReactNode;
}

/**
 * Error message display component for comment form.
 *
 * @component
 * @example
 * ```tsx
 * // Default error display
 * <Blog.Post.Comments.CommentCreateForm.Message />
 *
 * // Custom styling
 * <Blog.Post.Comments.CommentCreateForm.Message className="text-red-600 text-sm bg-red-50 p-2 rounded" />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comments.CommentCreateForm.Message asChild>
 *   {({ error, hasError }) => (
 *     hasError && <CustomErrorAlert message={error} />
 *   )}
 * </Blog.Post.Comments.CommentCreateForm.Message>
 * ```
 */
export const Message = React.forwardRef<HTMLElement, MessageProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { error } = useCreateCommentFormContext();

  if (!error) return null;

  const attributes = {
    'data-testid': TestIds.message,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ error }}
    >
      <p>{error}</p>
    </AsChildSlot>
  );
});

Message.displayName = 'Blog.Post.Comments.CreateCommentForm.Message';

export interface CreateCommentFormSubmitButtonProps {
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
 * Submit button for the comment form.
 * Automatically disabled when the form is empty or submitting.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Post.Comments.CreateCommentForm.SubmitButton />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comments.CreateCommentForm.SubmitButton asChild>
 *   <Button>Post comment</Button>
 * </Blog.Post.Comments.CreateCommentForm.SubmitButton>
 * ```
 */
export const SubmitButton = React.forwardRef<HTMLElement, CreateCommentFormSubmitButtonProps>(
  (props, ref) => {
    const { asChild, children, className, loadingState } = props;
    const { commentText, isLoading } = useCreateCommentFormContext();

    const isDisabled = !commentText.trim();

    const buttonAttributes: React.ComponentProps<'button'> = {
      type: 'submit',
      disabled: isDisabled,
    };

    const dataAttributes = {
      'data-testid': TestIds.submit,
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
        <button>Post comment</button>
      </AsChildSlot>
    );
  },
);

SubmitButton.displayName = 'Blog.Post.Comments.CreateCommentForm.SubmitButton';

export interface CreateCommentFormCancelButtonProps {
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
 * Cancel button for the comment form.
 * Clears the form input when clicked.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Post.Comments.CreateCommentForm.CancelButton />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comments.CreateCommentForm.CancelButton asChild>
 *   {({ handleCancel }) => (
 *     <Button variant="ghost" onClick={handleCancel}>
 *       Cancel
 *     </Button>
 *   )}
 * </Blog.Post.Comments.CreateCommentForm.CancelButton>
 * ```
 */
export const CancelButton = React.forwardRef<HTMLElement, CreateCommentFormCancelButtonProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { commentText, isLoading, setCommentText } = useCreateCommentFormContext();

    const isDisabled = !commentText.trim();

    const handleCancel = () => {
      setCommentText('');
    };
    const buttonAttributes: React.ComponentProps<'button'> = {
      type: 'reset',
      disabled: isDisabled,
      onClick: handleCancel,
    };

    const dataAttributes = {
      'data-testid': TestIds.cancel,
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
  },
);

CancelButton.displayName = 'Blog.Post.Comments.CreateCommentForm.CancelButton';
