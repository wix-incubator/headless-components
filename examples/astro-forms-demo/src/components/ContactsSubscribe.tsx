import { type ContactsSubscribeProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const ContactsSubscribe = ({
  id,
  label,
  defaultValue,
  required,
  readOnly,
}: ContactsSubscribeProps) => {
  return (
    <div>
      <label htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          defaultChecked={defaultValue}
          required={required}
          readOnly={readOnly}
        />
        <RicosViewer
          content={label as RichContent}
          plugins={quickStartViewerPlugins()}
        />
      </label>
    </div>
  );
};

export default ContactsSubscribe;
