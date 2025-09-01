import { Form } from '@wix/headless-forms/react';
import { type FormServiceConfig } from '@wix/headless-forms/services';

import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import '../styles/theme-1.css';

interface FormsPageProps {
  formServiceConfig: FormServiceConfig;
}

export default function FormsPage({ formServiceConfig }: FormsPageProps) {
  return (
        <KitchensinkLayout>
          <Form.Root form={formServiceConfig.form}>
            <Form.Container>
              {({ fields }) => (
               <form>
                <input type="text" value="A form, weeeee!!!" />
               </form>
              )}
            </Form.Container>
          </Form.Root>
        </KitchensinkLayout>
   );
}
