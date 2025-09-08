import { type ContactsFirstNameProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const ContactsFirstName = ({
  id,
  value,
  label,
  showLabel,
  placeholder,
  description,
  required,
  readOnly,
  minLength,
  maxLength,
  onChange,
  onBlur,
  onFocus,
}: ContactsFirstNameProps) => {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type="text"
        value={value || ''}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        aria-describedby={descriptionId}
        onChange={e => onChange(e.target.value)}
        onBlur={() => onBlur()}
        onFocus={() => onFocus()}
      />
      {description && (
        <div id={descriptionId}>
          <RicosViewer
            content={description as RichContent}
            plugins={quickStartViewerPlugins()}
          />
        </div>
      )}
    </div>
  );
};

export default ContactsFirstName;
