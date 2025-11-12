import { forms, submissions } from '@wix/forms';
import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type ReadOnlySignal,
} from '@wix/services-definitions/core-services/signals';
import { httpClient } from '@wix/essentials';
import { FormValues } from '../react/types.js';

/**
 * Response type for form submission operations.
 * Represents the different states a form submission can be in.
 */
export type SubmitResponse =
  | { type: 'success'; message?: string }
  | { type: 'error'; message: string }
  | { type: 'idle' }
  | { type: 'loading' };

/**
 * API interface for the Form service, providing reactive form data management.
 * This service handles loading and managing form data, loading state, errors, and submissions.
 * It supports both pre-loaded form data and lazy loading with form IDs.
 *
 * @interface FormServiceAPI
 */
export interface FormServiceAPI {
  /** Reactive signal containing the current form data */
  formSignal: ReadOnlySignal<forms.Form | null>;
  /** Reactive signal indicating if a form is currently being loaded */
  isLoadingSignal: ReadOnlySignal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  errorSignal: ReadOnlySignal<string | null>;
  /** Reactive signal containing submission response state */
  submitResponseSignal: ReadOnlySignal<SubmitResponse>;
  /** Function to submit form with current values */
  submitForm: (formValues: FormValues) => Promise<void>;
}

/**
 * Service definition for the Form service.
 * This defines the contract that the FormService must implement.
 *
 * @constant
 */
export const FormServiceDefinition =
  defineService<FormServiceAPI>('formService');

type OnSubmit = (
  formId: string,
  formValues: FormValues,
) => Promise<SubmitResponse>;

/**
 * Configuration type for the Form service.
 * Supports two distinct patterns for providing form data:
 * - Pre-loaded form data (SSR/SSG scenarios)
 * - Lazy loading with form ID (client-side routing)
 *
 * Optionally accepts a custom submission handler to override default behavior.
 *
 * @type {FormServiceConfig}
 */
export type FormServiceConfig =
  | {
      formId: string;
      onSubmit?: OnSubmit;
      namespace?: string;
      additionalMetadata?: Record<string, string | string[]>;
    }
  | { form: forms.Form; onSubmit?: OnSubmit };

/**
 * Implementation of the Form service that manages reactive form data and submissions.
 * This service provides signals for form data, loading state, error handling, and submission state.
 * It supports both pre-loaded form data and lazy loading with form IDs.
 * Consumers can provide a custom submission handler via config.
 *
 * @example
 * ```tsx
 * // Pre-loaded form data (SSR/SSG)
 * const formService = FormService.withConfig({ form: formData });
 *
 * // Lazy loading with form ID (client-side)
 * const formService = FormService.withConfig({ formId: 'form-123' });
 *
 * // With custom submission handler
 * const formService = FormService.withConfig({
 *   formId: 'form-123',
 *   onSubmit: async (formId, formValues) => {
 *     // Custom submission logic
 *     await fetch('/api/submit', { method: 'POST', body: JSON.stringify({ formId, ...formValues }) });
 *     return { type: 'success', message: 'Form submitted!' };
 *   }
 * });
 * ```
 */
export const FormService = implementService.withConfig<FormServiceConfig>()(
  FormServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const isLoadingSignal = signalsService.signal<boolean>(false);
    const errorSignal = signalsService.signal<string | null>(null);
    const submitResponseSignal = signalsService.signal<SubmitResponse>({
      type: 'idle',
    });
    const hasSchema = 'form' in config;
    const formSignal = signalsService.signal<forms.Form | null>(
      hasSchema ? config.form : null,
    );

    if (!hasSchema) {
      loadForm(config.formId, config.namespace, config.additionalMetadata);
    }

    async function loadForm(
      id: string,
      namespace?: string,
      additionalMetadata?: Record<string, string | string[]>,
    ): Promise<void> {
      isLoadingSignal.set(true);
      errorSignal.set(null);

      try {
        const result = await fetchForm({ id, namespace, additionalMetadata });

        if (result) {
          formSignal.set(result);
        } else {
          errorSignal.set('Form not found');
        }
      } catch (err) {
        errorSignal.set('Failed to load form');
        throw err;
      } finally {
        isLoadingSignal.set(false);
      }
    }

    async function defaultSubmitHandler(
      formId: string,
      formValues: FormValues,
    ): Promise<SubmitResponse> {
      try {
        await submissions.createSubmission({
          formId,
          submissions: formValues,
        });
        // TODO: add message
        return { type: 'success' };
      } catch (error) {
        console.error('Form submission failed:', error);
        return { type: 'error', message: 'Failed to submit form' };
      }
    }

    /**
     * Submits the form with the provided values.
     * Uses custom handler if provided in config, otherwise uses default submission.
     */
    async function submitForm(formValues: FormValues): Promise<void> {
      const form = formSignal.get();
      if (!form) {
        console.error('Cannot submit: form not loaded');
        return;
      }

      // @ts-expect-error
      const formId = form._id ? form._id : form.id;
      submitResponseSignal.set({ type: 'loading' });

      try {
        const handler = config.onSubmit || defaultSubmitHandler;
        const response = await handler(formId, formValues);
        submitResponseSignal.set(response);
      } catch (error) {
        console.error('Unexpected error during submission:', error);
        submitResponseSignal.set({
          type: 'error',
          message: 'Unexpected error during submission',
        });
      }
    }

    return {
      formSignal: formSignal,
      isLoadingSignal: isLoadingSignal,
      errorSignal: errorSignal,
      submitResponseSignal: submitResponseSignal,
      submitForm: submitForm,
    };
  },
);

function buildFormFetchQueryParams({
  id,
  namespace,
  additionalMetadata,
}: {
  id: string;
  namespace?: string;
  additionalMetadata?: Record<string, string | string[]>;
}): URLSearchParams {
  const params = new URLSearchParams();

  params.append('formId', id);

  if (namespace) {
    params.append('namespace', namespace);
  }

  if (additionalMetadata) {
    Object.entries(additionalMetadata).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    });
  }

  return params;
}

async function fetchForm({
  id,
  namespace,
  additionalMetadata,
}: {
  id: string;
  namespace?: string;
  additionalMetadata?: Record<string, string | string[]>;
}): Promise<forms.Form> {
  try {
    const params = buildFormFetchQueryParams({
      id,
      namespace,
      additionalMetadata,
    });
    const url = `https://edge.wixapis.com/form-schema-service/v4/forms/${id}?${params.toString()}`;
    const response = await httpClient.fetchWithAuth(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch form: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();

    if (data && data.form) {
      return data.form;
    }

    throw new Error('Invalid response format from Forms API');
  } catch (err) {
    console.error('Failed to load form:', id, err);
    throw err;
  }
}

/**
 * Loads form service configuration from the Wix Forms API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * a specific form by ID that will be used to configure the FormService.
 *
 * @param {string} formId - The unique identifier of the form to load
 * @param {string} [namespace] - Optional namespace for the form
 * @param {Record<string, string | string[]>} [additionalMetadata] - Optional additional metadata to pass to the API
 * @returns {Promise<FormServiceConfig>} Configuration object with pre-loaded form data
 * @throws {Error} When the form cannot be loaded
 *
 * @example
 * ```tsx
 * // In your SSR/SSG setup
 * const formConfig = await loadFormServiceConfig('form-123');
 * const formService = FormService.withConfig(formConfig);
 * ```
 */
export async function loadFormServiceConfig(
  formId: string,
  namespace?: string,
  additionalMetadata?: Record<string, string | string[]>,
): Promise<FormServiceConfig> {
  const form = await fetchForm({ id: formId, namespace, additionalMetadata });
  return { form };
}
