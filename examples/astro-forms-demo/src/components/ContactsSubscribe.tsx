import { type ContactsSubscribeProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const ContactsSubscribe = ({
  id,
  value,
  label,
  defaultValue,
  required,
  readOnly,
  onChange,
  onBlur,
  onFocus,
}: ContactsSubscribeProps) => {
  return (
    <div>
      <label htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={value}
          defaultChecked={defaultValue}
          required={required}
          readOnly={readOnly}
          onChange={e => onChange(e.target.checked)}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
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
