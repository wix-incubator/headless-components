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
              <ControlPrimitive.Label className="block text-sm font-medium text-content-primary" />
              <ControlPrimitive.Field
                className={`
                  [&>[type="text"]]:w-full [&>[type="text"]]:px-4 [&>[type="text"]]:py-3 [&>[type="text"]]:border [&>[type="text"]]:border-surface-strong [&>[type="text"]]:rounded-lg [&>[type="text"]]:text-content-primary
                  [&>[type="email"]]:w-full [&>[type="email"]]:px-4 [&>[type="email"]]:py-3 [&>[type="email"]]:border [&>[type="email"]]:border-surface-strong [&>[type="email"]]:rounded-lg [&>[type="email"]]:text-content-primary
                  [&>[type="tel"]]:w-full [&>[type="tel"]]:px-4 [&>[type="tel"]]:py-3 [&>[type="tel"]]:border [&>[type="tel"]]:border-surface-strong [&>[type="tel"]]:rounded-lg [&>[type="tel"]]:text-content-primary
                  [&>[type="date"]]:w-full [&>[type="date"]]:px-4 [&>[type="date"]]:py-3 [&>[type="date"]]:border [&>[type="date"]]:border-surface-strong [&>[type="date"]]:rounded-lg [&>[type="date"]]:text-content-primary
                  [&>textarea]:w-full [&>textarea]:px-4 [&>textarea]:py-3 [&>textarea]:border [&>textarea]:border-surface-strong [&>textarea]:rounded-lg [&>textarea]:text-content-primary
                  [&>select]:w-full [&>select]:px-4 [&>select]:py-3 [&>select]:border [&>select]:border-surface-strong [&>select]:rounded-lg [&>select]:text-content-primary

                  [&[data-type="checkbox"]]:space-y-4
                  [&>[data-type="checkbox-option"]]:flex [&>[data-type="checkbox-option"]]:items-center
                  [&>[data-type="checkbox-option"]_input]:w-5 [&>[data-type="checkbox-option"]_input]:h-5 [&>[data-type="checkbox-option"]_input]:mr-3
                  [&>[data-type="checkbox-option"]_label]:text-sm [&>[data-type="checkbox-option"]_label]:font-medium [&>[data-type="checkbox-option"]_label]:text-content-primary

                  [&[data-type="radio"]]:space-y-4
                  [&>[data-type="radio-option"]]:flex [&>[data-type="radio-option"]]:items-center
                  [&>[data-type="radio-option"]_input]:w-5 [&>[data-type="radio-option"]_input]:h-5 [&>[data-type="radio-option"]_input]:mr-3
                  [&>[data-type="radio-option"]_label]:text-sm [&>[data-type="radio-option"]_label]:font-medium [&>[data-type="radio-option"]_label]:text-content-primary

                  [&[data-type="guest-control"]]:space-y-4
                  [&[data-type="guest-control"]_label]:block [&[data-type="guest-control"]_label]:text-sm [&[data-type="guest-control"]_label]:font-medium [&[data-type="guest-control"]_label]:text-content-primary
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
