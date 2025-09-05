import { type ContactsBirthdateProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const ContactsBirthdate = ({
  id,
  value,
  label,
  showLabel,
  showPlaceholder,
  required,
  readOnly,
  description,
  onChange,
  onBlur,
  onFocus,
}: ContactsBirthdateProps) => {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type="date"
        value={value || ''}
        required={required}
        readOnly={readOnly}
        placeholder={showPlaceholder ? 'Enter your birthdate' : undefined}
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

export default ContactsBirthdate;
