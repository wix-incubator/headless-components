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
              <ControlPrimitive.Field className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm" />
            </div>
          </FormPrimitive.ControlRepeater>
        </FormPrimitive.Controls>

        <FormPrimitive.SubmitTrigger className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
          Register for Event
        </FormPrimitive.SubmitTrigger>
      </div>
    </FormPrimitive.Root>
  );
}
