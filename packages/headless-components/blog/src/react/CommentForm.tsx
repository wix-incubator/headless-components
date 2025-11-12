import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';
import type { CommentWithResolvedFields } from '../services/comments-service.js';
import { CommentContext } from './Comment.js';
import * as CoreComments from './core/Comments.js';
import { isValidChildren } from './helpers/children.js';

const enum TestIds {
  root = 'comment-form-root',
  messsage = 'comment-form-message',
  cancel = 'comment-form-cancel',
  submit = 'comment-form-submit',
  label = 'comment-form-label',
  input = 'comment-form-input',
}

/**
 * Context for sharing form state between Comment.Form components
 */
interface CreateCommentFormContextValue {
  commentText: string;
  setCommentText: (text: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  createComment: (content: string) => Promise<CommentWithResolvedFields | null>;
  isLoading: boolean;
  error: string | null;
  maxLength: number;
  htmlId: string;
}

const CommentFormContext = React.createContext<CreateCommentFormContextValue | null>(null);

CommentFormContext.displayName = 'Comment.CommentFormContext';

function useCommentFormContext(): CreateCommentFormContextValue {
  const context = React.useContext(CommentFormContext);
  if (!context) {
    throw new Error(
      'useCommentFormContext must be used within a Comment.CommentForm.Root component',
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
        createComment: (content: string) => Promise<CommentWithResolvedFields | null>;
        isLoading: boolean;
        error: string | null;
        commentText: string;
        setCommentText: (text: string) => void;
        handleSubmit: (e: React.FormEvent) => Promise<void>;
        handleCancel: () => void;
      }>
    | React.ReactNode;
}

/**
 * Form component for creating comments.
 * Provides context for sub-components to share form state.
 * Must contain composable sub-components as children.
 *
 * @component
 * @example
 * ```tsx
 * // Composable form with sub-components
 * <Comment.Form.Root className="space-y-3">
 *   <Comment.Form.Input
 *     className="w-full border rounded-lg p-3"
 *     placeholder="Write your reply..."
 *   />
 *   <Comment.Form.Message className="text-red-600" />
 *   <Comment.Form.SubmitButton className="btn-primary" />
 * </Comment.Form.Root>
 *
 * // Custom rendering with asChild
 * <Comment.Form.Root asChild>
 *   {({ createComment, isLoading, error, commentText, setCommentText, handleSubmit, handleCancel }) => (
 *     <CustomCommentForm
 *       onCommentAdded={onCommentAdded}
 *       loading={isLoading}
 *       error={error}
 *       commentText={commentText}
 *       setCommentText={setCommentText}
 *       handleSubmit={handleSubmit}
 *       handleCancel={handleCancel}
 *     />
 *   )}
 * </Comment.Form.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { asChild, children, className, maxLength = 500, onCommentAdded } = props;

  const topLevelComment = React.useContext(CoreComments.TopLevelCommentContext);
  const parentComment = React.useContext(CommentContext);

  return (
    <CoreComments.CreateComment
      parentCommentId={parentComment?.comment._id}
      topCommentId={topLevelComment?._id}
    >
      {({ createComment, isLoading, error, clearError }) => {
        const [commentText, setCommentText] = React.useState('');
        const htmlId = `text-field-${React.useId()}`;

        const handleSubmit = React.useCallback(
          async (e: React.FormEvent) => {
            e.preventDefault();

            const text = commentText.trim();
            if (!text || isLoading) {
              return;
            }

            try {
              // Create reply content structure for Wix Comments API
              const result = await createComment(text);

              if (result) {
                // Clear form on success
                setCommentText('');
                onCommentAdded?.();
              }
            } catch (err) {
              // Error is handled by the service
              console.error('Failed to create reply:', err);
            }
          },
          [commentText, createComment, isLoading],
        );

        const handleCancel = React.useCallback(() => {
          setCommentText('');
          clearError();
        }, [setCommentText, clearError]);

        const contextValue: CreateCommentFormContextValue = {
          commentText,
          setCommentText,
          handleSubmit,
          handleCancel,
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
          <CommentFormContext.Provider value={contextValue}>
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              {...attributes}
              customElement={children}
              customElementProps={{
                createComment,
                isLoading,
                error,
                commentText,
                setCommentText,
                handleSubmit,
                handleCancel,
              }}
            >
              {isValidChildren(children) ? (
                <form onSubmit={handleSubmit}>{children}</form>
              ) : (
                children
              )}
            </AsChildSlot>
          </CommentFormContext.Provider>
        );
      }}
    </CoreComments.CreateComment>
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
 * Label component for comment form input.
 *
 * @component
 * @example
 * ```tsx
 * // Default label
 * <Comment.Form.Label />
 *
 * // Custom styling
 * <Comment.Form.Label className="text-gray-700 font-medium mb-2" />
 *
 * // Custom rendering with asChild
 * <Comment.Form.Label asChild>
 *   {({ htmlFor, labelText }) => (
 *     <label htmlFor={htmlFor} className="custom-label">
 *       {labelText}
 *     </label>
 *   )}
 * </Comment.Form.Label>
 * ```
 */
export const Label = React.forwardRef<HTMLElement, LabelProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { htmlId } = useCommentFormContext();

  const attributes = {
    'data-testid': TestIds.label,
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
        labelText: 'Comment',
      }}
    >
      <label htmlFor={htmlId}>Comment</label>
    </AsChildSlot>
  );
});

