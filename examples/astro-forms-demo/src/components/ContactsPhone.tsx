import { type ContactsPhoneProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const ContactsPhone = ({
  id,
  value,
  label,
  showLabel,
  placeholder,
  description,
  required,
  readOnly,
  allowedCountryCodes,
  defaultCountryCode,
  onChange,
  onBlur,
  onFocus,
}: ContactsPhoneProps) => {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}
      <div style={{ display: 'flex', gap: '8px' }}>
        <select
          id={`${id}-country`}
          defaultValue={defaultCountryCode}
          disabled={readOnly}
          style={{ minWidth: '80px' }}
        >
          {allowedCountryCodes.map(code => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
        <input
          id={id}
          type="tel"
          value={value || ''}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-describedby={descriptionId}
          onChange={e => onChange(e.target.value)}
          onBlur={() => onBlur()}
          onFocus={() => onFocus()}
          style={{ flex: 1 }}
        />
      </div>
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

export default ContactsPhone;
