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
                <h1>This is form {formServiceConfig.form._id}</h1>
               </form>
              )}
            </Form.Container>
          </Form.Root>
   );
}
