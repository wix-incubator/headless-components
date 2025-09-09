import { type DateTimeInputProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const DateTimeInput = ({
  id,
  value,
  label,
  showLabel,
  showDateLabels,
  showPlaceholder,
  use24HourFormat,
  acceptedDates,
  required,
  readOnly,
  description,
  onChange,
  onBlur,
  onFocus,
}: DateTimeInputProps) => {
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div>
      {showLabel && (
        <label htmlFor={id}>
          {label}
          {required && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
        </label>
      )}

      <input onChange={onChange} onBlur={onBlur} onFocus={onFocus} />

      {description && (
        <div id={descriptionId} style={{ marginTop: '8px' }}>
          <RicosViewer
            content={description as RichContent}
            plugins={quickStartViewerPlugins()}
          />
        </div>
      )}
    </div>
  );
};

export default DateTimeInput;