Label.displayName = 'Comment.Form.Label';

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
 * Input component for form textarea.
 *
 * @component
 * @example
 * ```tsx
 * // Default textarea
 * <Comment.Form.Input placeholder="Write your comment..." />
 *
 * // Custom styling
 * <Comment.Form.Input
 *   className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
 *   placeholder="Write your comment..."
 *   rows={3}
 * />
 *
 * // Custom rendering with asChild
 * <Comment.Form.Input asChild>
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
 * </Comment.Form.Input>
 * ```
 */
export const Input = React.forwardRef<HTMLElement, InputProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { commentText, setCommentText, isLoading, maxLength, htmlId } = useCommentFormContext();

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCommentText(e.target.value);
    },
    [setCommentText],
  );

  const inputAttributes: React.ComponentProps<'textarea'> = {
    value: commentText,
    onChange: handleChange,
    minLength: 1,
    disabled: isLoading,
    maxLength,
    id: htmlId,
  };
  const dataAttributes = {
    'data-testid': TestIds.input,
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

Input.displayName = 'Comment.Form.Input';

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
 * <Comment.Form.Message />
 *
 * // Custom styling
 * <Comment.Form.Message className="text-red-600 text-sm bg-red-50 p-2 rounded" />
 *
 * // Custom rendering with asChild
 * <Comment.Form.Message asChild>
 *   {({ error, hasError }) => (
 *     hasError && <CustomErrorAlert message={error} />
 *   )}
 * </Comment.Form.Message>
 * ```
 */
export const Message = React.forwardRef<HTMLElement, MessageProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { error } = useCommentFormContext();

  const hasError = Boolean(error);

  if (!hasError) return null;

  const attributes = {
    'data-testid': TestIds.messsage,
    'data-has-error': hasError,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ error: error!, hasError }}
    >
      <div>{error}</div>
    </AsChildSlot>
  );
});

Message.displayName = 'Comment.Form.Message';

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
 * Cancel button for the comment form.
 * Clears the form input when clicked.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Comment.Form.CancelButton />
 *
 * // Custom rendering with asChild
 * <Comment.Form.CancelButton asChild>
 *   {({ handleCancel }) => (
 *     <Button variant="ghost" onClick={handleCancel}>
 *       Cancel
 *     </Button>
 *   )}
 * </Comment.Form.CancelButton>
 * ```
 */
export const CancelButton = React.forwardRef<HTMLElement, CancelButtonProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { commentText, isLoading, handleCancel } = useCommentFormContext();

  const isDisabled = !commentText.trim();

  const buttonAttributes: React.ComponentProps<'button'> = {
    type: 'reset',
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
});

CancelButton.displayName = 'Comment.Form.CancelButton';

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
 * Submit button for the comment form.
 * Automatically disabled when the form is empty or submitting.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Comment.Form.SubmitButton />
 *
 * // Custom rendering with asChild
 * <Comment.Form.SubmitButton asChild>
 *   <Button>Post reply</Button>
 * </Comment.Form.SubmitButton>
 * ```
 */
export const SubmitButton = React.forwardRef<HTMLElement, SubmitButtonProps>((props, ref) => {
  const { asChild, children, className, loadingState } = props;
  const { commentText, isLoading } = useCommentFormContext();

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
});

SubmitButton.displayName = 'Comment.Form.SubmitButton';
