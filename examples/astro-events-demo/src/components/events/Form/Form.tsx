import {
  type EventServiceConfig,
  type FormServiceConfig,
} from '@wix/events/services';

interface FormProps {
  eventServiceConfig: EventServiceConfig;
  formServiceConfig: FormServiceConfig;
}

export function Form({}: FormProps) {
  return <div>FORM</div>;
}
