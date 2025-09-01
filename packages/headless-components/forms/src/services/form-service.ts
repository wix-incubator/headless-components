import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { type Form, getForm } from '@wix/auto_sdk_forms_forms';

export interface FormServiceAPI {
  form: Signal<Form>;
}

export const FormServiceDefinition =
  defineService<FormServiceAPI>('formService');

export interface FormServiceConfig {
  form: Form;
}

export const FormService = implementService.withConfig<FormServiceConfig>()(
  FormServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const { form: initialForm } = config;

    const form: Signal<Form> = signalsService.signal(initialForm);

    return { form };
  },
);

export async function loadFormServiceConfig(
  id: string,
): Promise<FormServiceConfig> {
  const form = await getForm(id);

  return {
    form,
  };
}
