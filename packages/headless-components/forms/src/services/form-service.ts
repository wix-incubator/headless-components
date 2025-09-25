import { forms } from '@wix/forms';
import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type ReadOnlySignal,
} from '@wix/services-definitions/core-services/signals';

export type SubmitResponse =
  | { type: 'success'; message?: string }
  | { type: 'error'; message: string }
  | { type: 'idle' };

export interface FormServiceAPI {
  formSignal: ReadOnlySignal<forms.Form | null>;
  isLoadingSignal: ReadOnlySignal<boolean>;
  errorSignal: ReadOnlySignal<string | null>;
  // TODO: handle submit response
  // submitResponseSignal: ReadOnlySignal<SubmitResponse>;
}

export const FormServiceDefinition =
  defineService<FormServiceAPI>('formService');

export type FormServiceConfig = { formId: string } | { form: forms.Form };

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
      loadForm(config.formId);
    }

    async function loadForm(id: string): Promise<void> {
      try {
        const result = await fetchForm(id);

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

export async function loadFormServiceConfig(
  formId: string,
): Promise<FormServiceConfig> {
  const form = await fetchForm(formId);
  return { form };
}
