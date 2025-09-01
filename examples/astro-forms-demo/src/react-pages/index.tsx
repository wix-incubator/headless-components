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
              {({ fields }) => (
               <form>
                <h1>{formServiceConfig.form.name} ({formServiceConfig.form._id})</h1>
                {fields.map(field => (
                  <div key={field?.fieldType}>{field?.fieldType}</div>
                ))}
               </form>
              )}
            </Form.Container>
          </Form.Root>
   );
}
