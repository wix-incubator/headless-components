import { forms } from '@wix/forms';
import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';

export type SubmitResponse =
  | { type: 'success'; message?: string }
  | { type: 'error'; message: string }
  | { type: 'idle' };

export interface FormServiceAPI {
  form: Signal<forms.Form | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  submitResponse: Signal<SubmitResponse>;
}

export const FormServiceDefinition =
  defineService<FormServiceAPI>('formService');

/**
 * Configuration object for initializing the Form service.
 *
 * The Form service supports two distinct patterns for providing form data:
 *
 * **Pattern 1: Pre-loaded Form Data (SSR/SSG)**
 * - Use when you have form data available at service initialization
 * - Recommended for server-side rendering and static site generation
 * - Provides immediate form availability with no loading states
 * - Better performance and SEO as form data is available immediately
 *
 * **Pattern 2: Lazy Loading with Form ID (Client-side)**
 * - Use when you only have a form ID and need to load form data asynchronously
 * - Ideal for client-side routing and dynamic form loading
 * - Service will automatically fetch form data using the provided formId
 * - Provides loading states and error handling during form fetch
 *
 * @interface FormServiceConfig
 * @property {forms.Form} [form] - Pre-loaded form data. When provided, the service uses this data immediately without any network requests. Recommended for SSR/SSG scenarios.
 * @property {string} [formId] - Form ID for lazy loading. When provided (and no form data), the service will fetch form data asynchronously from the Wix Forms API. Ideal for client-side routing.
 *
 * @example
 * ```tsx
 * // Pattern 1: Pre-loaded form data (SSR/SSG)
 * // Server-side: Load form data first
 * const formServiceConfigResult = await loadFormServiceConfig('form-123');
 * if (formServiceConfigResult.type === 'success') {
 *   // Use pre-loaded form data
 *   <Form.Root formServiceConfig={formServiceConfigResult.config} />
 * }
 *
 * // Or with direct form data
 * const config1: FormServiceConfig = { form: myForm };
 * <Form.Root formServiceConfig={config1} />
 * ```
 *
 * @example
 * ```tsx
 * // Pattern 2: Lazy loading with form ID (Client-side)
 * // Simple formId-based loading - service handles the rest
 * const config2: FormServiceConfig = { formId: 'form-123' };
 * <Form.Root formServiceConfig={config2} />
 *
 * // With loading and error handling
 * <Form.Root formServiceConfig={{ formId: 'form-123' }}>
 *   <Form.Loading>
 *     {({ isLoading }) => isLoading ? <div>Loading form...</div> : null}
 *   </Form.Loading>
 *   <Form.LoadingError>
 *     {({ error, hasError }) => hasError ? <div>Error: {error}</div> : null}
 *   </Form.LoadingError>
 *   <Form.Fields fieldMap={FIELD_MAP} />
 * </Form.Root>
 * ```
 *
 * @example
 * ```tsx
 * // Pattern 3: Both provided (form takes precedence)
 * // The pre-loaded form data will be used, formId is ignored
 * const config3: FormServiceConfig = {
 *   form: myForm,
 *   formId: 'form-123' // This will be ignored
 * };
 * <Form.Root formServiceConfig={config3} />
 * ```
 *
 * @throws {Error} Throws an error if neither form nor formId is provided
 */
export interface FormServiceConfig {
  form?: forms.Form;
  formId?: string;
}

/**
 * Form service implementation that supports both pre-loaded form data and lazy loading.
 *
 * This service provides reactive state management for form data, loading states, errors, and submission responses.
 * It automatically handles form loading when only a formId is provided, making it suitable for both SSR and client-side scenarios.
 *
 * ## Service Behavior
 *
 * **Configuration Resolution:**
 * - If `form` is provided: Uses pre-loaded form data immediately (SSR/SSG pattern)
 * - If only `formId` is provided: Loads form data asynchronously from Wix Forms API
 * - If both are provided: Uses pre-loaded `form` data and ignores `formId`
 * - If neither is provided: Throws an error during service initialization
 *
 * **Loading States:**
 * - `isLoading`: `true` when loading form data via `formId`, `false` otherwise
 * - `form`: `null` initially when using `formId`, populated after successful load
 * - `error`: `null` initially, populated if form loading fails
 * - `submitResponse`: `{ type: 'idle' }` initially, updated during form submission
 *
 * **Error Handling:**
 * - Network errors during form loading are caught and stored in the `error` signal
 * - "Form not found" errors are handled when the formId doesn't exist
 * - All errors are logged to console for debugging
 *
 * @example
 * ```tsx
 * // Service automatically handles loading states
 * const service = useService(FormServiceDefinition);
 *
 * // Check loading state
 * const isLoading = service.isLoading.get();
 *
 * // Access form data (null during loading)
 * const form = service.form.get();
 *
 * // Check for errors
 * const error = service.error.get();
 * ```
 *
 */
