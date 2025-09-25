import { type TimeInputProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const TimeInput = ({
  id,
  value,
  label,
  showLabel,
  showPlaceholder,
  use24HourFormat,
  showSeconds,
  required,
  readOnly,
  description,
  onChange,
  onBlur,
  onFocus,
}: TimeInputProps) => {
  const descriptionId = description ? `${id}-description` : undefined;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value || null);
  };

  return (
    <div>
      {showLabel && (
        <label htmlFor={id}>
          {label}
          {required && (
            <span style={{ color: 'red', marginLeft: '4px' }}>*</span>
          )}
        </label>
      )}

      <input
        id={id}
        type="time"
        value={value || ''}
        placeholder={showPlaceholder ? 'Select time' : undefined}
        required={required}
        readOnly={readOnly}
        disabled={readOnly}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-describedby={descriptionId}
        step={showSeconds ? '1' : undefined}
        style={{
          width: '100%',
          maxWidth: '200px',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: readOnly ? '#f5f5f5' : 'white',
          cursor: readOnly ? 'not-allowed' : 'pointer',
        }}
      />

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

export default TimeInput;
