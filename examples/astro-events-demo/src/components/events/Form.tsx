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
      <div className="max-w-lg mx-auto py-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Event Registration
        </h2>

        <FormPrimitive.Controls className="space-y-4">
          <FormPrimitive.ControlRepeater>
            <div className="space-y-2">
              <ControlPrimitive.Label className="block text-sm font-medium text-white" />
              <ControlPrimitive.Field
                className={`
                  [&[type="text"]]:w-full [&[type="text"]]:px-4 [&[type="text"]]:py-3 [&[type="text"]]:bg-white/20 [&[type="text"]]:border [&[type="text"]]:border-white/30 [&[type="text"]]:rounded-lg [&[type="text"]]:text-white [&[type="text"]]:placeholder-white/50 [&[type="text"]]:focus:outline-none [&[type="text"]]:focus:ring-2 [&[type="text"]]:focus:ring-blue-400 [&[type="text"]]:focus:border-transparent
                  [&[type="date"]]:w-full [&[type="date"]]:px-4 [&[type="date"]]:py-3 [&[type="date"]]:bg-white/20 [&[type="date"]]:border [&[type="date"]]:border-white/30 [&[type="date"]]:rounded-lg [&[type="date"]]:text-white [&[type="date"]]:placeholder-white/50 [&[type="date"]]:focus:outline-none [&[type="date"]]:focus:ring-2 [&[type="date"]]:focus:ring-blue-400 [&[type="date"]]:focus:border-transparent
                  [textarea]:w-full [textarea]:px-4 [textarea]:py-3 [textarea]:bg-white/20 [textarea]:border [textarea]:border-white/30 [textarea]:rounded-lg [textarea]:text-white [textarea]:placeholder-white/50 [textarea]:focus:outline-none [textarea]:focus:ring-2 [textarea]:focus:ring-blue-400 [textarea]:focus:border-transparent
                  [select]:w-full [select]:px-4 [select]:py-3 [select]:bg-white/20 [select]:border [select]:border-white/30 [select]:rounded-lg [select]:text-white [select]:placeholder-white/50 [select]:focus:outline-none [select]:focus:ring-2 [select]:focus:ring-blue-400 [select]:focus:border-transparent

                  [&[data-type="checkbox"]]:space-y-4
                  [&>[data-type="checkbox-option"]]:flex [&>[data-type="checkbox-option"]]:items-center
                  [&>[data-type="checkbox-option"]_input]:w-5 [&>[data-type="checkbox-option"]_input]:h-5 [&>[data-type="checkbox-option"]_input]:focus:outline-none [&>[data-type="checkbox-option"]_input]:focus:ring-2 [&>[data-type="checkbox-option"]_input]:focus:ring-blue-400
                  [&>[data-type="checkbox-option"]_label]:ml-3 [&>[data-type="checkbox-option"]_label]:text-white [&>[data-type="checkbox-option"]_label]:text-sm [&>[data-type="checkbox-option"]_label]:font-medium [&>[data-type="checkbox-option"]_label]:cursor-pointer

                  [&[data-type="radio"]]:space-y-4
                  [&>[data-type="radio-option"]]:flex [&>[data-type="radio-option"]]:items-center
                  [&>[data-type="radio-option"]_input]:w-5 [&>[data-type="radio-option"]_input]:h-5 [&>[data-type="radio-option"]_input]:focus:outline-none [&>[data-type="radio-option"]_input]:focus:ring-2 [&>[data-type="radio-option"]_input]:focus:ring-blue-400
                  [&>[data-type="radio-option"]_label]:ml-3 [&>[data-type="radio-option"]_label]:text-white [&>[data-type="radio-option"]_label]:text-sm [&>[data-type="radio-option"]_label]:font-medium [&>[data-type="radio-option"]_label]:cursor-pointer
                `}
              />
            </div>
          </FormPrimitive.ControlRepeater>

          <FormPrimitive.SubmitTrigger className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
            Register for Event
          </FormPrimitive.SubmitTrigger>
        </FormPrimitive.Controls>
      </div>
    </FormPrimitive.Root>
  );
}