export const FormService = implementService.withConfig<FormServiceConfig>()(
  FormServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const { form: initialForm, formId } = config;

    // Validation: ensure either form or formId is provided
    if (!initialForm && !formId) {
      throw new Error(
        'FormServiceConfig must provide either "form" or "formId"',
      );
    }

    const form: Signal<forms.Form | null> = signalsService.signal(
      initialForm || null,
    );
    const isLoading: Signal<boolean> = signalsService.signal(
      !!formId && !initialForm,
    );
    const error: Signal<string | null> = signalsService.signal<string | null>(
      null,
    );
    const submitResponse: Signal<SubmitResponse> =
      signalsService.signal<SubmitResponse>({ type: 'idle' });

    // Client-side form loading for formId case
    if (formId && !initialForm) {
      // Load form asynchronously
      forms
        .getForm(formId)
        .then((loadedForm) => {
          if (loadedForm) {
            form.set(loadedForm);
            isLoading.set(false);
          } else {
            error.set('Form not found');
            isLoading.set(false);
          }
        })
        .catch((err) => {
          console.error('Failed to load form:', err);
          error.set('Failed to load form');
          isLoading.set(false);
        });
    }

    return { form, isLoading, error, submitResponse };
  },
);

export type FormServiceConfigResult =
  | { type: 'success'; config: FormServiceConfig }
  | { type: 'notFound' };

/**
 * Loads form service configuration by form ID.
 *
 * This function fetches form data from the Wix Forms API and returns a configuration
 * object that can be used to initialize the Form service. This is the recommended approach
 * for server-side rendering (SSR) and static site generation (SSG) scenarios.
 *
 * @param {string} id - The unique identifier of the form to load
 * @returns {Promise<FormServiceConfigResult>} A promise that resolves to either:
 *   - `{ type: 'success', config: FormServiceConfig }` if the form is found and loaded successfully
 *   - `{ type: 'notFound' }` if the form doesn't exist or an error occurs during loading
 *
 * @example
 * ```tsx
 * import { loadFormServiceConfig } from '@wix/headless-forms/services';
 *
 * // Server-side loading (Astro/SSR) - pre-loads form data
 * const formServiceConfigResult = await loadFormServiceConfig('form-id');
 *
 * if (formServiceConfigResult.type === 'notFound') {
 *   return Astro.redirect('/404');
 * }
 *
 * // Use pre-loaded form data
 * const formServiceConfig = formServiceConfigResult.config;
 * <Form.Root formServiceConfig={formServiceConfig} />
 * ```
 *
 * @example
 * ```tsx
 * // Alternative: Client-side loading with formId
 * // No need to pre-load, service handles loading automatically
 * <Form.Root formServiceConfig={{ formId: 'form-id' }}>
 *   <Form.Loading>
 *     {({ isLoading }) => isLoading ? <div>Loading...</div> : null}
 *   </Form.Loading>
 *   <Form.Fields fieldMap={FIELD_MAP} />
 * </Form.Root>
 * ```
 *
 * @throws {Error} Logs errors to console but returns 'notFound' result instead of throwing
 */
export async function loadFormServiceConfig(
  id: string,
): Promise<FormServiceConfigResult> {
  try {
    const form = await forms.getForm(id);

    if (!form) {
      return { type: 'notFound' };
    }

    return {
      type: 'success',
      config: { form },
    };
  } catch (error) {
    console.error('Failed to load form:', error);
    return { type: 'notFound' };
  }
}
