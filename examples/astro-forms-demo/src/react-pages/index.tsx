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

const FIELD_MAP = {};

export default function FormsPage({ formServiceConfig }: FormsPageProps) {
  return (
    <Form.Root form={formServiceConfig.form}>
      {/* user should not map each field separately, instead use the FIELD_MAP */}
      <Form.Container fieldsMap={FIELD_MAP} />
    </Form.Root>
  );
}
