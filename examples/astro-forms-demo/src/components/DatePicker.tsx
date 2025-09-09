import { type DatePickerProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const DatePicker = ({
  id,
  value,
  label,
  showLabel,
  placeholder,
  firstDayOfWeek = 'SUNDAY',
  acceptedDates = 'all',
  required,
  readOnly,
  description,
  onChange,
  onBlur,
  onFocus,
}: DatePickerProps) => {
  const descriptionId = description ? `${id}-description` : undefined;

  // Set min/max attributes based on acceptedDates
  const getMinMaxAttributes = () => {
    if (acceptedDates === 'past') {
      return { max: new Date().toISOString().split('T')[0] };
    } else if (acceptedDates === 'future') {
      return { min: new Date().toISOString().split('T')[0] };
    }
    return {};
  };

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
        type="date"
        value={value || ''}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        disabled={readOnly}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-describedby={descriptionId}
        style={{
          width: '100%',
          maxWidth: '300px',
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: readOnly ? '#f5f5f5' : 'white',
          cursor: readOnly ? 'not-allowed' : 'pointer',
        }}
        {...getMinMaxAttributes()}
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

export default DatePicker;
