import { forms } from '@wix/forms';
import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type ReadOnlySignal,
} from '@wix/services-definitions/core-services/signals';

/**
 * Response type for form submission operations.
 * Represents the different states a form submission can be in.
 */
export type SubmitResponse =
  | { type: 'success'; message?: string }
  | { type: 'error'; message: string }
  | { type: 'idle' };

/**
 * API interface for the Form service, providing reactive form data management.
 * This service handles loading and managing form data, loading state, and errors.
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
  // TODO: handle submit response
  // submitResponseSignal: ReadOnlySignal<SubmitResponse>;
}

/**
 * Service definition for the Form service.
 * This defines the contract that the FormService must implement.
 *
 * @constant
 */
export const FormServiceDefinition =
  defineService<FormServiceAPI>('formService');

/**
 * Configuration type for the Form service.
 * Supports two distinct patterns for providing form data:
 * - Pre-loaded form data (SSR/SSG scenarios)
 * - Lazy loading with form ID (client-side routing)
 *
 * @type {FormServiceConfig}
 */
export type FormServiceConfig = { formId: string } | { form: forms.Form };

/**
 * Implementation of the Form service that manages reactive form data.
 * This service provides signals for form data, loading state, and error handling.
 * It supports both pre-loaded form data and lazy loading with form IDs.
 *
 * @example
 * ```tsx
 * // Pre-loaded form data (SSR/SSG)
 * const formService = FormService.withConfig({ form: formData });
 *
 * // Lazy loading with form ID (client-side)
 * const formService = FormService.withConfig({ formId: 'form-123' });
 * ```
 */
export const FormService = implementService.withConfig<FormServiceConfig>()(
  FormServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const isLoadingSignal = signalsService.signal<boolean>(false);
    const errorSignal = signalsService.signal<string | null>(null);
    const hasSchema = 'form' in config;
    const formSignal = signalsService.signal<forms.Form | null>(
      hasSchema ? config.form : null,
    );

    if (!hasSchema) {
      isLoadingSignal.set(true);
      loadForm(config.formId);
    }

    async function loadForm(id: string): Promise<void> {
      try {
        const result = await fetchForm(id);

        if (result) {
          formSignal.set(result);
          console.log('result', !!result);
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

    return {
      formSignal: formSignal,
      isLoadingSignal: isLoadingSignal,
      errorSignal: errorSignal,
    };
  },
);

async function fetchForm(id: string): Promise<forms.Form> {
  try {
    const result = await forms.getForm(id);

    if (!result) {
      throw new Error(`Form ${id} not found`);
    }

    return result;
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
): Promise<FormServiceConfig> {
  const form = await fetchForm(formId);
  return { form };
}
