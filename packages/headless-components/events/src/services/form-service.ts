import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { rsvpV2 } from '@wix/events';
import { getFormResponse } from '../utils/form.js';
import { EventServiceDefinition } from './event-service.js';

export interface FormServiceAPI {
  isSubmitting: Signal<boolean>;
  error: Signal<string | null>;
  submit: (formData: FormData) => Promise<void>;
}

export interface FormServiceConfig {}

export const FormServiceDefinition = defineService<
  FormServiceAPI,
  FormServiceConfig
>('formService');

export const FormService = implementService.withConfig<FormServiceConfig>()(
  FormServiceDefinition,
  ({ getService }) => {
    const eventService = getService(EventServiceDefinition);
    const signalsService = getService(SignalsServiceDefinition);

    const event = eventService.event.get();

    const isSubmitting = signalsService.signal(false);
    const error = signalsService.signal<string | null>(null);

    const submit = async (formData: FormData) => {
      isSubmitting.set(true);
      error.set(null);

      try {
        await rsvpV2.createRsvp({
          eventId: event._id,
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          email: formData.get('email') as string,
          form: getFormResponse(formData),
          status: 'YES',
        });
      } catch (err) {
        error.set(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        isSubmitting.set(false);
      }
    };

    return {
      isSubmitting,
      error,
      submit,
    };
  },
);
