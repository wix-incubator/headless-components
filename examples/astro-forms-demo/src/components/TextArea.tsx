import { type TextAreaProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const TextArea = ({
  id,
  label,
  showLabel,
  placeholder,
  required,
  readOnly,
  description,
}: TextAreaProps) => {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}
      <textarea
        id={id}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
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

export default TextArea;
