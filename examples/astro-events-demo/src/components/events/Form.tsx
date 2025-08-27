import { type EventServiceConfig } from '@wix/headless-events/services';

interface FormProps {
  eventServiceConfig: EventServiceConfig;
}

export function Form({}: FormProps) {
  return <div>Form</div>;
}
