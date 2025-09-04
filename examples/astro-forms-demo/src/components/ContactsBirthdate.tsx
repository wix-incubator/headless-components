import { type ContactsBirthdateProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const ContactsBirthdate = ({
  id,
  label,
  showLabel,
  showPlaceholder,
  required,
  readOnly,
  description,
}: ContactsBirthdateProps) => {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type="date"
        required={required}
        readOnly={readOnly}
        placeholder={showPlaceholder ? 'Enter your birthdate' : undefined}
        aria-describedby={descriptionId}
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
