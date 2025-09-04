import { Form } from '@wix/headless-forms/react';
import { type FormServiceConfig } from '@wix/headless-forms/services';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

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
                {typeof field.label === 'string' ? (
                  field.label
                ) : (
                  <RicosViewer
                    content={field.label as RichContent}
                    plugins={quickStartViewerPlugins()}
                  />
                )}{' '}
                : {field.type}
              </div>
            ))}
          </form>
        )}
      </Form.Container>
    </Form.Root>
  );
}
