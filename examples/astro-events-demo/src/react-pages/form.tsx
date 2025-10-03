import {
  type EventServiceConfig,
  type FormServiceConfig,
} from '@wix/events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { Form } from '../components/events/Form';

interface FormPageProps {
  eventServiceConfig: EventServiceConfig;
  formServiceConfig: FormServiceConfig;
}

export default function FormPage({
  eventServiceConfig,
  formServiceConfig,
}: FormPageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <Form
          eventServiceConfig={eventServiceConfig}
          formServiceConfig={formServiceConfig}
        />
      </div>
    </KitchensinkLayout>
  );
}
