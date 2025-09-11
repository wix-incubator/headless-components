import { forms } from '@wix/forms';
import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';

export interface FormServiceAPI {
  form: Signal<forms.Form>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  submitError: Signal<string | null>;
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
    const submitError: Signal<string | null> = signalsService.signal<string | null>(
      null,
    );

    return { form, isLoading, error, submitError };
  },
);

export type FormServiceConfigResult =
  | { type: 'success'; config: FormServiceConfig }
  | { type: 'notFound' };

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
