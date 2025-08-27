import '../styles/theme-1.css';
import { type EventServiceConfig } from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { Form } from '../components/events/Form';

interface FormPageProps {
  eventServiceConfig: EventServiceConfig;
}

export default function FormPage({ eventServiceConfig }: FormPageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <Form eventServiceConfig={eventServiceConfig} />
      </div>
    </KitchensinkLayout>
  );
}
