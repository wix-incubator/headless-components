import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { wixEventsV2 } from '@wix/events';

export type FormControl = wixEventsV2.InputControl;
export type FormInput = wixEventsV2.Input;

export interface FormControlServiceAPI {
  control: Signal<FormControl>;
}

export interface FormControlServiceConfig {
  control: FormControl;
}

export const FormControlServiceDefinition = defineService<
  FormControlServiceAPI,
  FormControlServiceConfig
>('formControl');

export const FormControlService =
  implementService.withConfig<FormControlServiceConfig>()(
    FormControlServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const control = signalsService.signal<FormControl>(config.control);

      return {
        control,
      };
    },
  );
