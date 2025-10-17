import React from 'react';
import { Form as FormPrimitive } from '@wix/forms/components';
import { cn } from '@/lib/utils';

/**
 * Root component for form display and interaction.
 * Provides context for all form-related components like fields, loading states, etc.
 *
 * @component
 * @example
 * ```tsx
 * <Form formServiceConfig={{ form: formData }}>
 *   <FormLoading className="flex justify-center p-4" />
 *   <FormLoadingError className="text-destructive px-4 py-3 rounded mb-4" />
 *   <FormFields fieldMap={FIELD_MAP} />
 *   <FormError className="text-destructive p-4 rounded-lg mb-4" />
 *   <FormSubmitted className="text-green-500 p-4 rounded-lg mb-4" />
 * </Form>
 * ```
 */
const Form = FormPrimitive.Root;

/**
 * Component that renders content during loading state.
 * Only displays its children when the form is currently loading.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Form.Loading className="flex justify-center p-4" />
 *
 * // Custom content
 * <Form.Loading>
 *   <div className="flex items-center">
 *     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
 *     <span className="ml-2 text-foreground font-paragraph">Loading form...</span>
 *   </div>
 * </Form.Loading>
 *
 * // With asChild for custom components
 * <Form.Loading asChild>
 *   <div className="custom-loading-container">
 *     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
 *     <span className="ml-2 text-foreground font-paragraph">Loading form...</span>
 *   </div>
 * </Form.Loading>
 * ```
 */
const FormLoading = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Loading>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Loading>
>(({ className, children, ...props }, ref) => {
  return (
    <FormPrimitive.Loading
      {...props}
      ref={ref}
      className={cn('flex justify-center p-4', className)}
    >
      {children || (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2 text-foreground font-paragraph">
            Loading form...
          </span>
        </div>
      )}
    </FormPrimitive.Loading>
  );
});

FormLoading.displayName = 'FormLoading';

/**
 * Component that renders content when there's an error loading the form.
 * Only displays its children when an error has occurred.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Form.LoadingError className="error-message" />
 *
 * // Custom content
 * <Form.LoadingError>
 *   <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
 *     <h3 className="font-heading font-semibold">Error loading form</h3>
 *     <p className="font-paragraph">Something went wrong. Please try again.</p>
 *   </div>
 * </Form.LoadingError>
 *
 * // With asChild for custom components
 * <Form.LoadingError asChild>
 *   {React.forwardRef<HTMLDivElement, { error: string | null; hasError: boolean }>(
 *     ({ error }, ref) => (
 *       <div ref={ref} className="custom-error-container">
 *         <h3 className="font-heading">Error Loading Form</h3>
 *         <p className="font-paragraph">{error}</p>
 *       </div>
 *     )
 *   )}
 * </Form.LoadingError>
 * ```
 */
const FormLoadingError = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.LoadingError>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.LoadingError>
>(({ className, children, ...props }, ref) => {
  return (
    <FormPrimitive.LoadingError
      {...props}
      ref={ref}
      className={cn('text-destructive px-4 py-3 rounded mb-4', className)}
      asChild
    >
      {React.createElement(
        React.forwardRef<
          HTMLDivElement,
          { error: string | null; hasError: boolean }
        >(({ error, hasError, ...restProps }, ref) => {
          if (!hasError) return null;

          return (
            <div
              ref={ref as React.Ref<HTMLDivElement>}
              className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded"
              {...restProps}
            >
              {children || (
                <>
                  <h3 className="font-heading font-semibold">
                    Error loading form
                  </h3>
                  <p className="font-paragraph">
                    Something went wrong. Please try again.
                  </p>
                  {error && (
                    <p className="font-paragraph text-sm mt-1">{error}</p>
                  )}
                </>
              )}
            </div>
          );
        }),
        {
          error: null,
          hasError: false,
          ...props,
          ref: ref as React.Ref<HTMLDivElement>,
        }
      )}
    </FormPrimitive.LoadingError>
  );
});

FormLoadingError.displayName = 'FormLoadingError';

/**
 * Component that renders content after successful form submission.
 * Only displays its children when the form has been successfully submitted.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Form.Submitted className="bg-background border-foreground text-foreground p-6 rounded-lg" />
 *
 * // Custom content
 * <Form.Submitted>
 *   <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg">
 *     <h2 className="font-heading text-xl mb-2">Thank You!</h2>
 *     <p className="font-paragraph">Your form has been submitted successfully.</p>
 *   </div>
 * </Form.Submitted>
 *
 * // With asChild for custom components
 * <Form.Submitted asChild>
 *   {React.forwardRef<HTMLDivElement, { isSubmitted: boolean; message: string }>(
 *     ({ message }, ref) => (
 *       <div ref={ref} className="custom-success-container">
 *         <h2 className="font-heading">Thank You!</h2>
 *         <p className="font-paragraph">{message}</p>
 *       </div>
 *     )
 *   )}
 * </Form.Submitted>
 * ```
 */
