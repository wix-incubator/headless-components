import {
  Form as FormPrimitive,
  Control as ControlPrimitive,
} from '@wix/headless-events/react';
import { type EventServiceConfig } from '@wix/headless-events/services';

interface FormProps {
  eventServiceConfig: EventServiceConfig;
}

export function Form({ eventServiceConfig }: FormProps) {
  return (
    <FormPrimitive.Root eventServiceConfig={eventServiceConfig}>
      <div className="bg-surface-primary max-w-xl mx-auto py-6 px-6">
        <h2 className="text-2xl font-bold text-content-primary mb-6 text-center">
          Event Registration
        </h2>

        <FormPrimitive.Controls className="space-y-4">
          <FormPrimitive.ControlRepeater>
            <div className="space-y-2">
              <ControlPrimitive.Label className="block text-sm font-medium text-content-secondary" />
              <ControlPrimitive.Field
                className={`
                  [&>[type="text"]]:w-full [&>[type="text"]]:px-4 [&>[type="text"]]:py-3 [&>[type="text"]]:border [&>[type="text"]]:border-black/30 [&>[type="text"]]:rounded-lg
                  [&>[type="email"]]:w-full [&>[type="email"]]:px-4 [&>[type="email"]]:py-3 [&>[type="email"]]:border [&>[type="email"]]:border-black/30 [&>[type="email"]]:rounded-lg
                  [&>[type="tel"]]:w-full [&>[type="tel"]]:px-4 [&>[type="tel"]]:py-3 [&>[type="tel"]]:border [&>[type="tel"]]:border-black/30 [&>[type="tel"]]:rounded-lg
                  [&>[type="date"]]:w-full [&>[type="date"]]:px-4 [&>[type="date"]]:py-3 [&>[type="date"]]:border [&>[type="date"]]:border-black/30 [&>[type="date"]]:rounded-lg
                  [&>textarea]:w-full [&>textarea]:px-4 [&>textarea]:py-3 [&>textarea]:border [&>textarea]:border-black/30 [&>textarea]:rounded-lg
                  [&>select]:w-full [&>select]:px-4 [&>select]:py-3 [&>select]:border [&>select]:border-black/30 [&>select]:rounded-lg

                  [&[data-type="checkbox"]]:space-y-4
                  [&>[data-type="checkbox-option"]]:flex [&>[data-type="checkbox-option"]]:items-center
                  [&>[data-type="checkbox-option"]_input]:w-5 [&>[data-type="checkbox-option"]_input]:h-5 [&>[data-type="checkbox-option"]_input]:mr-3

                  [&[data-type="radio"]]:space-y-4
                  [&>[data-type="radio-option"]]:flex [&>[data-type="radio-option"]]:items-center
                  [&>[data-type="radio-option"]_input]:w-5 [&>[data-type="radio-option"]_input]:h-5 [&>[data-type="radio-option"]_input]:mr-3

                  [&[data-type="guest-control"]]:space-y-4
                `}
              />
            </div>
          </FormPrimitive.ControlRepeater>

          <FormPrimitive.SubmitTrigger
            className="btn-primary w-full mt-6 py-3 px-6 font-semibold rounded-lg"
            label="Register for Event"
          />
        </FormPrimitive.Controls>
        <FormPrimitive.Error className="block mt-3 text-center text-sm text-status-error" />
      </div>
    </FormPrimitive.Root>
  );
}
