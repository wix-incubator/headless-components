import { forms } from '@wix/forms';
import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';

export interface FormServiceAPI {
  form: Signal<forms.Form>;
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

    return { form };
  },
);

export async function loadFormServiceConfig(
  id: string,
): Promise<FormServiceConfig> {
  const form = await forms.getForm(id);

  return {
    form,
  };
}
