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
  form: Signal<forms.Form>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  submitResponse: Signal<SubmitResponse>;
}

export const FormServiceDefinition =
  defineService<FormServiceAPI>('formService');

export interface FormServiceConfig {
  form: forms.Form;
}

export const FormService = implementService.withConfig<FormServiceConfig>()(
  FormServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const { form: initialForm } = config;

    const form: Signal<forms.Form> = signalsService.signal(initialForm);
    const isLoading: Signal<boolean> = signalsService.signal(false);
    const error: Signal<string | null> = signalsService.signal<string | null>(
      null,
    );
    const submitResponse: Signal<SubmitResponse> =
      signalsService.signal<SubmitResponse>({ type: 'idle' });

    return { form, isLoading, error, submitResponse };
  },
);

export type FormServiceConfigResult =
  | { type: 'success'; config: FormServiceConfig }
  | { type: 'notFound' };

/**
 * Loads form service configuration by form ID.
 * This function fetches form data from the Wix Forms API and returns a configuration
 * object that can be used to initialize the Form service.
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
 * // Server-side loading (Astro/SSR)
 * const formServiceConfigResult = await loadFormServiceConfig('form-id');
 *
 * if (formServiceConfigResult.type === 'notFound') {
 *   return Astro.redirect('/404');
 * }
 *
 * const formServiceConfig = formServiceConfigResult.config;
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
