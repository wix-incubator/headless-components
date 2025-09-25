import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { rsvpV2 } from '@wix/events';
import { getFormResponse, getRequiredRsvpData } from '../utils/form.js';
import { getErrorMessage } from '../utils/errors.js';
import { EventServiceDefinition } from './event-service.js';

export interface FormServiceAPI {
  isSubmitting: Signal<boolean>;
  error: Signal<string | null>;
  submit: (formData: FormData) => Promise<void>;
}

export interface FormServiceConfig {
  postFlowUrl: string;
}

export const FormServiceDefinition = defineService<
  FormServiceAPI,
  FormServiceConfig
>('form');

export const FormService = implementService.withConfig<FormServiceConfig>()(
  FormServiceDefinition,
  ({ getService, config }) => {
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
          status: 'YES',
          form: getFormResponse(event, formData),
          ...getRequiredRsvpData(event, formData),
        });

        window.location.href = config.postFlowUrl;
      } catch (err) {
        error.set(getErrorMessage(err));
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