const FormSubmitted = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Submitted>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Submitted>
>(({ className, children, ...props }, ref) => {
  return (
    <FormPrimitive.Submitted
      {...props}
      ref={ref}
      className={cn(
        'bg-background border-foreground text-foreground p-6 rounded-lg',
        className
      )}
      asChild
    >
      {React.createElement(
        React.forwardRef<
          HTMLDivElement,
          { isSubmitted: boolean; message: string }
        >(({ isSubmitted, message, ...restProps }, ref) => {
          if (!isSubmitted) return null;

          return (
            <div
              ref={ref as React.Ref<HTMLDivElement>}
              className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg"
              {...restProps}
            >
              {children || (
                <>
                  <h2 className="font-heading text-xl mb-2">Thank You!</h2>
                  <p className="font-paragraph">
                    Your form has been submitted successfully.
                  </p>
                  {message && (
                    <p className="font-paragraph text-sm mt-2">{message}</p>
                  )}
                </>
              )}
            </div>
          );
        }),
        {
          isSubmitted: false,
          message: '',
          ...props,
          ref: ref as React.Ref<HTMLDivElement>,
        }
      )}
    </FormPrimitive.Submitted>
  );
});

FormSubmitted.displayName = 'FormSubmitted';

/**
 * Component that renders content when there's an error during form submission.
 * Only displays its children when a submission error has occurred.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Form.Error className="error-message" />
 *
 * // Custom content
 * <Form.Error>
 *   <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
 *     <h3 className="font-heading text-lg">Submission Failed</h3>
 *     <p className="font-paragraph">Please check your input and try again.</p>
 *   </div>
 * </Form.Error>
 *
 * // With asChild for custom components
 * <Form.Error asChild>
 *   {React.forwardRef<HTMLDivElement, { error: string | null; hasError: boolean }>(
 *     ({ error }, ref) => (
 *       <div ref={ref} className="custom-error-container">
 *         <h3 className="font-heading">Submission Failed</h3>
 *         <p className="font-paragraph">{error}</p>
 *       </div>
 *     )
 *   )}
 * </Form.Error>
 * ```
 */
const FormError = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Error>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Error>
>(({ className, children, ...props }, ref) => {
  return (
    <FormPrimitive.Error
      {...props}
      ref={ref}
      className={cn('text-destructive p-4 rounded-lg mb-4', className)}
      asChild
    >
      {React.createElement(
        React.forwardRef<
          HTMLDivElement,
          { error: string | null; hasError: boolean }
        >(({ error, hasError, ...restProps }, ref) => {
          if (!hasError) return null;

          return (
            <div
              ref={ref as React.Ref<HTMLDivElement>}
              className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg"
              {...restProps}
            >
              {children || (
                <>
                  <h3 className="font-heading text-lg">Submission Failed</h3>
                  <p className="font-paragraph">
                    Please check your input and try again.
                  </p>
                  {error && (
                    <p className="font-paragraph text-sm mt-2">{error}</p>
                  )}
                </>
              )}
            </div>
          );
        }),
        {
          error: null,
          hasError: false,
          ...props,
          ref: ref as React.Ref<HTMLDivElement>,
        }
      )}
    </FormPrimitive.Error>
  );
});

FormError.displayName = 'FormError';

/**
 * Fields component for rendering a form with custom field renderers.
 * It maps each field type from the form configuration to its corresponding React component
 * and renders them in the order and layout defined by the form structure.
 *
 * The component automatically handles:
 * - Field validation and error display
 * - Form state management
 * - Field value updates
 *
 * Must be used within Form.Root to access form context.
 *
 * @component
 * @example
 * ```tsx
 * <Form.Fields fieldMap={FIELD_MAP} />
 * ```
 */
const FormFields = React.forwardRef<
  React.ElementRef<typeof FormPrimitive.Fields>,
  React.ComponentPropsWithoutRef<typeof FormPrimitive.Fields> & {
    className?: string;
  }
>(({ className, ...props }, ref) => {
  return (
    <div className={cn('space-y-4', className)}>
      <FormPrimitive.Fields {...props} ref={ref} />
    </div>
  );
});

FormFields.displayName = 'FormFields';

// Export individual components
export {
  Form,
  FormLoading,
  FormLoadingError,
  FormSubmitted,
  FormError,
  FormFields,
};

// Export default as the root Form component
export default Form;
