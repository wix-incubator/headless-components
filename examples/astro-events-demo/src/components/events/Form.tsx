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
      <FormPrimitive.Controls>
        <FormPrimitive.ControlRepeater>
          <ControlPrimitive.Label />
        </FormPrimitive.ControlRepeater>
      </FormPrimitive.Controls>
    </FormPrimitive.Root>
  );
}
