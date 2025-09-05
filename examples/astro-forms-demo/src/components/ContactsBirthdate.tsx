import { type ContactsBirthdateProps } from '@wix/headless-forms/react';
import {
  quickStartViewerPlugins,
  RicosViewer,
  type RichContent,
} from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';
import { useState, useEffect } from 'react';

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

  // Parse the initial date value
  const parseDate = (dateString: string | undefined) => {
    if (!dateString) return { day: '', month: '', year: '' };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { day: '', month: '', year: '' };
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      year: date.getFullYear().toString(),
    };
  };

  const [dateParts, setDateParts] = useState(() =>
    parseDate(value || undefined)
  );

  // Update local state when external value changes
  useEffect(() => {
    setDateParts(parseDate(value || undefined));
  }, [value]);

  const handleDateChange = (
    field: 'day' | 'month' | 'year',
    newValue: string
  ) => {
    const updatedParts = { ...dateParts, [field]: newValue };
    setDateParts(updatedParts);

    // Only call onChange if we have all three parts and they form a valid date
    if (updatedParts.day && updatedParts.month && updatedParts.year) {
      const year = parseInt(updatedParts.year);
      const month = parseInt(updatedParts.month) - 1; // JavaScript months are 0-indexed
      const day = parseInt(updatedParts.day);

      const date = new Date(year, month, day);
      if (
        !isNaN(date.getTime()) &&
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
      ) {
        const isoString = date.toISOString().split('T')[0];
        onChange(isoString);
      }
    } else if (!updatedParts.day && !updatedParts.month && !updatedParts.year) {
      // All fields are empty, clear the value
      onChange('');
    }
  };

  const handleBlur = () => {
    onBlur();
  };

  const handleFocus = () => {
    onFocus();
  };

  return (
    <div>
      {showLabel && <label htmlFor={id}>{label}</label>}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          id={`${id}-day`}
          type="number"
          min="1"
          max="31"
          value={dateParts.day}
          required={required}
          readOnly={readOnly}
          placeholder={showPlaceholder ? 'DD' : undefined}
          aria-label="Day"
          onChange={e => handleDateChange('day', e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={{ width: '60px' }}
        />
        <span>/</span>
        <input
          id={`${id}-month`}
          type="number"
          min="1"
          max="12"
          value={dateParts.month}
          required={required}
          readOnly={readOnly}
          placeholder={showPlaceholder ? 'MM' : undefined}
          aria-label="Month"
          onChange={e => handleDateChange('month', e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={{ width: '60px' }}
        />
        <span>/</span>
        <input
          id={`${id}-year`}
          type="number"
          min="1900"
          max="2100"
          value={dateParts.year}
          required={required}
          readOnly={readOnly}
          placeholder={showPlaceholder ? 'YYYY' : undefined}
          aria-label="Year"
          onChange={e => handleDateChange('year', e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          style={{ width: '80px' }}
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

export default ContactsBirthdate;
