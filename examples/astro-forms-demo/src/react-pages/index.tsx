import { Form } from '@wix/headless-forms/react';
import { type FormServiceConfig } from '@wix/headless-forms/services';

import '../styles/theme-1.css';

interface FormsPageProps {
  formServiceConfig: FormServiceConfig;
}

export default function FormsPage({ formServiceConfig }: FormsPageProps) {
  return (
    <Form.Root form={formServiceConfig.form}>
      <Form.Container>
        {({ name, fields }) => (
          <form>
            <h1>
              {name} ({formServiceConfig.form._id})
            </h1>

            {fields.map(field => (
              <div key={field.type}>
                {field.label}: {field.type}
              </div>
            ))}
          </form>
        )}
      </Form.Container>
    </Form.Root>
  );
}
